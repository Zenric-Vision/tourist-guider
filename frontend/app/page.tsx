'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import GuideCard from '@/components/GuideCard';
import { useQuery } from 'react-query';
import { guidesAPI } from '@/lib/api';
import { StarIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: '',
    date: '',
    minPrice: undefined,
    maxPrice: undefined,
    languages: [],
    page: 1,
    limit: 6,
  });

  const { data: featuredGuides, isLoading } = useQuery(
    ['featured-guides', searchParams],
    () => guidesAPI.search({ ...searchParams, limit: 6 }),
    {
      keepPreviousData: true,
    }
  );

  const handleSearch = (params: any) => {
    setSearchParams(params);
    router.push(`/guides?${new URLSearchParams(params).toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Discover Amazing
              <span className="text-primary-600"> Local Guides</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Connect with experienced local guides who will show you the hidden gems and authentic experiences of your destination.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Choose TourMate?
            </h2>
            <p className="text-lg text-secondary-600">
              Experience destinations like a local with our trusted guides
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Local Expertise
              </h3>
              <p className="text-secondary-600">
                Our guides are locals who know every hidden corner and authentic experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Verified & Rated
              </h3>
              <p className="text-secondary-600">
                All guides are verified and rated by previous travelers for quality assurance.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Multiple Languages
              </h3>
              <p className="text-secondary-600">
                Find guides who speak your language for a more comfortable experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Featured Guides
            </h2>
            <p className="text-lg text-secondary-600">
              Meet some of our top-rated local guides
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="bg-secondary-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-secondary-200 h-4 rounded mb-2"></div>
                  <div className="bg-secondary-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGuides?.guides.map((guide) => (
                <GuideCard key={guide._id} guide={guide} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/guides')}
              className="btn-primary"
            >
              View All Guides
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of travelers who have discovered amazing destinations with local guides.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/auth/signup')}
              className="bg-white text-primary-600 hover:bg-primary-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Sign Up Now
            </button>
            <button
              onClick={() => router.push('/guides')}
              className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Browse Guides
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 