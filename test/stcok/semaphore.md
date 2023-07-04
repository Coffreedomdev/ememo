https://blog.csdn.net/weixin_39585974/article/details/111850764

>SemaphoreHandle_t xSemaphore = NULL;
 申明互斥型信號量，在FreeRTOS中二值型信號量和互斥型信號量類型完全相同。

>xSemaphore = xSemaphoreCreateMutex();
創建互斥型信號量。

>xSemaphoreTake( xSemaphore, portMAX_DELAY );
    獲得資源的使用權，此處的等待時間爲portMAX_DELAY（掛起最大時間），如果任務無法獲得資源的使用權，任務會處於掛起狀態。

>xSemaphoreGive( xSemaphore );
    釋放資源的使用權。

### hint
1. 互斥信号量仅支持用在 FreeRTOS 的任务中
2. 中断函数中使用=>xSemaphoreTakeFromISR,xSemaphoreGiveFromISR
3. 互斥信号量，xSemaphoreTake 和 xSemaphoreGive 一定要成对的调用

### example 
https://wokwi.com/projects/333321518201176660

### reference
使用如下 18 个函数可以实现 FreeRTOS 的信号量(含计数信号量，二值信号量和互斥信号)：

 xSemaphoreCreateBinary()
 xSemaphoreCreateBinaryStatic()
 vSemaphoreCreateBinary()
 xSemaphoreCreateCounting()
 xSemaphoreCreateCountingStatic()
 xSemaphoreCreateMutex()
 xSemaphoreCreateMutexStatic()
 xSem'CreateRecursiveMutex()
 xSem'CreateRecursiveMutexStatic()
 vSemaphoreDelete()
 xSemaphoreGetMutexHolder()
 uxSemaphoreGetCount()
 xSemaphoreTake()
 xSemaphoreTakeFromISR()
 xSemaphoreTakeRecursive()
 xSemaphoreGive()
 xSemaphoreGiveRecursive()
 xSemaphoreGiveFromISR()


## mutex
#include <mutex>

std::mutex serial_mtx;

void setup() {
  Serial.begin(112500);
  xTaskCreate(vTask1, "Task 1", 10000, NULL, 1, NULL);
  xTaskCreate(vTask2, "Task 2", 10000, NULL, 1, NULL);
}

void loop() {}

void vTask1(void *pvParameters) {
  for (;;) {
    std::lock_guard<std::mutex> lck(serial_mtx);
    Serial.println("Task 1 is running");
  }
}

void vTask2(void *pvParameters) {
  for (;;) {
    std::lock_guard<std::mutex> lck(serial_mtx);
    Serial.println("Task 2 is running");
  }
}




## Mutex 與 Semaphore 最大的差異是
名詞定義
Mutex: Linux kenrel 中的 mutex lock, <include/mutex.h>
Semaphore: Linux kernel 中的 semaphore, <include/semaphore.h>
mutual exclusion: 中翻互斥鎖，一個概念，為了防止 concurrency 狀況下出現 race condition.
Mutex 與 Semaphore 最大的差異是：

 - 最大的差異在於 Mutex 只能由上鎖的 thread 解鎖，而 Semaphore 沒有這個限制，可以由原本的 thread 或是另外一個 thread 解開。另外，Mutex 只能讓一個 thread 進入 critical section，Semaphore 的話則可以設定要讓幾個 thread 進入。這讓實際上使用 Mutex 跟 Semaphore 場景有很大的差別。

 - 舉例而言，Mutex 的兩個特性：一個是隻能有持鎖人解鎖、一個是在釋放鎖之前不能退出的特性，讓 Mutex 叫常使用在 critical section 只能有一個 thread 進入，而且要避免 priority inversion 的時候；Semaphore 也能透過 binary semaphore 做到類似的事情，卻沒有辦法避免 priority inversion 出現。

 - 而 Semaphore 更常是用在同步兩個 thread 或功能上面，因為 Semaphore 實際上使用的是 signal 的 up 與 down，讓 Semaphore 可以變成是一種 notification 的作用，例如 A thread 執行到某個地方時 B thread 才能繼續下去，就可以使用 Semaphore 來達成這樣的作用。

### Fact checks、priority inversion 跟 Linux kernel 實作的部份：

在 Linux kernel 中，一開始是隻有 semaphore 這個 structure，直到 2.6.16 版當中才把 mutex 從 semaphore 中分離出來 (這點可以從 LDD3e* 看出來)。雖然 Mutex 與 Semaphore 兩者都是休眠鎖，但是 Linux kernel 在實作 Mutex 的時候，有用到一些加速的技巧，將上鎖分為3個步驟：

 -Fast path: 嘗試使用 atomic operation 直接減少 counter 數值來獲得鎖。

 -Mid path: 第一步失敗的話，嘗試使用特化的 MCS spinlock 等待然後取鎖。 當持鎖的 thread 還在運行，而且沒有存在更高 priority 的 task 時，我們可以大膽假設，持鎖 thread 很快就會把 thread 釋放出來 (看看 code 就知道了)，因此會使用一個特化的 MCS spinlock 等待鎖被釋放。特化的 MCS spinlock 可以在被 reschedule 的時候退出 MCS spinlock queue。當走到這步時，就會到 Slow path。

 -Slow path: 鎖沒有辦法取得，只好把自己休眠了。 走到這一步，mutex 才會將自己加入 wait-queue 然後休眠，等待有人 unlock 後才會被喚醒。

當然這樣是會有代價的，Mutex 成為了 Linux kernel 中最大的一個鎖，在 x86-64 的環境下需要使用 40 bytes，相比於 semaphore 只需要使用 24 bytes，實在是大上許多。大的意思代表會佔用掉更多的 CPU cache (回頭看 phonebook) 跟 memory footprint。

而在 Linux kernel v4.6.0-rc2 中，使用 semaphore 的部份只有 75 處 (加上 drivers)，mutex 則使用在 1463 個地方

semaphore in Linux kernel: 75 parts (#include <linux/semaphore.h>)
mutex in Linux kernel: 1463 parts (#include <linux/mutex.h>)
通常也不會把 Semaphore 當作是 Mutex 來使用，而是利用 signal 的特性，同步不同 thread 之間的工作。