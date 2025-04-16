import { approveDeposit, getAdminDeposits, rejectDeposit } from '@/services/transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export const Route = createFileRoute('/admin/deposits')({
  component: DepositsComponent,
});

function DepositsComponent() {
  const queryClient = useQueryClient();
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedDepositId, setSelectedDepositId] = useState<number | null>(null);

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['adminDeposits'],
    queryFn: getAdminDeposits,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveDeposit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDeposits'] });
      toast.success('Deposit approved successfully');
    },
    onError: (error) => {
      toast.error(`Error approving deposit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => 
      rejectDeposit(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDeposits'] });
      toast.success('Deposit rejected');
      setRejectionReason('');
      setSelectedDepositId(null);
    },
    onError: (error) => {
      toast.error(`Error rejecting deposit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

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

  const openRejectDialog = (depositId: number) => {
    setSelectedDepositId(depositId);
    setRejectionReason('');
  };

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Deposit Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error Loading Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Failed to load deposit transactions. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Deposit Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions?.deposits && transactions.deposits.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">User</TableHead>
                    <TableHead className="text-center">Amount</TableHead>
                    <TableHead className="text-center">Transaction ID</TableHead>
                    <TableHead className="text-center">UPI ID</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.deposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell className="font-medium text-center">{deposit.id}</TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium">{deposit.userName}</div>
                          <div className="text-sm text-muted-foreground">{deposit.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-center">₹{deposit.amount}</TableCell>
                      <TableCell className="text-center">{deposit.transactionId}</TableCell>
                      <TableCell className="text-center">{deposit.upiId}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusBadgeColor(deposit.status)}>
                          {deposit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {format(new Date(typeof deposit.createdAt === 'string' ? deposit.createdAt : deposit.createdAt.toISOString()), "MMM dd, yyyy 'at' h:mm a")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          {deposit.status.toLowerCase() === 'pending' && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-500 text-white hover:bg-green-400 border-green-500"
                                    disabled={approveMutation.isPending}
                                  >
                                    <Check className="mr-1 h-3 w-3" />
                                    Approve
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className='dark border border-gray-700'>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className='text-white'>
                                      Confirm Deposit Approval
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to approve this deposit of{' '}
                                      <span className='font-semibold text-green-500'>₹{deposit.amount}</span> from{' '}
                                      <span className='font-semibold text-green-500'>{deposit.userName}</span>? 
                                      This action will credit funds to the user's account.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleApprove(deposit.id)}
                                      className='bg-green-500 hover:bg-green-600'
                                      disabled={approveMutation.isPending}
                                    >
                                      {approveMutation.isPending ? 'Processing...' : 'Yes, Approve Deposit'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="sm"
                                    className="bg-rose-600 text-white hover:bg-rose-700 border-rose-600"
                                    disabled={rejectMutation.isPending}
                                    onClick={() => openRejectDialog(deposit.id)}
                                  >
                                    <X className="mr-1 h-3 w-3" />
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className='dark border border-gray-700'>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className='text-white'>
                                      Confirm Deposit Rejection
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this deposit of{' '}
                                      <span className='font-semibold text-rose-500'>₹{deposit.amount}</span> from{' '}
                                      <span className='font-semibold text-rose-500'>{deposit.userName}</span>?
                                      Please provide a reason for the rejection.
                                    </AlertDialogDescription>
                                    <div className='mt-4'>
                                      <label className='text-sm font-medium text-white'>
                                        Rejection Reason <span className='text-rose-500'>*</span>
                                      </label>
                                      <Textarea 
                                        className='mt-1 bg-gray-800 border-gray-700 text-white'
                                        placeholder='Enter reason for rejection'
                                        value={selectedDepositId === deposit.id ? rejectionReason : ''}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                      />
                                    </div>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className='text-white/80'>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleReject(deposit.id, rejectionReason)}
                                      className='bg-rose-600 hover:bg-rose-700'
                                      disabled={rejectMutation.isPending || !rejectionReason.trim()}
                                    >
                                      {rejectMutation.isPending ? 'Processing...' : 'Yes, Reject Deposit'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {deposit.status.toLowerCase() !== 'pending' && (
                            <span className="text-sm text-muted-foreground">
                              No actions available
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No deposit transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
