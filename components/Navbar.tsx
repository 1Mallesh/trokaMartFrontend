"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useCartStore } from "@/store/cartStore";
import LoginModal from "./LoginModal";
import logo from "@/app/(public)/assets/imges/logo3.png";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin, isSeller } = useRole();
  const { getItemCount } = useCartStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="bg-gray-800 shadow-md sticky top-0 z-50 overflow-x-clip relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-[68px] gap-2">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center min-w-0">
              <Image
                src={logo}
                alt="TrokaMart Logo"
                width={360}
                height={88}
                priority
                
                className=""
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMenuOpen(false);
              }}
              className="text-white hover:text-green-200 p-1.5"
              title="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link href="/products" className="text-white hover:text-green-200">Products</Link>
            <Link href="/categories" className="text-white hover:text-green-200">Categories</Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-white hover:text-green-200 flex items-center max-w-[160px] xl:max-w-[220px]">
                  <span className="truncate">Hello, {user?.name || "User"}</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Account</Link>
                  <Link href="/forgot-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reset Password</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Orders</Link>
                  {isSeller && <Link href="/dashboard/listings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Listings</Link>}
                  {isAdmin && <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</Link>}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button onClick={() => setIsLoginModalOpen(true)} className="text-white hover:text-green-200">Sign In</button>
                <span className="text-green-300">|</span>
                <Link href="/register" className="text-white hover:text-green-200">Register</Link>
              </div>
            )}

            <Link href="/cart" className="relative">
              <svg className="w-6 h-6 text-white hover:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
          </div>

          <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setIsMenuOpen(false);
              }}
              className="text-white hover:text-green-200 focus:outline-none p-1.5"
              title="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSearchOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                )}
              </svg>
            </button>

            <Link href="/cart" className="relative p-1.5">
              <svg className="w-6 h-6 text-white hover:text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </Link>

            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsSearchOpen(false);
              }}
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

        {isMenuOpen && (
          <div className="lg:hidden border-t border-green-500 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2 px-1">Products</Link>
              <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2 px-1">Categories</Link>

              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2">Your Account</Link>
                  <Link href="/forgot-password" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2">Reset Password</Link>
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2">Your Orders</Link>
                  {isSeller && <Link href="/dashboard/listings" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2">Your Listings</Link>}
                  {isAdmin && <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200 py-2">Admin Panel</Link>}
                  <button onClick={logout} className="text-left text-white hover:text-green-200 py-2">Sign Out</button>
                </>
              ) : (
                <div className="flex space-x-4 py-2">
                  <button onClick={() => setIsLoginModalOpen(true)} className="text-white hover:text-green-200">Sign In</button>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-green-200">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {isSearchOpen && (
        <div className="absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 top-2 sm:top-3 lg:top-3 z-30">
          <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
              className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 text-sm border-0 focus:outline-none focus:ring-0 placeholder-gray-500"
            />
            <button className="px-3 sm:px-4 py-2.5 bg-green-600 text-white hover:bg-green-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-2.5 sm:px-3 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              title="Close Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
}
