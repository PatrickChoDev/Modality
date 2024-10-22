#include "modality.h"

int main(int argc, char **argv)
{
  g_autoptr(ModalityApplication) app = modality_app_new();
  return g_application_run(G_APPLICATION(app), argc, argv);
}
