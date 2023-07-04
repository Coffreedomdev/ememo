#include "cf2211.h"

void printPartitionTable(){
  printf("ESP32 Partition table:\n");
  printf("| Type | Sub |  Offset  |   Size   |       Label      |\n");
  printf("| ---- | --- | -------- | -------- | ---------------- |\n");
  esp_partition_iterator_t pi = esp_partition_find(ESP_PARTITION_TYPE_ANY, ESP_PARTITION_SUBTYPE_ANY, NULL);
  if (pi != NULL) {
    do {
      const esp_partition_t* p = esp_partition_get(pi);
      printf("|  %02x  | %02x  | 0x%06X | 0x%06X | %-16s |\n", 
        p->type, p->subtype, p->address, p->size, p->label);
    } while (pi = (esp_partition_next(pi)));
  }
}


CF2211::CF2211(config_t* aconfig,char* ver):paint(imgbuff+1,176,264) {
  pinMode(bnt_pin,INPUT_PULLUP); // touch btn 1:on 0:off
  pinMode(power_pin,OUTPUT); // shutdown power
  pinMode(charge_pin,INPUT_PULLUP); // charging
  pinMode(2,INPUT_PULLUP); // power level 1:on 0:off
  digitalWrite(power_pin,LOW); // power on low:on; high:off power;
  config = aconfig;
  version = ver;
  attachInterrupt(bnt_pin,chkInterrupe, CHANGE);
}

CF2211::~CF2211() {
}
CF2211& CF2211::initEPD(){
  if (!epdinit)
    if (config->userDefine & 0b0001) epd.Init(ROTATE_180);  else epd.Init(ROTATE_0);
  epdinit = true;  
  return *this;
}
void CF2211::init(boolean firstTime){
  initEPD();
  if (firstTime) {
    printPartitionTable();
    Serial.println("epd init");
    clean(); 
  }
  chkBattery();
}
CF2211& CF2211::stateChange(int num){
  quickLog(246,154,&Font20,"%u",num);
  sendDisplayData();
  rectShow(246,154,14,20);
  return *this;
}
CF2211& CF2211::stateChange(char ch){
  quickLog(246,154,&Font20,"%c",ch);
  sendDisplayData();
  rectShow(246,154,14,20);
  return *this;
}

CF2211& CF2211::quickShow(){
  std::lock_guard<std::mutex> lck(epd_mtx);
  epd.DisplayFrame2A(imgbuff);
  return *this;
}

CF2211& CF2211::log(int x,int y,sFONT* font,const char* format,va_list args){
  char buffer[256];
  cursor.x = x;
  cursor.y = y;
  vsnprintf (buffer, 255, format, args);
  // Serial.print("[log]:");Serial.println(buffer);
  paint.DrawFilledRectangle(cursor.x,cursor.y,cursor.x+font->Width * strlen(buffer),cursor.y+font->Height,0);
  paint.DrawStringAt(cursor.x, cursor.y, buffer, font, 1);
  cursor.y += font->Height;
  if (cursor.y > 156){
    show();
  }
  return *this;
}
CF2211& CF2211::quickLog(int x,int y,sFONT* font,const char* format,...){
  char buffer[256];
  cursor.x = x;
  cursor.y = y;
  va_list args;
  va_start(args, format);
  vsnprintf (buffer, 255, format, args);
  // Serial.printf("[log]:%s,x:%u,y:%u; font.h:%u,font.w:%u\n",buffer,x,y,font->Height,font->Width);
  paint.DrawFilledRectangle(cursor.x,cursor.y,cursor.x+font->Width * strlen(buffer),cursor.y+font->Height,0);
  paint.DrawStringAt(cursor.x, cursor.y, buffer, font, 1);
  cursor.y += font->Height;
  va_end (args);
  return *this;
}

CF2211& CF2211::log(int x,int y,sFONT* font,const char* format,...){
  char buffer[256];
  va_list args;
  cursor.x = x;
  cursor.y = y;
  va_start(args, format);
  log(x,y,font,format,args);
  va_end (args);
  return *this;
}
CF2211& CF2211::log(int x,int y,const char* format,...){
  va_list args;
  va_start(args, format);
  log(x,y,&Font16,format,args);
  va_end (args);
  return *this;
}
CF2211& CF2211::log(const char* format,...){
  va_list args;
  va_start(args, format);
  log(cursor.x,cursor.y,&Font16,format,args);
  va_end (args);
  return *this;
}
void CF2211::show(){
  std::lock_guard<std::mutex> lck(epd_mtx);
  epd.DisplayFrame2(++drawcnt%20, imgbuff);
}
CF2211& CF2211::setRotation(int r){
  epd.setRotation(r);
  return *this;
}
CF2211& CF2211::DisplayFrame16(int type){
  
  std::lock_guard<std::mutex> lck(epd_mtx);
  epd.DisplayFrame16(type,imgbuff);
  return *this;
}

