import React from 'react';

export const PricingPlans: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Pricing Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder pricing cards */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Plan</h2>
          <p className="text-gray-600 mb-4">Perfect for getting started</p>
          <p className="text-2xl font-bold mb-4">$9.99/month</p>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Get Started
          </button>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Pro Plan</h2>
          <p className="text-gray-600 mb-4">For professional instructors</p>
          <p className="text-2xl font-bold mb-4">$29.99/month</p>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Get Started
          </button>
        </div>
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Enterprise Plan</h2>
          <p className="text-gray-600 mb-4">For large organizations</p>
          <p className="text-2xl font-bold mb-4">Contact Us</p>
          <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};