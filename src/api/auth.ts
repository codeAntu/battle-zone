import { getApi, postApi } from '.';
import API from './api';
import {
  AdminLoginResponse,
  AdminRegisterResponse,
  AdminVerifyResponse,
  GetUsersResponse,
  UserLoginApiResponse,
  UserProfileResponse,
  UserRegisterResponse,
  UserVerifyResponse,
} from './types';

export const userLogin = async (formdata: { email: string; password: string }) => {
  console.log(formdata);
  return postApi<UserLoginApiResponse>(API.userLogin, formdata);
};

export const userRegister = async (formdata: { email: string; password: string }) => {
  return postApi<UserRegisterResponse>(API.userRegister, formdata);
};

export const verifyUser = async (formdata: { email: string; verificationCode: string }) => {
  return postApi<UserVerifyResponse>(API.userVerify, formdata);
};

export const adminLogin = async (formdata: { email: string; password: string }) => {
  console.log('Admin login:', formdata);
  return postApi<AdminLoginResponse>(API.adminLogin, formdata);
};

export const adminRegister = async (formdata: { email: string; password: string }) => {
  console.log('Admin register:', formdata);
  return postApi<AdminRegisterResponse>(API.adminRegister, formdata);
};

export const verifyAdmin = async (formdata: { email: string; verificationCode: string }) => {
  console.log('Admin verify:', formdata);
  return postApi<AdminVerifyResponse>(API.adminVerify, formdata);
};

export const getUserProfile = async () => {
  return getApi<UserProfileResponse>(API.getProfile);
};

export const getUsers = async () => {
  return getApi<GetUsersResponse>(API.getUsers);
};
