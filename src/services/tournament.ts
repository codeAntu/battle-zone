import { getApi, postApi } from '.';
import API from './api';
import {
  isParticipatedResponse,
  participantResponse,
  TournamentByNameResponse,
  TournamentData,
  TournamentResponse,
  TournamentsResponse,
  WinningResponse,
} from './types';

export const createTournament = async (data: TournamentData) => {
  console.log('Sending tournament data to API:', data);
  return postApi<TournamentResponse>(API.createTournament, data);
};

export const getAdminTournaments = async () => {
  return getApi(API.getAdminTournaments);
};

export const getAdminTournamentsById = async (id: string) => {
  return getApi<TournamentResponse>(API.getAdminTournamentsById(id));
};

export const updateTournament = async (id: string, roomId: string, roomPassword: string) => {
  return postApi<TournamentResponse>(API.updateTournament(id), { roomId, roomPassword });
};

export const endTournament = async (id: string, winnerId?: string) => {
  return postApi<TournamentResponse>(API.endTournament(id), winnerId ? { winnerId } : {});
};

export const getUserTournamentByName = async (gameName: string) => {
  return getApi<TournamentByNameResponse>(API.getUserTournamentByName(gameName));
};

// Updated to accept player data
export const participateInTournament = async (
  id: string,
  playerData?: {
    playerUsername: string;
    playerUserId: string;
    playerLevel: number;
  },
) => {
  return postApi(API.participateInTournament(id), playerData || {});
};

export const isParticipated = async (id: string) => {
  return getApi<isParticipatedResponse>(API.isParticipated(id));
};

export const getParticipatedTournaments = async () => {
  return getApi<TournamentsResponse>(API.getParticipatedTournaments);
};

export const getAdminTournamentHistory = async () => {
  return getApi<TournamentsResponse>(API.getAdminTournamentHistory);
};

export const getAdminCurrentTournaments = async () => {
  return getApi<TournamentsResponse>(API.getAdminCurrentTournaments);
};

export const getTournamentParticipants = async (id: string) => {
  return getApi<participantResponse>(API.getTournamentParticipants(id));
};

export const getUserWinnings = async () => {
  return getApi<WinningResponse>(API.getUserWinnings);
};

export const getUserTournamentHistory = async () => {
  return getApi<TournamentsResponse>(API.getUserTournamentHistory);
};

export const tournamentKill = async (id: string, kills: number) => {
  return postApi<TournamentResponse>(API.tournamentKill(id), { kills });
};

export const addUserKillAmount = async (tournamentId: string, userId: number, kills: number) => {
  return postApi<TournamentResponse>(API.tournamentKill(tournamentId), { userId, kills });
};

export const deleteTournament = async (id: string) => {
  return postApi<TournamentResponse>(API.deleteTournament(id), {});
};

export const editTournament = async (id: string, data: {
  name?: string;
  description?: string;
  game?: string;
  maxParticipants?: string;
  prize?: string;
  perKillPrize?: string;
  entryFee?: string;
  scheduledAt?: string;
  roomId?: string;
  roomPassword?: string;
}) => {
  return postApi<TournamentResponse>(API.editTournament(id), data);
};
