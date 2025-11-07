//
//  SettingsView.swift
//  PomodoroVoice
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var settingsManager: SettingsManager
    @State private var showVoiceAlerts = false
    
    var body: some View {
        Form {
            Section("ElevenLabs API") {
                SecureField("API Key", text: $settingsManager.settings.elevenLabsAPIKey)
                    .textFieldStyle(.roundedBorder)
                
                TextField("Voice ID", text: $settingsManager.settings.voiceID)
                    .textFieldStyle(.roundedBorder)
            }
            
            Section("Pomodoro Settings") {
                HStack {
                    Text("Sessions before long break")
                    Spacer()
                    Stepper(value: $settingsManager.settings.sessionsBeforeLongBreak, in: 1...10) {
                        Text("\(settingsManager.settings.sessionsBeforeLongBreak)")
                            .frame(width: 30)
                    }
                }
                Text("Number of focus sessions before taking a long break. Default is 4 (standard Pomodoro technique).")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Section("Audio Settings") {
                HStack {
                    Text("Volume")
                    Slider(value: $settingsManager.settings.volume, in: 0.0...1.0)
                    Text("\(Int(settingsManager.settings.volume * 100))%")
                        .frame(width: 50)
                }
            }
            
            Section("Voice Alerts") {
                Button(action: { showVoiceAlerts.toggle() }) {
                    HStack {
                        Text("Configure Voice Alerts")
                        Spacer()
                        Image(systemName: showVoiceAlerts ? "chevron.down" : "chevron.right")
                    }
                }
                
                if showVoiceAlerts {
                    VoiceAlertConfigurationView()
                }
            }
        }
        .padding()
        .frame(minWidth: 500, minHeight: 600)
    }
}

