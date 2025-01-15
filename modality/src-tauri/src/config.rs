use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PageState {
    current_page: String,
    previous_page: String,
    is_loading: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NotificationsState {
    enabled: bool,
    sound: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SettingsState {
    language: String,
    notifications: NotificationsState,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserPreferences {
    currency: String,
    timezone: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserState {
    is_authenticated: bool,
    preferences: UserPreferences,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppState {
    page: PageState,
    settings: SettingsState,
    user: UserState,
}

impl Default for AppState {
    fn default() -> Self {
        AppState {
            page: PageState {
                current_page: "home".to_string(),
                previous_page: "".to_string(),
                is_loading: false,
            },
            settings: SettingsState {
                language: "en".to_string(),
                notifications: NotificationsState {
                    enabled: true,
                    sound: true,
                },
            },
            user: UserState {
                is_authenticated: false,
                preferences: UserPreferences {
                    currency: "USD".to_string(),
                    timezone: "UTC".to_string(),
                },
            },
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    state: AppState,
}

impl Config {
    pub fn new() -> Self {
        Config {
            state: AppState::default(),
        }
    }

    pub fn set(&mut self, path: &str, value: serde_json::Value) -> Result<(), String> {
        let mut current = serde_json::to_value(&self.state).unwrap();
        let parts: Vec<&str> = path.split('.').collect();
        
        let mut target = current.as_object_mut()
            .ok_or("Invalid state structure")?;

        for &part in &parts[..parts.len()-1] {
            target = target.get_mut(part)
                .and_then(|v| v.as_object_mut())
                .ok_or(format!("Invalid path: {}", part))?;
        }

        if let Some(last_key) = parts.last() {
            target.insert(last_key.to_string(), value.clone());
            self.state = serde_json::from_value(current)
                .map_err(|e| format!("Failed to update state: {}", e))?;
            Ok(())
        } else {
            Err("Empty path".to_string())
        }
    }

    pub fn get(&self, path: &str) -> Option<serde_json::Value> {
        let state_value = serde_json::to_value(&self.state).ok()?;
        let mut current = state_value.as_object()?;
        
        for part in path.split('.') {
            match current.get(part) {
                Some(value) => {
                    if let Some(obj) = value.as_object() {
                        current = obj;
                    } else {
                        return Some(value.clone());
                    }
                }
                None => return None,
            }
        }
        
        Some(serde_json::to_value(current).ok()?)
    }

    pub fn reset_category(&mut self, category: &str) -> Result<(), String> {
        let default_state = AppState::default();
        match category {
            "page" => self.state.page = default_state.page,
            "settings" => self.state.settings = default_state.settings,
            "user" => self.state.user = default_state.user,
            _ => return Err(format!("Invalid category: {}", category)),
        }
        Ok(())
    }
}

pub struct ConfigState(pub Mutex<Config>);
