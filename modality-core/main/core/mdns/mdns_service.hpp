#pragma once

#include "esp_err.h"

namespace core
{
  namespace mdns
  {

    class MDNSService
    {
    public:
      static esp_err_t init();
      static void cleanup();
    };

  } // namespace mdns
} // namespace core
