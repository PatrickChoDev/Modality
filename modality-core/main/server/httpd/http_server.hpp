#pragma once

#include "esp_err.h"
#include "esp_http_server.h"

namespace server
{
  namespace http
  {

    struct ServerContext
    {
      const char *flight_config;
    };

    class HTTPServer
    {
    public:
      static esp_err_t init();
      static void cleanup();

    private:
      static httpd_handle_t server;
      static ServerContext context;
      static esp_err_t config_get_handler(httpd_req_t *req);
    };

  } // namespace http
} // namespace server
