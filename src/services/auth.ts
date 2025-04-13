import { getApi, postApi } from '.';
import API from './api';

export interface UserLoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  balance: number;
}

export interface UserRegisterResponse {
  message: string;
  title: string;
  isVerified: boolean;
  user: User;
}

export interface User {
  email: string;
  name: string;
  password: string;
  verificationCode: string;
  verificationCodeExpires: Date;
  isVerified: boolean;
  balance: number;
  id: number;
}

export interface ID {
  id: number;
}

export interface UserVerifyResponse {
  message: string;
  isVerified: boolean;
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  balance: number;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface AdminRegisterResponse {
  message: string;
  title: string;
  isVerified: boolean;
  admin: {
    id: number;
    email: string;
    name?: string;
  };
}

export interface AdminVerifyResponse {
  message: string;
  isVerified: boolean;
  token: string;
  admin: {
    id: number;
    email: string;
    name?: string;
  };
}


export interface UserProfileResponse {
  message: string;
  user:    User;
}

export interface User {
  id:      number;
  name:    string;
  email:   string;
  balance: number;
}

export const userLogin = async (formdata: { email: string; password: string }) => {
  console.log(formdata);
  return postApi<UserLoginResponse>(API.userLogin, formdata);
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
