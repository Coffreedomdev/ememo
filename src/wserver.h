#include <WebServer.h>

typedef void (*onEPDData)(uint8_t*, int,int) ;


class WS{
public:
    WS();
    void init(onEPDData);
    void handleClient();
protected:
};
