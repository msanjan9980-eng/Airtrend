export type Status = "NORMAL" | "WATCH" | "ANOMALY";

export interface SensorReading {
  timestamp: string;
  reading: number;
  arduino_baseline: number;
  difference: number;
  rolling_mean: number;
  rolling_std: number;
  trend_per_sample: number;
  status: Status;
}

export interface DashboardStats {
  current: SensorReading | null;
  totalReadings: number;
  watchCount: number;
  anomalyCount: number;
  avgReading: number;
  maxReading: number;
  minReading: number;
  uptime: string;
}
