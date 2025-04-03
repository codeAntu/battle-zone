import { postApi } from '.';
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
