import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Clock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Access Granted. Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden px-4">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />

      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700">
        {/* Logo/Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl rotate-12 flex items-center justify-center mb-4 shadow-xl shadow-indigo-600/20">
            <Clock className="text-white -rotate-12" size={32} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Kinetix</h1>
          <p className="text-gray-500 font-medium mt-1">Enterprise Resource Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl relative">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-8 font-medium">Please enter your credentials to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email / User ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  className="w-full bg-gray-800/50 text-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                  placeholder="name@company.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  className="w-full bg-gray-800/50 text-white pl-12 pr-4 py-3.5 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
            <p className="text-gray-500 text-sm font-medium">
              New to the platform?{' '}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-600 text-[10px] uppercase font-black tracking-tighter mt-8 opacity-50">
          DayFlow v2.0 • Secure End-to-End Encryption
        </p>
      </div>
    </div>
  );
};

export default Login;