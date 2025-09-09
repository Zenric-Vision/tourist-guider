'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { UserCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Find Guides', href: '/guides' },
    ...(isAuthenticated && user?.userType === 'traveler' ? [{ name: 'My Bookings', href: '/dashboard/tourist' }] : []),
    ...(isAuthenticated && user?.userType === 'guider' ? [{ name: 'Dashboard', href: '/dashboard/guide' }] : []),
    ...(isAuthenticated && user?.role === 'admin' ? [{ name: 'Admin Panel', href: '/admin' }] : []),
  ];

  return (
    <header className="bg-white shadow-soft border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-orange-pink rounded-2xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-neutral-900">TourMate</span>
                <span className="text-sm text-neutral-500 -mt-1">Incredible India</span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-18 0 7 7 0 0118 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search destinations, guides, experiences..."
                className="block w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-neutral-50 hover:bg-white focus:bg-white"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language & Currency */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                EN
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button className="flex items-center text-neutral-600 hover:text-neutral-900 transition-colors duration-200">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                INR
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link href="/guides" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors duration-200">
                Become a Guide
              </Link>
              <Link href="/help" className="text-neutral-600 hover:text-neutral-900 text-sm font-medium transition-colors duration-200">
                Help
              </Link>
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {user?.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.firstName || user.showcaseName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-orange-pink rounded-full flex items-center justify-center">
                      <UserCircleIcon className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="hidden lg:block">
                    <div className="text-sm font-semibold text-neutral-900">
                      {user?.firstName || user?.showcaseName}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {user?.userType === 'traveler' ? 'Traveler' : 'Guide'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-2xl hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-500/30 text-sm font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth/login" 
                  className="text-neutral-700 hover:text-neutral-900 text-sm font-medium transition-colors duration-200"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-gradient-orange-pink text-white px-6 py-3 rounded-2xl hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-500/30 font-semibold text-sm transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-700 hover:text-primary-600 p-2 rounded-2xl hover:bg-neutral-100 transition-all duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-neutral-200 bg-white rounded-b-3xl shadow-medium">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-18 0 7 7 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search destinations, guides, experiences..."
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-700 hover:text-primary-600 block px-3 py-3 text-base font-medium hover:bg-neutral-50 rounded-2xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Additional Mobile Links */}
              <div className="px-3 py-2 space-y-2">
                <Link
                  href="/guides"
                  className="text-neutral-700 hover:text-primary-600 block py-2 text-base font-medium hover:bg-neutral-50 rounded-2xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Guide
                </Link>
                <Link
                  href="/help"
                  className="text-neutral-700 hover:text-primary-600 block py-2 text-base font-medium hover:bg-neutral-50 rounded-2xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Help
                </Link>
              </div>
              
              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-neutral-200 px-3">
                  <div className="flex items-center py-3">
                    {user?.profilePictureUrl ? (
                      <img
                        src={user.profilePictureUrl}
                        alt={user.firstName || user.showcaseName}
                        className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-neutral-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-orange-pink rounded-full flex items-center justify-center mr-3">
                        <UserCircleIcon className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        {user?.firstName || user?.showcaseName}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {user?.userType === 'traveler' ? 'Traveler' : 'Guide'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-neutral-700 hover:text-primary-600 block py-3 text-base font-medium hover:bg-neutral-50 rounded-2xl transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-neutral-200 px-3 space-y-3">
                  <Link
                    href="/auth/login"
                    className="text-neutral-700 hover:text-primary-600 block py-3 text-base font-medium hover:bg-neutral-50 rounded-2xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-gradient-orange-pink text-white block text-center py-3 rounded-2xl font-semibold text-base transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 