
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
  currentParticipants: number;
  scheduledAt: Date;
  isEnded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentsResponse {
  message: string;
  tournaments: Tournament[];
}
export interface isParticipatedResponse {
  message: string;
  participation: boolean;
}

export interface TournamentByNameResponse {
  message: string;
  tournaments: TournamentElement[];
}

export interface TournamentElement {
  tournament: Tournament;
}
export interface participantResponse {
  message: string;
  participants: Participant[];
}

export interface Participant {
  id: number;
  joinedAt: Date;
  name: string;
  email: string;
  userId: number;
}
export interface WinningResponse {
  message: string;
  data: Datum[];
}

export interface Datum {
  tournament: Tournament;
  winning: Winning;
}

export interface Winning {
  id: number;
  userId: number;
  tournamentId: number;
  amount: number;
  createdAt: Date;
}
