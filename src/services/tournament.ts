import { getApi, postApi } from '.';
import API from './api';
import { adminTournamentData, isParticipatedResponse, TournamentData, TournamentResponse, TournamentsResponse } from './types';

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

export const updateTournament = async (id: string, roomId: string) => {
  return postApi<TournamentResponse>(API.updateTournament(id), { roomId });
};

export const endTournament = async (id: string) => {
  return postApi<TournamentResponse>(API.endTournament(id), {});
};

export const getUserTournamentByName = async (gameName: string) => {
  return getApi<TournamentsResponse>(API.getUserTournamentByName(gameName));
};

export const participateInTournament = async (id: string) => {
  return postApi(API.participateInTournament(id));
};

export const isParticipated = async (id: string) => {
  return getApi<isParticipatedResponse>(API.isParticipated(id));
};
