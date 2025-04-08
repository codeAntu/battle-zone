const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const API = {
  hello: `${BASE_URL}/hello`,

  // user auth
  userLogin: `${BASE_URL}/user/auth/login`,
  userRegister: `${BASE_URL}/user/auth/signup`,
  userVerify: `${BASE_URL}/user/auth/verify-otp`,

  // admin auth
  adminLogin: `${BASE_URL}/admin/auth/login`,
  adminRegister: `${BASE_URL}/admin/auth/signup`,
  adminVerify: `${BASE_URL}/admin/auth/verify-otp`,

  // game
  gameList: `${BASE_URL}/game/list`,

  // tournament
  createTournament: `${BASE_URL}/admin/tournaments/create`,
  getAdminTournaments: `${BASE_URL}/admin/tournaments`,
  getAdminTournamentsById: (id: string) => `${BASE_URL}/admin/tournaments/${id}`,
  updateTournament: (id: string) => `${BASE_URL}/admin/tournaments/update/${id}`,
  endTournament: (id: string) => `${BASE_URL}/admin/tournaments/end/${id}`,
  getAdminTournamentHistory: `${BASE_URL}/admin/tournaments/history`,
  getAdminCurrentTournaments: `${BASE_URL}/admin/tournaments/current`,
// participants/:id"
  getTournamentParticipants: (id: string) => `${BASE_URL}/admin/tournaments/participants/${id}`,  

  // user tournaments
  getUserTournamentByName: (name: string) => `${BASE_URL}/user/tournaments/game/${name}`,
  participateInTournament: (id: string) => `${BASE_URL}/user/tournaments/participate/${id}`,
  isParticipated: (id: string) => `${BASE_URL}/user/tournaments/isParticipated/${id}`,
  getParticipatedTournaments: `${BASE_URL}/user/tournaments/participated`,
  getUserWinnings: `${BASE_URL}/user/tournaments/winnings`,
};

export default API;
