import { PomodoroPhase } from './TimerState';

export enum AlertTrigger {
  EndOfSession = 'End of Session',
  StartOfBreak = 'Start of Break',
  MinutesBefore = 'Minutes Before End',
}

export interface VoiceAlert {
  id: string;
  trigger: AlertTrigger;
  minutesBefore?: number; // Only used when trigger is MinutesBefore
  message: string;
  enabled: boolean;
}

export interface VoiceAlertConfiguration {
  focusAlerts: VoiceAlert[];
  breakAlerts: VoiceAlert[];
}

export function createVoiceAlert(
  overrides: Partial<VoiceAlert> = {}
): VoiceAlert {
  return {
    id: crypto.randomUUID(),
    trigger: AlertTrigger.EndOfSession,
    message: '',
    enabled: true,
    ...overrides,
  };
}

export function createVoiceAlertConfiguration(): VoiceAlertConfiguration {
  return {
    focusAlerts: [],
    breakAlerts: [],
  };
}

export function shouldTriggerAlert(
  alert: VoiceAlert,
  currentSeconds: number,
  totalSeconds: number,
  phase: PomodoroPhase,
  isTransitioning: boolean
): boolean {
  if (!alert.enabled) {
    return false;
  }

  switch (alert.trigger) {
    case AlertTrigger.EndOfSession:
      return currentSeconds === 0;
    case AlertTrigger.StartOfBreak:
      return isTransitioning && phase !== PomodoroPhase.Focus;
    case AlertTrigger.MinutesBefore:
      if (alert.minutesBefore === undefined) {
        return false;
      }
      const targetSeconds = alert.minutesBefore * 60;
      return currentSeconds === targetSeconds && currentSeconds > 0;
  }
}

