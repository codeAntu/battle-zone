import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/user/withdraw')({
  component: RouteComponent,
});

function RouteComponent() {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentOption, setPaymentOption] = useState('withdraw');
  const [errors, setErrors] = useState({
    upiId: '',
    amount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {
      upiId: upiId ? '' : 'UPI ID is required',
      amount: amount ? '' : 'Amount is required',
    };

    setErrors(newErrors);

    // If no errors, proceed with submission
    if (!newErrors.upiId && !newErrors.amount) {
      console.log('Form submitted:', { upiId, amount, paymentOption });
      // Here you would handle the actual withdrawal process
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
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='upiId'>UPI ID</Label>
              <Input
                id='upiId'
                placeholder='Enter your UPI ID'
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
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
                  <SelectItem value='withdraw'>Direct Withdrawal</SelectItem>
                  <SelectItem value='upi'>UPI Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type='submit' className='w-full'>
              Process Withdrawal
            </Button>
          </form>
        </CardContent>
      </Card>
      <div>
        <div className='text-xl font-bold'>History</div>
        <div className='mt-4'>
          <p className='text-sm text-gray-500'>No withdrawal history available.</p>
        </div>
      </div>
    </div>
  );
}
