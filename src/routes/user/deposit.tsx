import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { depositTransaction } from '@/services/transaction';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

export const Route = createFileRoute('/user/deposit')({
  component: RouteComponent,
});

const depositValidator = z.object({
  amount: z.number().positive('Amount must be positive'),
  transactionId: z.number().positive('Transaction ID is required'),
  upiId: z.string().min(1, 'UPI ID is required'),
});

const depositInstructions = [
  '1. Enter your UPI ID or select payment method.',
  '2. Enter the amount you want to deposit.',
  '3. Review the details and click "Process Deposit".',
  '4. Complete the payment using your preferred method.',
  '5. Your account will be credited once the transaction is confirmed.',
];

function RouteComponent() {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentOption, setPaymentOption] = useState('upi');
  const [errors, setErrors] = useState({
    upiId: '',
    amount: '',
    transactionId: '',
  });

  const depositMutation = useMutation({
    mutationFn: (data: { upiId: string; amount: number; transactionId: number }) =>
      depositTransaction(data.upiId, data.amount, data.transactionId),
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message || 'Something went wrong!');
        return;
      }

      toast.success('Deposit request submitted successfully!');
      setUpiId('');
      setAmount('');
      setTransactionId('');
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
      const parsedAmount = parseFloat(amount);
      const parsedTransactionId = parseInt(transactionId, 10);

      depositValidator.parse({
        upiId,
        amount: parsedAmount,
        transactionId: parsedTransactionId,
      });

      depositMutation.mutate({
        upiId,
        amount: parsedAmount,
        transactionId: parsedTransactionId,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = { upiId: '', amount: '', transactionId: '' };

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
    <div className='container mx-auto max-w-md p-4'>
      <Card>
        <CardContent>
          <CardTitle className='pt-5 pb-3 text-center'>Deposit </CardTitle>
          <div className='flex flex-col items-center'>
            <p className='mb-1 text-sm font-medium'>Scan QR code to pay directly</p>
            <div className='rounded-md border bg-white p-3'>
              <img src='/qr-placeholder.png' alt='Payment QR Code' className='h-48 w-48 object-contain' />
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Supported methods: UPI, Paytm, GPay</p>
          </div>

          <div className='relative my-3'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-card text-muted-foreground px-2'>Or enter details manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-2'>
            <div className='space-y-2'>
              <Label htmlFor='upiId'>UPI ID</Label>
              <Input
                id='upiId'
                placeholder='Enter your UPI ID'
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={depositMutation.isPending}
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
                disabled={depositMutation.isPending}
              />
              {errors.amount && <p className='text-sm text-red-500'>{errors.amount}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='transactionId'>Transaction ID</Label>
              <Input
                id='transactionId'
                type='number'
                placeholder='Enter transaction ID'
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                disabled={depositMutation.isPending}
              />
              {errors.transactionId && <p className='text-sm text-red-500'>{errors.transactionId}</p>}
            </div>

            <div className='space-y-2'>
              <Label>Payment Option</Label>
              <Select value={paymentOption} onValueChange={setPaymentOption} disabled={depositMutation.isPending}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select payment method' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='upi'>UPI Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type='submit' className='mt-4 w-full' disabled={depositMutation.isPending}>
              {depositMutation.isPending ? 'Processing...' : 'Process Deposit'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className='pt-6'>
          <div className='font-medium'>How to deposit?</div>
          <ul className='list-disc pt-2 pl-5'>
            {depositInstructions.map((instruction, index) => (
              <li key={index} className='text-muted-foreground text-sm'>
                {instruction}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
