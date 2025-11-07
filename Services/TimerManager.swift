//
//  TimerManager.swift
//  PomodoroVoice
//

import Foundation
import UserNotifications
import Combine

class TimerManager: ObservableObject {
    @Published var state: TimerState {
        didSet {
            saveState()
        }
    }
    
    @Published var isTransitioning: Bool = false
    
    private var timer: Timer?
    private let stateKey = "com.pomodorovoice.timerstate"
    private let elevenLabsService = ElevenLabsService()
    private var settingsManager: SettingsManager?
    private var triggeredAlerts: Set<UUID> = [] // Track which alerts have been triggered in current session
    
    init() {
        if let data = UserDefaults.standard.data(forKey: stateKey),
           let decoded = try? JSONDecoder().decode(TimerState.self, from: data) {
            self.state = decoded
        } else {
            self.state = TimerState()
        }
        
        requestNotificationPermission()
    }
    
    func setSettingsManager(_ manager: SettingsManager) {
        self.settingsManager = manager
    }
    
    private func saveState() {
        if let encoded = try? JSONEncoder().encode(state) {
            UserDefaults.standard.set(encoded, forKey: stateKey)
        }
    }
    
    private func requestNotificationPermission() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, error in
            if let error = error {
                print("Notification permission error: \(error)")
            }
        }
    }
    
    func start() {
        guard !state.isRunning else { return }
        state.isRunning = true
        triggeredAlerts.removeAll() // Reset triggered alerts when starting
        startTimer()
    }
    
    func pause() {
        state.isRunning = false
        timer?.invalidate()
        timer = nil
    }
    
    func reset() {
        pause()
        state.reset()
        triggeredAlerts.removeAll()
    }
    
    func skip() {
        pause()
        state.nextPhase()
        triggeredAlerts.removeAll() // Reset for new phase
        isTransitioning = true
        checkAndTriggerAlerts(isTransitioning: true)
        isTransitioning = false
        if state.isRunning {
            startTimer()
        }
    }
    
    func setCustomDuration(minutes: Int) {
        state.customDuration = minutes * 60
        if state.mode == .custom {
            state.remainingSeconds = state.customDuration
        }
    }
    
    func setMode(_ mode: TimerMode) {
        pause()
        state.mode = mode
        triggeredAlerts.removeAll()
        if mode == .custom {
            state.remainingSeconds = state.customDuration
        } else {
            state.reset()
        }
    }
    
    private func startTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.tick()
        }
        RunLoop.current.add(timer!, forMode: .common)
    }
    
    private func tick() {
        guard state.isRunning else { return }
        
        checkAndTriggerAlerts(isTransitioning: false)
        
        if state.remainingSeconds > 0 {
            state.remainingSeconds -= 1
        } else {
            timerCompleted()
        }
    }
    
    private func checkAndTriggerAlerts(isTransitioning: Bool) {
        guard let settings = settingsManager?.settings else { return }
        
        let alerts: [VoiceAlert]
        switch state.phase {
        case .focus:
            alerts = settings.voiceAlerts.focusAlerts
        case .shortBreak, .longBreak:
            alerts = settings.voiceAlerts.breakAlerts
        }
        
        for alert in alerts {
            // Skip if already triggered in this session
            guard !triggeredAlerts.contains(alert.id) else { continue }
            
            if alert.shouldTrigger(
                currentSeconds: state.remainingSeconds,
                totalSeconds: state.totalDuration,
                phase: state.phase,
                isTransitioning: isTransitioning
            ) {
                triggeredAlerts.insert(alert.id)
                triggerAlert(alert)
            }
        }
    }
    
    private func triggerAlert(_ alert: VoiceAlert) {
        guard let settings = settingsManager?.settings,
              !settings.elevenLabsAPIKey.isEmpty,
              !settings.voiceID.isEmpty,
              !alert.message.isEmpty else { return }
        
        elevenLabsService.stopAudio() // Stop any currently playing audio
        elevenLabsService.synthesizeSpeech(
            text: alert.message,
            voiceID: settings.voiceID,
            apiKey: settings.elevenLabsAPIKey,
            volume: settings.volume
        ) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let data):
                    self?.elevenLabsService.playAudio(data: data, volume: settings.volume)
                case .failure(let error):
                    print("Voice alert error: \(error)")
                }
            }
        }
    }
    
    private func timerCompleted() {
        pause()
        
        // Check "end of session" alerts before transitioning
        isTransitioning = false
        checkAndTriggerAlerts(isTransitioning: false)
        
        // Show notification
        let content = UNMutableNotificationContent()
        content.title = phaseTitle
        content.body = "Timer completed!"
        content.sound = .default
        
        let request = UNNotificationRequest(
            identifier: UUID().uuidString,
            content: content,
            trigger: nil
        )
        
        UNUserNotificationCenter.current().add(request)
        
        // Auto-advance to next phase
        if state.mode == .pomodoro {
            state.nextPhase()
            triggeredAlerts.removeAll() // Reset for new phase
            // Check "start of break" alerts after transitioning
            isTransitioning = true
            checkAndTriggerAlerts(isTransitioning: true)
        } else {
            state.remainingSeconds = state.totalDuration
            triggeredAlerts.removeAll() // Reset for new cycle
        }
        
        isTransitioning = false
    }
    
    private var phaseTitle: String {
        switch state.phase {
        case .focus:
            return "Focus Session Complete"
        case .shortBreak:
            return "Short Break Complete"
        case .longBreak:
            return "Long Break Complete"
        }
    }
    
    deinit {
        timer?.invalidate()
    }
}

