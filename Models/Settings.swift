//
//  Settings.swift
//  PomodoroVoice
//

import Foundation

struct AppSettings: Codable {
    var elevenLabsAPIKey: String
    var voiceID: String
    var volume: Double // 0.0 to 1.0
    var voiceAlerts: VoiceAlertConfiguration
    var sessionsBeforeLongBreak: Int // Number of focus sessions before long break (1-10)
    
    init() {
        self.elevenLabsAPIKey = ""
        self.voiceID = ""
        self.volume = 0.8
        self.voiceAlerts = VoiceAlertConfiguration()
        self.sessionsBeforeLongBreak = 4 // Default to standard Pomodoro
    }
}

