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
  success: boolean;
  message: string;
  data: {
    tournament: Tournament;
  };
  timestamp: string;
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
  success: boolean;
  message: string;
  data: {
    tournaments: Tournament[];
  };
  timestamp: string;
}

export interface isParticipatedResponse {
  success: boolean;
  message: string;
  data: {
    isParticipated: boolean;
  };
  timestamp: string;
}

export interface TournamentByNameResponse {
  status: boolean;
  message: string;
  data: {
    tournaments: TournamentElement[];
  };
  timestamp: string;
}

export interface TournamentElement {
  tournament: Tournament;
}
export interface participantResponse {
  success: boolean;
  message: string;
  data: {
    participants: Participant[];
  };
  timestamp: string;
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
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    winnings: Datum[];
  };
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
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    users: User[];
  };
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
  success: boolean;
  message: string;
  data: {
    token: string;
    admin: {
      id: number;
      name: string;
      email: string;
    };
  };
  timestamp: string;
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
  success: boolean;
  message: string;
  data: {
    isVerified: boolean;
    token: string;
    admin: {
      id: number;
      name: string;
      email: string;
    };
  };
  timestamp: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    user: User;
  };
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
