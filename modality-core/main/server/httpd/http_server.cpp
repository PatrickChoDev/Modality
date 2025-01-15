#include "http_server.hpp"
#include "esp_log.h"

#define TAG "HTTP"

namespace server
{
  namespace http
  {
    httpd_handle_t HTTPServer::server = NULL;
    ServerContext HTTPServer::context = {
        .flight_config = "{\"config_hash\": \"a1b2c3d4\", \"mission\": \"Test Mission\"}"};

    esp_err_t HTTPServer::config_get_handler(httpd_req_t *req)
    {
      ServerContext *ctx = (ServerContext *)req->user_ctx;
      httpd_resp_set_type(req, "application/json");
      httpd_resp_send(req, ctx->flight_config, strlen(ctx->flight_config));
      return ESP_OK;
    }

    esp_err_t HTTPServer::init()
    {
      httpd_config_t config = HTTPD_DEFAULT_CONFIG();
      config.server_port = 25718;

      ESP_LOGI(TAG, "Starting server on port: %d", config.server_port);

      esp_err_t ret = httpd_start(&server, &config);
      if (ret != ESP_OK)
      {
        ESP_LOGE(TAG, "Error starting server!");
        return ret;
      }

      httpd_uri_t config_uri = {
          .uri = "/config",
          .method = HTTP_GET,
          .handler = config_get_handler,
          .user_ctx = &context,
      };

      ESP_ERROR_CHECK(httpd_register_uri_handler(server, &config_uri));
      ESP_LOGI(TAG, "HTTP server started successfully");
      return ESP_OK;
    }

    void HTTPServer::cleanup()
    {
      if (server)
      {
        httpd_stop(server);
        server = NULL;
      }
    }

  } // namespace http
} // namespace server
