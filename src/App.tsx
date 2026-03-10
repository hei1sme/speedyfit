// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Rulebook from './pages/Rulebook';
import Guides from './pages/Guides';
import Settings from './pages/Settings';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import { LangProvider } from './contexts/LangContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-400 text-lg">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { session, loading } = useAuth();

  return (
    <LangProvider>
      <ErrorBoundary>
      {session && !loading && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <Log />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rulebook"
          element={
            <ProtectedRoute>
              <Rulebook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guides"
          element={
            <ProtectedRoute>
              <Guides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
    </LangProvider>
  );
}
