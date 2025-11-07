import { useState } from 'react';
import {
  VoiceAlert,
  VoiceAlertConfiguration,
  AlertTrigger,
  createVoiceAlert,
} from '../models/VoiceAlert';
import { SettingsManager } from '../services/SettingsManager';
import { AppSettings } from '../models/Settings';
import { ElevenLabsService } from '../services/ElevenLabsService';

interface VoiceAlertConfigurationProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  settingsManager: SettingsManager;
}

export function VoiceAlertConfiguration({
  settings,
  updateSettings,
  settingsManager,
}: VoiceAlertConfigurationProps) {
  const elevenLabsService = new ElevenLabsService();

  const updateFocusAlerts = (alerts: VoiceAlert[]) => {
    updateSettings({
      voiceAlerts: { ...settings.voiceAlerts, focusAlerts: alerts },
    });
  };

  const updateBreakAlerts = (alerts: VoiceAlert[]) => {
    updateSettings({
      voiceAlerts: { ...settings.voiceAlerts, breakAlerts: alerts },
    });
  };

  const addFocusAlert = () => {
    if (settings.voiceAlerts.focusAlerts.length < 10) {
      updateFocusAlerts([...settings.voiceAlerts.focusAlerts, createVoiceAlert()]);
    }
  };

  const removeFocusAlert = (index: number) => {
    const newAlerts = [...settings.voiceAlerts.focusAlerts];
    newAlerts.splice(index, 1);
    updateFocusAlerts(newAlerts);
  };

  const addBreakAlert = () => {
    if (settings.voiceAlerts.breakAlerts.length < 10) {
      updateBreakAlerts([...settings.voiceAlerts.breakAlerts, createVoiceAlert()]);
    }
  };

  const removeBreakAlert = (index: number) => {
    const newAlerts = [...settings.voiceAlerts.breakAlerts];
    newAlerts.splice(index, 1);
    updateBreakAlerts(newAlerts);
  };

  const previewAlert = async (alert: VoiceAlert) => {
    if (
      !settings.elevenLabsAPIKey ||
      !settings.voiceID ||
      !alert.message
    ) {
      return;
    }

    try {
      await elevenLabsService.previewVoice(
        alert.message,
        settings.voiceID,
        settings.elevenLabsAPIKey,
        settings.volume
      );
    } catch (error) {
      console.error('Preview error:', error);
      alert('Error previewing voice. Check your API key and Voice ID.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Focus Session Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Focus Session Alerts
        </h3>
        <div className="space-y-4">
          {settings.voiceAlerts.focusAlerts.map((alert, index) => (
            <VoiceAlertRow
              key={alert.id}
              alert={alert}
              onUpdate={(updated) => {
                const newAlerts = [...settings.voiceAlerts.focusAlerts];
                newAlerts[index] = updated;
                updateFocusAlerts(newAlerts);
              }}
              onRemove={() => removeFocusAlert(index)}
              onPreview={() => previewAlert(alert)}
            />
          ))}
          {settings.voiceAlerts.focusAlerts.length < 10 && (
            <button
              onClick={addFocusAlert}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <span>+</span>
              <span>Add Alert</span>
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-600"></div>

      {/* Break Alerts */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Break Alerts
        </h3>
        <div className="space-y-4">
          {settings.voiceAlerts.breakAlerts.map((alert, index) => (
            <VoiceAlertRow
              key={alert.id}
              alert={alert}
              onUpdate={(updated) => {
                const newAlerts = [...settings.voiceAlerts.breakAlerts];
                newAlerts[index] = updated;
                updateBreakAlerts(newAlerts);
              }}
              onRemove={() => removeBreakAlert(index)}
              onPreview={() => previewAlert(alert)}
            />
          ))}
          {settings.voiceAlerts.breakAlerts.length < 10 && (
            <button
              onClick={addBreakAlert}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <span>+</span>
              <span>Add Alert</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface VoiceAlertRowProps {
  alert: VoiceAlert;
  onUpdate: (alert: VoiceAlert) => void;
  onRemove: () => void;
  onPreview: () => void;
}

function VoiceAlertRow({
  alert,
  onUpdate,
  onRemove,
  onPreview,
}: VoiceAlertRowProps) {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={alert.enabled}
          onChange={(e) => onUpdate({ ...alert, enabled: e.target.checked })}
          className="w-5 h-5"
        />

        <select
          value={alert.trigger}
          onChange={(e) =>
            onUpdate({ ...alert, trigger: e.target.value as AlertTrigger })
          }
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {Object.values(AlertTrigger).map((trigger) => (
            <option key={trigger} value={trigger}>
              {trigger}
            </option>
          ))}
        </select>

        {alert.trigger === AlertTrigger.MinutesBefore && (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onUpdate({
                  ...alert,
                  minutesBefore: Math.max(1, (alert.minutesBefore || 5) - 1),
                })
              }
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              −
            </button>
            <span className="w-16 text-center text-gray-900 dark:text-white">
              {alert.minutesBefore || 5} min
            </span>
            <button
              onClick={() =>
                onUpdate({
                  ...alert,
                  minutesBefore: Math.min(60, (alert.minutesBefore || 5) + 1),
                })
              }
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
              +
            </button>
          </div>
        )}

        <button
          onClick={onPreview}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          title="Preview"
        >
          ▶
        </button>

        <button
          onClick={onRemove}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          title="Remove"
        >
          ×
        </button>
      </div>

      <textarea
        value={alert.message}
        onChange={(e) => onUpdate({ ...alert, message: e.target.value })}
        placeholder="Enter your message..."
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
      />
    </div>
  );
}

