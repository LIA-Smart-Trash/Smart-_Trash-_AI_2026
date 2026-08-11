import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileFrame } from './components/MobileFrame';
import { FullDashboardView } from './components/FullDashboardView';
import { HomeView } from './components/views/HomeView';
import { ControlView } from './components/views/ControlView';
import { SensorsView } from './components/views/SensorsView';
import { HistoryView } from './components/views/HistoryView';
import { LidView } from './components/views/LidView';
import { SummonView } from './components/views/SummonView';
import { FollowView } from './components/views/FollowView';
import { SettingsView } from './components/views/SettingsView';
import { AlertsView } from './components/views/AlertsView';
import { AiAssistantModal } from './components/AiAssistantModal';

import { AppView, DisplayMode, LiaTelemetry, RobotPosition, LiaAlert, CollectionLog, SensorHistoryPoint } from './types';
import { initialTelemetry, initialCollectionLogs, initialAlerts, initialSensorHistory } from './lib/mockData';
import { sound } from './lib/soundEngine';
import { isNative } from './lib/device';

export function App() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(isNative() ? 'mobile' : 'dashboard');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  // Set initial display mode based on platform
  useEffect(() => {
    if (isNative()) {
      setDisplayMode('mobile');
    }
  }, []);

  // Core L.I.A Telemetry & State
  const [telemetry, setTelemetry] = useState<LiaTelemetry>(initialTelemetry);
  const [logs, setLogs] = useState<CollectionLog[]>(initialCollectionLogs);
  const [alerts, setAlerts] = useState<LiaAlert[]>(initialAlerts);
  const [sensorHistory, setSensorHistory] = useState<SensorHistoryPoint[]>(initialSensorHistory);

  // Robot Driving Simulator Position
  const [robotPos, setRobotPos] = useState<RobotPosition>({
    x: 50,
    y: 50,
    headingAngle: 0,
    isMoving: false,
  });

  // Real-time IoT Simulation Tick Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry((prev) => {
        // Subtle realistic sensor jitter
        const tempJitter = +((Math.random() - 0.5) * 0.2).toFixed(1);
        const gasJitter = Math.floor((Math.random() - 0.5) * 4);
        const distJitter = Math.floor((Math.random() - 0.5) * 2);

        const newTemp = +(prev.temperature + tempJitter).toFixed(1);
        const newGas = Math.max(80, Math.min(300, prev.gasPpm + gasJitter));
        const newDist = Math.max(15, Math.min(120, prev.distanceFrontCm + distJitter));

        return {
          ...prev,
          temperature: newTemp,
          gasPpm: newGas,
          distanceFrontCm: newDist,
        };
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  // Update telemetry helper
  const handleUpdateTelemetry = (updates: Partial<LiaTelemetry>) => {
    setTelemetry((prev) => ({ ...prev, ...updates }));
  };

  // Lid Control Action
  const handleToggleLid = (forcedState?: boolean) => {
    const nextState = forcedState !== undefined ? forcedState : !telemetry.lidOpen;
    setTelemetry((prev) => ({
      ...prev,
      lidOpen: nextState,
      lidAngle: nextState ? 70 : 0,
    }));
  };

  // Remote Driving Commands
  const handleDriveCommand = (dir: 'up' | 'down' | 'left' | 'right' | 'stop') => {
    setRobotPos((prev) => {
      let dx = 0;
      let dy = 0;
      let angle = prev.headingAngle;

      if (dir === 'up') {
        dy = -10;
        angle = 0;
      } else if (dir === 'down') {
        dy = 10;
        angle = 180;
      } else if (dir === 'left') {
        dx = -10;
        angle = 270;
      } else if (dir === 'right') {
        dx = 10;
        angle = 90;
      }

      const nextX = Math.max(10, Math.min(90, prev.x + dx));
      const nextY = Math.max(10, Math.min(90, prev.y + dy));

      return {
        x: nextX,
        y: nextY,
        headingAngle: dir === 'stop' ? prev.headingAngle : angle,
        isMoving: dir !== 'stop',
      };
    });
  };

  // Toggle Headlights
  const handleToggleHeadlights = () => {
    setTelemetry((prev) => ({
      ...prev,
      headlightsOn: !prev.headlightsOn,
    }));
  };

  // Trigger Manual Data Pulse (Refresh / Test)
  const handleSimulateDataPulse = () => {
    setTelemetry((prev) => ({
      ...prev,
      batteryLevel: Math.max(10, prev.batteryLevel - 1),
      distanceFrontCm: Math.floor(20 + Math.random() * 50),
      gasPpm: Math.floor(100 + Math.random() * 30),
    }));

    // Add point to history
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setSensorHistory((prev) => [
      ...prev.slice(1),
      {
        time: timeStr,
        timestamp: Date.now(),
        temperature: telemetry.temperature,
        humidity: telemetry.humidity,
        gasPpm: telemetry.gasPpm,
        trashLevel: telemetry.trashLevel,
        distanceCm: telemetry.distanceFrontCm,
      },
    ]);
  };

  // AI Assistant Action Execution
  const handleExecuteAiAction = (action: string) => {
    if (action === 'open_lid') {
      handleToggleLid(true);
    } else if (action === 'close_lid') {
      handleToggleLid(false);
    } else if (action === 'summon') {
      setCurrentView('summon');
    } else if (action === 'toggle_led') {
      handleToggleHeadlights();
    }
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className={`min-h-dvh bg-slate-950 text-slate-100 font-sans ${isNative() ? 'p-0 overflow-hidden' : 'p-4 md:p-8 flex flex-col items-center justify-start'} selection:bg-emerald-500 selection:text-slate-950`}>
      {/* Background ambient lighting glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Top Header - Only show if not native or if we want a global header */}
      {(!isNative() || displayMode === 'desktop') && (
        <Header
          displayMode={displayMode}
          onToggleDisplayMode={setDisplayMode}
          onOpenAi={() => setIsAiOpen(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sound.enabled = next;
          }}
          onSimulateDataPulse={handleSimulateDataPulse}
        />
      )}

      {/* Main View Area */}
      <main className={`w-full h-full flex justify-center items-start ${isNative() ? 'flex-1' : ''}`}>
        {displayMode === 'mobile' ? (
          <MobileFrame
            currentView={currentView}
            onSelectView={setCurrentView}
            unreadAlertsCount={unreadAlertsCount}
            onOpenAi={() => setIsAiOpen(true)}
          >
            {currentView === 'home' && (
              <HomeView
                telemetry={telemetry}
                onNavigate={setCurrentView}
                onToggleLid={handleToggleLid}
                onSummon={() => setCurrentView('summon')}
              />
            )}
            {currentView === 'control' && (
              <ControlView
                telemetry={telemetry}
                robotPos={robotPos}
                onDriveCommand={handleDriveCommand}
                onToggleHeadlights={handleToggleHeadlights}
              />
            )}
            {currentView === 'sensors' && (
              <SensorsView telemetry={telemetry} history={sensorHistory} />
            )}
            {currentView === 'history' && <HistoryView logs={logs} />}
            {currentView === 'lid' && (
              <LidView telemetry={telemetry} onToggleLid={handleToggleLid} />
            )}
            {currentView === 'summon' && (
              <SummonView
                telemetry={telemetry}
                onSummonActiveChange={(active) => {
                  handleUpdateTelemetry({
                    drivingMode: active ? 'autonomous' : 'manual',
                  });
                }}
              />
            )}
            {currentView === 'follow' && (
              <FollowView
                telemetry={telemetry}
                onUpdateTelemetry={handleUpdateTelemetry}
                onNavigate={setCurrentView}
              />
            )}
            {currentView === 'settings' && (
              <SettingsView
                telemetry={telemetry}
                onUpdateTelemetry={handleUpdateTelemetry}
                onNavigate={setCurrentView}
              />
            )}
            {currentView === 'alerts' && (
              <AlertsView
                alerts={alerts}
                onDismissAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
                onClearAll={() => setAlerts([])}
              />
            )}
          </MobileFrame>
        ) : (
          <FullDashboardView
            telemetry={telemetry}
            logs={logs}
            alerts={alerts}
            history={sensorHistory}
            robotPos={robotPos}
            onNavigate={setCurrentView}
            onToggleLid={handleToggleLid}
            onSummon={() => setCurrentView('summon')}
            onDriveCommand={handleDriveCommand}
            onToggleHeadlights={handleToggleHeadlights}
            onDismissAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
            onClearAlerts={() => setAlerts([])}
            onUpdateTelemetry={handleUpdateTelemetry}
          />
        )}
      </main>

      {/* Gemini AI Voice & Command Modal */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        telemetry={telemetry}
        onExecuteAction={handleExecuteAiAction}
      />
    </div>
  );
}

export default App;
