import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PedhisProvider from './components/PedhisProvider'
import CustomersProvider from './components/CustomersProvider'
import Home from './pages/Home'
import Login from './pages/Login'
import Invoice from './pages/Invoice'
import CreateInvoice from './pages/CreateInvoice'
import Customers from './pages/Customers'
import Payments from './pages/Payments'
import Dashboard from './pages/Dashboard'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import './App.css'
import { useAppSelector } from './store/hooks'

function App() {
  const state = useAppSelector((state) => state);
  console.log('state--->', state);
  return (
    <AuthProvider>
      <PedhisProvider>
        <CustomersProvider>
          <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          {/* Invoice Routes */}
          <Route path="/invoice" element={
            <ProtectedRoute>
              <Invoice />
            </ProtectedRoute>
          } />
          <Route path="/invoice/new" element={
            <ProtectedRoute>
              <CreateInvoice />
            </ProtectedRoute>
          } />
          
          {/* Customers Routes */}
          <Route path="/customers" element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } />
          
          {/* Payments Routes */}
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          
          {/* Dashboard Routes with Nested Structure */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<div className="p-xl text-center"><h2 className="text-2xl font-bold text-secondary-900">Profile Page</h2><p className="text-secondary-600">User profile management coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-xl text-center"><h2 className="text-2xl font-bold text-secondary-900">Dashboard Settings</h2><p className="text-secondary-600">Dashboard-specific settings coming soon...</p></div>} />
          </Route>
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </CustomersProvider>
      </PedhisProvider>
    </AuthProvider>
  )
}

export default App
