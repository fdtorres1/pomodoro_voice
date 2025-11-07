//
//  TimerView.swift
//  PomodoroVoice
//

import SwiftUI

struct TimerView: View {
    @EnvironmentObject var timerManager: TimerManager
    @EnvironmentObject var settingsManager: SettingsManager
    @State private var showCustomDurationPicker = false
    @State private var customMinutes: Int = 25
    
    var body: some View {
        VStack(spacing: 30) {
            // Mode selector
            Picker("Mode", selection: Binding(
                get: { timerManager.state.mode },
                set: { timerManager.setMode($0) }
            )) {
                Text("Pomodoro").tag(TimerMode.pomodoro)
                Text("Custom").tag(TimerMode.custom)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal)
            
            // Phase indicator (for Pomodoro mode)
            if timerManager.state.mode == .pomodoro {
                Text(phaseDescription)
                    .font(.headline)
                    .foregroundColor(.secondary)
            }
            
            // Timer display
            Text(timeString)
                .font(.system(size: 64, weight: .light, design: .monospaced))
                .monospacedDigit()
            
            // Custom duration picker (for Custom mode)
            if timerManager.state.mode == .custom {
                HStack {
                    Text("Duration:")
                    Stepper(value: Binding(
                        get: { customMinutes },
                        set: { 
                            customMinutes = $0
                            timerManager.setCustomDuration(minutes: $0)
                        }
                    ), in: 1...120) {
                        Text("\(customMinutes) minutes")
                    }
                }
                .padding(.horizontal)
            }
            
            // Control buttons
            HStack(spacing: 20) {
                if timerManager.state.isRunning {
                    Button(action: { timerManager.pause() }) {
                        Label("Pause", systemImage: "pause.fill")
                            .frame(width: 100)
                    }
                    .buttonStyle(.borderedProminent)
                } else {
                    Button(action: { timerManager.start() }) {
                        Label("Start", systemImage: "play.fill")
                            .frame(width: 100)
                    }
                    .buttonStyle(.borderedProminent)
                }
                
                Button(action: { timerManager.reset() }) {
                    Label("Reset", systemImage: "arrow.counterclockwise")
                        .frame(width: 100)
                }
                .buttonStyle(.bordered)
                
                if timerManager.state.mode == .pomodoro {
                    Button(action: { timerManager.skip() }) {
                        Label("Skip", systemImage: "forward.fill")
                            .frame(width: 100)
                    }
                    .buttonStyle(.bordered)
                }
            }
            
            Spacer()
        }
        .padding()
        .onAppear {
            if timerManager.state.mode == .custom {
                customMinutes = timerManager.state.customDuration / 60
            }
        }
    }
    
    private var timeString: String {
        let hours = timerManager.state.remainingSeconds / 3600
        let minutes = (timerManager.state.remainingSeconds % 3600) / 60
        let seconds = timerManager.state.remainingSeconds % 60
        
        if hours > 0 {
            return String(format: "%d:%02d:%02d", hours, minutes, seconds)
        } else {
            return String(format: "%d:%02d", minutes, seconds)
        }
    }
    
    private var phaseDescription: String {
        let sessionsBeforeLongBreak = settingsManager.settings.sessionsBeforeLongBreak
        switch timerManager.state.phase {
        case .focus:
            return "Focus Session \(timerManager.state.focusCount + 1) of \(sessionsBeforeLongBreak)"
        case .shortBreak:
            return "Short Break"
        case .longBreak:
            return "Long Break"
        }
    }
}

