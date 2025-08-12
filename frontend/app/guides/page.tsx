'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import GuideCard from '@/components/GuideCard';
import { guidesAPI } from '@/lib/api';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function GuidesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  // Parse search params
  const location = searchParams.get('location') || '';
  const date = searchParams.get('date') || '';
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
  const languages = searchParams.getAll('languages');

  const { data, isLoading, error } = useQuery(
    ['guides', { location, date, minPrice, maxPrice, languages, page: currentPage }],
    () => guidesAPI.search({
      location,
      date,
      minPrice,
      maxPrice,
      languages,
      page: currentPage,
      limit: 12,
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleSearch = (params: any) => {
    setCurrentPage(1);
    const queryString = new URLSearchParams(params).toString();
    router.push(`/guides?${queryString}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/guides?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Find Your Perfect Guide
          </h1>
          <SearchBar onSearch={handleSearch} initialValues={{ location, date, minPrice, maxPrice, languages }} />
        </div>

        {/* Results */}
        <div className="mb-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-secondary-600">Searching for guides...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading guides. Please try again.</p>
            </div>
          ) : data?.guides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-600">No guides found matching your criteria.</p>
              <button
                onClick={() => router.push('/guides')}
                className="mt-4 btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-secondary-600">
                  Found {data?.total} guides
                  {data?.totalPages > 1 && ` (Page ${currentPage} of ${data?.totalPages})`}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data?.guides.map((guide) => (
                  <GuideCard key={guide._id} guide={guide} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border ${
                          currentPage === page
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-secondary-300 hover:bg-secondary-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === data.totalPages}
                    className="p-2 rounded-lg border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 