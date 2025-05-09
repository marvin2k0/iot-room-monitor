#include "WiFiS3.h"
#include "Modulino.h"
#include "secrets.h"

const long INTERVAL = 1000 * 30; // 30 seconds

char ssid[] = SECRET_SSID;
char password[] = SECRET_PW;
int port = 8080;
int led = LED_BUILTIN;

WiFiClient wifi;
ModulinoThermo thermo;

void setup() {
  Serial.begin(9600);

  while (WiFi.begin(ssid, password) != WL_CONNECTED) {
    Serial.print("Connecting...");
    delay(1000);
  }

  Serial.println("Connected to WiFi");
  Modulino.begin();
  thermo.begin();
  Serial.println("Started thermo sensor");
}

float temperature = 0;

void loop() {
  temperature = thermo.getTemperature();

  Serial.print("Current room temperature: ");
  Serial.println(temperature);

  delay(INTERVAL);
}
