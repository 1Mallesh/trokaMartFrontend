"use client";

import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    {
      name: "Vegetables",
      icon: "🥕",
      description: "Fresh vegetables and produce",
      href: "/categories/vegetables",
      count: 150
    },
    {
      name: "Clothes",
      icon: "👕",
      description: "Fashion and apparel",
      href: "/categories/clothes",
      count: 320
    },
    {
      name: "Electronics",
      icon: "📱",
      description: "Gadgets and electronics",
      href: "/categories/electronics",
      count: 89
    },
    {
      name: "Cosmetics",
      icon: "💄",
      description: "Beauty and personal care",
      href: "/categories/cosmetics",
      count: 156
    },
    {
      name: "Books",
      icon: "📚",
      description: "Books and educational materials",
      href: "/categories/books",
      count: 203
    },
    {
      name: "Farming",
      icon: "🚜",
      description: "Agricultural products and equipment",
      href: "/categories/farming",
      count: 78
    },
    {
      name: "Home",
      icon: "🏠",
      description: "Home and kitchen essentials",
      href: "/categories/home",
      count: 267
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
          <p className="text-gray-600 mt-2">Discover products from various categories</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-3">{category.description}</p>
                <div className="text-sm text-gray-500">
                  {category.count} products available
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-xl mb-8 text-green-100">
            Browse all products or contact us for custom requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}