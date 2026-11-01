/**
 * WaterWise 2.0 - Pin Configuration Header
 * ============================================================
 * File   : include/config.h
 * Purpose: Central pin mapping and hardware constants.
 *          Commented out during Stage 1 (diagnostic only).
 *          Uncomment each section when adding that hardware.
 * ============================================================
 *
 * ESP32 DevKit v1 (ESP32-WROOM-32) Pin Restrictions:
 *   INPUT ONLY   : GPIO34, 35, 36 (VP), 39 (VN) - no pull-up/down in software
 *   BOOT SENSITIVE: GPIO0 (BOOT btn), GPIO2 (LED), GPIO12 (FLASH voltage)
 *   I2C DEFAULT  : SDA=GPIO21, SCL=GPIO22
 *   ADC2 CONFLICT: GPIO25-27, 32-33 OK for ADC; GPIO25,26,27 conflict with WiFi
 *   PWM/DAC      : GPIO25, 26 have built-in DAC
 *   DO NOT USE   : GPIO6-11 (connected to internal flash)
 *
 * VOLTAGE COMPATIBILITY:
 *   - ESP32 GPIO: 3.3V logic
 *   - DHT22: works at 3.3V (some need 5V pull-up, use 10k resistor to 3.3V)
 *   - BH1750: 3.3V I2C (ADDR pin to GND = 0x23, to VCC = 0x5C)
 *   - Capacitive moisture sensor: 3.3V compatible
 *   - Water level sensor: 5V sensor, use voltage divider for ADC pin
 *   - Relay module: Control signal 3.3V (active LOW), coil 5V, load up to 10A/250VAC
 *   - Pump: DO NOT connect to ESP32 GPIO directly. Use relay/MOSFET driver.
 *           Pump needs its own 5V-12V supply with common ground to ESP32.
 * ============================================================
 */

#pragma once

// ── Built-in ─────────────────────────────────────────────────
#define PIN_BUILTIN_LED     2   // Onboard blue LED (active HIGH)

// ── I2C Bus (shared by BH1750 + OLED) ────────────────────────
// These are the ESP32 default I2C pins — no change needed
#define PIN_I2C_SDA         21
#define PIN_I2C_SCL         22

// BH1750 I2C addresses:
//   ADDR pin to GND = 0x23 (default)
//   ADDR pin to VCC = 0x5C
#define BH1750_I2C_ADDR     0x23

// OLED SSD1306 I2C address (almost always 0x3C for 128x64)
#define OLED_I2C_ADDR       0x3C
#define OLED_SCREEN_WIDTH   128
#define OLED_SCREEN_HEIGHT  64

// ── DHT22 (Temperature + Humidity) ───────────────────────────
// GPIO4: safe digital pin, no special restrictions
#define PIN_DHT22           4
#define DHT_TYPE            DHT22  // Use DHT22 (AM2302) sensor type

// ── Capacitive Soil Moisture Sensor ──────────────────────────
// Analog input: GPIO34 is INPUT-only, perfect for ADC
// Output voltage: ~3.3V dry, ~0.9V wet (exact values need calibration)
// Calibration values below are APPROXIMATE — calibrate with your sensor
#define PIN_MOISTURE        34    // ADC1_CH6 (safe, no WiFi conflict)
#define MOISTURE_DRY_VAL    3100  // ADC reading in air (dry/no water)
#define MOISTURE_WET_VAL    1200  // ADC reading submerged in water

// ── Water Level Sensor ───────────────────────────────────────
// Sensor outputs 0-5V but ESP32 ADC max is 3.3V
// Use voltage divider: 10k + 10k → sensor output to GPIO35
// Result: 5V becomes 2.5V at GPIO, safe for ESP32
#define PIN_WATER_LEVEL     35    // ADC1_CH7, INPUT-only, no WiFi conflict

// ── Pump Control (via Relay or MOSFET) ───────────────────────
// SAFETY: This pin only controls a relay/MOSFET gate — NOT the pump directly
// Relay module: Active LOW (LOW = pump ON, HIGH = pump OFF)
// Set HIGH first in setup() to ensure pump is OFF at boot
#define PIN_PUMP_RELAY      26    // GPIO26 — digital output to relay IN pin
#define PUMP_ON             LOW   // Active-LOW relay (change to HIGH if active-HIGH)
#define PUMP_OFF            HIGH

// Pump safety timer: maximum pump run time per cycle (milliseconds)
#define PUMP_MAX_RUN_MS     5000  // 5 seconds max per watering cycle
#define PUMP_COOLDOWN_MS    30000 // 30 seconds before next watering allowed

// ── RGB LED ──────────────────────────────────────────────────
// Common cathode RGB LED (or WS2812B NeoPixel — adjust library if needed)
// Using PWM-capable pins for brightness control
#define PIN_LED_RED         25    // GPIO25 - PWM channel 0
#define PIN_LED_GREEN       27    // GPIO27 - PWM channel 1
#define PIN_LED_BLUE        14    // GPIO14 - PWM channel 2

// ── Plant Health Status Colors (RGB) ─────────────────────────
// Format: {R, G, B} — 0-255 for common cathode
// For MOSFET-driven: values are PWM duty cycle
// Status:
//   HEALTHY      → Green (solid)
//   NEEDS WATER  → Blue (slow blink)
//   STRESSED     → Red (fast blink)
//   WATERING     → Cyan (solid while pump runs)
#define LED_HEALTHY_R       0
#define LED_HEALTHY_G       255
#define LED_HEALTHY_B       0

#define LED_NEEDS_WATER_R   0
#define LED_NEEDS_WATER_G   0
#define LED_NEEDS_WATER_B   255

#define LED_STRESSED_R      255
#define LED_STRESSED_G      0
#define LED_STRESSED_B      0

#define LED_WATERING_R      0
#define LED_WATERING_G      200
#define LED_WATERING_B      200

// ── Plant Health Thresholds ───────────────────────────────────
// Moisture percentage (0-100%, calculated from ADC reading)
#define MOISTURE_HEALTHY_MIN  40  // Below this: Needs Attention
#define MOISTURE_HEALTHY_MAX  80  // Above this: Possibly over-watered
#define MOISTURE_STRESS_MIN   20  // Below this: Stressed (critical)

// Light intensity (lux from BH1750)
#define LIGHT_LOW_THRESHOLD   200   // Below 200 lux: insufficient light
#define LIGHT_HIGH_THRESHOLD  50000 // Above 50000 lux: too much direct sun

// Water tank level (percentage, 0-100%)
#define TANK_LOW_THRESHOLD    20  // Below 20%: Alert low tank

// ── Timing Constants ─────────────────────────────────────────
#define SENSOR_READ_INTERVAL_MS   2000   // Read sensors every 2 seconds
#define DISPLAY_UPDATE_MS         1000   // Update OLED every 1 second
#define WIFI_RECONNECT_MS         30000  // Retry WiFi every 30 seconds
