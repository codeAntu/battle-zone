import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { appData } from '@/conts/data';
import { adminLogin, adminRegister, verifyAdmin } from '@/services/auth';
import { useTokenStore } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Route = createFileRoute('/admin/login')({
  component: AdminSignInPage,
});

// Admin sign-in/sign-up component (ready to be moved to another file)
export function AdminSignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isVerify, setIsVerify] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const setToken = useTokenStore((state) => state.setToken);
  const setRole = useTokenStore((state) => state.setRole);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    setError('');
  }

  const { mutate: loginMutation, isPending: isLoginPending } = useMutation({
    mutationKey: ['adminLogin'],
    mutationFn: adminLogin,
    onError: (error) => {
      setError(error.message);
      toast.error('Login failed: ' + error.message);
    },
    onSuccess: (response) => {
      if (response.isAlert) {
        toast.error(response.message || 'Something went wrong!');
        return;
      }
      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.token) {
        setRole('admin');
        setToken(response.token);
        toast.success('Admin login successful!');
        navigate({ to: '/admin' });
      } else {
        setError('Invalid response from server');
        toast.error('Invalid response from server');
      }
    },
  });

  const { mutate: registerMutation, isPending: isRegisterPending } = useMutation({
    mutationKey: ['adminRegister'],
    mutationFn: adminRegister,
    onError: (error) => {
      setError(error.message);
      toast.error('Registration failed: ' + error.message);
    },
    onSuccess: (response) => {
      console.log(response);

      if (response.isAlert) {
        toast.error(response.message || 'Something went wrong!');
        return;
      }
      if (response.error) {
        toast.error(response.error);
        return;
      }

      setIsVerify(true);
      setError('');
      toast.success('Admin registration successful! Please verify your email.');
      setTimeout(() => {
        toast('Verification code sent to your email, please check your inbox.');
      }, 2000);
    },
  });

  const { mutate: verifyMutation, isPending: isVerifyPending } = useMutation({
    mutationKey: ['adminVerify'],
    mutationFn: verifyAdmin,
    onError: (error) => {
      setError(error.message);
      toast.error('Verification failed: ' + error.message);
    },
    onSuccess: (response) => {
      if (response.isAlert) {
        toast.error(response.message || 'Something went wrong!');
        return;
      }
      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.token) {
        setRole('admin');
        setToken(response.token);
        toast.success('Verification successful! You are now logged in as admin.');
        navigate({ to: '/admin' });
      } else {
        setError('Invalid response from server');
        toast.error('Invalid response from server');
      }
    },
  });

  const handleSubmit = () => {
    // if (!data.email || (!isVerify && !data.password)) {
    //   setError('Email and password are required');
    //   toast.error('Email and password are required');
    //   return;
    // }

    if (isVerify) {
      if (!otp || otp.length < 6) {
        setError('Please enter the complete verification code');
        toast.error('Please enter the complete verification code');
        return;
      }


      verifyMutation({
        email: data.email,
        verificationCode: otp,
      });
    } else if (isSignUp) {
      registerMutation({
        email: data.email,
        password: data.password,
      });
    } else {
      loginMutation({
        email: data.email,
        password: data.password,
      });
    }
  };

  return (
    <div className='grid w-full grow items-center p-4 sm:justify-center'>
      <Card className='w-full sm:w-96'>
        <CardHeader className='flex flex-col items-center gap-y-2'>
          <CardTitle>{appData.name} - Admin Panel</CardTitle>
          <CardDescription>{appData.description}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-y-4'>
          <p className='text-muted-foreground before:bg-border after:bg-border flex items-center gap-x-3 text-sm before:h-px before:flex-1 after:h-px after:flex-1'>
            {isVerify ? 'Verify Account' : isSignUp ? 'Create Admin Account' : 'Login as Admin'}
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
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value.replace(/[^0-9]/g, ''))}
                className='w-full'
              >
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
              disabled={isLoginPending || isRegisterPending || isVerifyPending}
              onClick={handleSubmit}
            >
              {isVerify ? 'Verify' : isSignUp ? 'Create Admin Account' : 'Login as Admin'}
            </Button>
            {!isVerify &&
              (isSignUp ? (
                <Button variant='link' size='sm' onClick={() => setIsSignUp(false)} className='space-x-2 text-white'>
                  <span className=''>Already have an account?</span>
                  <span className='underline'>Login</span>
                </Button>
              ) : (
                <Button variant='link' size='sm' onClick={() => setIsSignUp(true)} className='space-x-2 text-white'>
                  <span className=''>Don't have an account?</span>
                  <span className='underline'>Create Admin Account</span>
                </Button>
              ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function Error({ message }: { message: string }) {
  return message ? <div className='w-full text-center text-xs text-red-500'>{message}</div> : null;
}
