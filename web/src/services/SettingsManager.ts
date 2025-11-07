import { AppSettings, createAppSettings } from '../models/Settings';

const SETTINGS_KEY = 'pomodoro_voice_settings';

export class SettingsManager {
  private settings: AppSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  getSettings(): AppSettings {
    return { ...this.settings };
  }

  updateSettings(updates: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  private loadSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure voiceAlerts structure exists
        if (!parsed.voiceAlerts) {
          parsed.voiceAlerts = createAppSettings().voiceAlerts;
        }
        return parsed;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return createAppSettings();
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
}

