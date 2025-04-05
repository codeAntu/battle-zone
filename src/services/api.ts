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

  // user tournaments
  getUserTournamentByName: (name: string) => `${BASE_URL}/user/tournaments/game/${name}`,
  participateInTournament: (id: string) => `${BASE_URL}/user/tournaments/participate/${id}`,
  isParticipated: (id: string) => `${BASE_URL}/user/tournaments/isParticipated/${id}`,
};

export default API;
