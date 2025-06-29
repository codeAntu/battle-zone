import { getApi, postApi } from '.';
import API from './api';

// export interface GameResponse {
//   message: string;
//   data: GameType[];
// }

export interface GameResponse {
  success: boolean;
  message: string;
  data: Data;
  timestamp: Date;
}

export interface Data {
  games: Game[];
}

export interface Game {
  id: number;
  name: string;
  description: string;
  image: string;
  iconUrl: string;
}

export interface SingleGameResponse {
  message: string;
  data: GameType;
}

export interface GameType {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  image: string;
}

export interface CreateGameType {
  name: string;
  description: string;
  iconUrl: string;
  image: string;
}

export interface UpdateGameType {
  name?: string;
  description?: string;
  iconUrl?: string;
  image?: string;
}

export const getAllGames = async () => {
  return getApi<GameResponse>(API.gameList);
};

// Admin game services
export const getAdminGames = async () => {
  return getApi<GameResponse>(API.adminGamesList);
};

export const getAdminGameById = async (id: string) => {
  return getApi<SingleGameResponse>(API.adminGameById(id));
};

export const createGame = async (game: CreateGameType) => {
  return postApi<SingleGameResponse>(API.adminCreateGame, game);
};

export const updateGame = async (id: string, game: UpdateGameType) => {
  return postApi<SingleGameResponse>(API.adminUpdateGame(id), game);
};

export const deleteGame = async (id: string) => {
  return postApi<{ message: string }>(API.adminDeleteGame(id));
};
