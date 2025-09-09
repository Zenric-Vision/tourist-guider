'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState<'traveler' | 'guider'>('traveler');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<any>(null);
  const [otp, setOtp] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setMessage('');

    try {
      console.log('Attempting login with:', { userType, data });
      
      let response;
      
      if (userType === 'traveler') {
        response = await authAPI.loginTraveler(data);
      } else {
        response = await authAPI.loginGuider(data);
      }

      console.log('Login response:', response);

      // Check if user needs verification
      if (response.requiresVerification) {
        setUnverifiedUser(response.data);
        setShowOtpVerification(true);
        
        // Show appropriate message based on whether new OTP was sent
        if (response.otpSent) {
          setMessage('Account not verified. A new OTP has been sent to your email. Please verify to complete registration.');
        } else {
          setMessage('Account not verified. Please verify your OTP to complete registration.');
        }
        return;
      }

      // Store user data and token for verified users
      if (response.token && response.data) {
        login(response.data, response.token);
      }
      
      setMessage('Login successful! Redirecting...');
      
      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'traveler') {
          router.push('/dashboard/tourist');
        } else {
          router.push('/dashboard/guide');
        }
      }, 1500);
    } catch (error: any) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndCompleteLogin = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Verify OTP and complete registration
      const response = await authAPI.verifyOtpAndCompleteRegistration({
        email: unverifiedUser.email,
        otp,
      });

      // Store user data and token
      if (response.token && response.data) {
        login(response.data, response.token);
      }
      
      setMessage('Account verified successfully! Login completed. Redirecting...');
      
      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'traveler') {
          router.push('/dashboard/tourist');
        } else {
          router.push('/dashboard/guide');
        }
      }, 1500);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      await authAPI.resendOtpForTraveler({
        email: unverifiedUser.email,
        userName: `${unverifiedUser.firstName} ${unverifiedUser.lastName}`,
        actionType: 'login'
      });
      setMessage('OTP resent successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-large p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Sign in to your TourMate account</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm ${
            message.includes('successful') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* User Type Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setUserType('traveler')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              userType === 'traveler'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Traveler
          </button>
          <button
            type="button"
            onClick={() => setUserType('guider')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
              userType === 'guider'
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Guider
          </button>
        </div>

        {!showOtpVerification ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="john@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                Remember me
              </label>
            </div>
            <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-orange-pink text-white py-4 px-6 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h3>
              <p className="text-gray-600">
                {message.includes('new OTP') 
                  ? 'A new 6-digit OTP has been sent to' 
                  : 'We\'ve sent a 6-digit OTP to'
                } <span className="font-medium">{unverifiedUser?.email}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP *
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={verifyOtpAndCompleteLogin}
                disabled={isLoading || otp.length !== 6}
                className="flex-1 bg-gradient-orange-pink text-white py-4 px-6 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify & Complete Login'}
              </button>
              <button
                onClick={resendOtp}
                disabled={isLoading}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend
              </button>
            </div>

            <button
              onClick={() => {
                setShowOtpVerification(false);
                setUnverifiedUser(null);
                setOtp('');
              }}
              className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              ← Back to login
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
