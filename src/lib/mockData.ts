import { LiaTelemetry, CollectionLog, LiaAlert, SensorHistoryPoint } from '../types';

export const initialTelemetry: LiaTelemetry = {
  online: true,
  batteryLevel: 87,
  batteryVoltage: 12.4,
  trashLevel: 62,
  trashWeightKg: 2.8,
  temperature: 26.4,
  humidity: 58,
  gasPpm: 120,
  gasQualityText: 'Boa',
  distanceFrontCm: 42,
  lidOpen: false,
  lidAngle: 0,
  headlightsOn: false,
  drivingMode: 'manual',
  ledBrightness: 73,
  wifiSSID: 'LIA_ROBOT',
  wifiSignalDbm: -58,
  ipAddress: '192.168.4.1',
  firmwareVersion: 'v1.0.0-ESP32'
};

export const initialCollectionLogs: CollectionLog[] = [
  {
    id: 'log-1',
    date: '03/08/2026',
    time: '14:35',
    location: 'Rua das Flores, 123',
    fillLevelBefore: 88,
    type: 'coleta',
    status: 'sucesso',
    notes: 'Coleta realizada com sucesso pelo caminhão de recolhimento.'
  },
  {
    id: 'log-2',
    date: '03/08/2026',
    time: '10:12',
    location: 'Rua das Flores, 123',
    fillLevelBefore: 90,
    type: 'coleta',
    status: 'sucesso',
    notes: 'Aviso enviado automaticamente ao atingir 90% de nível.'
  },
  {
    id: 'log-3',
    date: '02/08/2026',
    time: '18:45',
    location: 'Estação Base',
    fillLevelBefore: 45,
    type: 'bateria',
    status: 'sucesso',
    notes: 'Carregamento por indução concluído (100%).'
  },
  {
    id: 'log-4',
    date: '02/08/2026',
    time: '16:20',
    location: 'Rua das Flores, 123',
    fillLevelBefore: 75,
    type: 'coleta',
    status: 'sucesso',
    notes: 'Coleta manual acionada por solicitação.'
  },
  {
    id: 'log-5',
    date: '01/08/2026',
    time: '09:30',
    location: 'Oficina / Base',
    fillLevelBefore: 12,
    type: 'manutencao',
    status: 'sucesso',
    notes: 'Manutenção preventiva realizada: calibração de sensores sonar.'
  }
];

export const initialAlerts: LiaAlert[] = [
  {
    id: 'alt-1',
    title: 'Bateria baixa',
    description: 'Bateria em 15%. Carregue a L.I.A o quanto antes.',
    type: 'low_battery',
    severity: 'danger',
    timestamp: 'Hoje, 14:10',
    read: false
  },
  {
    id: 'alt-2',
    title: 'Lixeira quase cheia',
    description: 'Nível de lixo em 90%. Esvaziamento recomendado.',
    type: 'bin_full',
    severity: 'warning',
    timestamp: 'Hoje, 10:12',
    read: false
  },
  {
    id: 'alt-3',
    title: 'Temperatura alta',
    description: 'Temperatura interna acima do normal (38°C). Verifique o local.',
    type: 'high_temp',
    severity: 'warning',
    timestamp: 'Ontem, 16:00',
    read: true
  },
  {
    id: 'alt-4',
    title: 'Sistema normal',
    description: 'Todos os sensores e atuadores funcionando corretamente.',
    type: 'normal',
    severity: 'success',
    timestamp: 'Hoje, 08:30',
    read: true
  }
];

export const initialSensorHistory: SensorHistoryPoint[] = Array.from({ length: 12 }, (_, i) => {
  const hour = 8 + i;
  const timeStr = `${hour.toString().padStart(2, '0')}:00`;
  return {
    time: timeStr,
    timestamp: Date.now() - (12 - i) * 3600 * 1000,
    temperature: +(24 + Math.sin(i) * 3).toFixed(1),
    humidity: +(55 + Math.cos(i) * 5).toFixed(0),
    gasPpm: Math.floor(100 + Math.random() * 45),
    trashLevel: Math.min(95, 20 + i * 5),
    distanceCm: Math.floor(30 + Math.random() * 60)
  };
});
