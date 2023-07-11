
#include "WiFi.h"
#include "cf2211.h" 
#include <HTTPClient.h>
#include <ArduinoJson.h>
StaticJsonDocument<200> json_doc;
char json_output[100];
DeserializationError json_error;



RTC_DATA_ATTR config_t config = {0,3200,1,0b0010,0b000};
char version[]="TEST001";
CF2211 cf(&config,version);

bool fgstock= false;


void btnHandleInit(){
  // Serial.printf("Bnt init!\n");
  cf.onClick([](int cnt,int ms){
    //cf.log("bnt==>cnt:%u,ms:%u.",cnt,ms).show();
    Serial.printf("bnt==>cnt:%u,ms:%u.\n",cnt,ms);
    cf.stateChange(cnt);
    switch (cnt)
    {
    case 0: 
      if (ms>3000 && ms < 10000)  esp_restart();//重啟
      break;  
    case 1:
    fgstock=true;
      break;    
    case 2:
      cf.printConfig();
      break;    
    case 3:
      cf.clear();
      cf.clean();
      cf.log(10,80,"epd test ok!").show();
      break; 
    case 9:
      cf.poweroff();      
      break;    
     
    default:
      break;
    }
    cf.chkBattery();
  });
}


void setup(){
  cf.init(false);
  cf.log(10,80,"epd testing").show();
  btnHandleInit();
  Serial.begin(115200);
  delay(1000); //Take some time to open up the Serial Monitor

  WiFi.begin("your ssid", "wifi password");
  Serial.printf("WiFi Connecting.");
  int testCnt=0;
  while (WiFi.status() != WL_CONNECTED && ++testCnt<60){
    Serial.printf(".");
    delay(1000);
  } 
  if (WiFi.status() == WL_CONNECTED){
    Serial.printf("\nWiFi Connected!\n");
    cf.log("WiFi Connected")
    .log("in %u sec.",testCnt)
    .show();
  }
  else {
    Serial.printf("\nWiFi fail!\n");
    cf.log("WiFi fail!").show();

  }
  

}

void loop(){

  if(fgstock){
    getStock();
    fgstock =false;
    } 
  delay(10000);
  
}

void getStock(){
  
HTTPClient http;
       DynamicJsonDocument doc(1024); //聲明一個JsonDocument對象

        Serial.print("[HTTP] begin...\n");
        //full url:`https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=${str}_${new Date().toISOString().substring(0, 10).split("-").join("")}`;
        // configure traged server and url
        //http.begin("https://www.howsmyssl.com/a/check", ca); //HTTPS
        http.begin("https://mis.twse.com.tw/stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=tse_2330.tw|otc_2330.tw_20230703"); //HTTP

        Serial.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            Serial.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                Serial.println(payload);
                DeserializationError err = deserializeJson(doc, payload);
                JsonArray array = doc["msgArray"].as<JsonArray>();
                for(JsonVariant v : array) {
                   cf.clear();
                   cf.clean();
                  cf.log(10,15,"id: %s",v["c"].as<const char *>()).show();

                  float lastday = v["y"].as<float>();
                  float cur;
                  if (v["z"].isNull() || v["z"].as<const char *>()[0]=='-'){
                    if (v["a"].isNull()) cur = lastday;
                    else if(v["a"].as<const char *>()[0]=='-'){
                      cur = v["u"].as<float>();
                    }
                    else if(v["b"].as<const char *>()[0]=='-'){
                      cur = v["w"].as<float>();
                    }        
                    else {
                      char tt[7]={0};
                      strncpy(tt,v["a"].as<const char *>(),6);
                      cur = atof(tt);
                    }
                    
                  } 
                  else cur= v["z"].as<float>();

                   cf.log(10,30,"cur price: %4.1f", cur).show();

                  
                }
                
            }
        } else {
            Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    }




    
//2021-11-23 edit getstock
// z  當盤成交價
// tv 當盤成交量
// v  累積成交量
// b  揭示買價(從高到低，以_分隔資料)
// g  揭示買量(配合b，以_分隔資料)
// a  揭示賣價(從低到高，以_分隔資料)
// f  揭示賣量(配合a，以_分隔資料)
// o  開盤
// h  最高
// l  最低
// y  昨收
// u  漲停價
// w  跌停價
// tlong  epoch毫秒數
// d  最近交易日期(YYYYMMDD)
// t  最近成交時刻(HH:MI:SS)
// c  股票代號
// n  公司簡稱
// nf 公司全名
