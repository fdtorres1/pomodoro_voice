//
//  TimerState.swift
//  PomodoroVoice
//

import Foundation

enum TimerMode {
    case pomodoro
    case custom
}

enum PomodoroPhase {
    case focus
    case shortBreak
    case longBreak
}

struct TimerState: Codable {
    var mode: TimerMode
    var phase: PomodoroPhase
    var focusCount: Int // Number of focus sessions completed in current cycle
    var remainingSeconds: Int
    var isRunning: Bool
    var customDuration: Int // In seconds, for custom timer mode
    
    init() {
        self.mode = .pomodoro
        self.phase = .focus
        self.focusCount = 0
        self.remainingSeconds = 25 * 60 // 25 minutes
        self.isRunning = false
        self.customDuration = 25 * 60
    }
    
    var totalDuration: Int {
        switch mode {
        case .pomodoro:
            switch phase {
            case .focus:
                return 25 * 60
            case .shortBreak:
                return 5 * 60
            case .longBreak:
                return 15 * 60
            }
        case .custom:
            return customDuration
        }
    }
    
    mutating func nextPhase(sessionsBeforeLongBreak: Int = 4) {
        guard mode == .pomodoro else { return }
        
        switch phase {
        case .focus:
            focusCount += 1
            if focusCount >= sessionsBeforeLongBreak {
                phase = .longBreak
                focusCount = 0
            } else {
                phase = .shortBreak
            }
        case .shortBreak, .longBreak:
            phase = .focus
        }
        remainingSeconds = totalDuration
    }
    
    mutating func reset() {
        phase = .focus
        focusCount = 0
        remainingSeconds = totalDuration
        isRunning = false
    }
}

