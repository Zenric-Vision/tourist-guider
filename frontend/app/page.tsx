'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import TourSamples from '@/components/TourSamples';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-sunset opacity-90"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Banner */}
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-white font-medium text-sm">India's #1 Local Guide Platform</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Discover{' '}
            <span className="text-yellow-300">Incredible India</span>{' '}
            with Local Experts
          </h1>
          
          {/* Sub-headline */}
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with verified local guides across India. From the majestic Taj Mahal to serene Kerala backwaters, 
            create unforgettable memories with authentic experiences.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/guides"
              className="group bg-white text-primary-600 px-8 py-4 rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-white/30 font-semibold text-lg transition-all duration-300 shadow-soft hover:shadow-medium"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Explore Tours
              </span>
            </Link>
            <Link
              href="/auth/signup"
              className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 font-semibold text-lg transition-all duration-300 border border-white/30"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </span>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80 font-medium">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">2.5K+</div>
                <div className="text-white/80 font-medium">Verified Guides</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">4.8★</div>
                <div className="text-white/80 font-medium">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 -mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-large p-8 border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Delhi, Mumbai, Goa..."
                  className="block w-full pl-10 pr-3 py-4 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="block w-full pl-10 pr-3 py-4 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="1 Person"
                  className="block w-full pl-10 pr-3 py-4 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <button className="bg-gradient-orange-pink text-white px-8 py-4 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-lg transition-all duration-300 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Samples Section */}
      <TourSamples />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
              Why Choose TourMate?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Your trusted platform for authentic local experiences across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-accent-blue-50 hover:to-accent-blue-100 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-blue-500 to-accent-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Verified Guides</h3>
              <p className="text-neutral-600 leading-relaxed">
                All guides undergo thorough verification and KYC processes for your safety and trust.
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-accent-green-50 hover:to-accent-green-100 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-green-500 to-accent-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Local Expertise</h3>
              <p className="text-neutral-600 leading-relaxed">
                Connect with local experts who know the hidden gems and authentic experiences.
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl hover:bg-gradient-to-br hover:from-accent-purple-50 hover:to-accent-purple-100 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-purple-500 to-accent-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">Best Prices</h3>
              <p className="text-neutral-600 leading-relaxed">
                Get competitive prices directly from guides, with no hidden fees or commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-orange-pink">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join thousands of travelers who have discovered amazing experiences with our verified guides.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/signup"
              className="group bg-white text-primary-600 px-10 py-5 rounded-2xl hover:shadow-large focus:outline-none focus:ring-4 focus:ring-white/30 font-semibold text-lg transition-all duration-300"
            >
              Create Free Account
            </Link>
            <Link
              href="/auth/login"
              className="group bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/30 font-semibold text-lg border border-white/30 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 