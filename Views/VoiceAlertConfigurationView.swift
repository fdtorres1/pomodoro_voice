//
//  VoiceAlertConfigurationView.swift
//  PomodoroVoice
//

import SwiftUI

struct VoiceAlertConfigurationView: View {
    @EnvironmentObject var settingsManager: SettingsManager
    @StateObject private var elevenLabsService = ElevenLabsService()
    
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Focus Session Alerts
            VStack(alignment: .leading, spacing: 10) {
                Text("Focus Session Alerts")
                    .font(.headline)
                
                ForEach(Array(settingsManager.settings.voiceAlerts.focusAlerts.enumerated()), id: \.element.id) { index, alert in
                    HStack {
                        VoiceAlertRow(
                            alert: Binding(
                                get: { settingsManager.settings.voiceAlerts.focusAlerts[index] },
                                set: { settingsManager.settings.voiceAlerts.focusAlerts[index] = $0 }
                            ),
                            onPreview: {
                                previewAlert(alert)
                            }
                        )
                        
                        Button(action: {
                            settingsManager.settings.voiceAlerts.removeFocusAlert(at: index)
                        }) {
                            Image(systemName: "minus.circle.fill")
                                .foregroundColor(.red)
                        }
                        .buttonStyle(.borderless)
                        .help("Remove Alert")
                    }
                }
                
                if settingsManager.settings.voiceAlerts.focusAlerts.count < 10 {
                    Button(action: {
                        settingsManager.settings.voiceAlerts.addFocusAlert()
                    }) {
                        HStack {
                            Image(systemName: "plus.circle.fill")
                            Text("Add Alert")
                        }
                    }
                    .buttonStyle(.borderless)
                }
            }
            
            Divider()
            
            // Break Alerts
            VStack(alignment: .leading, spacing: 10) {
                Text("Break Alerts")
                    .font(.headline)
                
                ForEach(Array(settingsManager.settings.voiceAlerts.breakAlerts.enumerated()), id: \.element.id) { index, alert in
                    HStack {
                        VoiceAlertRow(
                            alert: Binding(
                                get: { settingsManager.settings.voiceAlerts.breakAlerts[index] },
                                set: { settingsManager.settings.voiceAlerts.breakAlerts[index] = $0 }
                            ),
                            onPreview: {
                                previewAlert(alert)
                            }
                        )
                        
                        Button(action: {
                            settingsManager.settings.voiceAlerts.removeBreakAlert(at: index)
                        }) {
                            Image(systemName: "minus.circle.fill")
                                .foregroundColor(.red)
                        }
                        .buttonStyle(.borderless)
                        .help("Remove Alert")
                    }
                }
                
                if settingsManager.settings.voiceAlerts.breakAlerts.count < 10 {
                    Button(action: {
                        settingsManager.settings.voiceAlerts.addBreakAlert()
                    }) {
                        HStack {
                            Image(systemName: "plus.circle.fill")
                            Text("Add Alert")
                        }
                    }
                    .buttonStyle(.borderless)
                }
            }
        }
        .padding()
    }
    
    private func previewAlert(_ alert: VoiceAlert) {
        guard !settingsManager.settings.elevenLabsAPIKey.isEmpty,
              !settingsManager.settings.voiceID.isEmpty,
              !alert.message.isEmpty else { return }
        
        elevenLabsService.previewVoice(
            text: alert.message,
            voiceID: settingsManager.settings.voiceID,
            apiKey: settingsManager.settings.elevenLabsAPIKey,
            volume: settingsManager.settings.volume
        )
    }
}

struct VoiceAlertRow: View {
    @Binding var alert: VoiceAlert
    let onPreview: () -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Toggle("", isOn: $alert.enabled)
                    .toggleStyle(.switch)
                    .frame(width: 40)
                
                Picker("Trigger", selection: $alert.trigger) {
                    ForEach(AlertTrigger.allCases, id: \.self) { trigger in
                        Text(trigger.displayName).tag(trigger)
                    }
                }
                .frame(width: 180)
                
                if alert.trigger == .minutesBefore {
                    Stepper(value: Binding(
                        get: { alert.minutesBefore ?? 5 },
                        set: { alert.minutesBefore = $0 }
                    ), in: 1...60) {
                        Text("\(alert.minutesBefore ?? 5) min")
                            .frame(width: 60)
                    }
                } else {
                    Spacer()
                        .frame(width: 100)
                }
                
                Button(action: onPreview) {
                    Image(systemName: "play.circle.fill")
                }
                .buttonStyle(.borderless)
                .help("Preview")
            }
            
            TextField("Message", text: $alert.message, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(2...4)
        }
        .padding(.vertical, 4)
    }
}

