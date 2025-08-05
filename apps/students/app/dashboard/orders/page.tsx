import React from 'react';

// List of student's course orders - Purchase history and order management
export default function OrdersPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">View your purchase history and order details</p>
      </div>

      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
          
          {/* TODO: Add order filters and search */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-4">
              <select className="border border-gray-300 rounded px-3 py-2">
                <option>All Orders</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* TODO: Add orders table/list */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-001</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">React Fundamentals</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$99.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="/dashboard/order/ORD-001" className="text-blue-600 hover:text-blue-900">View</a>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-002</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Advanced JavaScript</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-20</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$149.00</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a href="/dashboard/order/ORD-002" className="text-blue-600 hover:text-blue-900">View</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-gray-500 mt-6">
            TODO: Implement order fetching, filtering, pagination, and invoice downloads
          </p>
        </div>
      </div>
    </div>
  );
}