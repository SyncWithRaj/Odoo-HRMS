import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Briefcase, ArrowRight, Clock } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'EMPLOYEE'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    if (result.success) {
      toast.success(`Account created as ${formData.role}!`);
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden px-4 py-12">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />

      <div className="max-w-lg w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl rotate-12 flex items-center justify-center mb-4 shadow-xl shadow-indigo-600/20">
            <Clock className="text-white -rotate-12" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Join Kinetix</h1>
          <p className="text-gray-500 font-medium mt-1 text-sm text-center">Start managing your workflow and team efficiency</p>
        </div>

        {/* Signup Card */}
        <div className="bg-gray-900/50 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Fields Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input type="text" 
                    placeholder="John"
                    className="w-full bg-gray-800/50 text-white pl-11 pr-4 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 text-sm"
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Last Name</label>
                <input type="text" 
                  placeholder="Doe"
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 text-sm"
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Company Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input type="email" 
                  placeholder="john.doe@company.com"
                  className="w-full bg-gray-800/50 text-white pl-11 pr-4 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">System Role</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors pointer-events-none" size={16} />
                <select 
                  className="w-full bg-gray-800/50 text-white pl-11 pr-4 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer text-sm appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Administrator (HR)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-[10px]">▼</div>
              </div>
            </div>

            {/* Phone & Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Phone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input type="tel" 
                    placeholder="+1 (555) 000"
                    className="w-full bg-gray-800/50 text-white pl-11 pr-4 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 text-sm"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                  <input type="password" 
                    placeholder="••••••••"
                    className="w-full bg-gray-800/50 text-white pl-11 pr-4 py-3 rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 text-sm"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-8 pt-6 border-t border-gray-800/50 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Already part of the team?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;