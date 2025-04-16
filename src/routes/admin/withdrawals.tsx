import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatDateToUTC, formatTimeToUTC } from '@/lib/utils';
import { approveWithdrawal, getAdminWithdrawals, rejectWithdrawal, WithdrawalResponse } from '@/services/transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/admin/withdrawals')({
  component: WithdrawalsComponent,
});

function WithdrawalsComponent() {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<number | null>(null);

  const {
    data: withdrawalData,
    isLoading,
    error,
  } = useQuery<WithdrawalResponse>({
    queryKey: ['adminWithdrawals'],
    queryFn: getAdminWithdrawals,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveWithdrawal(id),
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || 'Something went wrong!');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
      toast.success('Withdrawal approved successfully');
    },
    onError: (error) => {
      toast.error(`Error approving withdrawal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectWithdrawal(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] });
      toast.success('Withdrawal rejected');
      setRejectionReason('');
      setSelectedWithdrawalId(null);
    },
    onError: (error) => {
      toast.error(`Error rejecting withdrawal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate(id.toString());
  };

  const handleReject = (id: number, reason: string) => {
    if (!reason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate({ id: id.toString(), reason });
  };

  const openRejectDialog = (withdrawalId: number) => {
    setSelectedWithdrawalId(withdrawalId);
    setRejectionReason('');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'failed':
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto max-w-7xl p-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>Withdrawal Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto max-w-7xl p-6'>
        <Card className='border-red-300'>
          <CardHeader>
            <CardTitle className='text-center text-red-500'>Error Loading Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-center'>Failed to load withdrawal transactions. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-7xl p-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-center'>Withdrawal Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawalData?.withdrawals && withdrawalData.withdrawals.length > 0 ? (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center'>ID</TableHead>
                    <TableHead className='text-center'>User</TableHead>
                    <TableHead className='text-center'>Amount</TableHead>
                    <TableHead className='text-center'>UPI ID</TableHead>
                    <TableHead className='text-center'>Status</TableHead>
                    <TableHead className='text-center'>Date</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalData.withdrawals.map((withdrawal) => {
                    const formattedDate = formatDateToUTC(
                      withdrawal.createdAt instanceof Date ? withdrawal.createdAt.toISOString() : withdrawal.createdAt,
                    );
                    const formattedTime = formatTimeToUTC(
                      withdrawal.createdAt instanceof Date ? withdrawal.createdAt.toISOString() : withdrawal.createdAt,
                    );

                    return (
                      <TableRow key={withdrawal.id}>
                        <TableCell className='text-center font-medium'>{withdrawal.id}</TableCell>
                        <TableCell className='text-center'>
                          <div>
                            <div className='font-medium'>{withdrawal.userName}</div>
                            <div className='text-muted-foreground text-sm'>{withdrawal.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell className='text-center font-medium'>₹{withdrawal.amount}</TableCell>
                        <TableCell className='text-center'>{withdrawal.upiId}</TableCell>
                        <TableCell className='text-center'>
                          <Badge className={getStatusBadgeColor(withdrawal.status)}>{withdrawal.status}</Badge>
                        </TableCell>
                        <TableCell className='text-center'>
                          {formattedDate} at {formattedTime}
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex justify-center gap-2'>
                            {withdrawal.status.toLowerCase() === 'pending' && (
                              <>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size='sm'
                                      className='border-green-500 bg-green-500 text-white hover:bg-green-400'
                                      disabled={approveMutation.isPending}
                                    >
                                      <Check className='mr-1 h-3 w-3' />
                                      Approve
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className='dark border border-gray-700'>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className='text-white'>
                                        Confirm Withdrawal Approval
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to approve this withdrawal of{' '}
                                        <span className='font-semibold text-green-500'>₹{withdrawal.amount}</span> for{' '}
                                        <span className='font-semibold text-green-500'>{withdrawal.userName}</span>?
                                        This action will release funds to the user's UPI ID:{' '}
                                        <span className='font-semibold'>{withdrawal.upiId}</span>.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleApprove(withdrawal.id)}
                                        className='bg-green-500 hover:bg-green-600'
                                        disabled={approveMutation.isPending}
                                      >
                                        {approveMutation.isPending ? 'Processing...' : 'Yes, Approve Withdrawal'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size='sm'
                                      className='border-rose-600 bg-rose-600 text-white hover:bg-rose-700'
                                      disabled={rejectMutation.isPending}
                                      onClick={() => openRejectDialog(withdrawal.id)}
                                    >
                                      <X className='mr-1 h-3 w-3' />
                                      Reject
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className='dark border border-gray-700'>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className='text-white'>
                                        Confirm Withdrawal Rejection
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to reject this withdrawal request of{' '}
                                        <span className='font-semibold text-rose-500'>₹{withdrawal.amount}</span> from{' '}
                                        <span className='font-semibold text-rose-500'>{withdrawal.userName}</span>?
                                        Please provide a reason for the rejection.
                                      </AlertDialogDescription>
                                      <div className='mt-4'>
                                        <label className='text-sm font-medium text-white'>
                                          Rejection Reason <span className='text-rose-500'>*</span>
                                        </label>
                                        <Textarea
                                          className='mt-1 border-gray-700 bg-gray-800 text-white'
                                          placeholder='Enter reason for rejection'
                                          value={selectedWithdrawalId === withdrawal.id ? rejectionReason : ''}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                      </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleReject(withdrawal.id, rejectionReason)}
                                        className='bg-rose-600 hover:bg-rose-700'
                                        disabled={rejectMutation.isPending || !rejectionReason.trim()}
                                      >
                                        {rejectMutation.isPending ? 'Processing...' : 'Yes, Reject Withdrawal'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            {withdrawal.status.toLowerCase() !== 'pending' && (
                              <span className='text-muted-foreground text-sm'>No actions available</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='text-muted-foreground py-8 text-center'>No withdrawal transactions found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
