import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { useAuth } from './hooks/useAuth';
import { RoleBasedAccess } from './components/auth/RoleBasedAccess';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UserProfile } from './components/user/profile/UserProfile';
import { HomePage } from './components/pages/HomePage';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { OrphanApplicationsView } from './components/orphan/OrphanApplicationsView';
import { OrphanApplicationView } from './components/orphan/OrphanApplicationView';
import { CreateOrphanApplication } from './components/orphan/CreateOrphanApplication';
import { UpdateOrphanApplication } from './components/orphan/UpdateOrphanApplication';
import { UserCreation } from './components/user/creation/UserCreation';
import {
  CreateHeartSurgeryApplication,
  UpdateHeartSurgeryApplication,
  HeartSurgeryApplicationView,
  HeartSurgeryApplicationsView,
  CreateEyeSurgeryApplication,
  UpdateEyeSurgeryApplication,
  EyeSurgeryApplicationView,
  EyeSurgeryApplicationsView,
} from './components/medical';

function App() {
  const { loading, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debug logging
  React.useEffect(() => {
    console.log('[App] Component mounted/updated');
    console.log('[App] Current path:', window.location.pathname);
    console.log('[App] Loading:', loading);
    console.log('[App] User:', user?.username);
  }, [loading, user]);

  // Don't render a completely different component during loading
  // This causes React Router to lose track of the current route
  if (loading) {
    console.log('[App] Showing loading spinner at path:', window.location.pathname);
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <LoadingSpinner message="Initializing Qatar Charity Bangladesh..." />
        </div>
      </ThemeProvider>
    );
  }

  console.log('[App] Rendering routes at path:', window.location.pathname);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Header
            onMenuToggle={handleMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile userId={user?.id || user?.username || ''} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <OrphanApplicationsView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications/create"
                element={
                  <ProtectedRoute requiredRoles={['app-admin', 'app-agent']}>
                    <CreateOrphanApplication />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications/:id"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <OrphanApplicationView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/applications/:id/edit"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <UpdateOrphanApplication />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users/create"
                element={
                  <RoleBasedAccess requiredRoles={['app-admin', 'app-agent']}>
                    <UserCreation />
                  </RoleBasedAccess>
                }
              />

              <Route
                path="/medical/heart-surgery"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <HeartSurgeryApplicationsView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/heart-surgery/create"
                element={
                  <ProtectedRoute requiredRoles={['app-admin', 'app-agent']}>
                    <CreateHeartSurgeryApplication />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/heart-surgery/:id"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <HeartSurgeryApplicationView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/heart-surgery/:id/edit"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <UpdateHeartSurgeryApplication />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/eye-surgery"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <EyeSurgeryApplicationsView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/eye-surgery/create"
                element={
                  <ProtectedRoute requiredRoles={['app-admin', 'app-agent']}>
                    <CreateEyeSurgeryApplication />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/eye-surgery/:id"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <EyeSurgeryApplicationView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/medical/eye-surgery/:id/edit"
                element={
                  <ProtectedRoute requiredRoles={['app-agent', 'app-authenticator', 'app-admin']}>
                    <UpdateEyeSurgeryApplication />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;