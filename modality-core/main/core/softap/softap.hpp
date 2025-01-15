#pragma once

#include "esp_err.h"
#include "esp_event.h"

namespace core
{
  namespace wifi
  {

    class SoftAP
    {
    public:
      static esp_err_t init();
      static void cleanup();

    private:
      static void event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data);
    };

  } // namespace wifi
} // namespace core
