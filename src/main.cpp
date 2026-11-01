#include <Arduino.h>
#include <DHT.h>

// =====================================================
// WATERWISE 2.0 - COMPLETE SYSTEM
// ESP32 + DHT11 + Soil + LDR + Water Level + Relay
// =====================================================

// ---------- PIN DEFINITIONS ----------
#define SOIL_PIN      34
#define DHT_PIN        4
#define DHT_TYPE     DHT11
#define LDR_PIN       35
#define WATER_PIN      32

#define RELAY_PIN      26
#define BUZZER_PIN     27

#define GREEN_LED_PIN  14
#define RED_LED_PIN    13

// Most standard 5V relay modules are Active-LOW (LOW turns relay ON, HIGH turns it OFF).
// If your relay is Active-HIGH, change this to false.
#define RELAY_ACTIVE_LOW true

#if RELAY_ACTIVE_LOW
  #define RELAY_ON  LOW
  #define RELAY_OFF HIGH
#else
  #define RELAY_ON  HIGH
  #define RELAY_OFF LOW
#endif

// ---------- DHT ----------
// disableIRQ=false fixes timing issues on ESP32 240MHz
DHT dht(DHT_PIN, DHT_TYPE);

// =====================================================
// CALIBRATED SETTINGS
// =====================================================

// Soil moisture (capacitive sensor):
// 4095 = dry/in air, lower values = wetter
// Adjust after testing in your actual soil
#define SOIL_DRY_THRESHOLD  3000   // above this = needs water
#define SOIL_WET_THRESHOLD  1500   // below this = well watered

// Water level (HW-038 sensor submerged in tank):
// 0 = sensor in air / empty, higher = more water
// Calibrate: note value when submerged halfway = your LOW threshold
#define WATER_LOW_THRESHOLD  500   // below this = tank low

// Light (LDR module):
// 943 = your measured indoor room light
// Threshold set below room light so normal light reads OK
#define LIGHT_LOW_THRESHOLD  700   // below this = too dark

// How long pump runs per cycle (ms)
#define PUMP_RUN_TIME 5000

// Cooldown between watering cycles (ms)
#define WATERING_COOLDOWN 30000

// =====================================================
// VARIABLES
// =====================================================
bool pumpRunning = false;
unsigned long pumpStartTime = 0;
unsigned long lastWateringTime = 0;

// =====================================================
// SETUP
// =====================================================
void setup() {
  Serial.begin(115200);

  // IMPORTANT: Extra delay for ESP32 + DHT11 stability
  // DHT11 needs ~2s after power-on before first valid read
  // ESP32 boots fast so we wait here
  delay(3000);

  Serial.println();
  Serial.println("====================================");
  Serial.println("       WATERWISE 2.0 STARTING");
  Serial.println("====================================");

  // Setup output pins
  pinMode(RELAY_PIN,     OUTPUT);
  pinMode(BUZZER_PIN,    OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN,   OUTPUT);

  // Everything OFF at start
  digitalWrite(RELAY_PIN,     RELAY_OFF);
  digitalWrite(BUZZER_PIN,    LOW);
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN,   LOW);

  // Start DHT with extra settle time
  dht.begin();
  delay(2500); // Let DHT11 stabilize after begin()

  Serial.println("DHT11 initialized.");
  Serial.println("System ready.");
  Serial.println();

  // Hardware startup test
  Serial.println("LED & Relay self-test...");
  digitalWrite(GREEN_LED_PIN, HIGH); delay(400);
  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(RED_LED_PIN,   HIGH); delay(400);
  digitalWrite(RED_LED_PIN,   LOW);

  // Relay self-test (audible click)
  Serial.println("Relay test: Triggering for 1 second (listen for click)...");
  digitalWrite(RELAY_PIN, RELAY_ON);
  delay(1000);
  digitalWrite(RELAY_PIN, RELAY_OFF);
  Serial.println("Relay test complete.");
  Serial.println();
}

