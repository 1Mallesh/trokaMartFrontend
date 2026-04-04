"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useCartStore } from "@/store/cartStore";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin, isSeller } = useRole();
  const { getItemCount } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="bg-green-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center text-white text-2xl font-bold hover:text-green-200">
              <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              TrokaMart
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="px-4 py-2 bg-green-700 text-white rounded-r-md hover:bg-green-800">
              Search
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/products" className="text-white hover:text-green-200">
              Products
            </Link>
            <Link href="/categories" className="text-white hover:text-green-200">
              Categories
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-white hover:text-green-200 flex items-center">
                  Hello, {user?.name || "User"}
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Account
                  </Link>
                  <Link href="/forgot-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Reset Password
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Orders
                  </Link>
                  {isSeller && (
                    <Link href="/dashboard/listings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Your Listings
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-white hover:text-green-200"
                >
                  Sign In
                </button>
                <span className="text-green-300">|</span>
                <Link href="/register" className="text-white hover:text-green-200">
                  Register
                </Link>
              </div>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-white hover:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-green-700 text-white rounded-r-md hover:bg-green-800">
              Search
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-500 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/products" className="text-white hover:text-green-200 py-2">
                Products
              </Link>
              <Link href="/categories" className="text-white hover:text-green-200 py-2">
                Categories
              </Link>
              <Link href="/cart" className="text-white hover:text-green-200 py-2 flex items-center">
                Cart
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-white hover:text-green-200 py-2">
                    Your Account
                  </Link>
                  <Link href="/forgot-password" className="text-white hover:text-green-200 py-2">
                    Reset Password
                  </Link>
                  <Link href="/orders" className="text-white hover:text-green-200 py-2">
                    Your Orders
                  </Link>
                  {isSeller && (
                    <Link href="/dashboard/listings" className="text-white hover:text-green-200 py-2">
                      Your Listings
                    </Link>
                  )}
                  {isAdmin && (
                    <Link href="/admin/dashboard" className="text-white hover:text-green-200 py-2">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-left text-white hover:text-green-200 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex space-x-4 py-2">
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-white hover:text-green-200"
                  >
                    Sign In
                  </button>
                  <Link href="/register" className="text-white hover:text-green-200">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}