# Xcode Project Setup

There are two ways to set up the Xcode project:

## Option 1: Using XcodeGen (Recommended)

XcodeGen is a tool that generates Xcode projects from a YAML file. This ensures consistent project setup.

### Install XcodeGen

```bash
brew install xcodegen
```

### Generate the Project

```bash
xcodegen generate
```

This will create `PomodoroVoice.xcodeproj` in the current directory.

### Open in Xcode

```bash
open PomodoroVoice.xcodeproj
```

## Option 2: Manual Setup in Xcode

If you prefer to create the project manually:

1. **Open Xcode**
2. **Create New Project**:
   - Choose "macOS" → "App"
   - Product Name: `PomodoroVoice`
   - Team: Select your development team
   - Organization Identifier: `com.pomodorovoice` (or your preferred)
   - Interface: SwiftUI
   - Language: Swift
   - Storage: None
   - Save in the current directory (replace the auto-generated files)

3. **Configure Project Settings**:
   - Select the project in the navigator
   - Under "General":
     - Set Deployment Target to macOS 12.0
     - Set Version to 0.1.0
     - Set Build to 1
   - Under "Signing & Capabilities":
     - Add "App Sandbox"
     - Under App Sandbox → Network: Enable "Outgoing Connections (Client)"
     - Set Code Signing Entitlements to `PomodoroVoice.entitlements`

4. **Add Files**:
   - Delete the auto-generated `ContentView.swift` and `PomodoroVoiceApp.swift`
   - Add all files from the project:
     - Right-click project → "Add Files to PomodoroVoice"
     - Select all files and folders (Models, Services, Views)
     - Ensure "Copy items if needed" is unchecked
     - Ensure "Create groups" is selected
     - Click "Add"

5. **Replace App Entry Point**:
   - The `PomodoroVoiceApp.swift` file should be the main app file
   - Ensure it's set as the entry point (should be automatic)

6. **Configure Info.plist**:
   - The provided `Info.plist` should be used
   - Ensure it's linked in Build Settings → Info.plist File

7. **Build and Run**:
   - Select your Mac as the run destination
   - Build (⌘B) to check for errors
   - Run (⌘R) to launch the app

## After Setup

1. **Configure Bundle Identifier**:
   - Update `PRODUCT_BUNDLE_IDENTIFIER` in project settings if needed
   - Or update `project.yml` if using XcodeGen

2. **Set Development Team**:
   - In Signing & Capabilities, select your development team
   - Or update `DEVELOPMENT_TEAM` in `project.yml` if using XcodeGen

3. **Test the Build**:
   - Build the project to ensure everything compiles
   - Run the app to verify it launches correctly

## Troubleshooting

- **Missing files**: Ensure all files are added to the target
- **Build errors**: Check that all Swift files are included in "Compile Sources"
- **Entitlements**: Verify the entitlements file is properly linked
- **Info.plist**: Ensure the Info.plist path is correct in Build Settings

