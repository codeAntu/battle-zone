import { postApi } from '.';
import API from './api';

// Update TournamentData type to match backend expectations
export type TournamentData = {
  game: 'PUBG' | 'FREEFIRE';
  name: string;
  description?: string;
  roomId?: number;
  entryFee: number;
  prize: number;
  perKillPrize: number;
  maxParticipants: number;
  scheduledAt: string; // Single field for date/time
};

export interface TournamentResponse {
  message: string;
  tournament: Tournament;
}

export interface Tournament {
  id: number;
  adminId: number;
  game: string;
  name: string;
  description: string;
  roomId: number;
  entryFee: number;
  prize: number;
  perKillPrize: number;
  maxParticipants: number;
  scheduledAt: Date;
  isEnded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const createTournament = async (data: TournamentData) => {
  console.log('Sending tournament data to API:', data);
  return postApi<TournamentResponse>(API.createTournament, data);
};
