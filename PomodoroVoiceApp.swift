//
//  PomodoroVoiceApp.swift
//  PomodoroVoice
//
//  Created on macOS
//

import SwiftUI

@main
struct PomodoroVoiceApp: App {
    @StateObject private var timerManager = TimerManager()
    @StateObject private var settingsManager = SettingsManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(timerManager)
                .environmentObject(settingsManager)
        }
        .windowStyle(.automatic)
        .defaultSize(width: 400, height: 600)
    }
}

