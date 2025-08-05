'use client';

import React from 'react';
import { useOptionalAuth } from '../hooks/useOptionalAuth';
import CreditPurchase from '../components/CreditPurchase';
import CreditBalance from '../components/CreditBalance';
import Layout from '../ssrComponent/Layout';

export default function CreditsPage() {
  const { userId, isLoaded } = useOptionalAuth();

  if (!isLoaded) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!userId) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to purchase credits</p>
            <a
              href="/sign-in"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Credit Balance */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buy Credits</h1>
              <p className="text-gray-600 mt-2">
                Purchase credits to access premium features and unlimited usage
              </p>
            </div>
            <CreditBalance />
          </div>

          {/* Credit Purchase Component */}
          <CreditPurchase userId={userId} />

          {/* Additional Information */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How Credits Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Purchase Credits</h3>
                <p className="text-gray-600 text-sm">
                  Choose a credit package that fits your needs and complete the secure payment
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Activation</h3>
                <p className="text-gray-600 text-sm">
                  Credits are added to your account immediately after successful payment
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Using</h3>
                <p className="text-gray-600 text-sm">
                  Use credits across all puzzle types and premium features without expiration
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do credits expire?</h3>
                <p className="text-gray-600">No, credits never expire. Once purchased, they remain in your account until used.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What can I use credits for?</h3>
                <p className="text-gray-600">Credits can be used for all puzzle types, AI analysis, premium features, and unlimited access to instructor tools.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
                <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee on all credit purchases. Contact support for refund requests.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">Yes, all payments are processed securely through Stripe, and we never store your payment information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}