//
//  SettingsManager.swift
//  PomodoroVoice
//

import Foundation
import Combine

class SettingsManager: ObservableObject {
    @Published var settings: AppSettings {
        didSet {
            saveSettings()
        }
    }
    
    private let settingsKey = "com.pomodorovoice.settings"
    
    init() {
        if let data = UserDefaults.standard.data(forKey: settingsKey),
           let decoded = try? JSONDecoder().decode(AppSettings.self, from: data) {
            self.settings = decoded
        } else {
            self.settings = AppSettings()
        }
    }
    
    private func saveSettings() {
        if let encoded = try? JSONEncoder().encode(settings) {
            UserDefaults.standard.set(encoded, forKey: settingsKey)
        }
    }
}

