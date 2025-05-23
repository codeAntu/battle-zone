import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { appData } from '@/conts/data';
import { userLogin, userRegister, verifyUser } from '@/services/auth';
import { useTokenStore } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from "zod";

export const Route = createFileRoute('/user/login')({
  component: Login,
});

const signupValidator = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email format" }),
    password: z
      .string({ required_error: "Password is required" })
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, { message: "Password must be at most 100 characters long" }),
  })
  .strict();

 const verifyOtpValidator = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .toLowerCase()
      .email({ message: "Invalid email format" }),
    verificationCode: z
      .string({ required_error: "OTP is required" })
      .trim()
      .min(6, { message: "OTP must be at least 6 characters long" })
      .max(6, { message: "OTP must be at most 6 characters long" }),
  })
  .strict()
  .refine((data) => data.email || data.verificationCode, {
    message: "Email and OTP is required",
  });

export function Login() {
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
    mutationKey: ['login'],
    mutationFn: userLogin,
    onError: (error) => {
      console.log(error);
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
        console.log(response);

        setRole('user');
        setToken(response.token);
        toast.success('Login successful!');
        navigate({ to: '/welcome' }); // Changed from /user/tournaments to /welcome
      } else {
        setError('Invalid response from server');
      }
    },
  });

  const { mutate: registerMutation, isPending: isRegisterPending } = useMutation({
    mutationKey: ['register'],
    mutationFn: userRegister,
    onError: (error) => {
      console.log(error);
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
      // setData({ ...data, email: response.user.email });
      setError('');
      toast.success('Registration successful! Please verify your email.');
      setTimeout(() => {
        toast('Verification code sent to your email, please check your inbox and spam box.');
      }, 2000);
    },
  });

  const { mutate: verifyMutation } = useMutation({
    mutationKey: ['verify'],
    mutationFn: verifyUser,
    onError: (error) => {
      console.log(error);
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
        setRole('user');
        setToken(response.token);
        toast.success('Verification successful! You are now logged in.');
        navigate({ to: '/welcome' }); // Changed from /user/tournaments to /welcome
      }
    },
  });

  const handleSubmit = () => {
    try {
      if (isVerify) {
        verifyOtpValidator.parse({ email: data.email, verificationCode: otp });

        verifyMutation({
          email: data.email,
          verificationCode: otp,
        });
      } else if (isSignUp) {
        signupValidator.parse(data);

        registerMutation({
          email: data.email,
          password: data.password,
        });
      } else {
        signupValidator.parse(data);

        loginMutation({
          email: data.email,
          password: data.password,
        });
      }
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0]?.message || 'Validation error');
        toast.error(validationError.errors[0]?.message || 'Validation error');
      }
    }
  };

  return (
    <div className='grid w-full grow items-center p-4 sm:justify-center'>
      <Card className='w-full sm:w-96'>
        <CardHeader className='flex flex-col items-center gap-y-2'>
          <CardTitle>{appData.name}</CardTitle>
          <CardDescription>{appData.description}</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-y-4'>
          <p className='text-muted-foreground before:bg-border after:bg-border flex items-center gap-x-3 text-sm before:h-px before:flex-1 after:h-px after:flex-1'>
            {isSignUp ? 'Create Account' : 'Login'} as User
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

          {isVerify && (
            <p className='text-sm text-muted-foreground'>
              If you don't see the verification code in your inbox, please check your spam box.
            </p>
          )}

          <Error message={error} />
        </CardContent>

        <CardFooter>
          <div className='grid w-full gap-y-4'>
            <Button className='' disabled={isLoginPending || isRegisterPending} onClick={handleSubmit}>
              {isVerify ? 'Verify' : isSignUp ? 'Create Account' : 'Login'}
            </Button>
            {isSignUp ? (
              <Button variant='link' size='sm' onClick={() => setIsSignUp(false)} className='space-x-2 text-white'>
                <span className=''>Already have an account?</span>
                <span className='underline'>Login</span>
              </Button>
            ) : (
              <Button variant='link' size='sm' onClick={() => setIsSignUp(true)} className='space-x-2 text-white'>
                <span className=''>Don't have an account?</span>
                <span className='underline'>Create Account</span>
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
