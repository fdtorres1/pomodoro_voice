# Xcode Project Setup Guide

## Creating the Xcode Project

1. Open Xcode
2. Select "Create a new Xcode project"
3. Choose "macOS" → "App"
4. Configure:
   - Product Name: `PomodoroVoice`
   - Team: Your development team
   - Organization Identifier: `com.yourcompany` (or your preferred identifier)
   - Interface: SwiftUI
   - Language: Swift
   - Storage: None (we're using UserDefaults)
5. Save the project in this directory

## Adding Files to the Project

After creating the project, add all the files from this directory:

### Models
- `Models/TimerState.swift`
- `Models/VoiceAlert.swift`
- `Models/Settings.swift`

### Services
- `Services/TimerManager.swift`
- `Services/SettingsManager.swift`
- `Services/ElevenLabsService.swift`

### Views
- `Views/ContentView.swift`
- `Views/TimerView.swift`
- `Views/SettingsView.swift`
- `Views/VoiceAlertConfigurationView.swift`

### App Entry
- `PomodoroVoiceApp.swift` (replace the auto-generated one)

### Configuration
- `Info.plist` (add to project, ensure it's included in build)
- `PomodoroVoice.entitlements` (add to project, link in Build Settings → Code Signing Entitlements)

## Project Settings

### Build Settings
1. Set "Code Signing Entitlements" to `PomodoroVoice.entitlements`
2. Ensure "App Sandbox" is enabled (should be automatic with entitlements file)

### Capabilities
1. Go to Signing & Capabilities tab
2. Ensure "App Sandbox" is enabled
3. Under App Sandbox → Network:
   - Check "Outgoing Connections (Client)"

### Info.plist
- The provided `Info.plist` should be used as a reference
- Xcode may manage some of these settings automatically

## Build and Run

1. Select your Mac as the run destination
2. Build (⌘B) to check for errors
3. Run (⌘R) to launch the app

## Testing

1. Enter your ElevenLabs API key and Voice ID in Settings
2. Configure a test voice alert
3. Use the preview button to test voice synthesis
4. Start a timer and verify alerts trigger correctly

