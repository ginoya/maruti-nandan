import React from 'react';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-xl">
        {/* Welcome Section */}
        <div className="mb-2xl">
          <h1 className="text-3xl font-bold text-secondary-900 mb-md">Welcome to Dashboard</h1>
          <p className="text-secondary-600">Manage your invoices, payments, and business operations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-xl mb-2xl">
          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Total Revenue</h3>
              <span className="text-2xl font-bold text-success-600">₹1,25,000</span>
            </div>
            <p className="text-sm text-secondary-600">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Active Invoices</h3>
              <span className="text-2xl font-bold text-primary-600">24</span>
            </div>
            <p className="text-sm text-secondary-600">Pending payments</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Completed</h3>
              <span className="text-2xl font-bold text-accent-600">18</span>
            </div>
            <p className="text-sm text-secondary-600">This month</p>
          </div>

          <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-lg font-semibold text-secondary-900">Growth</h3>
              <span className="text-2xl font-bold text-primary-600">+12%</span>
            </div>
            <p className="text-sm text-secondary-600">vs last month</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2xl">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <h2 className="text-xl font-semibold text-secondary-900 mb-xl">Recent Activity</h2>
              
              <div className="space-y-md">
                <div className="flex items-center space-x-md p-md bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                    <span className="text-success-600 text-lg">✓</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">Payment Received</h4>
                    <p className="text-sm text-secondary-600">Invoice #INV-001 - ₹12,500</p>
                    <p className="text-xs text-secondary-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-md p-md bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 text-lg">📄</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">New Invoice Created</h4>
                    <p className="text-sm text-secondary-600">Invoice #INV-025 - ABC Company</p>
                    <p className="text-xs text-secondary-500">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-md p-md bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-accent-600 text-lg">⏳</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">Payment Reminder Sent</h4>
                    <p className="text-sm text-secondary-600">Invoice #INV-020 - XYZ Corp</p>
                    <p className="text-xs text-secondary-500">2 days ago</p>
                  </div>
                </div>

                <div className="flex items-center space-x-md p-md bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                    <span className="text-error-600 text-lg">⚠</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">Payment Overdue</h4>
                    <p className="text-sm text-secondary-600">Invoice #INV-018 - DEF Ltd</p>
                    <p className="text-xs text-secondary-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-xl">
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <h3 className="text-lg font-semibold text-secondary-900 mb-lg">Quick Actions</h3>
              <div className="space-y-sm">
                <Button variant="gradient" className="w-full justify-start">
                  📄 Create Invoice
                </Button>
                <Button variant="primary" className="w-full justify-start">
                  💳 Record Payment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  📊 View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  🔔 Send Reminders
                </Button>
              </div>
            </div>

            {/* Alerts */}
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
                <div className="flex items-start space-x-sm">
                  <div className="w-2 h-2 bg-success-500 rounded-full mt-sm"></div>
                  <div>
                    <p className="text-sm text-secondary-900">2 new payments received</p>
                    <p className="text-xs text-secondary-500">Today</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-xl">
              <h3 className="text-lg font-semibold text-secondary-900 mb-lg">Recent Invoices</h3>
              <div className="space-y-md">
                <div className="border-b border-gray-100 pb-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-secondary-900">#INV-025</p>
                      <p className="text-sm text-secondary-600">ABC Company</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹15,000</p>
                      <span className="inline-block px-xs py-xs bg-accent-100 text-accent-700 text-xs rounded">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-secondary-900">#INV-024</p>
                      <p className="text-sm text-secondary-600">XYZ Corp</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹8,500</p>
                      <span className="inline-block px-xs py-xs bg-success-100 text-success-700 text-xs rounded">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-secondary-900">#INV-023</p>
                      <p className="text-sm text-secondary-600">DEF Ltd</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-secondary-900">₹12,200</p>
                      <span className="inline-block px-xs py-xs bg-error-100 text-error-700 text-xs rounded">
                        Overdue
                      </span>
                    </div>
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

export default Home; 