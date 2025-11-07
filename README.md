# PomodoroVoice

A native macOS Pomodoro timer app with AI voice alerts powered by ElevenLabs.

## Features

- **Pomodoro Timer**: Standard Pomodoro technique cycles (25 min focus, 5 min short break, 15 min long break after 4 sessions)
- **Custom Timer**: Set any duration from 1-120 minutes
- **Voice Alerts**: Configure up to 10 voice alerts per session type with custom messages
- **ElevenLabs Integration**: Bring your own API key and voice ID
- **Notifications**: macOS notifications when timers complete
- **State Persistence**: Timer state persists across app restarts
- **Fully Sandboxed**: Ready for App Store submission

## Requirements

- macOS 12.0 or later
- Xcode 14.0 or later
- Swift 5.7 or later
- ElevenLabs API key (bring your own)

## Setup

1. Open the project in Xcode
2. Configure your bundle identifier in project settings
3. Ensure the entitlements file is properly configured
4. Build and run

## Usage

### Timer Modes

- **Pomodoro**: Follows the standard Pomodoro technique
  - 25-minute focus sessions
  - 5-minute short breaks
  - 15-minute long break after 4 focus sessions
  - Auto-advances through phases

- **Custom**: Set any duration from 1-120 minutes

### Voice Alerts

1. Go to Settings tab
2. Enter your ElevenLabs API key and Voice ID
3. Adjust volume slider
4. Click "Configure Voice Alerts"
5. Add alerts for Focus Sessions and/or Breaks:
   - **End of Session**: Triggers when timer reaches 0
   - **Start of Break**: Triggers when transitioning to a break
   - **Minutes Before End**: Triggers X minutes before session ends (1-60 minutes)
6. Enter your custom message for each alert
7. Use the preview button to test alerts
8. Add up to 10 alerts per session type

### Controls

- **Start/Pause**: Control timer execution
- **Reset**: Reset current session
- **Skip**: Skip to next phase (Pomodoro mode only)

## Privacy

- No user tracking
- No data collection
- All settings stored locally
- Fully sandboxed for security

## App Store Compliance

- Fully sandboxed
- No tracking
- Follows macOS Human Interface Guidelines
- Native SwiftUI implementation

