"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  seller: string;
  location: string;
  description: string;
  quantity: string;
  quality: string;
}

export default function ProductsPage() {
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1,
      seller: product.seller,
      location: product.location,
      currency: "INR",
    });
  };

  // Mock data for now
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Fresh Organic Tomatoes",
        price: 120,
        originalPrice: 150,
        image: "/placeholder",
        category: "vegetables",
        seller: "Green Farms",
        location: "Bangalore",
        description: "Fresh organic tomatoes, 1kg pack",
        quantity: "1kg",
        quality: "Grade A"
      },
      {
        id: "2",
        name: "Wireless Headphones",
        price: 2500,
        originalPrice: 3000,
        image: "/placeholder",
        category: "electronics",
        seller: "TechHub",
        location: "Mumbai",
        description: "High-quality wireless headphones with noise cancellation",
        quantity: "1 piece",
        quality: "Premium"
      },
      {
        id: "3",
        name: "Cotton T-Shirt",
        price: 800,
        originalPrice: 1000,
        image: "/placeholder",
        category: "clothes",
        seller: "Fashion Store",
        location: "Delhi",
        description: "Comfortable cotton t-shirt, available in multiple sizes",
        quantity: "1 piece",
        quality: "Premium Cotton"
      },
      {
        id: "4",
        name: "Rice - Premium Quality",
        price: 1800,
        image: "/placeholder",
        category: "farming",
        seller: "AgriCorp",
        location: "Chennai",
        description: "Premium basmati rice, 25kg bag",
        quantity: "25kg",
        quality: "Premium Basmati"
      }
    ];
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
      default:
        return 0; // For now, no date sorting
    }
  });

  const categories = [
    { value: "", label: "All Categories" },
    { value: "vegetables", label: "Vegetables" },
    { value: "clothes", label: "Clothes" },
    { value: "electronics", label: "Electronics" },
    { value: "cosmetics", label: "Cosmetics" },
    { value: "books", label: "Books" },
    { value: "farming", label: "Farming" },
    { value: "home", label: "Home" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">All Products</h1>

          {/* Filters */}
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-3 sm:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[180px] px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                    }}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
              <p className="text-sm text-gray-600">Filter by category</p>
              <p className="text-sm text-gray-500">{sortedProducts.length} items</p>
            </div>

            <div className="flex gap-2 overflow-x-auto md:overflow-visible md:flex-wrap pb-1 -mx-1 px-1 md:mx-0 md:px-0">
              {categories.map((category) => {
                const isActive = selectedCategory === category.value;
                return (
                  <button
                    key={category.value || "all"}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                      isActive
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:text-green-700"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-44 sm:h-48 bg-gray-200 flex items-center justify-center cursor-pointer">
                    <span className="text-4xl">
                      {product.category === 'vegetables' ? '🥕' :
                       product.category === 'electronics' ? '📱' :
                       product.category === 'clothes' ? '👕' :
                       product.category === 'farming' ? '🌾' : '📦'}
                    </span>
                    {product.originalPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800 hover:text-green-600 cursor-pointer line-clamp-2 min-h-[3rem]">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.seller} | {product.location}</p>
                  <p className="text-sm text-gray-500 mb-3">{product.quantity} | {product.quality}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-2xl font-bold text-green-600">Rs {product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">Rs {product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


