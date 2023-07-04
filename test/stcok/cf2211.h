#define uS_TO_S_FACTOR 1000000ULL  /* Conversion factor for micro seconds to seconds */
#define MAX_LONG_BTN_DOWN 10000
#define MIN_LONG_BTN_DOWN 2000
#define MIN_CONTINUE_BTN_DOWN 300
#define bnt_pin 0
#define charge_pin 5
#define power_pin 3
#include <Arduino.h>
#include "epd2in7.h"
#include "epdpaint.h"
#include <mutex>

typedef struct {
  uint32_t timeStamp;
  uint16_t btLevelToSleep;
  uint8_t minFetchCheck;
  uint8_t fetch;  // bits [img,todo,weather,stock]
  uint8_t userDefine; //bits [tbd,tbd,refresh,rotation]
} config_t;
typedef void (*OnBtnCallBack)(int, int) ;

class CF2211{
public:
    CF2211(config_t*,char* ver);
    ~CF2211();
    void init(boolean firstTime);
    int estBatteryV(void);
    void chkBattery();
    void chkBattery(bool updateScreen);
    void deepSleep(int sec);
    void deepSleep();
    static void chkInterrupe();
    static void chkHeap();
    static void chkHeap(const char* msg);
    CF2211& onClick(OnBtnCallBack);
    CF2211& quickLog(int x,int y,sFONT* font,const char* format,...);
    CF2211& log(int x,int y,sFONT* font,const char* format,...);
    CF2211& log(int x,int y,const char* format,...);
    CF2211& log(const char* format,...);
    CF2211& stateChange(int num);
    CF2211& stateChange(char num);
    
    unsigned char imgbuff[23233] = {0};
    void show();
    void rectShow(int x,int y,int width,int length);
    CF2211& sendDisplayData();
    void poweroff();
    CF2211& timeStamp();
    CF2211& printConfig();
    CF2211& clear();
    CF2211& clean();
    CF2211& initEPD();
    CF2211& setRotation(int rotation);
    CF2211& DisplayFrame16(int type);
    Paint paint;
    config_t * config;
    boolean busy=false;
    int drawcnt=1;
    std::mutex busy_mtx;
    std::mutex epd_mtx;
    CF2211& quickShow();
protected:
    struct {int x; int y;} cursor={0,0};
    boolean epdinit = false;
    char* version;
    CF2211& log(int x,int y,sFONT* font,const char* format,va_list args);
private:
    Epd epd;   
};
