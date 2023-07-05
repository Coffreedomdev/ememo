此主題講述的是如何透過此開源程式獨立操作ememo，實現ememo資料更新的功能，專案內容包含了透過[PlatformIO](https://randomnerdtutorials.com/vs-code-platformio-ide-esp32-esp8266-arduino/#2)或透過[ESP32 Filesystem Uploader in Arduino IDE](https://randomnerdtutorials.com/install-esp32-filesystem-uploader-arduino-ide/) (請留意 ESP32 Filesystem Uploader 工具至目前為止仍只支援Arduino 2.0以下的版本)

#PlatformIO
- 準備工具：VS Code。在VS Code 的擴充功能（Extensions）頁面搜尋並安裝PlatformIO IDE 就可以了。
- 您可以直接clone本專案後，以VS Code工具開啟。並透過Type C傳輸線將ememo本體與電腦連接
![image](https://github.com/Coffreedomdev/tempimg/blob/main/vscodedesc.png)


- 按下Upload FilesystemImage 後，本體裝置會產生如下圖網址，您可以透過網址內容，進行編修程式(本範例為上傳圖片，或者自行編輯文字寫至電子紙標籤上)
![image](https://github.com/Coffreedomdev/tempimg/blob/main/S__3162161.jpg)

- 本範例上傳圖片網頁畫面
![image](https://github.com/Coffreedomdev/tempimg/blob/main/webpagedisplay.png)
