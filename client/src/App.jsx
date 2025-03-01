import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from './recoil/atoms/authAtom';
import { checkToken } from './utils/tokenManager';

// Pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import Problems from './pages/Problems';
import Thread from './pages/Thread';

// Layout
import AppLayout from './components/layout/AppLayout';

// Auth protection component
const RequireAuth = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};

const App = () => {
  const [auth, setAuth] = useRecoilState(authState);

  // Check token on app load
  useEffect(() => {
    const initAuth = async () => {
      const isTokenValid = await checkToken();
      
      if (isTokenValid) {
        setAuth({
          isAuthenticated: true,
          isLoading: false,
          user: isTokenValid.user
        });
      } else {
        setAuth({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
      }
    };

    initAuth();
  }, [setAuth]);

  // Show loading state
  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading DSA Teaching Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!auth.isAuthenticated ? <Auth /> : <Navigate to="/" />} />
        
        {/* Protected Routes - Wrapped in AppLayout */}
        <Route element={<RequireAuth isAuthenticated={auth.isAuthenticated} />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/thread/:id" element={<Thread />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;