import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { postApi, getApi } from '.';
import API from './api';
import { z } from 'zod';

export const withdrawTransaction = async (upiId: string, amount: number) => {
  return postApi(API.withdrawTransaction, { upiId, amount });
};

export const depositTransaction = async (upiId: string, amount: number, transactionId: number) => {
  return postApi(API.depositTransaction, { upiId, amount, transactionId });
};

// Admin transaction methods
export const getAdminDeposits = async () => {
  return getApi<DepositResponse>(API.adminDeposits);
};

export const getAdminWithdrawals = async () => {
  return getApi<WithdrawalResponse>(API.adminWithdrawals);
};

// Updated validation schema that matches backend expectation
const statusUpdateValidator = z
  .object({
    status: z.enum(['pending', 'approved', 'rejected']),
    reason: z.string().min(1).optional(),
  })
  .refine(
    (data) => {
      // Require reason if status is "rejected"
      return data.status !== 'rejected' || (data.status === 'rejected' && data.reason);
    },
    {
      message: 'Reason is required when rejecting a transaction',
      path: ['reason'],
    },
  );

// Updated status update function that always sends an object
export const updateTransactionStatus = async (
  endpoint: string,
  status: 'pending' | 'approved' | 'rejected',
  reason?: string,
) => {
  // Create proper request body that matches backend expectation: { status, reason }
  const requestBody = { status, reason };

  const validatedData = statusUpdateValidator.parse(requestBody);
  console.log('Validated Data:', validatedData); // Debugging line to check the validated data

  return postApi(endpoint, validatedData);
};

// Admin transaction approval/rejection methods
export const approveDeposit = async (id: string) => {
  return updateTransactionStatus(API.approveDeposit(id), 'approved');
};

export const rejectDeposit = async (id: string, reason: string) => {
  return updateTransactionStatus(API.approveDeposit(id), 'rejected', reason);
};

export const approveWithdrawal = async (id: string) => {
  return updateTransactionStatus(API.approveWithdrawal(id), 'approved');
};

export const rejectWithdrawal = async (id: string, reason: string) => {
  return updateTransactionStatus(API.approveWithdrawal(id), 'rejected', reason);
};

export interface DepositResponse {
  status: string;
  message: string;
  data: {
    deposits: Deposit[];
  };
}

export interface Deposit {
  id: number;
  userId: number;
  amount: number;
  transactionId: number;
  upiId: string;
  status: string;
  createdAt: Date;
  userName: string;
  userEmail: string;
}

export interface WithdrawalResponse {
  status: string;
  message: string;
  data: {
    withdrawals: Withdrawal[];
  };
}

export interface Withdrawal {
  id: number;
  userId: number;
  amount: number;
  upiId: string;
  status: string;
  createdAt: Date;
  userName: string;
  userEmail: string;
}

export const getHistory = async () => {
  return getApi<TransactionHistoryResponse>(API.getTransactionHistory);
};
export interface TransactionHistoryResponse {
  status: string;
  message: string;
  data: {
    history: History[];
  };
}

export interface History {
  id: number;
  userId: number;
  transactionType: string;
  amount: number;
  balanceEffect: string;
  status: string;
  message: string;
  referenceId: number;
  createdAt: Date;
  formattedCreatedAt: string;
  formattedCreatedTime: string;
}

export const formatHistory = (transaction: History) => {
  const formattedCreatedAt = formatDateToUTC(
    typeof transaction.createdAt === 'string' ? transaction.createdAt : transaction.createdAt.toISOString(),
  );
  const formattedCreatedTime = formatTimeToUTC(
    typeof transaction.createdAt === 'string' ? transaction.createdAt : transaction.createdAt.toISOString(),
  );
  return { ...transaction, formattedCreatedAt, formattedCreatedTime };
};
