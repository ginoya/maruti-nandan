import React from 'react';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';

const Payments: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-xl">
        {/* Header */}
        <div className="mb-2xl">
          <h1 className="text-3xl font-bold text-secondary-900 mb-md">Payment Management</h1>
          <p className="text-secondary-600">Track and manage all your payments</p>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-2xl">
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Total Received</h3>
              <span className="text-2xl font-bold text-success-600">₹67,500</span>
            </div>
            <p className="text-sm text-secondary-600">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Pending</h3>
              <span className="text-2xl font-bold text-accent-600">₹23,950</span>
            </div>
            <p className="text-sm text-secondary-600">Awaiting payment</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Overdue</h3>
              <span className="text-2xl font-bold text-error-600">₹8,200</span>
            </div>
            <p className="text-sm text-secondary-600">Past due date</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Success Rate</h3>
              <span className="text-2xl font-bold text-primary-600">94%</span>
            </div>
            <p className="text-sm text-secondary-600">On-time payments</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          {/* Payment List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <div className="flex items-center justify-between mb-xl">
                <h2 className="text-xl font-semibold text-secondary-900">Recent Payments</h2>
                <Button variant="gradient" size="sm">
                  + Record Payment
                </Button>
              </div>

              <div className="space-y-md">
                {/* Payment Item */}
                <div className="border border-gray-200 rounded-lg p-lg hover:shadow-soft transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-md">
                      <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                        <span className="text-success-600 text-lg">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">Payment #PAY-001</h4>
                        <p className="text-sm text-secondary-600">Invoice #INV-001 - ABC Company</p>
                        <p className="text-xs text-secondary-500">Received: 10 Dec 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹12,500</p>
                      <span className="inline-block px-sm py-xs bg-success-100 text-success-700 text-xs rounded-md">
                        Completed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-lg hover:shadow-soft transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-md">
                      <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                        <span className="text-accent-600 text-lg">⏳</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">Payment #PAY-002</h4>
                        <p className="text-sm text-secondary-600">Invoice #INV-002 - XYZ Corp</p>
                        <p className="text-xs text-secondary-500">Due: 20 Dec 2024</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹8,750</p>
                      <span className="inline-block px-sm py-xs bg-accent-100 text-accent-700 text-xs rounded-md">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-lg hover:shadow-soft transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-md">
                      <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                        <span className="text-error-600 text-lg">⚠</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900">Payment #PAY-003</h4>
                        <p className="text-sm text-secondary-600">Invoice #INV-003 - DEF Ltd</p>
                        <p className="text-xs text-secondary-500">Overdue: 5 days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹15,200</p>
                      <span className="inline-block px-sm py-xs bg-error-100 text-error-700 text-xs rounded-md">
                        Overdue
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-xl">
            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <h3 className="text-lg font-semibold text-secondary-900 mb-lg">Payment Methods</h3>
              <div className="space-y-sm">
                <div className="flex items-center justify-between p-sm bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-sm">
                    <span className="text-lg">💳</span>
                    <span className="text-sm font-medium">Credit Card</span>
                  </div>
                  <span className="text-xs text-success-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-sm bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-sm">
                    <span className="text-lg">🏦</span>
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </div>
                  <span className="text-xs text-success-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-sm bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-sm">
                    <span className="text-lg">📱</span>
                    <span className="text-sm font-medium">UPI</span>
                  </div>
                  <span className="text-xs text-success-600">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <h3 className="text-lg font-semibold text-secondary-900 mb-lg">Quick Actions</h3>
              <div className="space-y-sm">
                <Button variant="primary" className="w-full justify-start">
                  💳 Record Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📊 Payment Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🔔 Send Reminders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  ⚙️ Settings
                </Button>
              </div>
            </div>

            {/* Payment Alerts */}
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <h3 className="text-lg font-semibold text-secondary-900 mb-lg">Alerts</h3>
              <div className="space-y-md">
                <div className="flex items-start space-x-sm">
                  <div className="w-2 h-2 bg-error-500 rounded-full mt-sm"></div>
                  <div>
                    <p className="text-sm text-secondary-900">3 payments overdue</p>
                    <p className="text-xs text-secondary-500">Action required</p>
                  </div>
                </div>
                <div className="flex items-start space-x-sm">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-sm"></div>
                  <div>
                    <p className="text-sm text-secondary-900">5 payments due this week</p>
                    <p className="text-xs text-secondary-500">Send reminders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments; 