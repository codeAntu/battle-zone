const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const API = {
  hello: `${BASE_URL}/hello`,

  // user auth
  userLogin: `${BASE_URL}/user/auth/login`,
  userRegister: `${BASE_URL}/user/auth/signup`,
  userVerify: `${BASE_URL}/user/auth/verify-otp`,
  getProfile: `${BASE_URL}/user/profile`,

  // admin auth
  adminLogin: `${BASE_URL}/admin/auth/login`,
  adminRegister: `${BASE_URL}/admin/auth/signup`,
  adminVerify: `${BASE_URL}/admin/auth/verify-otp`,

  // game
  gameList: `${BASE_URL}/game/all`,

  getUsers: `${BASE_URL}/admin/users`,

  // admin games
  adminGamesList: `${BASE_URL}/admin/games`,
  adminGameById: (id: string) => `${BASE_URL}/admin/games/${id}`,
  adminCreateGame: `${BASE_URL}/admin/games`,
  adminUpdateGame: (id: string) => `${BASE_URL}/admin/games/${id}`,
  adminDeleteGame: (id: string) => `${BASE_URL}/admin/games/${id}`,

  // tournament
  createTournament: `${BASE_URL}/admin/tournaments/create`,
  getAdminTournaments: `${BASE_URL}/admin/tournaments`,
  getAdminTournamentsById: (id: string) => `${BASE_URL}/admin/tournaments/${id}`,
  updateTournament: (id: string) => `${BASE_URL}/admin/tournaments/update/${id}`,
  endTournament: (id: string) => `${BASE_URL}/admin/tournaments/end/${id}`,
  getAdminTournamentHistory: `${BASE_URL}/admin/tournaments/history`,
  getAdminCurrentTournaments: `${BASE_URL}/admin/tournaments/current`,
  getTournamentParticipants: (id: string) => `${BASE_URL}/admin/tournaments/participants/${id}`,
  getUserTournamentHistory: `${BASE_URL}/admin/tournaments/history`,
  tournamentKill: (id: string) => `${BASE_URL}/admin/tournaments/kills/${id}`,

  // user tournaments
  getUserTournamentByName: (name: string) => `${BASE_URL}/user/tournaments/game/${name}`,
  participateInTournament: (id: string) => `${BASE_URL}/user/tournaments/participate/${id}`,
  isParticipated: (id: string) => `${BASE_URL}/user/tournaments/isParticipated/${id}`,
  getParticipatedTournaments: `${BASE_URL}/user/tournaments/participated`,
  getUserWinnings: `${BASE_URL}/user/tournaments/winnings`,
  deleteTournament: (id: string) => `${BASE_URL}/admin/tournaments/delete/${id}`,
  editTournament: (id: string) => `${BASE_URL}/admin/tournaments/edit/${id}`,

  // transactions
  depositTransaction: `${BASE_URL}/user/transaction/deposit`,
  withdrawTransaction: `${BASE_URL}/user/transaction/withdraw`,
  getTransactionHistory: `${BASE_URL}/user/transaction/history`,

  // admin transactions
  adminDeposits: `${BASE_URL}/admin/transactions/deposits`,
  adminWithdrawals: `${BASE_URL}/admin/transactions/withdrawals`,
  approveDeposit: (id: string) => `${BASE_URL}/admin/transactions/deposit/${id}`,
  approveWithdrawal: (id: string) => `${BASE_URL}/admin/transactions/withdrawal/${id}`,
};

export default API;
