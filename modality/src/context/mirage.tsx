import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface PageState {
  currentPage: string;
  previousPage: string;
  isLoading: boolean;
}

interface SettingsState {
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
  };
}

interface UserState {
  isAuthenticated: boolean;
  preferences: {
    currency: string;
    timezone: string;
  };
}

// Combine all state types
interface AppState {
  page: PageState;
  settings: SettingsState;
  user: UserState;
}

// Action types using dot notation for paths
type ActionPath = string; // e.g., "settings.theme.mode"
type ActionType = 'SET_VALUE' | 'RESET_CATEGORY';

interface AppAction {
  type: ActionType;
  path: ActionPath;
  payload?: any;
}

// Initial state
const initialState: AppState = {
  page: {
    currentPage: 'home',
    previousPage: '',
    isLoading: false,
  },
  settings: {
    language: 'en',
    notifications: {
      enabled: true,
      sound: true,
    },
  },
  user: {
    isAuthenticated: false,
    preferences: {
      currency: 'USD',
      timezone: 'UTC',
    },
  },
};

// Helper function to set nested object value using path
const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
  target[lastKey] = value;
  return { ...obj };
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_VALUE':
      return setNestedValue({ ...state }, action.path, action.payload);
    case 'RESET_CATEGORY':
      const category = action.path.split('.')[0];
      return {
        ...state,
        [category]: initialState[category as keyof AppState],
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    console.log('App state:', state);
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Helper function to update state
export const setValue = (dispatch: React.Dispatch<AppAction>, path: string, value: any) => {
  dispatch({ type: 'SET_VALUE', path, payload: value });
};

// Helper function to reset category
export const resetCategory = (dispatch: React.Dispatch<AppAction>, category: string) => {
  dispatch({ type: 'RESET_CATEGORY', path: category });
};