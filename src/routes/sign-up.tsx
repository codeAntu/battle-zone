import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { appData } from '@/conts/data';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      u
      <SignInPage />
    </div>
  );
}
function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const [otp, setOtp] = useState('');

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    setError('');
  }

  return (
    <div className='grid w-full grow items-center px-4 sm:justify-center'>
      <Card className='w-full sm:w-96'>
        <CardHeader className='flex flex-col items-center gap-y-2'>
          <CardTitle>{appData.name}</CardTitle>
          <CardDescription>{appData.description}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-y-4'>
          <div className='grid grid-cols-2 gap-x-4'>
            <Button size='sm' variant={isAdmin ? 'default' : 'outline'} type='button' onClick={() => setIsAdmin(true)}>
              Admin
            </Button>
            <Button size='sm' variant={isAdmin ? 'outline' : 'default'} type='button' onClick={() => setIsAdmin(false)}>
              user
            </Button>
          </div>

          <p className='text-muted-foreground before:bg-border after:bg-border flex items-center gap-x-3 text-sm before:h-px before:flex-1 after:h-px after:flex-1'>
            {isSignUp ? 'Sign up' : 'Sign in'} as {isAdmin ? 'Admin' : 'User'}
          </p>

          <div className='space-y-2'>
            <Label>Email</Label>

            <Input
              type='email'
              name='email'
              required
              value={data.email}
              onChange={handleInputChange}
              disabled={isVerify}
            />
          </div>

          {isVerify ? (
            <div className='w-full space-y-2'>
              <Label>Verification code</Label>
              <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} className='w-full'>
                <InputOTPGroup className='flex w-full grow items-center'>
                  <InputOTPSlot index={0} className='w-full' />
                  <InputOTPSlot index={1} className='w-full' />
                  <InputOTPSlot index={2} className='w-full' />
                  <InputOTPSlot index={3} className='w-full' />
                  <InputOTPSlot index={4} className='w-full' />
                  <InputOTPSlot index={5} className='w-full' />
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : (
            <div className='space-y-2'>
              <Label>Password</Label>
              <Input type='password' name='password' required value={data.password} onChange={handleInputChange} />
            </div>
          )}

          <Error message={error} />
        </CardContent>

        <CardFooter>
          <div className='grid w-full gap-y-4'>
            <Button
              className=''
              onClick={() => {
                if (isVerify) {
                  console.log('Verify');
                } else {
                  if (isSignUp) {
                    setIsVerify(true);
                    if (isAdmin) {
                      console.log('Sign up as Admin');
                    } else {
                      console.log('Sign up as User');
                    }
                  } else {
                    if (isAdmin) {
                      console.log('Sign in as Admin');
                    } else {
                      console.log('Sign in as User');
                    }
                  }
                }
              }}
            >
              {isVerify ? 'Verify' : isSignUp ? 'Sign up' : 'Sign in'} as {isAdmin ? 'Admin' : 'User'}
            </Button>
            {isSignUp ? (
              <Button variant='link' size='sm' onClick={() => setIsSignUp(false)} className='space-x-2 text-black'>
                <span className=''>Already have an account?</span>
                <span className='underline'>Sign in</span>
              </Button>
            ) : (
              <Button variant='link' size='sm' onClick={() => setIsSignUp(true)} className='space-x-2 text-black'>
                <span className=''>Don't have an account?</span>
                <span className='underline'>Sign up</span>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function Error({ message }: { message: string }) {
  return message ? <div className='w-full text-center text-xs text-red-500'>{message}</div> : null;
}
