# PomodoroVoice Web App

The web version of PomodoroVoice, built with React, TypeScript, and Vite.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Web Audio API** - Audio playback

## Project Structure

```
web/
├── src/
│   ├── components/        # React components
│   │   ├── Timer.tsx
│   │   ├── Settings.tsx
│   │   └── VoiceAlertConfiguration.tsx
│   ├── models/           # TypeScript models
│   │   ├── TimerState.ts
│   │   ├── VoiceAlert.ts
│   │   └── Settings.ts
│   ├── services/         # Business logic
│   │   ├── TimerManager.ts
│   │   ├── SettingsManager.ts
│   │   └── ElevenLabsService.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Features

- Full feature parity with macOS version
- Responsive design
- Dark mode support
- Local storage persistence
- Browser notifications
- Web Audio API for voice playback

## Development

The app uses Vite's HMR (Hot Module Replacement) for fast development. Changes to React components will hot-reload automatically.

## Building

The production build creates optimized, minified files in the `dist/` directory:

```bash
npm run build
```

## Deployment

The `dist/` directory can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Use GitHub Actions or deploy manually
- **Any static host**: Upload the `dist/` folder contents

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

Requires modern browser features:
- ES6+ JavaScript
- Web Audio API
- LocalStorage API
- Notification API

## Environment Variables

No environment variables are required. All configuration is done through the app's settings UI.

## License

MIT License - see [../LICENSE](../LICENSE) for details.
