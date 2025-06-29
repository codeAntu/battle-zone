export type TournamentData = {
  game: 'BGMI' | 'FREEFIRE';
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
  roomPassword: string;
  entryFee: number;
  prize: number;
  perKillPrize: number;
  maxParticipants: number;
  currentParticipants: number;
  scheduledAt: string;
  isEnded: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
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
  joinedAt: string;
  name: string;
  email: string;
  userId: number;
  playerUserId?: string; // Game ID provided by participant (corrected from userPlayerId)
  playerUsername?: string; // In-game username
  playerLevel?: number; // Player's level in the game
}

export interface WinningResponse {
  message: string;
  data: Datum[];
}

export interface Datum {
  tournament: Tournament;
  winnings: Winning;
}

export interface Winning {
  id: number;
  userId: number;
  tournamentId: number;
  amount: number;
  createdAt: string;
}

export interface GetUsersResponse {
  users: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpires: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}
export interface UserLoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  balance: number;
}

export interface UserRegisterResponse {
  message: string;
  title: string;
  isVerified: boolean;
  user: User;
}

export interface User {
  email: string;
  name: string;
  password: string;
  verificationCode: string;
  verificationCodeExpires: string;
  isVerified: boolean;
  balance: number;
  id: number;
}

export interface ID {
  id: number;
}

export interface UserVerifyResponse {
  message: string;
  isVerified: boolean;
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  balance: number;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface AdminRegisterResponse {
  message: string;
  title: string;
  isVerified: boolean;
  admin: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface AdminVerifyResponse {
  message: string;
  isVerified: boolean;
  token: string;
  admin: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface UserProfileResponse {
  message: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export interface UserLoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
  timestamp: string;
}

export interface AdminLoginApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
  timestamp: string;
}