void CF2211::rectShow(int x,int y,int width,int length){
  // if (imgbuff[0] == 16) return;

  std::lock_guard<std::mutex> lck(epd_mtx);
  epd.DisplayRectFrame(176-y-length,x,length,width);
  
}
CF2211& CF2211::sendDisplayData(){
  std::lock_guard<std::mutex> lck(epd_mtx);
  epd.SendDisplayData(imgbuff+1);
  return *this;
};

void CF2211::poweroff(){
    // chkBattery(false);
    // quickLog(8,160,&Font16,"Power off! @[%umv]",estBatteryV());
    // sendDisplayData();
    clear();
    log(100,60,&Font48,"Bye");
    show();
    delay(1000);
    epd.Sleep();
    digitalWrite(power_pin,HIGH); // power on low:on; high:off power;
}
int CF2211::estBatteryV(void){
      // unit:mV
  int v = analogRead(A2);
  // return ((v-2070)*0.001437708138 +3.1)*1000;
  return ((v-2070)*1438)/1000+3100;
}
CF2211& CF2211::printConfig(){
  clear();
  log("config: ver:%s",version);
  // log("[timeStamp]:%u",config->timeStamp);
  // log("[btLevelToSleep]:%u",config->btLevelToSleep);
  log("[Battery]:%u mV",estBatteryV());
  // log("[minFetchCheck]:%u",config->minFetchCheck);   
  // if (config->fetch & 0b1) log ("[stock]:on");
  // if ((config->fetch & 0b10) >>1) log ("[weather]:on");
  // if ((config->fetch & 0b100) >>2) log ("[todo]:on");
  // log("[fetch]:0X%X",config->fetch);
  if (config->userDefine &0x1) log("[rotation]:on");
  log("1:next page").log("2:show config").log("3:refresh config").log("4:clean screen")
  .log("5:restart").log("6:power off").log("8:reset all");
  // log("[userDefine]:0X%X",config->userDefine);
  show();
  return *this;
};
void CF2211::chkBattery(bool updateScreen){
  if (updateScreen) chkBattery();
  else {
  // $%&'()*+
    int bl = estBatteryV();
    if (!digitalRead(charge_pin)) quickLog(246,154,&Font20,"%s","*");
    else if (bl>4100) quickLog(246,154,&Font20,"%s","(");
    else if (bl>3900) quickLog(246,154,&Font20,"%s","'");
    else if (bl>3700) quickLog(246,154,&Font20,"%s","&");
    else if (bl>3400) quickLog(246,154,&Font20,"%s","%");
    else if (bl>3250) quickLog(246,154,&Font20,"%s","$");
    else poweroff();
  }
}

void CF2211::chkBattery(){
  int bl = estBatteryV();
  // $%&'()*+
  if (!digitalRead(charge_pin)) stateChange('*');
  else if (bl>4100) stateChange('(');
  else if (bl>3900) stateChange('\'');
  else if (bl>3700) stateChange('&');
  else if (bl>3400) stateChange('%');
  else if (bl>3250) stateChange('$');
  else {
    poweroff();
  }  
}

CF2211& CF2211::timeStamp(){
  int tk = (config->timeStamp + millis()/1000); 
  uint8_t hh=0;
  uint8_t mm=0;
  uint8_t ss=0;
  hh = tk % 86400 / 3600;
  mm = tk % 3600 /60;
  ss = tk % 60;
  quickLog(22,44,&Font48,"%02i:%02i",hh,mm);
  // quickLog(40,60,&Font48,"gy:%02i:%02i",mm,ss);
  sendDisplayData();
  rectShow(22,44,24*5+8,48);
  return *this;
};
CF2211& CF2211::clear(){
  cursor = {8,8};
  memset(imgbuff+1, 0, 5808);
  return *this;
};

CF2211& CF2211::clean(){
  std::lock_guard<std::mutex> lck(epd_mtx);
  epd.SetLut16_sClear();
  epd.ClearFrame();
  epd.DisplayFrame();
  return *this;
};
void CF2211::chkHeap(const char* msg){
	printf("%s,heap free size: %d\n",msg, heap_caps_get_free_size(MALLOC_CAP_8BIT));

}


