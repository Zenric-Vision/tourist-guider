'use client';

import { TourSample } from '@/types';
import Link from 'next/link';

const tourSamples: TourSample[] = [
  {
    id: '1',
    title: 'Taj Mahal Sunrise & Agra Fort Explorer',
    description: 'Experience the magic of Taj Mahal at sunrise with a certified guide. Includes Agra Fort and local cuisine.',
    image: '/images/taj-mahal.jpg',
    startingPrice: 5999,
    location: 'Agra, Uttar Pradesh',
    duration: '3 Days',
    category: 'Golden Triangle Tour',
  },
  {
    id: '2',
    title: 'Alleppey Houseboat & Village Experience',
    description: 'Cruise through serene backwaters on traditional houseboat. Authentic Kerala cuisine and village interactions.',
    image: '/images/kerala-backwaters.jpg',
    startingPrice: 8499,
    location: 'Kerala',
    duration: '2 Days',
    category: 'Kerala Backwaters',
  },
  {
    id: '3',
    title: 'North Goa Beaches & Nightlife Tour',
    description: 'Explore pristine beaches, beach shacks, water sports, and vibrant nightlife of North Goa with local insights.',
    image: '/images/goa-beaches.jpg',
    startingPrice: 12999,
    location: 'Goa',
    duration: '4 Days',
    category: 'Goa Beach Paradise',
  },
];

export default function TourSamples() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Featured Tours & Experiences
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Handpicked experiences by our travel experts. Book now or try our demo booking flow!
          </p>
        </div>

        {/* Demo Booking Button */}
        <div className="text-center mb-16">
          <button className="group bg-gradient-orange-pink text-white px-12 py-6 rounded-3xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-xl transition-all duration-300 shadow-soft hover:shadow-large">
            <span className="flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              Try Demo Booking Flow
            </span>
            <div className="block text-sm font-normal mt-1 opacity-90">
              Experience the booking process without payment
            </div>
          </button>
        </div>

        {/* Tour Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {tourSamples.map((tour, index) => (
            <div key={tour.id} className="group bg-white rounded-3xl shadow-soft hover:shadow-large overflow-hidden transition-all duration-300 border border-neutral-200">
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold text-center px-4">{tour.title}</span>
                </div>
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    index === 0 ? 'bg-primary-500 text-white' :
                    index === 1 ? 'bg-accent-green-500 text-white' :
                    'bg-accent-blue-500 text-white'
                  }`}>
                    {index === 0 ? 'Popular' : index === 1 ? 'Eco-Tour' : 'Beach'}
                  </span>
                </div>
                
                {/* Heart Icon */}
                <div className="absolute top-4 right-4">
                  <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
                    <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                {/* Rating */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center bg-white/90 rounded-full px-3 py-1">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-neutral-700">
                      {index === 0 ? '4.9 (234)' : index === 1 ? '4.8 (189)' : '4.7 (156)'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                {/* Category and Duration */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-500 font-medium">{tour.category}</span>
                  <span className="text-sm text-accent-green-600 font-semibold">{tour.duration}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 mb-3 leading-tight">{tour.title}</h3>
                
                {/* Description */}
                <p className="text-neutral-600 mb-4 leading-relaxed">{tour.description}</p>
                
                {/* Guide Info */}
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-blue-500 to-accent-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-semibold">
                      {index === 0 ? 'RK' : index === 1 ? 'PN' : 'MD'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {index === 0 ? 'Rajesh Kumar' : index === 1 ? 'Priya Nair' : 'Marcus D\'Souza'}
                    </div>
                    <div className="flex items-center text-xs text-neutral-600">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        index === 0 ? 'bg-accent-blue-500' : index === 1 ? 'bg-accent-green-500' : 'bg-accent-blue-500'
                      }`}></span>
                      {index === 0 ? 'Verified Pro Guide' : index === 1 ? 'Local Expert' : 'Beach Expert'}
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-neutral-900">₹{tour.startingPrice.toLocaleString()}</span>
                    <span className="text-sm text-neutral-500 ml-2">per person</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-white text-primary-600 border border-primary-200 py-3 px-4 rounded-2xl hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-medium transition-all duration-200">
                    View Details
                  </button>
                  <button className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-2xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-medium transition-all duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-3xl p-12 max-w-4xl mx-auto border border-neutral-200">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing experiences with our verified guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-gradient-orange-pink text-white px-8 py-4 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                href="/auth/login"
                className="bg-white text-primary-600 border border-primary-200 px-8 py-4 rounded-2xl hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
