"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Swiper custom styles
const swiperStyles = `
  .swiper-button-next::after,
  .swiper-button-prev::after {
    font-size: 18px;
    color: #16a34a;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    background-color: rgba(255, 255, 255, 0.9);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    top: 35%;
  }
  
  @media (max-width: 640px) {
    .swiper-button-next,
    .swiper-button-prev {
      width: 32px;
      height: 32px;
      top: 25%;
    }
    
    .swiper-button-next::after,
    .swiper-button-prev::after {
      font-size: 14px;
    }
  }
  
  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    background-color: #16a34a;
  }
  
  .swiper-button-next:hover::after,
  .swiper-button-prev:hover::after {
    color: white;
  }
  
  .swiper-pagination-bullet {
    background-color: #d1d5db;
    width: 8px;
    height: 8px;
  }
  
  @media (max-width: 640px) {
    .swiper-pagination-bullet {
      width: 6px;
      height: 6px;
    }
  }
  
  .swiper-pagination-bullet-active {
    background-color: #16a34a;
  }
  
  .swiper {
    padding: 0 12px;
  }
  
  @media (max-width: 640px) {
    .swiper-slide {
      margin-right: 8px;
    }
  }
`;

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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, fetch from API
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Fresh Organic Tomatoes",
      basePrice: 120,
      originalPrice: 150,
      image: "/placeholder",
      category: "vegetables",
      seller: "Green Farms - Rajesh Kumar",
      location: "Bangalore, Karnataka",
      description: "Premium organic tomatoes grown without any chemical pesticides or fertilizers. These tomatoes are hand-picked at peak ripeness and delivered fresh to your doorstep. Perfect for salads, cooking, or eating fresh.",
      quantity: "1kg",
      quality: "Grade A Organic",
      farmerStory: "Grown without pesticides for 3 generations on our family farm. We use traditional farming methods combined with modern sustainable practices.",
      stock: 50,
      rating: 4.8,
      reviews: 124
    },
    {
      id: "2",
      name: "Premium Basmati Rice",
      basePrice: 1800,
      image: "/placeholder",
      category: "farming",
      seller: "Singh Farms - Amarjeet Singh",
      location: "Amritsar, Punjab",
      description: "Award-winning premium basmati rice from the fertile lands of Punjab. Known for its aromatic flavor and perfect texture. Ideal for biryani, pulao, or everyday cooking.",
      quantity: "25kg",
      quality: "Premium Basmati",
      farmerStory: "Our family has been growing rice for over 100 years. This basmati variety has won multiple agricultural awards for its quality and taste.",
      stock: 25,
      rating: 4.9,
      reviews: 89
    },
    {
      id: "3",
      name: "Handwoven Cotton Saree",
      basePrice: 2500,
      originalPrice: 3000,
      image: "/placeholder",
      category: "clothes",
      seller: "Weavers Co-op - Meera Bai",
      location: "Jaipur, Rajasthan",
      description: "Beautiful handwoven cotton saree crafted by skilled artisans using traditional techniques. Features intricate patterns and comes with a matching blouse piece.",
      quantity: "1 piece",
      quality: "Handwoven Cotton",
      farmerStory: "Traditional craftsmanship passed down for centuries. Our cooperative empowers local women artisans and preserves ancient weaving techniques.",
      stock: 15,
      rating: 4.7,
      reviews: 67
    },
    {
      id: "4",
      name: "Organic Honey",
      basePrice: 450,
      image: "/placeholder",
      category: "farming",
      seller: "Bee Keepers Union - Ramesh",
      location: "Coorg, Karnataka",
      description: "Pure organic honey harvested from coffee estates in Coorg. Raw and unprocessed, retaining all natural enzymes and nutrients. Perfect for tea, cooking, or medicinal use.",
      quantity: "500g",
      quality: "Raw Organic",
      farmerStory: "Sustainably harvested from our bee colonies in the misty hills of Coorg. We practice ethical beekeeping that benefits both bees and the environment.",
      stock: 30,
      rating: 4.9,
      reviews: 156
    },
    {
      id: "5",
      name: "Organic Spinach",
      basePrice: 80,
      image: "/placeholder",
      category: "vegetables",
      seller: "Organic Valley - Priya",
      location: "Mysore, Karnataka",
      description: "Fresh organic spinach leaves, rich in nutrients and iron. Grown without any chemical pesticides, perfect for salads, smoothies, or cooking.",
      quantity: "500g",
      quality: "Premium Organic",
      farmerStory: "Chemical-free farming for healthy greens. We use natural composting methods passed down through generations.",
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
      description: "Crunchy, sweet carrots perfect for cooking or eating raw. Grown in fertile soil with natural fertilizers.",
      quantity: "1kg",
      quality: "Grade A",
      farmerStory: "Grown in fertile soil with natural fertilizers. Best carrots in Tamil Nadu for 5 consecutive years.",
      stock: 40,
      rating: 4.7,
      reviews: 67
    },
    {
      id: "3",
      name: "Handwoven Cotton Saree",
      basePrice: 2500,
      originalPrice: 3000,
      image: "/placeholder",
      category: "clothes",
      seller: "Weavers Co-op - Meera Bai",
      location: "Jaipur, Rajasthan",
      description: "Beautiful handwoven cotton saree with intricate traditional patterns. Each piece is unique and made by skilled artisans.",
      quantity: "1 piece",
      quality: "Handwoven Cotton",
      farmerStory: "Traditional craftsmanship passed down for centuries. Supporting local weavers and sustainable textile production.",
      stock: 15,
      rating: 4.7,
      reviews: 67
    },
    {
      id: "7",
      name: "Organic Wheat Flour",
      basePrice: 220,
      image: "/placeholder",
      category: "farming",
      seller: "Golden Grains - Vikram",
      location: "Jaipur, Rajasthan",
      description: "Stone-ground organic wheat flour preserving all nutrients. Perfect for healthy breads and rotis.",
      quantity: "5kg",
      quality: "Organic Stone Ground",
      farmerStory: "Traditional stone grinding preserves nutrients. No chemical additives or bleaching agents used.",
      stock: 20,
      rating: 4.8,
      reviews: 45
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
      description: "Comfortable organic cotton kurti with traditional embroidery. Perfect for daily wear and special occasions.",
      quantity: "1 piece",
      quality: "Organic Cotton",
      farmerStory: "Supporting local artisans and sustainable cotton farming. Every purchase helps our weaving community.",
      stock: 25,
      rating: 4.5,
      reviews: 34
    },
    {
      id: "9",
      name: "Wireless Headphones",
      basePrice: 2500,
      originalPrice: 3000,
      image: "/placeholder",
      category: "electronics",
      seller: "TechHub",
      location: "Mumbai, Maharashtra",
      description: "High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals.",
      quantity: "1 piece",
      quality: "Premium",
      farmerStory: "Quality electronics for modern farming needs. Tech solutions developed with farmer feedback.",
      stock: 15,
      rating: 4.3,
      reviews: 78
    },
    {
      id: "10",
      name: "Natural Face Cream",
      basePrice: 450,
      image: "/placeholder",
      category: "cosmetics",
      seller: "Nature's Beauty - Kavita",
      location: "Pune, Maharashtra",
      description: "Organic face cream made from natural ingredients. Gentle on skin, no harsh chemicals or artificial preservatives.",
      quantity: "50g",
      quality: "Organic Natural",
      farmerStory: "Using herbs and oils from local organic farms. 100% natural ingredients, dermatologist tested.",
      stock: 40,
      rating: 4.6,
      reviews: 92
    },
    {
      id: "11",
      name: "Organic Farming Guide",
      basePrice: 350,
      image: "/placeholder",
      category: "books",
      seller: "AgriBooks - Dr. Sharma",
      location: "Delhi, Delhi",
      description: "Comprehensive guide to organic farming practices. Written by experienced farmers and agricultural experts.",
      quantity: "1 book",
      quality: "Educational",
      farmerStory: "Written by experienced organic farmers. Over 300 pages of practical farming knowledge and tips.",
      stock: 50,
      rating: 4.8,
      reviews: 156
    },
    {
      id: "12",
      name: "Handmade Bamboo Basket",
      basePrice: 180,
      image: "/placeholder",
      category: "home",
      seller: "Artisan Crafts - Raju",
      location: "Kolkata, West Bengal",
      description: "Beautiful handmade bamboo storage basket. Perfect for organizing your home in an eco-friendly way.",
      quantity: "1 piece",
      quality: "Handcrafted",
      farmerStory: "Supporting traditional bamboo artisans. Sustainable bamboo harvesting and traditional weaving techniques.",
      stock: 30,
      rating: 4.4,
      reviews: 45
    },
    {
      id: "13",
      name: "Organic Ghee",
      basePrice: 650,
      image: "/placeholder",
      category: "farming",
      seller: "Desi Dairy - Krishna",
      location: "Mathura, Uttar Pradesh",
      description: "Pure organic ghee from cow milk. Made traditionally through slow churning without additives.",
      quantity: "500g",
      quality: "Pure Organic",
      farmerStory: "Made from milk of grass-fed cows. Traditional bilona method ensures purity and nutritional value.",
      stock: 20,
      rating: 4.9,
      reviews: 203
    },
    {
      id: "14",
      name: "Fresh Bell Peppers Mix",
      basePrice: 150,
      image: "/placeholder",
      category: "vegetables",
      seller: "Valley Farms - Ravi",
      location: "Nashik, Maharashtra",
      description: "Mix of colorful organic bell peppers. Red, yellow, and green varieties freshly harvested.",
      quantity: "1kg",
      quality: "Grade A Organic",
      farmerStory: "Grown without any chemical pesticides. Picked fresh and delivered within 24 hours.",
      stock: 35,
      rating: 4.7,
      reviews: 112
    },
    {
      id: "15",
      name: "Organic Turmeric Powder",
      basePrice: 280,
      image: "/placeholder",
      category: "farming",
      seller: "Spice Master - Sharma",
      location: "Telangana, Hyderabad",
      description: "Pure organic turmeric powder with high curcumin content. No additives or fillers.",
      quantity: "1kg",
      quality: "Premium Organic",
      farmerStory: "Sourced from the best turmeric farms in Telangana. Traditionally dried and ground.",
      stock: 50,
      rating: 4.8,
      reviews: 178
    },
    {
      id: "16",
      name: "Linen Bedsheet Set",
      basePrice: 1800,
      originalPrice: 2200,
      image: "/placeholder",
      category: "clothes",
      seller: "Home Comforts - Priya",
      location: "Indore, Madhya Pradesh",
      description: "Soft and durable organic linen bedsheet set. Perfect for a comfortable night's sleep.",
      quantity: "1 set",
      quality: "Premium Linen",
      farmerStory: "Made from organic flax plants. No synthetic dyes or harsh chemicals used.",
      stock: 18,
      rating: 4.6,
      reviews: 89
    },
    {
      id: "17",
      name: "Smart Garden Lights",
      basePrice: 2200,
      image: "/placeholder",
      category: "electronics",
      seller: "GreenTech - Arjun",
      location: "Bangalore, Karnataka",
      description: "Solar-powered smart garden lights. Energy efficient and environmentally friendly.",
      quantity: "4 pieces",
      quality: "Premium Solar",
      farmerStory: "Tech innovation for sustainable farming. Solar-powered solutions for modern farmers.",
      stock: 22,
      rating: 4.5,
      reviews: 95
    },
    {
      id: "18",
      name: "Natural Aloe Vera Gel",
      basePrice: 380,
      image: "/placeholder",
      category: "cosmetics",
      seller: "Herbal Beauty - Maya",
      location: "Kerala, Kochi",
      description: "100% pure aloe vera gel. No artificial color, fragrance, or preservatives added.",
      quantity: "150g",
      quality: "Pure Natural",
      farmerStory: "Harvested from our organic aloe farms. Cold-pressed to retain all natural properties.",
      stock: 45,
      rating: 4.7,
      reviews: 134
    },
    {
      id: "19",
      name: "Sustainable Farming Handbook",
      basePrice: 420,
      image: "/placeholder",
      category: "books",
      seller: "Green Knowledge - Dr. Patel",
      location: "Gujarat, Ahmedabad",
      description: "Practical handbook for sustainable farming. Covers soil health, crop rotation, and organic methods.",
      quantity: "1 book",
      quality: "Reference Guide",
      farmerStory: "Compiled by agricultural experts and successful farmers. Practical knowledge for everyone.",
      stock: 35,
      rating: 4.8,
      reviews: 121
    },
    {
      id: "20",
      name: "Wooden Kitchen Utensil Set",
      basePrice: 550,
      image: "/placeholder",
      category: "home",
      seller: "Eco Crafts - Mohan",
      location: "Bangalore, Karnataka",
      description: "Set of wooden kitchen utensils. Eco-friendly and durable for everyday cooking.",
      quantity: "6 pieces",
      quality: "Handcrafted Wood",
      farmerStory: "Made from sustainable wood sources. Supporting eco-friendly production methods.",
      stock: 28,
      rating: 4.5,
      reviews: 76
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.id as string;
      const foundProduct = mockProducts.find(p => p.id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        router.push('/products');
        return;
      }

      setLoading(false);
    };

    const fetchLocationData = async () => {
      try {
        // Get user's location (in real app, use IP geolocation API)
        const response = await fetch('https://ipapi.co/json/');
        const location = await response.json();

        // Mock location-based pricing data
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
        // Fallback to India pricing
        setLocationData({ country: 'India', currency: 'INR', exchangeRate: 1, taxRate: 0.18 });
      }
    };

    fetchProduct();
    fetchLocationData();
  }, [params.id, router]);

  const calculatePrice = (basePrice: number) => {
    if (!locationData) return { price: basePrice, currency: 'INR', tax: 0, total: basePrice };

    const convertedPrice = basePrice * locationData.exchangeRate;
    const tax = convertedPrice * locationData.taxRate;
    const total = convertedPrice + tax;

    return {
      price: convertedPrice,
      currency: locationData.currency,
      tax,
      total
    };
  };

  const handleAddToCart = () => {
    if (!product || !locationData) return;

    const pricing = calculatePrice(product.basePrice);
    addToCart({
      id: product.id,
      name: product.name,
      price: pricing.total,
      originalPrice: product.originalPrice ? calculatePrice(product.originalPrice).total : undefined,
      image: product.image,
      quantity: quantity,
      seller: product.seller,
      location: product.location,
      currency: locationData.currency
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product || !locationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Link href="/products" className="text-green-600 hover:text-green-700 mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const pricing = calculatePrice(product.basePrice);
  const originalPricing = product.originalPrice ? calculatePrice(product.originalPrice) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-0">
      <style>{`
        ${swiperStyles}
        
        /* Mobile Responsive Improvements */
        @media (max-width: 768px) {
          .product-image {
            height: 300px;
          }
          
          .sticky-cta {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            padding: 12px 16px;
            z-index: 40;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .page-content {
            padding-bottom: 80px;
          }
        }
      `}</style>
      
      {/* Breadcrumb - Mobile Optimized */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
          <nav className="flex text-xs sm:text-sm overflow-x-auto">
            <Link href="/" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700 whitespace-nowrap">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 page-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Product Images - Mobile Optimized */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden product-image sm:aspect-auto sm:h-auto">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl sm:text-8xl">
                  {product.category === 'vegetables' ? '🍅' :
                   product.category === 'farming' ? '🌾' :
                   product.category === 'clothes' ? '🧵' : '🍯'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1 text-gray-600">{product.rating} ({product.reviews})</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-green-600 font-medium">{product.stock} in stock</span>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Pricing - Mobile Optimized */}
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{locationData.country}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
                <span className="text-gray-600">Currency:</span>
                <span className="font-medium">{locationData.currency}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-green-600">
                    {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                    {pricing.price.toFixed(2)}
                  </span>
                  {originalPricing && (
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                      {originalPricing.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Tax: {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                  {pricing.tax.toFixed(2)} ({(locationData.taxRate * 100).toFixed(0)}%)
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 mt-2">
                  Total: {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                  {pricing.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Product Details - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="font-medium">{product.seller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{product.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{product.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quality:</span>
                <span className="font-medium">{product.quality}</span>
              </div>
            </div>

            {/* Farmer Story - Mobile Optimized */}
            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2 text-sm sm:text-base">🌾 Farmer's Story</h3>
              <p className="text-amber-700 text-xs sm:text-sm leading-relaxed">"{product.farmerStory}"</p>
            </div>

            {/* Quantity Selector - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-sm sm:text-base text-gray-600 font-medium">Order Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center"
                >
                  −
                </button>
                <span className="px-4 py-2 border-x text-center w-12">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized with Sticky Footer */}
            <div className="hidden sm:space-y-3 sm:block">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                Add to Cart
              </button>
              <Link
                href="/cart"
                className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors block text-center"
              >
                View Cart
              </Link>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="sticky-cta sm:hidden flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
              >
                Add to Cart
              </button>
              <Link
                href="/cart"
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center text-sm"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Products from Same Category Section with Swiper - Mobile Optimized */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 px-1">More from {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {mockProducts
              .filter(p => p.category === product.category && p.id !== product.id)
              .map(relatedProduct => {
                const relatedPricing = calculatePrice(relatedProduct.basePrice);
                const relatedOriginalPricing = relatedProduct.originalPrice 
                  ? calculatePrice(relatedProduct.originalPrice) 
                  : null;

                return (
                  <SwiperSlide key={relatedProduct.id}>
                    <Link
                      href={`/product/${relatedProduct.id}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group h-full"
                    >
                      <div className="relative bg-gray-200 h-48 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl group-hover:scale-110 transition-transform">
                          {relatedProduct.category === 'vegetables' ? '🍅' :
                           relatedProduct.category === 'farming' ? '🌾' :
                           relatedProduct.category === 'clothes' ? '🧵' :
                           relatedProduct.category === 'electronics' ? '📱' :
                           relatedProduct.category === 'cosmetics' ? '💄' :
                           relatedProduct.category === 'books' ? '📚' :
                           relatedProduct.category === 'home' ? '🏠' : '🍯'}
                        </span>
                        {relatedOriginalPricing && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            {Math.round(((relatedOriginalPricing.price - relatedPricing.price) / relatedOriginalPricing.price) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">{relatedProduct.seller}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-xs text-gray-600">
                            {relatedProduct.rating} ({relatedProduct.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xl font-bold text-green-600">
                            {locationData?.currency === 'INR' ? '₹' :
                             locationData?.currency === 'USD' ? '$' :
                             locationData?.currency === 'GBP' ? '£' :
                             locationData?.currency === 'AED' ? 'د.إ' :
                             locationData?.currency === 'CAD' ? 'C$' : '₹'}
                            {relatedPricing.price.toFixed(2)}
                          </span>
                          {relatedOriginalPricing && (
                            <span className="text-xs text-gray-500 line-through">
                              {locationData?.currency === 'INR' ? '₹' :
                               locationData?.currency === 'USD' ? '$' :
                               locationData?.currency === 'GBP' ? '£' :
                               locationData?.currency === 'AED' ? 'د.إ' :
                               locationData?.currency === 'CAD' ? 'C$' : '₹'}
                              {relatedOriginalPricing.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>

        {/* Explore More Categories Section with Swiper - Mobile Optimized */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 px-1">Explore More Categories</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000, disableOnInteraction: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 5 },
            }}
            className="pb-12"
          >
            {mockProducts
              .filter(p => p.id !== product.id)
              .slice(0, 10)
              .map((recentProduct, index) => {
                const recentPricing = calculatePrice(recentProduct.basePrice);
                const recentOriginalPricing = recentProduct.originalPrice 
                  ? calculatePrice(recentProduct.originalPrice) 
                  : null;

                return (
                  <SwiperSlide key={`explore-${recentProduct.id}-${index}`}>
                    <Link
                      href={`/product/${recentProduct.id}`}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group h-full"
                    >
                      <div className="relative bg-gray-200 h-40 flex items-center justify-center overflow-hidden">
                        <span className="text-5xl group-hover:scale-110 transition-transform">
                          {recentProduct.category === 'vegetables' ? '🍅' :
                           recentProduct.category === 'farming' ? '🌾' :
                           recentProduct.category === 'clothes' ? '🧵' :
                           recentProduct.category === 'electronics' ? '📱' :
                           recentProduct.category === 'cosmetics' ? '💄' :
                           recentProduct.category === 'books' ? '📚' :
                           recentProduct.category === 'home' ? '🏠' : '🍯'}
                        </span>
                        {recentOriginalPricing && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            {Math.round(((recentOriginalPricing.price - recentPricing.price) / recentOriginalPricing.price) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="text-xs bg-green-100 text-green-800 inline-block px-2 py-1 rounded mb-2">
                          {recentProduct.category.charAt(0).toUpperCase() + recentProduct.category.slice(1)}
                        </div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1 group-hover:text-green-600 transition-colors">
                          {recentProduct.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-1">{recentProduct.seller}</p>
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-xs text-gray-600">
                            {recentProduct.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-green-600">
                            {locationData?.currency === 'INR' ? '₹' :
                             locationData?.currency === 'USD' ? '$' :
                             locationData?.currency === 'GBP' ? '£' :
                             locationData?.currency === 'AED' ? 'د.إ' :
                             locationData?.currency === 'CAD' ? 'C$' : '₹'}
                            {recentPricing.price.toFixed(0)}
                          </span>
                          {recentOriginalPricing && (
                            <span className="text-xs text-gray-500 line-through">
                              {locationData?.currency === 'INR' ? '₹' :
                               locationData?.currency === 'USD' ? '$' :
                               locationData?.currency === 'GBP' ? '£' :
                               locationData?.currency === 'AED' ? 'د.إ' :
                               locationData?.currency === 'CAD' ? 'C$' : '₹'}
                              {recentOriginalPricing.price.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
