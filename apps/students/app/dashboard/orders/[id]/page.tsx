import React from 'react';

interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

// Order tracking page - Detailed view of a specific order with tracking and payment information
export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = params;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <a href="/dashboard/orders" className="hover:text-gray-900">Orders</a>
          <span>/</span>
          <span className="text-gray-900">Order {orderId}</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600 mt-2">Order ID: {orderId}</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking & Details</h2>
          
          {/* TODO: Add order status indicator */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center">
                <div className="flex items-center text-green-600">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                  <span className="ml-2 font-medium">Order Placed</span>
                </div>
                <div className="w-16 h-1 bg-green-600 mx-2"></div>
                <div className="flex items-center text-green-600">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                  <span className="ml-2 font-medium">Payment Confirmed</span>
                </div>
                <div className="w-16 h-1 bg-green-600 mx-2"></div>
                <div className="flex items-center text-green-600">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                  <span className="ml-2 font-medium">Access Granted</span>
                </div>
              </div>
            </div>
            <p className="text-green-600 font-medium">Order Completed Successfully</p>
          </div>

          {/* TODO: Add order details */}
          <div className="bg-white p-6 rounded-lg shadow text-left">
            <h3 className="text-xl font-bold mb-4">Order Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Course Details</h4>
                <p className="text-gray-600 mb-1">React Fundamentals Course</p>
                <p className="text-gray-600 mb-1">Instructor: John Doe</p>
                <p className="text-gray-600">Duration: 20+ hours</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <p className="text-gray-600 mb-1">Amount: $99.00</p>
                <p className="text-gray-600 mb-1">Payment Method: Credit Card (**** 4242)</p>
                <p className="text-gray-600">Transaction ID: txn_1234567890</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Timeline</h4>
                <p className="text-gray-600 mb-1">Ordered: January 15, 2024 at 2:30 PM</p>
                <p className="text-gray-600 mb-1">Paid: January 15, 2024 at 2:31 PM</p>
                <p className="text-gray-600">Access Granted: January 15, 2024 at 2:31 PM</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Actions</h4>
                <div className="space-y-2">
                  <button className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Start Course
                  </button>
                  <button className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-500 mt-6">
            TODO: Implement real-time order tracking, payment verification, and invoice generation
          </p>
        </div>
      </div>
    </div>
  );
}