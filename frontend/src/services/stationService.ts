import { ActionHistory, Station } from "../types";
import api from "./api";

// Lista todas as estações
export async function fetchStations(): Promise<Station[]> {
  const response = await api.get("/stations/");
  return response.data;
}

// Atualiza o volume de uma estação
export async function updateStationVolume(stationId: number, volume: number) {
  return api.patch(`/stations/${stationId}/`, { volume });
}

// Confirma a coleta de uma estação
export async function confirmStationPickup(stationId: number) {
  return api.post(`/stations/${stationId}/confirm_pickup/`);
}

// Lista o histórico de uma estação
export async function fetchStationHistory(
  stationId: number
): Promise<ActionHistory[]> {
  const response = await api.get(`/stations/${stationId}/history/`);
  return response.data;
}
