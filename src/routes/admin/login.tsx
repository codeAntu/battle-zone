import { adminLogin, adminRegister, verifyAdmin } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { appData } from '@/conts/data';
import { useTokenStore } from '@/store/store';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

export const Route = createFileRoute('/admin/login')({
  component: AdminSignInPage,
});

// Validators
const signupValidator = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email({ message: 'Invalid email format' }),
    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(100, { message: 'Password must be at most 100 characters long' }),
  })
  .strict();

export const verifyOtpValidator = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email({ message: 'Invalid email format' }),
    verificationCode: z
      .string({ required_error: 'OTP is required' })
      .trim()
      .min(6, { message: 'OTP must be at least 6 characters long' })
      .max(6, { message: 'OTP must be at most 6 characters long' }),
  })
  .strict()
  .refine((data) => data.email || data.verificationCode, {
    message: 'Email and OTP is required',
  });

// Admin sign-in/sign-up component (ready to be moved to another file)
export function AdminSignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [data, setData] = useState({ email: 'admin@gmail.com', password: '1111111111111' });
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

      if (response.data && response.data.token) {
        setRole('admin');
        setToken(response.data.token);
        toast.success('Admin login successful!');
        navigate({ to: '/admin/tournaments' });
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
        toast('Verification code sent to your email, please check your inbox and spam box.');
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

      if (response.data && response.data.token) {
        setRole('admin');
        setToken(response.data.token);
        toast.success('Verification successful! You are now logged in as admin.');
        navigate({ to: '/admin/tournaments' });
      } else {
        setError('Invalid response from server');
        toast.error('Invalid response from server');
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
    <div className='flex min-h-screen items-center justify-center bg-black p-4'>
      {/* Background Animation */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl'></div>
        <div className='absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl delay-1000'></div>
      </div>

      <Card className='relative w-full max-w-md border border-gray-700/50 bg-gray-900/80 shadow-2xl backdrop-blur-sm'>
        <CardHeader className='flex flex-col items-center gap-y-4 pb-6'>
          {' '}
          {/* Admin Badge */}
          <div className='inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-400'>
            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                clipRule='evenodd'
              />
            </svg>
            Admin Panel
          </div>
          <div className='text-center'>
            <CardTitle className='mb-2 text-2xl font-bold text-white'>{appData.name}</CardTitle>
            <CardDescription className='text-gray-400'>{appData.description}</CardDescription>
          </div>
        </CardHeader>{' '}
        <CardContent className='space-y-6 px-6'>
          {' '}
          {/* Status Indicator with Icon */}
          <div className='flex items-center justify-center gap-3 text-sm text-gray-400'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent'></div>
            <div className='flex items-center gap-2 rounded-full border border-gray-700/50 bg-gray-800/50 px-3 py-1.5'>
              {isVerify ? (
                <>
                  <svg className='h-4 w-4 text-green-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Verify Account
                </>
              ) : isSignUp ? (
                <>
                  <svg className='h-4 w-4 text-blue-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
                  </svg>
                  Create Admin Account
                </>
              ) : (
                <>
                  <svg className='h-4 w-4 text-purple-400' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Admin Login
                </>
              )}{' '}
            </div>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent via-gray-600 to-transparent'></div>
          </div>
          {isVerify && (
            <div className='rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4'>
              <p className='flex items-center gap-2 text-sm text-yellow-300'>
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                Check your email inbox and spam folder for the verification code.
              </p>
            </div>
          )}{' '}
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='font-medium text-gray-300'>Email Address</Label>
              <div className='relative'>
                <Input
                  type='email'
                  name='email'
                  required
                  value={data.email}
                  onChange={handleInputChange}
                  disabled={isVerify}
                  placeholder='admin@example.com'
                  className='border-gray-700/50 bg-gray-800/50 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                />
                <svg
                  className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                </svg>
              </div>
            </div>{' '}
            {isVerify ? (
              <div className='space-y-2'>
                <Label className='font-medium text-gray-300'>Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value.replace(/[^0-9]/g, ''))}
                  className='w-full'
                >
                  <InputOTPGroup className='flex w-full justify-center gap-2'>
                    <InputOTPSlot
                      index={0}
                      className='h-12 w-12 border-gray-700/50 bg-gray-800/50 text-lg font-semibold text-white focus:border-purple-500 focus:ring-purple-500/20'
                    />
                    <InputOTPSlot
                      index={1}
                      className='h-12 w-12 border-gray-700/50 bg-gray-800/50 text-lg font-semibold text-white focus:border-purple-500 focus:ring-purple-500/20'
                    />
                    <InputOTPSlot
                      index={2}
                      className='h-12 w-12 border-gray-700/50 bg-gray-800/50 text-lg font-semibold text-white focus:border-purple-500 focus:ring-purple-500/20'
                    />
                    <InputOTPSlot
                      index={3}
                      className='h-12 w-12 border-gray-700/50 bg-gray-800/50 text-lg font-semibold text-white focus:border-purple-500 focus:ring-purple-500/20'
                    />
                    <InputOTPSlot
                      index={4}
                      className='h-12 w-12 border-gray-700/50 bg-gray-800/50 text-lg font-semibold text-white focus:border-purple-500 focus:ring-purple-500/20'
                    />
                    <InputOTPSlot
                      index={5}
                      className='h-12 w-12 border-gray-700/50 bg-gray-800/50 text-lg font-semibold text-white focus:border-purple-500 focus:ring-purple-500/20'
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            ) : (
              <div className='space-y-2'>
                <Label className='font-medium text-gray-300'>Password</Label>
                <div className='relative'>
                  <Input
                    type='password'
                    name='password'
                    required
                    value={data.password}
                    onChange={handleInputChange}
                    placeholder='Enter your password'
                    className='border-gray-700/50 bg-gray-800/50 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20'
                  />
                  <svg
                    className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            )}
            <Error message={error} />
          </div>
        </CardContent>{' '}
        <CardFooter className='px-6 pb-6'>
          <div className='grid w-full gap-y-4'>
            <Button
              className='h-12 transform rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-purple-700 hover:to-blue-700 hover:shadow-xl'
              disabled={isLoginPending || isRegisterPending || isVerifyPending}
              onClick={handleSubmit}
            >
              {isLoginPending || isRegisterPending || isVerifyPending ? (
                <div className='flex items-center gap-3'>
                  <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent'></div>
                  <span>
                    {isVerify ? 'Verifying Account...' : isSignUp ? 'Creating Admin Account...' : 'Signing In...'}
                  </span>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  {isVerify ? (
                    <>
                      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Verify Account
                    </>
                  ) : isSignUp ? (
                    <>
                      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
                      </svg>
                      Create Admin Account
                    </>
                  ) : (
                    <>
                      <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Sign In to Admin Panel
                    </>
                  )}
                </div>
              )}
            </Button>

            {/* Toggle between login/signup */}
            {!isVerify && (
              <div className='flex justify-center'>
                {' '}
                {isSignUp ? (
                  <Button
                    variant='link'
                    size='sm'
                    onClick={() => setIsSignUp(false)}
                    className='text-gray-400 transition-colors duration-200 hover:text-white'
                  >
                    <span className=''>Already have an admin account? </span>
                    <span className='ml-1 text-purple-400 underline hover:text-purple-300'>Sign In</span>
                  </Button>
                ) : (
                  <Button
                    variant='link'
                    size='sm'
                    onClick={() => setIsSignUp(true)}
                    className='text-gray-400 transition-colors duration-200 hover:text-white'
                  >
                    <span className=''>Need an admin account? </span>
                    <span className='ml-1 text-purple-400 underline hover:text-purple-300'>Create Account</span>
                  </Button>
                )}
              </div>
            )}
            {/* Navigation to user login */}
            <div className='border-t border-gray-700/50 pt-4'>
              <Button
                variant='link'
                size='sm'
                onClick={() => navigate({ to: '/user/login' })}
                className='w-full text-blue-400 transition-colors duration-200 hover:text-blue-300'
              >
                <svg className='mr-2 h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                </svg>
                Switch to User Login
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function Error({ message }: { message: string }) {
  return message ? (
    <div className='w-full rounded-lg border border-red-500/20 bg-red-500/10 p-3'>
      <div className='flex items-center gap-2 text-sm text-red-400'>
        <svg className='h-4 w-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  ) : null;
}
