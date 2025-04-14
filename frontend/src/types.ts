export interface Station {
  id: number;
  name: string;
  volume: number;
}

export interface ActionHistory {
  id: number;
  station: number;
  action: string;
  description: string;
  timestamp: string;
}