void CF2211::chkHeap(){  
	printf("heap freesize: %d\n", heap_caps_get_free_size(MALLOC_CAP_8BIT));
	// printf("heap_caps_get_minimum_free_size: %d\n", heap_caps_get_minimum_free_size(MALLOC_CAP_8BIT));
	// printf("heap_caps_get_largest_free_block: %d\n", heap_caps_get_largest_free_block(MALLOC_CAP_8BIT));    
}
void CF2211::deepSleep(int sec){ // sec <10 force to sleep!
    if (sec >10) {
      std::lock_guard<std::mutex> lck(busy_mtx);
      delay(500);
      std::lock_guard<std::mutex> lck2(epd_mtx);
    }
    else {
      // config->userDefine |= 0b0010; //enable fetch when start
      delay(1000);
    }
    int btymV = estBatteryV();
    if (btymV > config->btLevelToSleep && sec >10) { 
    // if (btymV > config->btLevelToSleep) { 
      Serial.printf("Power Level:%u mV,no sleep!,battery Level :%u\n",btymV,config->btLevelToSleep); 
      return; 
    } 
    //定义用于RTC_GPIO唤醒的I,0b为二进制“0010”为2(gpio )的二进制数
    //gpio0~3为0b1111,即2~0+2~1+2~2+23=15的二进制数
    const uint64_t WAKEUP_PIN_BITMASK = 0b0001;
    //配置唤醒源
    char info[30];
    sprintf(info,"Sleep@%umV",btymV);
    
    gpio_deep_sleep_hold_dis(); //在深度睡眠时禁用所有数字gpio pad保持能。
    esp_deep_sleep_enable_gpio_wakeup(WAKEUP_PIN_BITMASK, ESP_GPIO_WAKEUP_GPIO_HIGH);
    gpio_set_direction(GPIO_NUM_0, GPIO_MODE_INPUT); //GPI0定向,设置为输入或输出
    if (sec > 10) stateChange(')');
    epd.Sleep();
    Serial.printf("deep sleep [%u] seconds.\n\n",sec);
    Serial.flush(); 
    uint64_t priorUp = config->timeStamp *uS_TO_S_FACTOR + micros();
    config->timeStamp+= millis()/1000+sec;
    if (sec >0) esp_sleep_enable_timer_wakeup(config->timeStamp*uS_TO_S_FACTOR - priorUp -300);
    esp_deep_sleep_start();
}
void CF2211::deepSleep(){
    deepSleep(config->minFetchCheck*60);
}


OnBtnCallBack clickCB =  NULL;
struct {
  int cnt;
  long last;
  long prior;
} intInfo = {0};

void btnChkReslut(){
  if (clickCB) clickCB(intInfo.cnt,millis()- intInfo.last);
  else {
    Serial.printf("btn Click(w/o cb):%u times,w %u ms!\n",intInfo.cnt,millis()- intInfo.last);
  }
  intInfo.cnt = 0;
  intInfo.last = 0;
};
TimerHandle_t btnChkTimer = xTimerCreate("btnTimer", pdMS_TO_TICKS(1000), pdFALSE, NULL, reinterpret_cast<TimerCallbackFunction_t>(btnChkReslut));

CF2211& CF2211::onClick(OnBtnCallBack callback){
  clickCB = callback;
  return *this;
};

void CF2211::chkInterrupe(){
  uint8_t status = digitalRead(bnt_pin);
  long now = millis ();
  if (status==1) {
      intInfo.prior = intInfo.last;
      intInfo.last = now;
  }
  else {
    xTimerStop(btnChkTimer,0);
    if (intInfo.last !=0 && now - intInfo.last> MAX_LONG_BTN_DOWN) {
      Serial.printf("miss operation prevention:[hold:%u ms]\n",now - intInfo.last);
    }
    else if (intInfo.last != 0 &&  now - intInfo.last>MIN_LONG_BTN_DOWN){
      xTimerStart(btnChkTimer,0);
    }
    else if (now - intInfo.last<50){
      Serial.printf("fake trigger!\n");
      // xTimerStart(btnChkTimer,0);
    }
    else {
      ++intInfo.cnt;
      xTimerStart(btnChkTimer,MIN_CONTINUE_BTN_DOWN);
    }
  }  
}


