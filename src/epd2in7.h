/**
    @filename   :   epd2in7.h
    @brief      :   Header file for e-paper library epd2in7.cpp
    @author     :   Yehui from Waveshare

    Copyright (C) Waveshare     August 10 2017

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documnetation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to  whom the Software is
   furished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS OR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
*/

#include "epdif.h"

// Display resolution
#define EPD_WIDTH       176
#define EPD_HEIGHT      264

// EPD2IN7 commands
#define PANEL_SETTING                               0x00
#define POWER_SETTING                               0x01
#define POWER_OFF                                   0x02
#define POWER_OFF_SEQUENCE_SETTING                  0x03
#define POWER_ON                                    0x04
#define POWER_ON_MEASURE                            0x05
#define BOOSTER_SOFT_START                          0x06
#define DEEP_SLEEP                                  0x07
#define DATA_START_TRANSMISSION_1                   0x10
#define DATA_STOP                                   0x11
#define DISPLAY_REFRESH                             0x12
#define DATA_START_TRANSMISSION_2                   0x13
#define PARTIAL_DATA_START_TRANSMISSION_1           0x14
#define PARTIAL_DATA_START_TRANSMISSION_2           0x15
#define PARTIAL_DISPLAY_REFRESH                     0x16
#define LUT_FOR_VCOM                                0x20
#define LUT_WHITE_TO_WHITE                          0x21
#define LUT_BLACK_TO_WHITE                          0x22
#define LUT_WHITE_TO_BLACK                          0x23
#define LUT_BLACK_TO_BLACK                          0x24
#define PLL_CONTROL                                 0x30
#define TEMPERATURE_SENSOR_COMMAND                  0x40
#define TEMPERATURE_SENSOR_CALIBRATION              0x41
#define TEMPERATURE_SENSOR_WRITE                    0x42
#define TEMPERATURE_SENSOR_READ                     0x43
#define VCOM_AND_DATA_INTERVAL_SETTING              0x50
#define LOW_POWER_DETECTION                         0x51
#define TCON_SETTING                                0x60
#define TCON_RESOLUTION                             0x61
#define SOURCE_AND_GATE_START_SETTING               0x62
#define GET_STATUS                                  0x71
#define AUTO_MEASURE_VCOM                           0x80
#define VCOM_VALUE                                  0x81
#define VCM_DC_SETTING_REGISTER                     0x82
#define PROGRAM_MODE                                0xA0
#define ACTIVE_PROGRAM                              0xA1
#define READ_OTP_DATA                               0xA2

#define ROTATE_0            0
#define ROTATE_90           1
#define ROTATE_180          2
#define ROTATE_270          3


extern const unsigned char lut_vcom_dc16_sClear[];
extern const unsigned char lut_ww16_sClear[];
extern const unsigned char lut_bw16_sClear[];
extern const unsigned char lut_bb16_sClear[];
extern const unsigned char lut_wb16_sClear[];

extern const unsigned char lut_vcom_dc16_fClear[];
extern const unsigned char lut_ww16_fClear[];
extern const unsigned char lut_bw16_fClear[];
extern const unsigned char lut_bb16_fClear[];
extern const unsigned char lut_wb16_fClear[];

extern const unsigned char lut_vcom_dc16_Update[];
extern const unsigned char lut_ww16_Update[];
extern const unsigned char lut_bw16_Update[];
extern const unsigned char lut_bb16_Update[];
extern const unsigned char lut_wb16_Update[];

extern const unsigned char lut_vcom_dc2_sUpdate[];
extern const unsigned char lut_ww2_sUpdate[];
extern const unsigned char lut_bw2_sUpdate[];
extern const unsigned char lut_bb2_sUpdate[];
extern const unsigned char lut_wb2_sUpdate[];

extern const unsigned char lut_vcom_dc2_fUpdate[];
extern const unsigned char lut_ww2_fUpdate[];
extern const unsigned char lut_bw2_fUpdate[];
extern const unsigned char lut_bb2_fUpdate[];
extern const unsigned char lut_wb2_fUpdate[];

//2022.11.14
extern const unsigned char lut_vcom_dc2_pUpdate[];
extern const unsigned char lut_ww2_pUpdate[];
extern const unsigned char lut_bw2_pUpdate[];
extern const unsigned char lut_bb2_pUpdate[];
extern const unsigned char lut_wb2_pUpdate[];
//2022.11.14

class Epd : EpdIf {
  public:
    unsigned int width;
    unsigned int height;

    Epd();
    ~Epd();
    int  Init(uint8_t rotate);
    int  Init2(void);
    void SendCommand(unsigned char command);
    void SendData(unsigned char dat);
    void WaitUntilIdle(void);
    void Reset(void);
    void SetLut16_sClear(void);
    void SetLut16_fClear(void);
    void SetLut16_Update(uint8_t l);
    void SetLut2_sUpdate(void);
    void SetLut2_fUpdate(void);
    //2022.11.14
    void SetLut2_pUpdate(void);
    //2022.11.14
    void DisplayFrame16(uint8_t type, const unsigned char* frame_buffer);
    void DisplayFrame2(uint8_t type, const unsigned char* frame_buffer);
    void DisplayFrame2A(const unsigned char* frame_buffer);
    //2022.11.14
    void DisplayFrameP(int x, int y, int w, int l, const unsigned char* frame_buffer);
    //2022.11.14
    void DisplayFrame(void);
    void ClearFrame(void);
    void Sleep(void);
    void setRotation(uint8_t rotate);

    //add by martin
    void SendDisplayData(const unsigned char* frame_buffer);
    void DisplayRectFrame(int x, int y, int w, int l);
    // end martin
    
  private:
    unsigned int reset_pin;
    unsigned int dc_pin;
    unsigned int cs_pin;
    unsigned int busy_pin;
    uint8_t rotation;
    uint8_t bit_reverse(uint8_t x);
};
