'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchFormData {
  location: string;
  date: string;
  duration: string;
  minPrice: string;
  maxPrice: string;
  languages: string[];
}

interface SearchBarProps {
  onSearch: (data: any) => void;
  initialValues?: Partial<SearchFormData>;
}

const SearchBar = ({ onSearch, initialValues }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<SearchFormData>({
    defaultValues: {
      location: initialValues?.location || '',
      date: initialValues?.date || '',
      duration: initialValues?.duration || '1',
      minPrice: initialValues?.minPrice || '',
      maxPrice: initialValues?.maxPrice || '',
      languages: initialValues?.languages || [],
    },
  });

  const onSubmit = (data: SearchFormData) => {
    const searchParams = {
      location: data.location,
      date: data.date,
      minPrice: data.minPrice ? parseInt(data.minPrice) : undefined,
      maxPrice: data.maxPrice ? parseInt(data.maxPrice) : undefined,
      languages: data.languages,
      page: 1,
      limit: 12,
    };
    onSearch(searchParams);
  };

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];

  return (
    <div className="card p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="input-field pl-10"
                {...register('location')}
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Date
            </label>
            <input
              type="date"
              className="input-field"
              {...register('date')}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Duration (hours)
            </label>
            <select className="input-field" {...register('duration')}>
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="6">6 hours</option>
              <option value="8">8 hours</option>
              <option value="24">1 day</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Search Guides
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            {isExpanded ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-secondary-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Price Range (per hour)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field"
                    {...register('minPrice')}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field"
                    {...register('maxPrice')}
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Languages
                </label>
                <select
                  multiple
                  className="input-field h-20"
                  {...register('languages')}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setValue('minPrice', '');
                    setValue('maxPrice', '');
                    setValue('languages', []);
                  }}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar; 