import { useTokenStore } from '@/store/store';
import axios, { AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.BACKEND_URL;

function logOut() {
  console.log('Logging out');
}

const DEFAULT_ERR = 'Error occurred. Something went wrong.';

interface ServerResponse {
  message?: string;
  error?: string;
  isAlert?: boolean;
}

export function exe() {
  axios.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

exe();

async function apiRequest<T>(method: 'get' | 'post', path: string, data?: any, config?: AxiosRequestConfig) {
  type ServerT = T & ServerResponse;
  try {
    const response = await axios[method]<ServerT>(path, method === 'get' ? config : data, config);
    return response.data;
  } catch (error: any) {
    return handleError(error) as ServerT;
  }
}

export async function postApi<T>(path: string, data?: any, config?: AxiosRequestConfig) {
  return apiRequest<T>('post', path, data, config);
}

export async function getApi<T>(path: string, config?: AxiosRequestConfig) {
  return apiRequest<T>('get', path, undefined, config);
}

function handleError(error: any) {
  // Network error
  if (!error?.response) {
    handleNetworkError();
    console.log(error);
    return { message: DEFAULT_ERR, isAlert: true };
  }

  switch (error?.response?.status) {
    case 401:
      handleUnauthenticated();
      return { message: error.response.data.message, isAlert: true, error: error.response.data.error };
    case 400:
      return { message: error.response.data.message, statusCode: 400, isAlert: true, error: error.response.data.error };
    default:
      return {
        message: 'Internal Server Error. Please try again later.',
        statusCode: 500,
        isAlert: true,
      };
  }
}

function handleNetworkError() {
  toast.error('Network Error');
}

function handleUnauthenticated() {
  // toast.error('Session Expired.');
  console.log('Unauthenticated', 'Logging out');
  logOut();
}

// export const citySearch = axios.create({
//   baseURL: 'https://www.universal-tutorial.com/api/getaccesstoken',
//   headers: {
//     Accept: 'application/json',
//     'api-token': citySearchAPIToken,
//     'user-email': userEmail,
//   },
// })
