'use client';

import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { UserIcon, CalendarIcon, StarIcon, CurrencyDollarIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { EyeIcon, BanIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'bookings' | 'reviews'>('users');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setIsRedirecting(true);
      router.push('/auth/login');
    }
  }, [user, router]);

  // Call all hooks consistently
  const { data: users, isLoading: usersLoading } = useQuery(
    ['admin', 'users'],
    () => adminAPI.getAllUsers(),
    {
      enabled: !!user && user.role === 'admin',
    }
  );

  const tourists = users?.filter(u => u.role === 'tourist') || [];
  const guides = users?.filter(u => u.role === 'guide') || [];
  const activeUsers = users?.filter(u => u.isActive) || [];
  const suspendedUsers = users?.filter(u => !u.isActive) || [];

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await adminAPI.updateUserStatus(userId, isActive);
      // Refetch users
      window.location.reload();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Show loading or redirect state
  if (isRedirecting || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-secondary-600">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (usersLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-secondary-200 h-8 rounded mb-4"></div>
            <div className="bg-secondary-200 h-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-secondary-600">
            Manage users, bookings, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Users</p>
                <p className="text-2xl font-bold text-secondary-900">{users?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Tourists</p>
                <p className="text-2xl font-bold text-secondary-900">{tourists.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Guides</p>
                <p className="text-2xl font-bold text-secondary-900">{guides.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <ShieldExclamationIcon className="w-8 h-8 text-red-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Suspended Users</p>
                <p className="text-2xl font-bold text-secondary-900">{suspendedUsers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-900">User Management</h2>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                All Users ({users?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Users List */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {users?.map((user) => (
                <div key={user._id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-secondary-900">{user.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'guide'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary-600">
                        <div>
                          <strong>Email:</strong> {user.email}
                        </div>
                        <div>
                          <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        {user.phoneNumber && (
                          <div>
                            <strong>Phone:</strong> {user.phoneNumber}
                          </div>
                        )}
                        {user.role === 'guide' && user.rating && (
                          <div>
                            <strong>Rating:</strong> {user.rating.toFixed(1)} ⭐
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => router.push(`/admin/users/${user._id}`)}
                        className="p-2 text-secondary-400 hover:text-secondary-600"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(user._id, !user.isActive)}
                          className={`p-2 ${
                            user.isActive 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={user.isActive ? 'Suspend User' : 'Activate User'}
                        >
                          {user.isActive ? (
                            <BanIcon className="w-5 h-5" />
                          ) : (
                            <CheckIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!users || users.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-secondary-600">No users found.</p>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="text-center py-8">
              <p className="text-secondary-600">Bookings management coming soon...</p>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="text-center py-8">
              <p className="text-secondary-600">Reviews management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 