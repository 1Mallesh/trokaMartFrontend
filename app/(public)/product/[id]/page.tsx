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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl">
                  {product.category === 'vegetables' ? '🍅' :
                   product.category === 'farming' ? '🌾' :
                   product.category === 'clothes' ? '🧵' : '🍯'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-green-600">{product.stock} in stock</span>
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm font-medium">{locationData.country}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Currency:</span>
                <span className="text-sm font-medium">{locationData.currency}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-green-600">
                    {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                    {pricing.price.toFixed(2)}
                  </span>
                  {originalPricing && (
                    <span className="text-lg text-gray-500 line-through">
                      {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                      {originalPricing.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Tax: {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                  {pricing.tax.toFixed(2)} ({(locationData.taxRate * 100).toFixed(0)}%)
                </div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  Total: {locationData.currency === 'INR' ? '₹' : locationData.currency === 'USD' ? '$' : locationData.currency === 'GBP' ? '£' : locationData.currency === 'AED' ? 'د.إ' : 'C$'}
                  {pricing.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
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

            {/* Farmer Story */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Farmer's Story</h3>
              <p className="text-amber-700 text-sm italic">"{product.farmerStory}"</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
          </div>
        </div>
      </div>
    </div>
  );
}