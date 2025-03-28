const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const API = {
  hello: `${BASE_URL}/hello`,

  // auth
  signup: `${BASE_URL}/auth/signup`,
};

export default API;
