import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFileRoute } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { withdrawTransaction } from '@/services/transaction';
import { useState } from 'react';
import { z } from 'zod';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/user/withdraw')({
  component: Withdraw,
});

const withdrawValidator = z.object({
  amount: z.number().positive('Amount must be positive'),
  upiId: z.string().min(1, 'UPI ID is required'),
});
export function Withdraw() {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentOption, setPaymentOption] = useState('upi');
  const [errors, setErrors] = useState({
    upiId: '',
    amount: '',
  });

  // Create withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: (data: { upiId: string; amount: number }) => withdrawTransaction(data.upiId, data.amount),
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || 'Something went wrong!');
        return;
      }

      toast.success('Withdrawal request submitted successfully!');
      setUpiId('');
      setAmount('');
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
        console.error('Unexpected error:', error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form inputs
      const parsedAmount = parseFloat(amount);

      withdrawValidator.parse({
        upiId,
        amount: parsedAmount,
      });

      // Submit withdrawal request
      withdrawMutation.mutate({ upiId, amount: parsedAmount });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const newErrors = { upiId: '', amount: '' };

        error.errors.forEach((err) => {
          const path = err.path[0] as keyof typeof newErrors;
          if (path in newErrors) {
            newErrors[path] = err.message;
          }
        });

        setErrors(newErrors);
      } else {
        toast.error('An unexpected error occurred');
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className='container mx-auto max-w-md space-y-6 p-4'>
      <Card>
        <CardHeader className='items-center'>
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>Enter your details to process a withdrawal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='upiId'>UPI ID</Label>
              <Input
                id='upiId'
                placeholder='Enter your UPI ID'
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={withdrawMutation.isPending}
              />
              {errors.upiId && <p className='text-sm text-red-500'>{errors.upiId}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='amount'>Amount</Label>
              <Input
                id='amount'
                type='number'
                placeholder='Enter amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={withdrawMutation.isPending}
              />
              {errors.amount && <p className='text-sm text-red-500'>{errors.amount}</p>}
            </div>

            <div className='space-y-2'>
              <Label>Payment Option</Label>
              <Select value={paymentOption} onValueChange={setPaymentOption}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select payment method' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='upi'>UPI Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type='submit' className='mt-4 w-full' disabled={withdrawMutation.isPending}>
              {withdrawMutation.isPending ? 'Processing...' : 'Process Withdrawal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
