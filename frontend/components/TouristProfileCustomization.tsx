'use client';

import { useState } from 'react';
import { User, TravelPreferences } from '@/types';
import { usersAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface TouristProfileCustomizationProps {
  tourist: User;
  onUpdate: (tourist: User) => void;
}

export default function TouristProfileCustomization({ tourist, onUpdate }: TouristProfileCustomizationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TravelPreferences>({
    travelStyle: tourist.travelStyle || '',
    preferredCategories: tourist.preferredCategories || [],
    travelPreferences: tourist.travelPreferences || '',
    city: tourist.city || '',
  });

  const travelStyles = [
    'Adventure',
    'Cultural',
    'Relaxation',
    'Wildlife',
    'Spiritual',
    'Food & Culinary',
    'Photography',
    'Historical',
    'Nature',
    'Shopping',
  ];

  const travelCategories = [
    'Historical Monuments',
    'Beach Destinations',
    'Hill Stations',
    'Spiritual Sites',
    'Wildlife Sanctuaries',
    'Adventure Sports',
    'Cultural Festivals',
    'Museums & Galleries',
    'National Parks',
    'Urban Exploration',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const updatedTourist = await usersAPI.updateTravelPreferences(formData);
      onUpdate(updatedTourist);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    const current = formData.preferredCategories || [];
    if (current.includes(category)) {
      setFormData({
        ...formData,
        preferredCategories: current.filter(c => c !== category),
      });
    } else {
      setFormData({
        ...formData,
        preferredCategories: [...current, category],
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Customization</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {tourist.profilePictureUrl ? (
                <img 
                  src={tourist.profilePictureUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Style
          </label>
          <select
            value={formData.travelStyle}
            onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select your travel style</option>
            {travelStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        {/* Preferred Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Categories
          </label>
          <div className="grid grid-cols-2 gap-3">
            {travelCategories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.preferredCategories?.includes(category) || false}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Travel Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Preferences
          </label>
          <textarea
            value={formData.travelPreferences}
            onChange={(e) => setFormData({ ...formData, travelPreferences: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Tell us about your travel preferences (e.g., Love adventure and cultural tours, prefer small group experiences, interested in local cuisine)"
          />
          <p className="mt-1 text-xs text-gray-500">50-100 words recommended</p>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select your city</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Pune">Pune</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Varanasi">Varanasi</option>
            <option value="Goa">Goa</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      {/* Badges Display */}
      {tourist.badges && tourist.badges.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Badges</h3>
          <div className="flex flex-wrap gap-2">
            {tourist.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tour Points Display */}
      {tourist.tourPoints && tourist.tourPoints > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Tour Points</span>
            <span className="text-lg font-bold text-blue-600">{tourist.tourPoints}</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((tourist.tourPoints / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
