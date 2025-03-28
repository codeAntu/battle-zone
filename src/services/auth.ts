import { postApi } from '.';
import API from './api';

export const signup = async (formdata: { email: string; password: string }) => {
  console.log(formdata);

  return postApi(API.signup, formdata);
};
