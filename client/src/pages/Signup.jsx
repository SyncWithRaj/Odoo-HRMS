import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'EMPLOYEE' // Default role
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      toast.success(`Account created as ${formData.role}!`);
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">First Name</label>
              <input type="text" 
                className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Last Name</label>
              <input type="text" 
                className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input type="email" 
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {/* Role Selection (Added) */}
          <div>
            <label className="block text-gray-400 mb-1">Select Role</label>
            <select 
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin (HR Officer)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              *Select Admin to access full HR dashboard features
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-400 mb-1">Phone</label>
            <input type="tel" 
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input type="password" 
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold transition">
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;