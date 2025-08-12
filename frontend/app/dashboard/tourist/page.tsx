'use client';

import { useQuery } from 'react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { bookingsAPI, reviewsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth';
import { StarIcon, CalendarIcon, MapPinIcon, ClockIcon, UserIcon } from '@heroicons/react/24/solid';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function TouristDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if not logged in or not a tourist
  useEffect(() => {
    if (!user || user.role !== 'tourist') {
      setIsRedirecting(true);
      router.push('/auth/login');
    }
  }, [user, router]);

  // Call all hooks consistently
  const { data: bookings, isLoading: bookingsLoading } = useQuery(
    ['bookings', 'tourist'],
    () => bookingsAPI.getMyBookings('tourist'),
    {
      enabled: !!user && user.role === 'tourist',
    }
  );

  const { data: reviews, isLoading: reviewsLoading } = useQuery(
    ['reviews', 'tourist'],
    () => reviewsAPI.getByTourist(user?._id || ''),
    {
      enabled: !!user && user.role === 'tourist',
    }
  );

  const upcomingBookings = bookings?.filter(booking => 
    new Date(booking.startDate) > new Date() && booking.status !== 'cancelled'
  ) || [];

  const pastBookings = bookings?.filter(booking => 
    new Date(booking.startDate) <= new Date() || booking.status === 'cancelled'
  ) || [];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Show loading or redirect state
  if (isRedirecting || !user || user.role !== 'tourist') {
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

  if (bookingsLoading) {
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
            Welcome back, {user.name}!
          </h1>
          <p className="text-secondary-600">
            Manage your bookings and reviews
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <CalendarIcon className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Upcoming Tours</p>
                <p className="text-2xl font-bold text-secondary-900">{upcomingBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Completed Tours</p>
                <p className="text-2xl font-bold text-secondary-900">{pastBookings.length}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <StarIcon className="w-8 h-8 text-primary-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-secondary-600">Reviews Given</p>
                <p className="text-2xl font-bold text-secondary-900">{reviews?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-secondary-900">My Bookings</h2>
            <button
              onClick={() => router.push('/guides')}
              className="btn-primary"
            >
              Book New Tour
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-secondary-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Upcoming ({upcomingBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                Past ({pastBookings.length})
              </button>
            </nav>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).map((booking) => (
              <div key={booking._id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-secondary-900">
                        Tour with {booking.guide?.name || 'Guide'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-600">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {booking.place}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        {booking.durationHours} hours
                      </div>
                    </div>

                    {booking.specialRequests && (
                      <p className="text-sm text-secondary-600 mt-2">
                        <strong>Special Requests:</strong> {booking.specialRequests}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className="font-medium text-secondary-900">
                      ${booking.price}
                    </span>
                    <button
                      onClick={() => router.push(`/bookings/${booking._id}`)}
                      className="p-2 text-secondary-400 hover:text-secondary-600"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 && (
              <div className="text-center py-8">
                <p className="text-secondary-600">
                  {activeTab === 'upcoming' 
                    ? "You don't have any upcoming tours. Book your first tour now!"
                    : "You haven't completed any tours yet."
                  }
                </p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => router.push('/guides')}
                    className="btn-primary mt-4"
                  >
                    Browse Guides
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-secondary-900 mb-6">My Reviews</h2>
          
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-medium text-secondary-900">
                        Review for {review.guide?.name || 'Guide'}
                      </span>
                    </div>
                    <span className="text-sm text-secondary-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-secondary-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-600">You haven't written any reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 