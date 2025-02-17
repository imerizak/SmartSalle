import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
}

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}
