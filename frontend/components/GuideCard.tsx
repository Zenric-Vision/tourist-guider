'use client';

import Link from 'next/link';
import { User } from '@/types';
import { 
  StarIcon, 
  MapPinIcon, 
  GlobeAltIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/solid';

interface GuideCardProps {
  guide: User;
}

const GuideCard = ({ guide }: GuideCardProps) => {
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

  const getPriceDisplay = () => {
    if (guide.pricePerHour) return `₹${guide.pricePerHour}/hour`;
    if (guide.pricePerDay) return `₹${guide.pricePerDay}/day`;
    if (guide.pricePerTour) return `₹${guide.pricePerTour}/tour`;
    return 'Contact for pricing';
  };

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Guide Image */}
      <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
        {guide.profilePicture ? (
          <img
            src={guide.profilePicture}
            alt={guide.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-4xl font-bold">
              {guide.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Verification Badge */}
        {guide.isVerified && (
          <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
            <CheckBadgeIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-gray-700">Verified</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {guide.rating && (
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
            {renderStars(guide.rating)}
            <span className="text-sm font-medium text-gray-700 ml-1">
              {guide.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {guide.isFeatured && (
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured Guide
          </div>
        )}
      </div>

      {/* Guide Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {guide.name}
          </h3>
          
          {/* Location */}
          {guide.indianCities && guide.indianCities.length > 0 && (
            <div className="flex items-center text-gray-600 mb-2">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{guide.indianCities.join(', ')}</span>
            </div>
          )}

          {/* Languages */}
          {guide.indianLanguages && guide.indianLanguages.length > 0 && (
            <div className="flex items-center text-gray-600 mb-3">
              <GlobeAltIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{guide.indianLanguages.slice(0, 2).join(', ')}</span>
              {guide.indianLanguages.length > 2 && (
                <span className="text-sm text-gray-500 ml-1">
                  +{guide.indianLanguages.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Tour Types */}
          {guide.tourTypes && guide.tourTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {guide.tourTypes.slice(0, 3).map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                >
                  {type}
                </span>
              ))}
              {guide.tourTypes.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{guide.tourTypes.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Specializations */}
          {guide.specializations && guide.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {guide.specializations.slice(0, 2).map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {spec}
                </span>
              ))}
              {guide.specializations.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{guide.specializations.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {guide.bio && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {guide.bio}
            </p>
          )}
        </div>

        {/* Stats and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm font-medium text-gray-700">
              {getPriceDisplay()}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {guide.experienceYears && (
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>{guide.experienceYears} years</span>
              </div>
            )}
            {guide.totalTours && (
              <div className="flex items-center">
                <UsersIcon className="w-4 h-4 mr-1" />
                <span>{guide.totalTours} tours</span>
              </div>
            )}
          </div>
        </div>

        {/* Response Time */}
        {guide.responseTime && (
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Response time:</span> {guide.responseTime} hours
          </div>
        )}

        {/* Action Button */}
        <Link
          href={`/guides/${guide._id}`}
          className="btn-primary w-full text-center group-hover:bg-orange-700 transition-colors duration-200"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default GuideCard; 