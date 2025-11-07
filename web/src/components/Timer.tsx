import { useEffect, useState } from 'react';
import { TimerManager } from '../services/TimerManager';
import { TimerMode, PomodoroPhase } from '../models/TimerState';

interface TimerProps {
  timerManager: TimerManager;
}

export function Timer({ timerManager }: TimerProps) {
  const [state, setState] = useState(timerManager.getState());
  const [customMinutes, setCustomMinutes] = useState(
    state.mode === TimerMode.Custom ? state.customDuration / 60 : 25
  );

  useEffect(() => {
    const unsubscribe = timerManager.subscribe(() => {
      setState(timerManager.getState());
    });
    return unsubscribe;
  }, [timerManager]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getPhaseDescription = (): string => {
    if (state.mode !== TimerMode.Pomodoro) {
      return '';
    }

    switch (state.phase) {
      case PomodoroPhase.Focus:
        return `Focus Session ${state.focusCount + 1} of 4`;
      case PomodoroPhase.ShortBreak:
        return 'Short Break';
      case PomodoroPhase.LongBreak:
        return 'Long Break';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => timerManager.setMode(TimerMode.Pomodoro)}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              state.mode === TimerMode.Pomodoro
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => timerManager.setMode(TimerMode.Custom)}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              state.mode === TimerMode.Custom
                ? 'bg-white dark:bg-gray-700 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Phase Indicator */}
        {state.mode === TimerMode.Pomodoro && (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {getPhaseDescription()}
            </p>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center">
          <div className="text-7xl font-light font-mono text-gray-900 dark:text-white tabular-nums">
            {formatTime(state.remainingSeconds)}
          </div>
        </div>

        {/* Custom Duration Picker */}
        {state.mode === TimerMode.Custom && (
          <div className="flex items-center justify-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Duration:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newMinutes = Math.max(1, customMinutes - 1);
                  setCustomMinutes(newMinutes);
                  timerManager.setCustomDuration(newMinutes);
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                −
              </button>
              <span className="w-20 text-center text-gray-900 dark:text-white">
                {customMinutes} minutes
              </span>
              <button
                onClick={() => {
                  const newMinutes = Math.min(120, customMinutes + 1);
                  setCustomMinutes(newMinutes);
                  timerManager.setCustomDuration(newMinutes);
                }}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-4 justify-center">
          {state.isRunning ? (
            <button
              onClick={() => timerManager.pause()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={() => timerManager.start()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Start
            </button>
          )}

          <button
            onClick={() => timerManager.reset()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Reset
          </button>

          {state.mode === TimerMode.Pomodoro && (
            <button
              onClick={() => timerManager.skip()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

