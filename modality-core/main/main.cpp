#include "esp_log.h"
#include "nvs_flash.h"
#include "core/softap/softap.hpp"
#include "core/mdns/mdns_service.hpp"
#include "server/httpd/http_server.hpp"
#include "freertos/FreeRTOS.h"

#define TAG "MAIN"

void task(void *pvParameter)
{
  ESP_LOGI("Task", "Task started");
  ESP_LOGI("Task", "Task running on core: %d", xPortGetCoreID());
  while (true)
  {
    ESP_LOGI(TAG, "Task running");
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

extern "C" void app_main()
{
  // Initialize NVS
  esp_err_t ret = nvs_flash_init();
  if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
  {
    ESP_ERROR_CHECK(nvs_flash_erase());
    ret = nvs_flash_init();
  }
  ESP_ERROR_CHECK(ret);

  // Initialize SoftAP
  ret = core::wifi::SoftAP::init();
  if (ret != ESP_OK)
  {
    ESP_LOGE(TAG, "Failed to initialize SoftAP");
    return;
  }

  // Initialize mDNS
  ret = core::mdns::MDNSService::init();
  if (ret != ESP_OK)
  {
    ESP_LOGE(TAG, "Failed to initialize mDNS");
    core::wifi::SoftAP::cleanup();
    return;
  }

  // Initialize HTTP Server
  ret = server::http::HTTPServer::init();
  if (ret != ESP_OK)
  {
    ESP_LOGE(TAG, "Failed to initialize HTTP server");
    core::mdns::MDNSService::cleanup();
    core::wifi::SoftAP::cleanup();
    return;
  }

  // Create a task
  xTaskCreatePinnedToCore(task, "task", 4096, NULL, 5, NULL, 1);
}