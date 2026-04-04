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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

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
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="w-full flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Category Filter */}
              <select className="px-4 py-2.5 text-sm bg-gray-50 border-r border-gray-200 text-gray-700 focus:outline-none cursor-pointer hover:bg-gray-100">
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="farming">Farming</option>
                <option value="clothes">Clothes</option>
                <option value="electronics">Electronics</option>
                <option value="cosmetics">Cosmetics</option>
                <option value="books">Books</option>
                <option value="home">Home</option>
              </select>
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search products by name, seller..."
                className="flex-1 px-4 py-2.5 text-sm border-0 focus:outline-none focus:ring-0 placeholder-gray-500"
              />
              
              {/* Search Button */}
              <button className="px-6 py-2.5 bg-green-600 text-white hover:bg-green-700 font-semibold flex items-center gap-2 transition-colors active:bg-green-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
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

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="text-white hover:text-green-200 focus:outline-none p-1.5"
              title="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile Cart Icon */}
            <Link href="/cart" className="relative p-1.5">
              <svg className="w-6 h-6 text-white hover:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-200 focus:outline-none p-1.5"
              title="Menu"
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

        {/* Mobile Search Bar - Toggle Expand (Industry Standard) */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-3 py-3 bg-green-700 border-t border-green-500 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                autoFocus
                className="flex-1 px-4 py-2.5 text-sm bg-white border-2 border-transparent rounded-lg focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-200 placeholder-gray-500 transition-all"
              />
              <button className="px-4 py-2.5 bg-green-800 text-white rounded-lg hover:bg-green-900 font-semibold flex items-center justify-center gap-1 transition-colors active:bg-green-950">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        )}

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