// =====================================================
// LOOP
// =====================================================
void loop() {

  // ---------------------------------------------------
  // READ ALL SENSORS
  // ---------------------------------------------------
  int soilValue  = analogRead(SOIL_PIN);
  int lightValue = analogRead(LDR_PIN);
  int waterValue = analogRead(WATER_PIN);

  // DHT11: read with retry (ESP32 timing sensitive)
  float humidity    = dht.readHumidity();
  float temperature = dht.readTemperature();

  // ---------------------------------------------------
  // SERIAL OUTPUT
  // ---------------------------------------------------
  Serial.println("------------------------------------");
  Serial.print("Soil moisture raw:  "); Serial.println(soilValue);
  Serial.print("Light raw:          "); Serial.println(lightValue);
  Serial.print("Water level raw:    "); Serial.println(waterValue);

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT11: ERROR - check wiring/sensor");
    Serial.println("  Tip: ensure DATA pin has solid contact");
  } else {
    Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" C");
    Serial.print("Humidity:    "); Serial.print(humidity);    Serial.println(" %");
  }

  // ---------------------------------------------------
  // DETERMINE CONDITIONS
  // ---------------------------------------------------
  bool soilDry  = soilValue  > SOIL_DRY_THRESHOLD;
  bool soilWet  = soilValue  < SOIL_WET_THRESHOLD;
  bool lightLow = lightValue < LIGHT_LOW_THRESHOLD;
  bool waterLow = waterValue < WATER_LOW_THRESHOLD;

  // Plant status
  if (soilDry)       Serial.println("Plant status: SAD / THIRSTY");
  else if (soilWet)  Serial.println("Plant status: HAPPY / WELL WATERED");
  else               Serial.println("Plant status: OK");

  // Light status
  Serial.print("Light status: ");
  Serial.println(lightLow ? "LOW - needs more light" : "OK");

  // Water tank status
  Serial.print("Water tank:   ");
  Serial.println(waterLow ? "LOW - refill needed" : "OK");

  // ---------------------------------------------------
  // LED INDICATOR
  // GREEN = healthy, RED = problem
  // ---------------------------------------------------
  if (soilDry || waterLow) {
    digitalWrite(RED_LED_PIN,   HIGH);
    digitalWrite(GREEN_LED_PIN, LOW);
  } else {
    digitalWrite(RED_LED_PIN,   LOW);
    digitalWrite(GREEN_LED_PIN, HIGH);
  }

  // ---------------------------------------------------
  // BUZZER ALERT
  // ---------------------------------------------------
  if (soilDry || waterLow) {
    // Short beep pattern instead of constant buzz
    digitalWrite(BUZZER_PIN, HIGH); delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  }

  // ---------------------------------------------------
  // AUTO WATERING (only if soil dry AND tank has water)
  // ---------------------------------------------------
  if (soilDry && !waterLow && !pumpRunning) {
    if (millis() - lastWateringTime > WATERING_COOLDOWN) {
      Serial.println();
      Serial.println(">>> SOIL DRY + TANK OK - STARTING PUMP <<<");
      digitalWrite(RELAY_PIN, RELAY_ON);
      pumpRunning     = true;
      pumpStartTime   = millis();
      lastWateringTime = millis();
    } else {
      Serial.print("Pump: In cooldown (");
      Serial.print((WATERING_COOLDOWN - (millis() - lastWateringTime)) / 1000);
      Serial.println("s remaining)");
    }
  } else if (soilDry && waterLow) {
    Serial.println(">>> PUMP INHIBITED: Soil dry, but Tank is LOW (submerge water sensor or lower threshold)! <<<");
  }

  // Stop pump after run time
  if (pumpRunning && (millis() - pumpStartTime >= PUMP_RUN_TIME)) {
    digitalWrite(RELAY_PIN, RELAY_OFF);
    pumpRunning = false;
    Serial.println(">>> WATERING CYCLE COMPLETE - PUMP OFF <<<");
  }

  // Pump status
  Serial.print("Pump: ");
  Serial.println(pumpRunning ? "ON" : "OFF");

  delay(2000);
}