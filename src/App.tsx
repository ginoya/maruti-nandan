import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomersProvider from './components/CustomersProvider'
import PedhisProvider from './components/PedhisProvider'
import InvoicesProvider from './components/InvoicesProvider'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetails from './pages/CustomerDetails'
import Invoice from './pages/Invoice'
import ViewInvoice from './pages/ViewInvoice'
import CreateInvoice from './pages/CreateInvoice'
import EditInvoice from './pages/EditInvoice'
import Payments from './pages/Payments'
import MonthwiseReport from './pages/MonthwiseReport'

function App() {
  return (
    <AuthProvider>
      <Router>
        <CustomersProvider>
          <PedhisProvider>
            <InvoicesProvider>
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
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* Customers Routes */}
                <Route path="/customers" element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } />
                
                <Route path="/customer/:customerName" element={
                  <ProtectedRoute>
                    <CustomerDetails />
                  </ProtectedRoute>
                } />
                
                {/* Invoice Routes */}
                <Route path="/create-invoice" element={
                  <ProtectedRoute>
                    <CreateInvoice />
                  </ProtectedRoute>
                } />
                
                <Route path="/invoice/new" element={
                  <ProtectedRoute>
                    <CreateInvoice mode='create'/>
                  </ProtectedRoute>
                } />
                
                <Route path="/invoice/:id" element={
                  <ProtectedRoute>
                    <ViewInvoice />
                  </ProtectedRoute>
                } />
                
                <Route path="/invoice/:id/edit" element={
                  <ProtectedRoute>
                    <EditInvoice />
                  </ProtectedRoute>
                } />
                
                <Route path="/invoice" element={
                  <ProtectedRoute>
                    <Invoice />
                  </ProtectedRoute>
                } />
                
                {/* Payments Routes */}
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                } />
                
                {/* Reports Routes */}
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <MonthwiseReport />
                  </ProtectedRoute>
                } />
              </Routes>
            </InvoicesProvider>
          </PedhisProvider>
        </CustomersProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
