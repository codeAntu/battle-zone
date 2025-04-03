import { useTokenStore } from '@/store/store';
import axios, { AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

function logOut() {
  console.log('Logging out');
}

const DEFAULT_ERR = 'Error occurred. Something went wrong.';

export interface ServerResponse {
  message?: string;
  isAlert?: boolean;
  statusCode?: number;
  error?: string;
}

export function exe() {
  axios.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    const userRole = useTokenStore.getState().role;

    console.log('userRole', userRole);
    console.log('token', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

exe();

async function apiRequest<T>(method: 'get' | 'post', path: string, data?: any, config?: AxiosRequestConfig) {
  try {
    const response = await axios[method]<T & ServerResponse>(path, method === 'get' ? config : data, config);
    return response.data;
  } catch (error: any) {
    return handleError(error) as T & ServerResponse;
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
      return { message: error.response.data.message, isAlert: true };
    case 400:
      return { message: error.response.data.message, statusCode: 400, isAlert: true };
    default:
      return {
        message: 'Internal Server Error. Please try again later.',
        statusCode: error.response.status || 500,
        isAlert: true,
        error: error.response.data.error,
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
