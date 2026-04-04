"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative h-48 bg-gray-200 flex items-center justify-center cursor-pointer">
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
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-green-600 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{product.seller} • {product.location}</p>
                  <p className="text-sm text-gray-500 mb-2">{product.quantity} • {product.quality}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
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