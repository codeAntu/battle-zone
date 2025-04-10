import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/user/deposit')({
  component: RouteComponent,
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
  const [paymentOption, setPaymentOption] = useState('upi');
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
      // Here you would handle the actual deposit process
    }
  };

  return (
    <div className='container mx-auto max-w-md space-y-6 p-4'>
      <Card>
        <CardHeader className='items-center'>
          <CardTitle>Deposit </CardTitle>
          <CardDescription>Enter your details to add funds to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* QR Code Section */}
          <div className='mb-6 flex flex-col items-center'>
            <p className='mb-2 text-sm font-medium'>Scan QR code to pay directly</p>
            <div className='rounded-md border bg-white p-3'>
              <img
                src='/qr-placeholder.png'
                alt='Payment QR Code'
                className='h-48 w-48 object-contain'
                onError={(e) => {
                  // Fallback if image doesn't load
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>
            <p className='text-muted-foreground mt-2 text-xs'>Supported methods: UPI, Paytm, GPay</p>
          </div>

          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-card text-muted-foreground px-2'>Or enter details manually</span>
            </div>
          </div>

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
                  <SelectItem value='upi'>UPI Transfer</SelectItem>
                  <SelectItem value='card'>Debit/Credit Card</SelectItem>
                  <SelectItem value='netbanking'>Net Banking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type='submit' className='w-full'>
              Process Deposit
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

      <div>
        <div className='text-xl font-bold'>History</div>
        <div className='mt-4'>
          <p className='text-sm text-gray-500'>No deposit history available.</p>
        </div>
      </div>
    </div>
  );
}
