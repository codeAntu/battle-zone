import { postApi } from '.';
import API from './api';

// const depositValidator = z.object({
//   amount: z.number().positive("Amount must be positive"),
//   transactionId: z.number().positive("Transaction ID is required"),
//   upiId: z.string().min(1, "UPI ID is required"),
// });

// const withdrawValidator = z.object({
//   amount: z.number().positive("Amount must be positive"),
//   upiId: z.string().min(1, "UPI ID is required"),
// });

export const withdrawTransaction = async (upiId: string, amount: number) => {
  return postApi(API.withdrawTransaction, { upiId, amount });
};

export const depositTransaction = async (upiId: string, amount: number, transactionId: number) => {
  return postApi(API.depositTransaction, { upiId, amount, transactionId });
};
