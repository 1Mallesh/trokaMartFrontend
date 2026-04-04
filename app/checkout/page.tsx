"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface LocationData {
  country: string;
  currency: string;
  symbol: string;
  exchangeRate: number;
  taxRate: number;
  shippingCost: number;
}

const locationConfigs: Record<string, LocationData> = {
  IN: { country: "India", currency: "INR", symbol: "₹", exchangeRate: 1, taxRate: 0.18, shippingCost: 50 },
  US: { country: "United States", currency: "USD", symbol: "$", exchangeRate: 0.012, taxRate: 0.08, shippingCost: 10 },
  GB: { country: "United Kingdom", currency: "GBP", symbol: "£", exchangeRate: 0.0098, taxRate: 0.20, shippingCost: 8 },
  EU: { country: "Europe", currency: "EUR", symbol: "€", exchangeRate: 0.011, taxRate: 0.19, shippingCost: 12 },
  AU: { country: "Australia", currency: "AUD", symbol: "A$", exchangeRate: 0.016, taxRate: 0.10, shippingCost: 15 },
};

interface CheckoutFormProps {
  amount: number;
  currency: string;
  onSuccess: () => void;
}

function CheckoutForm({ amount, currency, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsLoading(false);
      return;
    }

    // Create payment method
    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message || "Payment failed");
      setIsLoading(false);
      return;
    }

    // Here you would typically send the payment method ID to your backend
    // For now, we'll simulate a successful payment
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : `Pay ${currency}${amount}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<LocationData>(locationConfigs.IN);
  const [cartItems] = useState([
    { id: "1", name: "Fresh Organic Tomatoes", price: 120, quantity: 2, category: "vegetables" },
    { id: "2", name: "Premium Rice 25kg", price: 1800, quantity: 1, category: "farming" }
  ]);

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    country: "IN"
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Detect user location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get location from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const countryCode = data.country_code || 'IN';
        const locationData = locationConfigs[countryCode] || locationConfigs.IN;

        setUserLocation(locationData);
        setShippingAddress(prev => ({ ...prev, country: countryCode }));
      } catch (error) {
        console.log('Location detection failed, using default');
      }
    };

    detectLocation();
  }, []);

  // Calculate prices in user's currency
  const convertPrice = (inrPrice: number) => {
    return Math.round(inrPrice * userLocation.exchangeRate * 100) / 100;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const convertedSubtotal = convertPrice(subtotal);
  const shipping = convertedSubtotal > convertPrice(500) ? 0 : userLocation.shippingCost;
  const tax = Math.round(convertedSubtotal * userLocation.taxRate * 100) / 100;
  const platformFee = Math.round(convertedSubtotal * 0.10 * 100) / 100; // 10% platform profit
  const total = convertedSubtotal + shipping + tax + platformFee;

  const handleLocationChange = (countryCode: string) => {
    const locationData = locationConfigs[countryCode] || locationConfigs.IN;
    setUserLocation(locationData);
    setShippingAddress(prev => ({ ...prev, country: countryCode }));
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      router.push("/orders");
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
          <p className="text-sm text-gray-500">Order will be delivered to {userLocation.country}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Global Checkout</h1>
          <p className="text-gray-600 mt-2">🌍 Delivering to {userLocation.country} • Currency: {userLocation.currency}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping & Payment */}
          <div className="space-y-8">
            {/* Location Selector */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Delivery Location</h2>
              <select
                value={shippingAddress.country}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {Object.entries(locationConfigs).map(([code, config]) => (
                  <option key={code} value={code}>
                    {config.country} ({config.symbol}{config.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">💳 Secure Payment</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={total}
                  currency={`${userLocation.symbol}${total.toFixed(2)}`}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🧾 Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{userLocation.symbol}{convertPrice(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{userLocation.symbol}{convertedSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `${userLocation.symbol}${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({(userLocation.taxRate * 100).toFixed(0)}%)</span>
                    <span>{userLocation.symbol}{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Platform Fee (10%)</span>
                    <span>{userLocation.symbol}{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{userLocation.symbol}{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p className="flex items-center">🌍 Global shipping available</p>
                <p className="flex items-center">🚚 Free shipping on orders above {userLocation.symbol}{convertPrice(500).toFixed(2)}</p>
                <p className="flex items-center">💰 10% platform profit supports farmers</p>
                <p className="flex items-center">🛡️ Secure payment with Stripe</p>
                <p className="flex items-center">🌾 Supporting local farmers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}