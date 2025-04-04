import { getApi } from '.';
import API from './api';

export interface GameResponse {
  message: string;
  data: GameType[];
}

export interface GameType {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  image: string;
}

export const getGameList = async () => {
  return getApi<GameResponse>(API.gameList);
};
