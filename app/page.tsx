"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Home() {
  const { addItem } = useCartStore();
  const categories = [
    { name: "Vegetables", icon: "🥕", href: "/categories/vegetables" },
    { name: "Clothes", icon: "👕", href: "/categories/clothes" },
    { name: "Electronics", icon: "📱", href: "/categories/electronics" },
    { name: "Cosmetics", icon: "💄", href: "/categories/cosmetics" },
    { name: "Books", icon: "📚", href: "/categories/books" },
    { name: "Farming", icon: "🚜", href: "/categories/farming" },
    { name: "Home", icon: "🏠", href: "/categories/home" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Fresh Organic Tomatoes",
      price: 120,
      originalPrice: 150,
      image: "/api/placeholder/300/200",
      seller: "Green Farms - Rajesh Kumar",
      location: "Bangalore, Karnataka",
      quantity: "1kg",
      quality: "Grade A Organic",
      farmerStory: "Grown without pesticides for 3 generations"
    },
    {
      id: 2,
      name: "Premium Basmati Rice",
      price: 1800,
      image: "/api/placeholder/300/200",
      seller: "Singh Farms - Amarjeet Singh",
      location: "Amritsar, Punjab",
      quantity: "25kg",
      quality: "Premium Basmati",
      farmerStory: "Award-winning rice from fertile Punjab lands"
    },
    {
      id: 3,
      name: "Handwoven Cotton Saree",
      price: 2500,
      originalPrice: 3000,
      image: "/api/placeholder/300/200",
      seller: "Weavers Co-op - Meera Bai",
      location: "Jaipur, Rajasthan",
      quantity: "1 piece",
      quality: "Handwoven Cotton",
      farmerStory: "Traditional craftsmanship passed down for centuries"
    },
    {
      id: 4,
      name: "Organic Honey",
      price: 450,
      image: "/api/placeholder/300/200",
      seller: "Bee Keepers Union - Ramesh",
      location: "Coorg, Karnataka",
      quantity: "500g",
      quality: "Raw Organic",
      farmerStory: "Sustainably harvested from coffee estates"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-14 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Welcome to <span className="text-green-200">TrokaMart</span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-green-100 max-w-3xl mx-auto">
              Your ultimate shopping destination for fresh produce, quality products, and amazing deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-14 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <div className="relative h-44 sm:h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">
                    {product.name.includes('Tomatoes') ? '🍅' :
                     product.name.includes('Rice') ? '🌾' :
                     product.name.includes('Saree') ? '🧵' :
                     product.name.includes('Honey') ? '🍯' : '🛒'}
                  </span>
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800 line-clamp-2 min-h-[3rem]">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1 line-clamp-1">{product.seller} • {product.location}</p>
                  <p className="text-xs text-green-600 mb-2">{product.quantity} • {product.quality}</p>
                  <p className="text-xs text-gray-500 mb-4 italic line-clamp-2">"{product.farmerStory}"</p>
                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      addItem({
                        id: product.id.toString(),
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        quantity: 1,
                        seller: product.seller,
                        location: product.location,
                        currency: "INR",
                      })
                    }
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-800">Why Choose TrokaMart?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered quickly and safely to your doorstep.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with regular deals and discounts on all products.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure Shopping</h3>
              <p className="text-gray-600">Safe and secure payment options with buyer protection guarantee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-14 lg:py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-base sm:text-xl mb-8 text-green-100">
            Join thousands of satisfied customers on TrokaMart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/products"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

