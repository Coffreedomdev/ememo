void setuptest(){
   Serial.begin(115200);
   pinMode(0,INPUT_PULLUP); // touch btn 1:on 0:off
   pinMode(2,INPUT_PULLUP); // power level 1:on 0:off
   pinMode(5,INPUT_PULLUP); // power charging 1:on 0:off
   pinMode(3,OUTPUT); // shutdown power
   digitalWrite(3,LOW); // power on low:on; high:off power;
   delay(2000);
   Serial.println("start!");Serial.println(digitalRead(0)); 
}
void looptest(){

  delay(1000);
  // Serial.print("cnt:");Serial.println(cnt); 
  // Serial.print("btn;pin 0:");
  Serial.print(digitalRead(0)); 
  // Serial.print("charge;pin 5:");Serial.println(digitalRead(5)); 
  // Serial.print("power level:");Serial.println(analogRead(A2));
  cnt++;
  if (cnt> 10) digitalWrite(3,HIGH); //poweroff;

}
