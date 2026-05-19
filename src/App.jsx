import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Expenses from './pages/Expenses/Expenses';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import AuthGuard from './components/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page - only for unauthenticated users */}
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false} fallbackPath="/dashboard">
              <Login />
            </AuthGuard>
          }
        />

        {/* Protected routes with Layout wrapper */}
        <Route
          element={
            <AuthGuard requireAuth={true} fallbackPath="/login">
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
