// src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import QuickLogFAB from './components/QuickLogFAB';
import { LangProvider } from './contexts/LangContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Log = lazy(() => import('./pages/Log'));
const Rulebook = lazy(() => import('./pages/Rulebook'));
const Guides = lazy(() => import('./pages/Guides'));
const Settings = lazy(() => import('./pages/Settings'));

function RouteSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="h-32 w-full bg-gray-200 rounded-2xl animate-pulse" />
      <div className="h-56 w-full bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  );
}

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
      {session && !loading && <QuickLogFAB />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteSkeleton />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/log"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteSkeleton />}>
                <Log />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rulebook"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteSkeleton />}>
                <Rulebook />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/guides"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteSkeleton />}>
                <Guides />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteSkeleton />}>
                <Settings />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
    </LangProvider>
  );
}
