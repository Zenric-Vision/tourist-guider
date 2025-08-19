'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { toast } from 'react-hot-toast';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // Store user and token
        login(user, token);
        
        toast.success('Login successful!');
        
        // Redirect based on user role
        if (user.role === 'tourist') {
          router.push('/dashboard/tourist');
        } else if (user.role === 'guide') {
          router.push('/dashboard/guide');
        } else if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Login failed. Please try again.');
        router.push('/auth/login');
      }
    } else {
      toast.error('Authentication failed. Please try again.');
      router.push('/auth/login');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Completing Login...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
