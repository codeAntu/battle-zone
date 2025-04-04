import { getApi, postApi } from '.';
import API from './api';
import { adminTournamentData, TournamentData, TournamentResponse } from './types';

export const createTournament = async (data: TournamentData) => {
  console.log('Sending tournament data to API:', data);
  return postApi<TournamentResponse>(API.createTournament, data);
};

export const getAdminTournaments = async () => {
  return getApi(API.getAdminTournaments);
};

export const getAdminTournamentsById = async (id: string) => {
  return getApi<adminTournamentData>(API.getAdminTournamentsById(id));
};
