#include "mdns_service.hpp"
#include "mdns.h"
#include "esp_log.h"

#define TAG "MDNS"

namespace core
{
  namespace mdns
  {

    esp_err_t MDNSService::init()
    {
      esp_err_t ret = mdns_init();
      if (ret != ESP_OK)
      {
        ESP_LOGE(TAG, "Error initializing mDNS!");
        return ret;
      }

      ret = mdns_hostname_set("randomhash_modality");
      if (ret != ESP_OK)
      {
        ESP_LOGE(TAG, "Error setting mDNS hostname!");
        return ret;
      }

      ret = mdns_instance_name_set("Modality Worker Device");
      if (ret != ESP_OK)
      {
        ESP_LOGE(TAG, "Error setting mDNS instance name!");
        return ret;
      }

      ret = mdns_service_add(NULL, "_modality", "_tcp", 25718, NULL, 0);
      if (ret != ESP_OK)
      {
        ESP_LOGE(TAG, "Error adding mDNS service!");
        return ret;
      }

      ESP_LOGI(TAG, "mDNS service started successfully");
      return ESP_OK;
    }

    void MDNSService::cleanup()
    {
      mdns_free();
    }

  } // namespace mdns
} // namespace core
