import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Layout & Protection
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Core Feature Pages (Now importing the REAL files)
import Attendance from './pages/Attendance';
import EmployeeList from './pages/EmployeeList'; // This is your Admin Dashboard
import TimeOff from './pages/TimeOff';           // Connects to /leaves
import Profile from './pages/Profile';           // Connects to /profile

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast Notifications */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes (Wrapped in Layout) */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              
              {/* Default Redirect to Attendance */}
              <Route path="/dashboard" element={<Navigate to="/attendance" />} />
              
              {/* 1. Attendance (Check In/Out) */}
              <Route path="/attendance" element={<Attendance />} />
              
              {/* 2. Leaves / Time Off Management */}
              <Route path="/leaves" element={<TimeOff />} />
              
              {/* 3. User Profile & Salary View */}
              <Route path="/profile" element={<Profile />} />
              
              {/* 4. Admin Only: Employee Directory & Analytics */}
              <Route element={<PrivateRoute requiredRole="ADMIN" />}>
                <Route path="/employees" element={<EmployeeList />} />
              </Route>

            </Route>
          </Route>

          {/* Catch-all: Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;