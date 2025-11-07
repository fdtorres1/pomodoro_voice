export const TimerMode = {
  Pomodoro: 'pomodoro',
  Custom: 'custom',
} as const;

export type TimerMode = typeof TimerMode[keyof typeof TimerMode];

export const PomodoroPhase = {
  Focus: 'focus',
  ShortBreak: 'shortBreak',
  LongBreak: 'longBreak',
} as const;

export type PomodoroPhase = typeof PomodoroPhase[keyof typeof PomodoroPhase];

export interface TimerState {
  mode: TimerMode;
  phase: PomodoroPhase;
  focusCount: number; // Number of focus sessions completed in current cycle
  remainingSeconds: number;
  isRunning: boolean;
  customDuration: number; // In seconds, for custom timer mode
}

export function createInitialTimerState(): TimerState {
  return {
    mode: TimerMode.Pomodoro,
    phase: PomodoroPhase.Focus,
    focusCount: 0,
    remainingSeconds: 25 * 60, // 25 minutes
    isRunning: false,
    customDuration: 25 * 60,
  };
}

export function getTotalDuration(state: TimerState): number {
  switch (state.mode) {
    case TimerMode.Pomodoro:
      switch (state.phase) {
        case PomodoroPhase.Focus:
          return 25 * 60;
        case PomodoroPhase.ShortBreak:
          return 5 * 60;
        case PomodoroPhase.LongBreak:
          return 15 * 60;
      }
      break;
    case TimerMode.Custom:
      return state.customDuration;
  }
}

export function nextPhase(state: TimerState): TimerState {
  if (state.mode !== TimerMode.Pomodoro) {
    return state;
  }

  const newState = { ...state };

  switch (state.phase) {
    case PomodoroPhase.Focus:
      newState.focusCount += 1;
      if (newState.focusCount >= 4) {
        newState.phase = PomodoroPhase.LongBreak;
        newState.focusCount = 0;
      } else {
        newState.phase = PomodoroPhase.ShortBreak;
      }
      break;
    case PomodoroPhase.ShortBreak:
    case PomodoroPhase.LongBreak:
      newState.phase = PomodoroPhase.Focus;
      break;
  }

  newState.remainingSeconds = getTotalDuration(newState);
  return newState;
}

export function resetTimer(state: TimerState): TimerState {
  return {
    ...state,
    phase: PomodoroPhase.Focus,
    focusCount: 0,
    remainingSeconds: getTotalDuration({
      ...state,
      phase: PomodoroPhase.Focus,
      focusCount: 0,
    }),
    isRunning: false,
  };
}

