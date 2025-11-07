import { VoiceAlertConfiguration, createVoiceAlertConfiguration } from './VoiceAlert';

export interface AppSettings {
  elevenLabsAPIKey: string;
  voiceID: string;
  volume: number; // 0.0 to 1.0
  voiceAlerts: VoiceAlertConfiguration;
}

export function createAppSettings(): AppSettings {
  return {
    elevenLabsAPIKey: '',
    voiceID: '',
    volume: 0.8,
    voiceAlerts: createVoiceAlertConfiguration(),
  };
}

