import Dashboard from "@/app/dashboard/page";
import "./styles/globals.css";
import { ThemeProvider } from "@/context/theme";
import { FlightConfigProvider } from "./context/flight-configs";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="modality-ui-theme">
      <FlightConfigProvider>
        <Dashboard />
      </FlightConfigProvider>
    </ThemeProvider>
  );
}

export default App;
