#include "modality.h"

#include <flutter_linux/flutter_linux.h>
#ifdef GDK_WINDOWING_X11
#include <gdk/gdkx.h>
#endif

#include "flutter/generated_plugin_registrant.h"

struct _ModalityApplication
{
  GtkApplication parent_instance;
  char **dart_entrypoint_arguments;
};

G_DEFINE_TYPE(ModalityApplication, modality_app, GTK_TYPE_APPLICATION)

// Implements GApplication::activate.
static void modality_app_activate(GApplication *application)
{
  ModalityApplication *self = MODALITY_APP(application);
  GtkWindow *window =
      GTK_WINDOW(gtk_application_window_new(GTK_APPLICATION(application)));

  // Use a header bar when running in GNOME as this is the common style used
  // by applications and is the setup most users will be using (e.g. Ubuntu
  // desktop).
  // If running on X and not using GNOME then just use a traditional title bar
  // in case the window manager does more exotic layout, e.g. tiling.
  // If running on Wayland assume the header bar will work (may need changing
  // if future cases occur).
  gboolean use_header_bar = TRUE;
#ifdef GDK_WINDOWING_X11
  GdkScreen *screen = gtk_window_get_screen(window);
  if (GDK_IS_X11_SCREEN(screen))
  {
    const gchar *wm_name = gdk_x11_screen_get_window_manager_name(screen);
    if (g_strcmp0(wm_name, "GNOME Shell") != 0)
    {
      use_header_bar = FALSE;
    }
  }
#endif
  if (use_header_bar)
  {
    GtkHeaderBar *header_bar = GTK_HEADER_BAR(gtk_header_bar_new());
    gtk_widget_show(GTK_WIDGET(header_bar));
    gtk_header_bar_set_title(header_bar, "Modality");
    gtk_header_bar_set_show_close_button(header_bar, TRUE);
    gtk_window_set_titlebar(window, GTK_WIDGET(header_bar));
  }
  else
  {
    gtk_window_set_title(window, "Modality");
  }

  gtk_window_set_default_size(window, 1280, 720);
  gtk_widget_show(GTK_WIDGET(window));

  g_autoptr(FlDartProject) project = fl_dart_project_new();
  fl_dart_project_set_dart_entrypoint_arguments(project, self->dart_entrypoint_arguments);

  FlView *view = fl_view_new(project);
  gtk_widget_show(GTK_WIDGET(view));
  gtk_container_add(GTK_CONTAINER(window), GTK_WIDGET(view));

  fl_register_plugins(FL_PLUGIN_REGISTRY(view));

  gtk_widget_grab_focus(GTK_WIDGET(view));
}

// Implements GApplication::local_command_line.
static gboolean modality_app_local_command_line(GApplication *application, gchar ***arguments, int *exit_status)
{
  ModalityApplication *self = MODALITY_APP(application);
  // Strip out the first argument as it is the binary name.
  self->dart_entrypoint_arguments = g_strdupv(*arguments + 1);

  g_autoptr(GError) error = nullptr;
  if (!g_application_register(application, nullptr, &error))
  {
    g_warning("Failed to register: %s", error->message);
    *exit_status = 1;
    return TRUE;
  }

  g_application_activate(application);
  *exit_status = 0;

  return TRUE;
}

// Implements GApplication::startup.
static void modality_app_startup(GApplication *application)
{
  // ModalityApplication* self = MODALITY_APP(object);

  // Perform any actions required at application startup.

  G_APPLICATION_CLASS(modality_app_parent_class)->startup(application);
}

// Implements GApplication::shutdown.
static void modality_app_shutdown(GApplication *application)
{
  // ModalityApplication* self = MODALITY_APP(object);

  // Perform any actions required at application shutdown.

  G_APPLICATION_CLASS(modality_app_parent_class)->shutdown(application);
}

// Implements GObject::dispose.
static void modality_app_dispose(GObject *object)
{
  ModalityApplication *self = MODALITY_APP(object);
  g_clear_pointer(&self->dart_entrypoint_arguments, g_strfreev);
  G_OBJECT_CLASS(modality_app_parent_class)->dispose(object);
}

static void modality_app_class_init(ModalityApplicationClass *klass)
{
  G_APPLICATION_CLASS(klass)->activate = modality_app_activate;
  G_APPLICATION_CLASS(klass)->local_command_line = modality_app_local_command_line;
  G_APPLICATION_CLASS(klass)->startup = modality_app_startup;
  G_APPLICATION_CLASS(klass)->shutdown = modality_app_shutdown;
  G_OBJECT_CLASS(klass)->dispose = modality_app_dispose;
}

static void modality_app_init(ModalityApplication *self) {}

ModalityApplication *modality_app_new()
{
  return MODALITY_APP(g_object_new(modality_app_get_type(),
                                   "application-id", APPLICATION_ID,
                                   "flags", G_APPLICATION_NON_UNIQUE,
                                   nullptr));
}
