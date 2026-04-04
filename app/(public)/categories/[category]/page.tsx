"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  basePrice: number;
  originalPrice?: number;
  image: string;
  category: string;
  seller: string;
  location: string;
  description: string;
  quantity: string;
  quality: string;
  farmerStory: string;
  stock: number;
  rating: number;
  reviews: number;
}

interface LocationData {
  country: string;
  currency: string;
  exchangeRate: number;
  taxRate: number;
}

export default function CategoryPage() {
  const { addItem } = useCartStore();
  const params = useParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleAddToCart = (product: Product) => {
    if (!locationData) return;

    const convertedPrice = product.basePrice * locationData.exchangeRate;
    const taxAmount = convertedPrice * locationData.taxRate;
    const totalPrice = convertedPrice + taxAmount;

    addItem({
      id: product.id,
      name: product.name,
      price: totalPrice,
      originalPrice: product.originalPrice ? product.originalPrice * locationData.exchangeRate + product.originalPrice * locationData.taxRate : undefined,
      image: product.image,
      quantity: 1,
      seller: product.seller,
      location: product.location,
      currency: locationData.currency,
    });
  };

  const category = params.category as string;

  // Category metadata
  const categoryInfo = {
    vegetables: {
      name: "Vegetables",
      icon: "🥕",
      description: "Fresh, organic vegetables from local farmers",
      color: "green"
    },
    clothes: {
      name: "Clothes",
      icon: "👕",
      description: "Traditional and modern clothing",
      color: "blue"
    },
    electronics: {
      name: "Electronics",
      icon: "📱",
      description: "Latest gadgets and electronic devices",
      color: "purple"
    },
    cosmetics: {
      name: "Cosmetics",
      icon: "💄",
      description: "Beauty and personal care products",
      color: "pink"
    },
    books: {
      name: "Books",
      icon: "📚",
      description: "Educational and recreational books",
      color: "yellow"
    },
    farming: {
      name: "Farming",
      icon: "🚜",
      description: "Agricultural products and equipment",
      color: "orange"
    },
    home: {
      name: "Home",
      icon: "🏠",
      description: "Home and kitchen essentials",
      color: "indigo"
    }
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo];

  // Mock products data - in real app, fetch from API
  const mockProducts: Product[] = [
    // Vegetables
    {
      id: "1",
      name: "Fresh Organic Tomatoes",
      basePrice: 120,
      originalPrice: 150,
      image: "/placeholder",
      category: "vegetables",
      seller: "Green Farms - Rajesh Kumar",
      location: "Bangalore, Karnataka",
      description: "Premium organic tomatoes grown without pesticides",
      quantity: "1kg",
      quality: "Grade A Organic",
      farmerStory: "Grown without pesticides for 3 generations",
      stock: 50,
      rating: 4.8,
      reviews: 124
    },
    {
      id: "5",
      name: "Organic Spinach",
      basePrice: 80,
      image: "/placeholder",
      category: "vegetables",
      seller: "Organic Valley - Priya",
      location: "Mysore, Karnataka",
      description: "Fresh organic spinach leaves, rich in nutrients",
      quantity: "500g",
      quality: "Premium Organic",
      farmerStory: "Chemical-free farming for healthy greens",
      stock: 30,
      rating: 4.6,
      reviews: 89
    },
    {
      id: "6",
      name: "Fresh Carrots",
      basePrice: 60,
      originalPrice: 75,
      image: "/placeholder",
      category: "vegetables",
      seller: "Farm Fresh - Anil Kumar",
      location: "Coimbatore, Tamil Nadu",
      description: "Crunchy, sweet carrots perfect for cooking",
      quantity: "1kg",
      quality: "Grade A",
      farmerStory: "Grown in fertile soil with natural fertilizers",
      stock: 40,
      rating: 4.7,
      reviews: 67
    },

    // Farming
    {
      id: "2",
      name: "Premium Basmati Rice",
      basePrice: 1800,
      image: "/placeholder",
      category: "farming",
      seller: "Singh Farms - Amarjeet Singh",
      location: "Amritsar, Punjab",
      description: "Award-winning premium basmati rice",
      quantity: "25kg",
      quality: "Premium Basmati",
      farmerStory: "Award-winning rice from fertile Punjab lands",
      stock: 25,
      rating: 4.9,
      reviews: 89
    },
    {
      id: "4",
      name: "Organic Honey",
      basePrice: 450,
      image: "/placeholder",
      category: "farming",
      seller: "Bee Keepers Union - Ramesh",
      location: "Coorg, Karnataka",
      description: "Pure organic honey from coffee estates",
      quantity: "500g",
      quality: "Raw Organic",
      farmerStory: "Sustainably harvested from coffee estates",
      stock: 30,
      rating: 4.9,
      reviews: 156
    },
    {
      id: "7",
      name: "Organic Wheat Flour",
      basePrice: 220,
      image: "/placeholder",
      category: "farming",
      seller: "Golden Grains - Vikram",
      location: "Jaipur, Rajasthan",
      description: "Stone-ground organic wheat flour",
      quantity: "5kg",
      quality: "Organic Stone Ground",
      farmerStory: "Traditional stone grinding preserves nutrients",
      stock: 20,
      rating: 4.8,
      reviews: 45
    },

    // Clothes
    {
      id: "3",
      name: "Handwoven Cotton Saree",
      basePrice: 2500,
      originalPrice: 3000,
      image: "/placeholder",
      category: "clothes",
      seller: "Weavers Co-op - Meera Bai",
      location: "Jaipur, Rajasthan",
      description: "Beautiful handwoven cotton saree",
      quantity: "1 piece",
      quality: "Handwoven Cotton",
      farmerStory: "Traditional craftsmanship passed down for centuries",
      stock: 15,
      rating: 4.7,
      reviews: 67
    },
    {
      id: "8",
      name: "Organic Cotton Kurti",
      basePrice: 1200,
      originalPrice: 1500,
      image: "/placeholder",
      category: "clothes",
      seller: "Heritage Crafts - Sunita",
      location: "Ahmedabad, Gujarat",
      description: "Comfortable organic cotton kurti with traditional embroidery",
      quantity: "1 piece",
      quality: "Organic Cotton",
      farmerStory: "Supporting local artisans and sustainable cotton farming",
      stock: 25,
      rating: 4.5,
      reviews: 34
    },

    // Electronics
    {
      id: "9",
      name: "Wireless Headphones",
      basePrice: 2500,
      originalPrice: 3000,
      image: "/placeholder",
      category: "electronics",
      seller: "TechHub",
      location: "Mumbai, Maharashtra",
      description: "High-quality wireless headphones with noise cancellation",
      quantity: "1 piece",
      quality: "Premium",
      farmerStory: "Quality electronics for modern farming needs",
      stock: 15,
      rating: 4.3,
      reviews: 78
    },

    // Cosmetics
    {
      id: "10",
      name: "Natural Face Cream",
      basePrice: 450,
      image: "/placeholder",
      category: "cosmetics",
      seller: "Nature's Beauty - Kavita",
      location: "Pune, Maharashtra",
      description: "Organic face cream made from natural ingredients",
      quantity: "50g",
      quality: "Organic Natural",
      farmerStory: "Using herbs and oils from local organic farms",
      stock: 40,
      rating: 4.6,
      reviews: 92
    },

    // Books
    {
      id: "11",
      name: "Organic Farming Guide",
      basePrice: 350,
      image: "/placeholder",
      category: "books",
      seller: "AgriBooks - Dr. Sharma",
      location: "Delhi, Delhi",
      description: "Comprehensive guide to organic farming practices",
      quantity: "1 book",
      quality: "Educational",
      farmerStory: "Written by experienced organic farmers",
      stock: 50,
      rating: 4.8,
      reviews: 156
    },

    // Home
    {
      id: "12",
      name: "Handmade Bamboo Basket",
      basePrice: 180,
      image: "/placeholder",
      category: "home",
      seller: "Artisan Crafts - Raju",
      location: "Kolkata, West Bengal",
      description: "Beautiful handmade bamboo storage basket",
      quantity: "1 piece",
      quality: "Handcrafted",
      farmerStory: "Supporting traditional bamboo artisans",
      stock: 30,
      rating: 4.4,
      reviews: 45
    }
  ];

  useEffect(() => {
    if (!currentCategory) {
      router.push('/categories');
      return;
    }

    const fetchLocationData = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const location = await response.json();

        const locationPricing: Record<string, LocationData> = {
          'IN': { country: 'India', currency: 'INR', exchangeRate: 1, taxRate: 0.18 },
          'US': { country: 'United States', currency: 'USD', exchangeRate: 0.012, taxRate: 0.08 },
          'GB': { country: 'United Kingdom', currency: 'GBP', exchangeRate: 0.0098, taxRate: 0.20 },
          'AE': { country: 'UAE', currency: 'AED', exchangeRate: 0.044, taxRate: 0.05 },
          'CA': { country: 'Canada', currency: 'CAD', exchangeRate: 0.016, taxRate: 0.13 },
        };

        const userLocation = locationPricing[location.country_code] || locationPricing['IN'];
        setLocationData(userLocation);
      } catch (error) {
        setLocationData({ country: 'India', currency: 'INR', exchangeRate: 1, taxRate: 0.18 });
      }
    };

    const filteredProducts = mockProducts.filter(product => product.category === category);
    setProducts(filteredProducts);
    setLoading(false);
    fetchLocationData();
  }, [category, currentCategory, router]);

  const calculatePrice = (basePrice: number) => {
    if (!locationData) return { price: basePrice, currency: 'INR' };

    const convertedPrice = basePrice * locationData.exchangeRate;
    return {
      price: convertedPrice,
      currency: locationData.currency
    };
  };

  const filteredProducts = products.filter(product => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           product.seller.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.basePrice - b.basePrice;
      case "price-high":
        return b.basePrice - a.basePrice;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {currentCategory?.name}...</p>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Category not found</p>
          <Link href="/categories" className="text-green-600 hover:text-green-700 mt-4 inline-block">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r from-${currentCategory.color}-600 to-${currentCategory.color}-700 text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-4">
            <Link href="/categories" className="text-white hover:text-gray-200 mr-4">
              ← Back to Categories
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-6xl mr-6">{currentCategory.icon}</span>
            <div>
              <h1 className="text-4xl font-bold mb-2">{currentCategory.name}</h1>
              <p className="text-xl text-gray-100">{currentCategory.description}</p>
              <p className="text-sm text-gray-200 mt-2">{sortedProducts.length} products available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Search ${currentCategory.name.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <Link href="/products" className="text-green-600 hover:text-green-700 mt-4 inline-block">
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const pricing = calculatePrice(product.basePrice);
              const originalPricing = product.originalPrice ? calculatePrice(product.originalPrice) : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-48 bg-gray-200 flex items-center justify-center cursor-pointer">
                      <span className="text-4xl">
                        {product.category === 'vegetables' ? '🥕' :
                         product.category === 'farming' ? '🌾' :
                         product.category === 'clothes' ? '🧵' :
                         product.category === 'electronics' ? '📱' :
                         product.category === 'cosmetics' ? '💄' :
                         product.category === 'books' ? '📚' :
                         product.category === 'home' ? '🏠' : '📦'}
                      </span>
                      {originalPricing && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          {Math.round(((originalPricing.price - pricing.price) / originalPricing.price) * 100)}% OFF
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-green-600 cursor-pointer line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-1">{product.seller}</p>
                    <p className="text-sm text-gray-500 mb-2">{product.location}</p>
                    <p className="text-xs text-green-600 mb-2">{product.quantity} • {product.quality}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400 text-sm">⭐</span>
                      <span className="text-xs text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        {locationData?.currency === 'INR' ? '₹' :
                         locationData?.currency === 'USD' ? '$' :
                         locationData?.currency === 'GBP' ? '£' :
                         locationData?.currency === 'AED' ? 'د.إ' :
                         locationData?.currency === 'CAD' ? 'C$' : '₹'}
                        {pricing.price.toFixed(2)}
                      </span>
                      {originalPricing && (
                        <span className="text-sm text-gray-500 line-through">
                          {locationData?.currency === 'INR' ? '₹' :
                           locationData?.currency === 'USD' ? '$' :
                           locationData?.currency === 'GBP' ? '£' :
                           locationData?.currency === 'AED' ? 'د.إ' :
                           locationData?.currency === 'CAD' ? 'C$' : '₹'}
                          {originalPricing.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Related Categories */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Explore Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== category)
              .slice(0, 6)
              .map(([key, cat]) => (
                <Link
                  key={key}
                  href={`/categories/${key}`}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 hover:shadow-md transition-all group"
                >
                  <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 text-center">{cat.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}