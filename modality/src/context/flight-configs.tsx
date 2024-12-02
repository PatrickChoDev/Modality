import React, { createContext, useContext, useEffect, useReducer } from "react";
import { invoke } from "@tauri-apps/api/core";

// Define the shape of your flight configuration
interface FlightConfig {
  id: string;
  name: string;
  description?: string;
}

// Define the shape of the state
interface FlightConfigState {
  configs: FlightConfig[];
  currentConfig?: FlightConfig;
}

// Define the initial state
const initialState: FlightConfigState = {
  configs: [
    {
      id: "1",
      name: "Default Config",
      description: "SAC 2026",
      // Add other properties as needed
    },
    {
      id: "2",
      name: "No Airbrake",
      description: "SAC 2025",
      // Add other properties as needed
    },
  ],
  currentConfig: {
    id: "1",
    name: "Default Config",
    description: "SAC 2026",
    // Add other properties as needed
  },
};

// Define action types
type Action =
  | { type: "SET_CONFIGS"; payload: FlightConfig[] }
  | { type: "SET_CURRENT_CONFIG"; payload: FlightConfig }
  | { type: "CREATE_CONFIG"; payload: FlightConfig };

// Create a reducer function
const flightConfigReducer = (
  state: FlightConfigState,
  action: Action,
): FlightConfigState => {
  switch (action.type) {
    case "SET_CONFIGS":
      return { ...state, configs: action.payload };
    case "SET_CURRENT_CONFIG":
      return { ...state, currentConfig: action.payload };
    case "CREATE_CONFIG":
      console.log("Creating config:", action.payload);
      return { ...state, configs: [...state.configs, action.payload] };
    default:
      return state;
  }
};

// Create a context
const FlightConfigContext = createContext<{
  state: FlightConfigState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create a provider component
export const FlightConfigProvider: React.FC<{ children: React.ReactNode }> = (
  { children },
) => {
  const [state, dispatch] = useReducer(flightConfigReducer, initialState);

  useEffect(() => {
    // Fetch flight configs from the backend
    const fetchConfigs = async () => {
      try {
        const configs: FlightConfig[] = await invoke("get_flight_configs");
        dispatch({ type: "SET_CONFIGS", payload: configs });
      } catch (error) {
        console.error("Failed to fetch flight configs:", error);
      }
    };

    fetchConfigs();
  }, []);

  return (
    <FlightConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </FlightConfigContext.Provider>
  );
};

// Custom hook to use the FlightConfigContext
export const useFlightConfig = () => {
  return useContext(FlightConfigContext);
};
