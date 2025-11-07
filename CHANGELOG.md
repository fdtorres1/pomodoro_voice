# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-11-07

### Added
- Web app version built with React, TypeScript, and Vite
- Cross-platform support (macOS native + web)
- Responsive web UI with Tailwind CSS v4
- Dark mode support for web app
- Browser notifications support
- Full feature parity with macOS version
- LocalStorage persistence for settings and timer state
- Web Audio API integration for voice playback
- Modern, polished UI with consistent spacing

## [0.1.0] - 2025-01-XX

### Added
- Pomodoro timer with standard cycles (25/5/25/5/25/5/25/15)
- Custom timer mode (1-120 minutes)
- ElevenLabs voice alert integration
- Voice alert configuration system
  - Up to 10 alerts per session type
  - Multiple trigger types: End of Session, Start of Break, Minutes Before End
  - Custom messages for each alert
  - Preview functionality
- Volume control for voice alerts
- Timer controls: Start/Pause, Reset, Skip
- State persistence across app restarts
- macOS notifications on timer completion
- Fully sandboxed for App Store submission
- Native SwiftUI interface

[Unreleased]: https://github.com/fdtorres1/pomodoro_voice/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/fdtorres1/pomodoro_voice/releases/tag/v1.0.0
[0.1.0]: https://github.com/fdtorres1/pomodoro_voice/releases/tag/v0.1.0

