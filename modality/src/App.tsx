import "./styles/globals.css";
import { ThemeProvider } from "@/context/theme";
import { FlightConfigProvider } from "@/context/flight-configs";
import { AppProvider } from "./context/mirage";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Dashboard from "./app/dashboard/page";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="modality-ui-theme">
      <AppProvider>
        <FlightConfigProvider>

          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Flight Configuration</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <ModeToggle />
              </header>
              <Dashboard />
            </SidebarInset>
          </SidebarProvider>
        </FlightConfigProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
