import { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { TimerManager } from './services/TimerManager';
import { SettingsManager } from './services/SettingsManager';

function App() {
  const [timerManager] = useState(() => new TimerManager());
  const [settingsManager] = useState(() => new SettingsManager());
  const [currentView, setCurrentView] = useState<'timer' | 'settings'>('timer');

  useEffect(() => {
    timerManager.setSettingsManager(settingsManager);
  }, [timerManager, settingsManager]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setCurrentView('timer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'timer'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Timer
            </button>
            <button
              onClick={() => setCurrentView('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'settings'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {currentView === 'timer' ? (
          <Timer timerManager={timerManager} settingsManager={settingsManager} />
        ) : (
          <Settings settingsManager={settingsManager} />
        )}
      </main>
    </div>
  );
}

export default App;
