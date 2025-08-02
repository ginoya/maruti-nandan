import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Invoice from './pages/Invoice'
import CreateInvoice from './pages/CreateInvoice'
import Payments from './pages/Payments'
import Components from './pages/Components'
import ComponentsOverview from './pages/components/ComponentsOverview'
import ButtonsPage from './pages/components/ButtonsPage'
import InputsPage from './pages/components/InputsPage'
import Dashboard from './pages/Dashboard'
import DashboardOverview from './pages/dashboard/DashboardOverview'
import Settings from './pages/Settings'
import './App.css'

function App() {
  return (
    <AuthProvider>
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
          
          {/* Payments Routes */}
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          
          {/* Components Routes with Nested Structure */}
          <Route path="/components" element={
            <ProtectedRoute>
              <Components />
            </ProtectedRoute>
          }>
            <Route index element={<ComponentsOverview />} />
            <Route path="buttons" element={<ButtonsPage />} />
            <Route path="inputs" element={<InputsPage />} />
            <Route path="forms" element={<div className="p-xl text-center"><h2 className="text-2xl font-bold text-secondary-900">Forms Page</h2><p className="text-secondary-600">Forms examples coming soon...</p></div>} />
          </Route>
          
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
          
          {/* Settings Route */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
