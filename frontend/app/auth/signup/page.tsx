'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().optional(),
  city: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const watchedPassword = watch('password');

  const getPasswordStrength = (password: string | undefined) => {
    if (!password || password.length === 0) return { strength: 0, color: 'bg-gray-200', text: '' };
    if (password.length < 8) return { strength: 1, color: 'bg-red-500', text: 'Too short' };
    
    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { strength: 2, color: 'bg-red-500', text: 'Weak' };
    if (score <= 2) return { strength: 3, color: 'bg-yellow-500', text: 'Fair' };
    if (score <= 3) return { strength: 4, color: 'bg-blue-500', text: 'Good' };
    return { strength: 5, color: 'bg-green-500', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setMessage('');

    try {
      // Register user and send OTP in one call
      const response = await authAPI.registerTraveler({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile || undefined,
        city: data.city || '',
        password: data.password,
      });
      
      setOtpSent(true);
      setShowOtpInput(true);
      setMessage('Registration successful! OTP sent to your email. Please verify to complete registration.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Verify OTP and complete registration in one call
      const response = await authAPI.verifyOtpAndCompleteRegistration({
        email: watch('email'),
        otp,
      });
      
      setMessage('Account verified successfully! Registration completed. Redirecting to home...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
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
        email: watch('email'),
        userName: `${watch('firstName')} ${watch('lastName')}`,
        actionType: 'registration'
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
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Benefits */}
        <div className="text-white space-y-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Join TourMate Community
            </h1>
            <p className="text-xl text-secondary-100">
              Connect with verified local guides and discover authentic travel experiences across India.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Verified Local Guides</h3>
                <p className="text-secondary-100">All our guides are thoroughly verified and background-checked for your safety.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Authentic Experiences</h3>
                <p className="text-secondary-100">Discover hidden gems and local culture that you won't find in guidebooks.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Best Price Guarantee</h3>
                <p className="text-secondary-100">Get the best rates directly from local guides, no middleman fees.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Signup Form */}
        <div className="bg-white rounded-3xl shadow-large p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join thousands of travelers discovering amazing experiences</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-2xl text-sm ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {!showOtpInput ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number (Optional)
                </label>
                <input
                  {...register('mobile')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="+91 98765 43210"
                />
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City (Optional)
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                
                {/* Password Strength Indicator */}
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-200 ${
                          i < passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {watchedPassword && (
                    <p className={`text-sm mt-1 ${
                      passwordStrength.strength <= 2 ? 'text-red-600' :
                      passwordStrength.strength <= 3 ? 'text-yellow-600' :
                      passwordStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <label className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-orange-pink text-white py-4 px-6 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP & Continue'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-gray-600">
                  We've sent a 6-digit OTP to <span className="font-medium">{watch('email')}</span>
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
                  onClick={verifyOtp}
                  disabled={isLoading || otp.length !== 6}
                  className="flex-1 bg-gradient-orange-pink text-white py-4 px-6 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Create Account'}
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
                onClick={() => setShowOtpInput(false)}
                className="w-full text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
              >
                ← Back to form
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 