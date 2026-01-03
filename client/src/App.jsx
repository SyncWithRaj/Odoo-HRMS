import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Layout & Protection
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Core Feature Pages
import Attendance from './pages/Attendance';
import EmployeeList from './pages/EmployeeList';
import TimeOff from './pages/TimeOff';
import Profile from './pages/Profile';
import AboutUs from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Private Routes (Wrapped in Layout) */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>

              {/* --- UPDATED: Default Redirect --- */}
              {/* Now, when a user hits /dashboard or just logs in, they land on Employees */}
              <Route path="/" element={<Navigate to="/employees" />} />
              <Route path="/dashboard" element={<Navigate to="/employees" />} />

              {/* 1. Employee Directory (Now Shared by Admin & Employee) */}
              {/* Your EmployeeList.jsx now handles the role-based view internally */}
              <Route path="/employees" element={<EmployeeList />} />

              {/* 2. Attendance (Check In/Out) */}
              <Route path="/attendance" element={<Attendance />} />

              {/* 3. Leaves / Time Off Management */}
              <Route path="/leaves" element={<TimeOff />} />

              {/* 4. User Profile & Salary View */}
              <Route path="/profile" element={<Profile />} />

              <Route path="/about" element={<AboutUs />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;