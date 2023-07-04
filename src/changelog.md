### 0.81w 
1. drawweather ==> partical refresh if not fetch weater
2. task create fail ==> deepSleep(8); force deepSleep;
3. http get fail > 1 ==> deepSleep(8);
4. loopCnt%60==59 ==> chkConfig();