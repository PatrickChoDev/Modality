#ifndef FLUTTER_MODALITY_APP_H_
#define FLUTTER_MODALITY_APP_H_

#include <gtk/gtk.h>

G_DECLARE_FINAL_TYPE(ModalityApplication, modality_app, MODALITY, APP,
                     GtkApplication)

/**
 * modality_app_new:
 *
 * Creates a new Flutter-based application.
 *
 * Returns: a new #ModalityApplication.
 */
ModalityApplication *modality_app_new();

#endif // FLUTTER_MODALITY_APP_H_
