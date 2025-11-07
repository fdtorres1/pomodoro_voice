import {
  TimerState,
  TimerMode,
  PomodoroPhase,
  createInitialTimerState,
  getTotalDuration,
  nextPhase,
  resetTimer,
} from '../models/TimerState';
import { VoiceAlert, shouldTriggerAlert } from '../models/VoiceAlert';
import { AppSettings } from '../models/Settings';
import { ElevenLabsService } from './ElevenLabsService';
import { SettingsManager } from './SettingsManager';

const STATE_KEY = 'pomodoro_voice_timerstate';

export class TimerManager {
  private state: TimerState;
  private timerInterval: number | null = null;
  private triggeredAlerts: Set<string> = new Set();
  private settingsManager: SettingsManager | null = null;
  private elevenLabsService: ElevenLabsService;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.elevenLabsService = new ElevenLabsService();
    this.requestNotificationPermission();
  }

  setSettingsManager(manager: SettingsManager): void {
    this.settingsManager = manager;
  }

  getState(): TimerState {
    return { ...this.state };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private loadState(): TimerState {
    try {
      const stored = localStorage.getItem(STATE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading timer state:', error);
    }
    return createInitialTimerState();
  }

  private saveState(): void {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving timer state:', error);
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  start(): void {
    if (this.state.isRunning) {
      return;
    }

    this.state.isRunning = true;
    this.triggeredAlerts.clear();
    this.saveState();
    this.notify();
    this.startTimer();
  }

  pause(): void {
    this.state.isRunning = false;
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.saveState();
    this.notify();
  }

  reset(): void {
    this.pause();
    this.state = resetTimer(this.state);
    this.triggeredAlerts.clear();
    this.saveState();
    this.notify();
  }

  skip(): void {
    this.pause();
    this.state = nextPhase(this.state);
    this.triggeredAlerts.clear();
    this.saveState();
    this.checkAndTriggerAlerts(true);
    this.notify();
    if (this.state.isRunning) {
      this.startTimer();
    }
  }

  setCustomDuration(minutes: number): void {
    this.state.customDuration = minutes * 60;
    if (this.state.mode === TimerMode.Custom) {
      this.state.remainingSeconds = this.state.customDuration;
    }
    this.saveState();
    this.notify();
  }

  setMode(mode: TimerMode): void {
    this.pause();
    this.state.mode = mode;
    this.triggeredAlerts.clear();
    if (mode === TimerMode.Custom) {
      this.state.remainingSeconds = this.state.customDuration;
    } else {
      this.state = resetTimer(this.state);
    }
    this.saveState();
    this.notify();
  }

  private startTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  private tick(): void {
    if (!this.state.isRunning) {
      return;
    }

    this.checkAndTriggerAlerts(false);

    if (this.state.remainingSeconds > 0) {
      this.state.remainingSeconds -= 1;
      this.saveState();
      this.notify();
    } else {
      this.timerCompleted();
    }
  }

  private checkAndTriggerAlerts(isTransitioning: boolean): void {
    if (!this.settingsManager) {
      return;
    }

    const settings = this.settingsManager.getSettings();
    const alerts: VoiceAlert[] =
      this.state.phase === PomodoroPhase.Focus
        ? settings.voiceAlerts.focusAlerts
        : settings.voiceAlerts.breakAlerts;

    for (const alert of alerts) {
      if (this.triggeredAlerts.has(alert.id)) {
        continue;
      }

      if (
        shouldTriggerAlert(
          alert,
          this.state.remainingSeconds,
          getTotalDuration(this.state),
          this.state.phase,
          isTransitioning
        )
      ) {
        this.triggeredAlerts.add(alert.id);
        this.triggerAlert(alert);
      }
    }
  }

  private async triggerAlert(alert: VoiceAlert): Promise<void> {
    if (!this.settingsManager) {
      return;
    }

    const settings = this.settingsManager.getSettings();
    if (
      !settings.elevenLabsAPIKey ||
      !settings.voiceID ||
      !alert.message
    ) {
      return;
    }

    try {
      const data = await this.elevenLabsService.synthesizeSpeech(
        alert.message,
        settings.voiceID,
        settings.elevenLabsAPIKey,
        settings.volume
      );
      await this.elevenLabsService.playAudio(data, settings.volume);
    } catch (error) {
      console.error('Voice alert error:', error);
    }
  }

  private timerCompleted(): void {
    this.pause();

    // Check "end of session" alerts before transitioning
    this.checkAndTriggerAlerts(false);

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const title =
        this.state.phase === PomodoroPhase.Focus
          ? 'Focus Session Complete'
          : this.state.phase === PomodoroPhase.ShortBreak
          ? 'Short Break Complete'
          : 'Long Break Complete';

      new Notification(title, {
        body: 'Timer completed!',
        icon: '/vite.svg',
      });
    }

    // Auto-advance to next phase
    if (this.state.mode === TimerMode.Pomodoro) {
      this.state = nextPhase(this.state);
      this.triggeredAlerts.clear();
      // Check "start of break" alerts after transitioning
      this.checkAndTriggerAlerts(true);
    } else {
      this.state.remainingSeconds = getTotalDuration(this.state);
      this.triggeredAlerts.clear();
    }

    this.saveState();
    this.notify();
  }
}

