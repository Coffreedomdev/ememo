
// prelease!
#include "cf2211.h" 
#include "SPIFFS.h"
#include <ESPmDNS.h>
#include "wserver.h"

RTC_DATA_ATTR config_t config = {0,5000,1,0b0010,0b000};
RTC_DATA_ATTR char host[] = "epd";
CF2211 cf2211(&config,"localWeb");
WS ws; //declare web server

void btnHandleInit(){
  // Serial.printf("Bnt init!\n");
  cf2211.onClick([](int cnt,int ms){
    //cf2211.log("bnt==>cnt:%u,ms:%u.",cnt,ms).show();
    Serial.printf("bnt==>cnt:%u,ms:%u.\n",cnt,ms);

    switch (cnt)
    {
    case 0: 
      if (ms>3000 && ms < 10000)  esp_restart();//重啟
      break;  
    case 1:
      break;
    case 2:
        if (cf2211.busy) return;
        cf2211.busy = true;
        cf2211.printConfig();
        cf2211.busy = false;
      break;
    case 3:
      break;
    case 4:
      break;
      
    case 5:
        esp_restart();//重啟
      break;
    case 6:
        cf2211.poweroff();//關閉電源
      break;
    case 8:
      break;
    
    default:
      break;
    }
  });
}



void setup(){
  Serial.begin(115200);
  delay(1000); //Take some time to open up the Serial Monitor
  // reason: 4 timer,7 external signal
    btnHandleInit();
    int waitCnt = 0;
    //type your own wifi ssid, pwd
    // WiFi.begin("ssid","pwd");
    WiFi.begin("coffreedomX60","Cf45128158money");
    Serial.printf("WiFi connecting.");
    while (WiFi.status() != WL_CONNECTED) {
      waitCnt++;
      Serial.printf(".");
    }

    cf2211.init(true);
    cf2211.log(10,10,"local web!").show();
    MDNS.begin(host); //MDNS is resolving an address with mDNS
    ws.init([](uint8_t* data,int start,int len){

    //use "memcpy" send your data to flash
    //Note: first var is start bit, data is your raw data, len is length 
    memcpy(cf2211.imgbuff+start,data,len); 
    // Serial.printf("bytes:[%u,%u,%u,%u],len:%u. \n",data[0],data[1],data[2],data[3],len);
    if (start+len==23233) cf2211.DisplayFrame16(0); //if length equare 23233, use 16 bit method draw
    });
  cf2211.log(10,80,"http://%s.local/",host); //standalone website
  cf2211.log("http://%s/",WiFi.localIP().toString().c_str())
  .show();
}

void loop(){
  ws.handleClient();
  delay(100);

}
