import { useState } from 'react';
import { SettingsManager } from '../services/SettingsManager';
import { VoiceAlertConfiguration } from './VoiceAlertConfiguration';

interface SettingsProps {
  settingsManager: SettingsManager;
}

export function Settings({ settingsManager }: SettingsProps) {
  const [settings, setSettings] = useState(settingsManager.getSettings());
  const [showVoiceAlerts, setShowVoiceAlerts] = useState(false);

  const updateSettings = (updates: Partial<typeof settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    settingsManager.updateSettings(newSettings);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="space-y-6">
        {/* ElevenLabs API Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            ElevenLabs API
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key
              </label>
              <input
                type="password"
                value={settings.elevenLabsAPIKey}
                onChange={(e) =>
                  updateSettings({ elevenLabsAPIKey: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your ElevenLabs API key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Voice ID
              </label>
              <input
                type="text"
                value={settings.voiceID}
                onChange={(e) => updateSettings({ voiceID: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your Voice ID"
              />
            </div>
          </div>
        </section>

        {/* Pomodoro Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Pomodoro Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                Sessions before long break
              </label>
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => {
                    const newValue = Math.max(1, settings.sessionsBeforeLongBreak - 1);
                    updateSettings({ sessionsBeforeLongBreak: newValue });
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  −
                </button>
                <span className="w-16 text-center text-gray-900 dark:text-white font-medium">
                  {settings.sessionsBeforeLongBreak}
                </span>
                <button
                  onClick={() => {
                    const newValue = Math.min(10, settings.sessionsBeforeLongBreak + 1);
                    updateSettings({ sessionsBeforeLongBreak: newValue });
                  }}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                (1-10)
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Number of focus sessions before taking a long break. Default is 4 (standard Pomodoro technique).
            </p>
          </div>
        </section>

        {/* Audio Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Audio Settings
          </h2>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Volume
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.volume}
              onChange={(e) =>
                updateSettings({ volume: parseFloat(e.target.value) })
              }
              className="flex-1"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
        </section>

        {/* Voice Alerts */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <button
            onClick={() => setShowVoiceAlerts(!showVoiceAlerts)}
            className="w-full flex items-center justify-between text-xl font-semibold text-gray-900 dark:text-white"
          >
            <span>Voice Alerts</span>
            <span>{showVoiceAlerts ? '▼' : '▶'}</span>
          </button>

          {showVoiceAlerts && (
            <div className="mt-6">
              <VoiceAlertConfiguration
                settings={settings}
                updateSettings={updateSettings}
                settingsManager={settingsManager}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

