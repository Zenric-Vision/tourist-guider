'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useState } from 'react';
import Header from '@/components/Header';
import { guidesAPI, reviewsAPI } from '@/lib/api';
import { StarIcon, MapPinIcon, GlobeAltIcon, CurrencyDollarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function GuideProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const guideId = params.id as string;

  const { data: guide, isLoading: guideLoading } = useQuery(
    ['guide', guideId],
    () => guidesAPI.getById(guideId)
  );

  const { data: reviews, isLoading: reviewsLoading } = useQuery(
    ['reviews', guideId],
    () => reviewsAPI.getByGuide(guideId)
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-secondary-300'
        }`}
      />
    ));
  };

  const handleBookNow = () => {
    if (!guide) return;
    
    // Navigate to booking page with guide info
    router.push(`/booking/checkout?guideId=${guide._id}&date=${selectedDate}&time=${selectedTime}`);
  };

  if (guideLoading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-secondary-200 h-64 rounded-lg mb-6"></div>
            <div className="bg-secondary-200 h-8 rounded mb-4"></div>
            <div className="bg-secondary-200 h-4 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">Guide not found</h1>
            <button
              onClick={() => router.push('/guides')}
              className="btn-primary"
            >
              Back to Guides
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Guide Header */}
        <div className="card p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Guide Image */}
            <div className="md:col-span-1">
              <div className="relative">
                {guide.profilePicture ? (
                  <img
                    src={guide.profilePicture}
                    alt={guide.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {guide.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {guide.rating && (
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center space-x-1">
                    {renderStars(guide.rating)}
                    <span className="text-sm font-medium text-secondary-700 ml-1">
                      {guide.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Guide Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-secondary-900 mb-4">{guide.name}</h1>
              
              {guide.bio && (
                <p className="text-secondary-600 mb-6 leading-relaxed">{guide.bio}</p>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Location */}
                {guide.locations && guide.locations.length > 0 && (
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-secondary-400 mr-2" />
                    <span className="text-secondary-700">{guide.locations.join(', ')}</span>
                  </div>
                )}

                {/* Languages */}
                {guide.languages && guide.languages.length > 0 && (
                  <div className="flex items-center">
                    <GlobeAltIcon className="w-5 h-5 text-secondary-400 mr-2" />
                    <span className="text-secondary-700">{guide.languages.join(', ')}</span>
                  </div>
                )}

                {/* Experience */}
                {guide.experienceYears && (
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 text-secondary-400 mr-2" />
                    <span className="text-secondary-700">{guide.experienceYears} years experience</span>
                  </div>
                )}

                {/* Price */}
                {guide.pricePerHour && (
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-secondary-400 mr-2" />
                    <span className="text-secondary-700">${guide.pricePerHour}/hour</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {guide.phoneNumber && (
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-secondary-400 mr-2" />
                    <span className="text-secondary-700">{guide.phoneNumber}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-secondary-400 mr-2" />
                  <span className="text-secondary-700">{guide.email}</span>
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                className="btn-primary text-lg px-8 py-3"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Reviews</h2>
          
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-secondary-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-medium text-secondary-900">
                        {review.tourist?.name || 'Anonymous'}
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
            <p className="text-secondary-600 text-center py-8">No reviews yet. Be the first to review this guide!</p>
          )}
        </div>

        {/* Availability Section */}
        {guide.availability && guide.availability.length > 0 && (
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Availability</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {guide.availability.map((slot, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <h3 className="font-medium text-secondary-900 mb-2">
                    {new Date(slot.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="space-y-1">
                    {slot.slots.map((time, timeIndex) => (
                      <button
                        key={timeIndex}
                        onClick={() => {
                          setSelectedDate(slot.date);
                          setSelectedTime(time);
                          setShowBookingModal(true);
                        }}
                        className="availability-slot"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-xl font-bold text-secondary-900 mb-4">Book with {guide.name}</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleBookNow}
                disabled={!selectedDate || !selectedTime}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 