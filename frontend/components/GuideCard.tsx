'use client';

import Link from 'next/link';
import { User } from '@/types';
import { StarIcon, MapPinIcon, GlobeAltIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';

interface GuideCardProps {
  guide: User;
}

const GuideCard = ({ guide }: GuideCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-secondary-300'
        }`}
      />
    ));
  };

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Guide Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
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
        
        {/* Rating Badge */}
        {guide.rating && (
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center space-x-1">
            {renderStars(guide.rating)}
            <span className="text-sm font-medium text-secondary-700 ml-1">
              {guide.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Guide Info */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-secondary-900 mb-1">
            {guide.name}
          </h3>
          
          {/* Location */}
          {guide.locations && guide.locations.length > 0 && (
            <div className="flex items-center text-secondary-600 mb-2">
              <MapPinIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{guide.locations.join(', ')}</span>
            </div>
          )}

          {/* Languages */}
          {guide.languages && guide.languages.length > 0 && (
            <div className="flex items-center text-secondary-600 mb-3">
              <GlobeAltIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">{guide.languages.slice(0, 2).join(', ')}</span>
              {guide.languages.length > 2 && (
                <span className="text-sm text-secondary-500 ml-1">
                  +{guide.languages.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {guide.bio && (
            <p className="text-secondary-600 text-sm line-clamp-2 mb-3">
              {guide.bio}
            </p>
          )}
        </div>

        {/* Price and Experience */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-sm font-medium text-secondary-700">
              ${guide.pricePerHour}/hour
            </span>
          </div>
          
          {guide.experienceYears && (
            <div className="text-sm text-secondary-600">
              {guide.experienceYears} years exp.
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/guides/${guide._id}`}
          className="btn-primary w-full text-center"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default GuideCard; 