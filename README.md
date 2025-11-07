# PomodoroVoice

A Pomodoro timer app with AI voice alerts powered by ElevenLabs. Available as a native macOS app and as a web application.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/fdtorres1/pomodoro_voice/releases/tag/v1.0.0)

## Repository

🔗 **GitHub**: [https://github.com/fdtorres1/pomodoro_voice](https://github.com/fdtorres1/pomodoro_voice)

## Features

- **Pomodoro Timer**: Standard Pomodoro technique cycles (25 min focus, 5 min short break, 15 min long break after 4 sessions)
- **Custom Timer**: Set any duration from 1-120 minutes
- **Voice Alerts**: Configure up to 10 voice alerts per session type with custom messages
- **ElevenLabs Integration**: Bring your own API key and voice ID
- **Notifications**: Desktop/browser notifications when timers complete
- **State Persistence**: Timer state persists across app restarts/sessions
- **Cross-Platform**: Available for macOS (native) and web browsers

## Platforms

### macOS App

A native macOS application built with SwiftUI.

**Requirements:**
- macOS 12.0 or later
- Xcode 14.0 or later (for building)
- Swift 5.7 or later
- ElevenLabs API key (bring your own)

**Setup:**
1. Open `PomodoroVoice.xcodeproj` in Xcode
2. Configure your bundle identifier in project settings
3. Ensure the entitlements file is properly configured
4. Build and run

See [XCODE_SETUP.md](./XCODE_SETUP.md) for detailed setup instructions.

### Web App

A modern web application built with React, TypeScript, and Vite.

**Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18+ and npm (for development)
- ElevenLabs API key (bring your own)

**Setup:**
```bash
cd web
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

**Build for Production:**
```bash
cd web
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, etc.).

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

## Project Structure

```
pomodoro_voice/
├── macos/                    # macOS Swift app
│   ├── Models/
│   ├── Services/
│   ├── Views/
│   └── PomodoroVoice.xcodeproj
├── web/                      # Web app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── models/          # TypeScript models
│   │   ├── services/        # Business logic
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## Privacy

- No user tracking
- No data collection
- All settings stored locally (UserDefaults on macOS, localStorage in web)
- Fully sandboxed (macOS)
- No analytics or telemetry

## App Store Compliance (macOS)

- Fully sandboxed
- No tracking
- Follows macOS Human Interface Guidelines
- Native SwiftUI implementation

## Development

### macOS Development

See [XCODE_SETUP.md](./XCODE_SETUP.md) for Xcode project setup.

### Web Development

The web app uses:
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Web Audio API** for voice playback

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both platforms if applicable
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## License

MIT License - see [LICENSE](./LICENSE) for details.
