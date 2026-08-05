export type AppView = 
  | 'home' 
  | 'control' 
  | 'sensors' 
  | 'history' 
  | 'lid' 
  | 'summon' 
  | 'settings' 
  | 'alerts';

export type DisplayMode = 'mobile' | 'dashboard';

export interface LiaTelemetry {
  online: boolean;
  batteryLevel: number; // 0 - 100%
  batteryVoltage: number; // e.g. 12.4 V
  trashLevel: number; // 0 - 100%
  trashWeightKg: number; // e.g. 2.4 kg
  temperature: number; // °C
  humidity: number; // %
  gasPpm: number; // MQ-2 air quality
  gasQualityText: 'Excelente' | 'Boa' | 'Moderada' | 'Alerta';
  distanceFrontCm: number; // Ultrasonic
  lidOpen: boolean; // true = open, false = closed
  lidAngle: number; // 0 to 90 degrees
  headlightsOn: boolean;
  drivingMode: 'manual' | 'autonomous' | 'follow';
  ledBrightness: number;
  wifiSSID: string;
  wifiSignalDbm: number;
  ipAddress: string;
  firmwareVersion: string;
}

export interface SensorHistoryPoint {
  time: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  gasPpm: number;
  trashLevel: number;
  distanceCm: number;
}

export interface CollectionLog {
  id: string;
  date: string;
  time: string;
  location: string;
  fillLevelBefore: number;
  type: 'coleta' | 'rota' | 'manutencao' | 'bateria';
  status: 'sucesso' | 'em_progresso' | 'alerta';
  notes?: string;
}

export interface LiaAlert {
  id: string;
  title: string;
  description: string;
  type: 'low_battery' | 'bin_full' | 'high_temp' | 'normal' | 'obstacle' | 'maintenance';
  severity: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  read: boolean;
}

export interface RobotPosition {
  x: number; // 0 to 100 grid
  y: number; // 0 to 100 grid
  headingAngle: number; // 0 to 360 degrees
  isMoving: boolean;
  targetX?: number;
  targetY?: number;
}

export interface GlassConfig {
  blurIntensity: number;
  opacity: number;
  borderOpacity: number;
  specularHighlight: boolean;
  tilt3D: boolean;
  accentColor: string; // e.g. #22c55e (neon green)
  glowColor: string;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  theme: 'dark-emerald' | 'cyber-obsidian' | 'liquid-light' | 'neon-matrix';
}
