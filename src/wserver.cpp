#include "wserver.h"
#include <SPIFFS.h>
#define FILESYSTEM SPIFFS

WebServer server(80);
onEPDData refreshEPD =NULL;

//holds the current upload

String formatBytes(size_t bytes) {
  if (bytes < 1024) {
    return String(bytes) + "B";
  } else if (bytes < (1024 * 1024)) {
    return String(bytes / 1024.0) + "KB";
  } else if (bytes < (1024 * 1024 * 1024)) {
    return String(bytes / 1024.0 / 1024.0) + "MB";
  } else {
    return String(bytes / 1024.0 / 1024.0 / 1024.0) + "GB";
  }
}

String getContentType(String filename) {
  if (server.hasArg("download")) { return "application/octet-stream"; } 
  else if (filename.endsWith(".htm")) { return "text/html"; } 
  else if (filename.endsWith(".html")) { return "text/html"; } 
  else if (filename.endsWith(".css")) { return "text/css"; } 
  else if (filename.endsWith(".js")) { return "application/javascript"; } 
  else if (filename.endsWith(".png")) { return "image/png"; } 
  else if (filename.endsWith(".gif")) { return "image/gif"; } 
  else if (filename.endsWith(".jpg")) { return "image/jpeg"; } 
  else if (filename.endsWith(".svg")) { return "image/svg+xml"; } 
  else if (filename.endsWith(".ico")) { return "image/x-icon"; } 
  else if (filename.endsWith(".xml")) { return "text/xml"; } 
  else if (filename.endsWith(".pdf")) { return "application/x-pdf"; } 
  else if (filename.endsWith(".zip")) { return "application/x-zip"; } 
  else if (filename.endsWith(".gz")) { return "application/x-gzip"; }
  return "text/plain";
}


bool exists(String path){
  bool yes = false;
  File file = FILESYSTEM.open(path, "r");
  if(!file.isDirectory()){
    yes = true;
  }
  file.close();
  return yes;
}

bool handleFileRead(String path) {
  Serial.println("handleFileRead: " + path);
  if (path.endsWith("/")) {
    path += "index.html";
  }
  String contentType = getContentType(path);
  String pathWithGz = path + ".gz";
  if (exists(pathWithGz) || exists(path)) {
    if (exists(pathWithGz)) {
      path += ".gz";
    }
    File file = FILESYSTEM.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

int _startByte=0;
void handleDraw() {
  // Serial.printf("handle Draw,content len:%u \n",server.clientContentLength());
  HTTPUpload& upload = server.upload();
  if (upload.status == UPLOAD_FILE_START) {
    Serial.println("\n\n data start!\n");
    _startByte = 0;
  } else if (upload.status == UPLOAD_FILE_WRITE) {
    // if (refreshEPD) refreshEPD(upload.buf,upload.currentSize);
    Serial.printf("data in:len%u, from%u,to%u,[%u,%u,%u]\n",upload.currentSize,_startByte,_startByte+upload.currentSize,upload.buf[0],upload.buf[1],upload.buf[2]);
    if (refreshEPD) refreshEPD(upload.buf,_startByte,upload.currentSize);
    _startByte += upload.currentSize;
  } else if (upload.status == UPLOAD_FILE_END) {
    // if (refreshEPD) refreshEPD(upload.buf,upload.totalSize);
    Serial.printf("total:%u\n",upload.totalSize);
  };
}

void handleFileDelete() {
  if (server.args() == 0) {
    return server.send(500, "text/plain", "BAD ARGS");
  }
  String path = server.arg(0);
  Serial.println("handleFileDelete: " + path);
  if (path == "/") {
    return server.send(500, "text/plain", "BAD PATH");
  }
  if (!exists(path)) {
    return server.send(404, "text/plain", "FileNotFound");
  }
  FILESYSTEM.remove(path);
  server.send(200, "text/plain", "");
  path = String();
}

void handleFileCreate() {
  if (server.args() == 0) {
    return server.send(500, "text/plain", "BAD ARGS");
  }
  String path = server.arg(0);
  Serial.println("handleFileCreate: " + path);
  if (path == "/") {
    return server.send(500, "text/plain", "BAD PATH");
  }
  if (exists(path)) {
    return server.send(500, "text/plain", "FILE EXISTS");
  }
  File file = FILESYSTEM.open(path, "w");
  if (file) {
    file.close();
  } else {
    return server.send(500, "text/plain", "CREATE FAILED");
  }
  server.send(200, "text/plain", "");
  path = String();
}

void handleFileList() {
  if (!server.hasArg("dir")) {
    server.send(200, "text/json", "[{\"BAD\":\"ARGS\"}]");
    return;
  }
  String path = server.arg("dir");
  Serial.println("handleFileList: " + path);
  File root = FILESYSTEM.open(path);
  path = String();

  String output = "[";
  if(root.isDirectory()){
      File file = root.openNextFile();
      while(file){
          if (output != "[") {
            output += ',';
          }
          output += "{\"type\":\"";
          output += (file.isDirectory()) ? "dir" : "file";
          output += "\",\"name\":\"";
          output += String(file.path()).substring(1);
          output += "\"}";
          file = root.openNextFile();
      }
  }
  output += "]";
  server.send(200, "text/json", output);
}


WS::WS(){
    Serial.begin(115200);
    Serial.print("\n");
    // epd = aepd;
    // if (FORMAT_FILESYSTEM) FILESYSTEM.format();
    FILESYSTEM.begin();
    // {
    //     File root = FILESYSTEM.open("/");
    //     File file = root.openNextFile();
    //     while(file){
    //         String fileName = file.name();
    //         size_t fileSize = file.size();
    //         Serial.printf("FS File: %s, size: %s\n", fileName.c_str(), formatBytes(fileSize).c_str());
    //         file = root.openNextFile();
    //     }
    //     Serial.printf("\n");
    // }

    //SERVER INIT
    //list directory
    server.on("/draw", HTTP_POST, []() { server.send(200, "text/plain", "drawing!"); }, handleDraw);
    server.on("/list", handleFileList);
    //load editor
    server.onNotFound([]() {
        if (!handleFileRead(server.uri())) {
        server.send(404, "text/plain", "FileNotFound");
        }
    });

    //get heap status, analog input value and all GPIO statuses in one json call
    server.on("/status", HTTP_GET, []() {
        String json = "{";
        json += "\"heap\":" + String(ESP.getFreeHeap());
        json += ", \"analog\":" + String(analogRead(A0));
        json += ", \"gpio\":" + String((uint32_t)(0));
        json += "}";
        server.send(200, "text/json", json);
        json = String();
    });

    // server.begin();
    // TimerHandle_t webHandleTimer = xTimerCreate("httphandle", pdMS_TO_TICKS(3000), pdTRUE, NULL, [](TimerHandle_t xTimer ){
    //     server.handleClient();
    // });
    // xTimerStart(webHandleTimer,0);

}

void WS::init(onEPDData cb){
    refreshEPD = cb;
    server.begin();
    server.enableCORS(true);
    Serial.println("HTTP server started");
}

void WS::handleClient(){
    server.handleClient();
}

// void loop(void) {
//   server.handleClient();
//   delay(2);//allow the cpu to switch to other tasks
// }

