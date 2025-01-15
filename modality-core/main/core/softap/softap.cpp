#include <cstring>
#include "softap.hpp"
#include "esp_wifi.h"
#include "esp_mac.h"
#include "esp_log.h"
#include "esp_event.h"
#include "esp_netif.h"

#define TAG "SoftAP"
#define WIFI_AP_SSID_PREFIX "Modality"
#define WIFI_AP_MAX_CONNECTIONS 1

namespace core
{
  namespace wifi
  {

    esp_err_t SoftAP::init()
    {
      ESP_ERROR_CHECK(esp_netif_init());
      ESP_ERROR_CHECK(esp_event_loop_create_default());
      esp_netif_create_default_wifi_ap();

      wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
      ESP_ERROR_CHECK(esp_wifi_init(&cfg));

      uint8_t mac[6];
      esp_base_mac_addr_get(mac);
      char ssid[32];
      snprintf(ssid, sizeof(ssid), "%s %02X%02X%02X", WIFI_AP_SSID_PREFIX, mac[3], mac[4], mac[5]);

      char password[32];
      snprintf(password, sizeof(password), "modality-%02X%02X%02X", mac[5], mac[4], mac[3]);

      wifi_config_t wifi_config = {};
      memcpy(wifi_config.ap.ssid, ssid, sizeof(wifi_config.ap.ssid));
      memcpy(wifi_config.ap.password, password, sizeof(wifi_config.ap.password));
      wifi_config.ap.ssid_len = strlen(ssid);
      wifi_config.ap.authmode = WIFI_AUTH_WPA2_WPA3_PSK;
      wifi_config.ap.max_connection = WIFI_AP_MAX_CONNECTIONS;

      ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_AP));
      ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_AP, &wifi_config));
      ESP_ERROR_CHECK(esp_wifi_start());

      ESP_LOGI(TAG, "SoftAP initialized. SSID:%s", ssid);
      return ESP_OK;
    }

    void SoftAP::cleanup()
    {
      esp_wifi_stop();
      esp_wifi_deinit();
    }

  } // namespace wifi
} // namespace core
