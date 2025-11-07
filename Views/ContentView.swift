//
//  ContentView.swift
//  PomodoroVoice
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var timerManager: TimerManager
    @EnvironmentObject var settingsManager: SettingsManager
    
    var body: some View {
        TabView {
            TimerView()
                .tabItem {
                    Label("Timer", systemImage: "timer")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape")
                }
        }
        .frame(minWidth: 400, minHeight: 600)
        .onAppear {
            timerManager.setSettingsManager(settingsManager)
        }
    }
}

