export type TournamentData = {
  game: 'PUBG' | 'FREEFIRE';
  name: string;
  description?: string;
  roomId?: string;
  entryFee: number;
  prize: number;
  perKillPrize: number;
  maxParticipants: number;
  scheduledAt: string;
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

export interface adminTournamentData {
  message: string;
  tournament: Tournament;
}
