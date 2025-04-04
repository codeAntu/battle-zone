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
  

};

export default API;
