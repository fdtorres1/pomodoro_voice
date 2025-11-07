import type { VoiceAlertConfiguration } from './VoiceAlert';
import { createVoiceAlertConfiguration } from './VoiceAlert';

export interface AppSettings {
  elevenLabsAPIKey: string;
  voiceID: string;
  volume: number; // 0.0 to 1.0
  voiceAlerts: VoiceAlertConfiguration;
  sessionsBeforeLongBreak: number; // Number of focus sessions before long break (1-10)
}

export function createAppSettings(): AppSettings {
  return {
    elevenLabsAPIKey: '',
    voiceID: '',
    volume: 0.8,
    voiceAlerts: createVoiceAlertConfiguration(),
    sessionsBeforeLongBreak: 4, // Default to standard Pomodoro
  };
}

