import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  User, DollarSign, Shield, Save, Briefcase, FileText, Lock, Edit2 
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth(); // Used for avatar/header fallback
  const [activeTab, setActiveTab] = useState('privateinfo');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for Salary Data
  const [salary, setSalary] = useState(null);

  // Form State for Personal Info
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    dateOfBirth: '', address: '', nationality: '', personalEmail: '',
    gender: '', maritalStatus: '',
    bankName: '', accountNumber: '', ifscCode: '', panNo: '', uanNo: ''
  });

  // 1. Fetch Profile Data on Mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            phone: data.phone || '',
            email: data.email || '',
            dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
            address: data.address || '',
            nationality: data.nationality || '',
            personalEmail: data.personalEmail || '',
            gender: data.gender || '',
            maritalStatus: data.maritalStatus || '',
            bankName: data.bankName || '',
            accountNumber: data.accountNumber || '',
            ifscCode: data.ifscCode || '',
            panNo: data.panNo || '',
            uanNo: data.uanNo || ''
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchProfileData();
  }, []);

  // 2. Fetch Salary Data when Tab changes
  useEffect(() => {
    const fetchSalary = async () => {
      if (activeTab === 'salaryinfo' && user?.id) {
        try {
          const res = await api.get(`/salary/${user.id}`);
          setSalary(res.data);
        } catch (error) {
          // It's normal to error if no salary record exists yet
          setSalary(null);
        }
      }
    };
    fetchSalary();
  }, [activeTab, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/users/profile', formData);
      setIsEditing(false);
      alert("Profile Saved!");
    } catch (error) {
      console.error(error);
      alert("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-gray-700">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>

            <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-wide flex items-center gap-3">
                            {isEditing ? (
                                <>
                                  <input name="firstName" value={formData.firstName} onChange={handleChange} className="bg-gray-700 text-white p-1 rounded w-32" />
                                  <input name="lastName" value={formData.lastName} onChange={handleChange} className="bg-gray-700 text-white p-1 rounded w-32" />
                                </>
                            ) : (
                                `${formData.firstName} ${formData.lastName}`
                            )}
                        </h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <Briefcase size={16} /> {user?.role} • {user?.employeeId}
                        </p>
                    </div>
                    
                    {activeTab === 'privateinfo' && (
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                        >
                            {loading ? 'Saving...' : (isEditing ? <><Save size={18}/> Save</> : <><Edit2 size={18}/> Edit Profile</>)}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-700 mt-4">
                    <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase font-semibold">Email</label>
                        <p className="text-indigo-400 font-medium">{formData.email}</p>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase font-semibold">Mobile</label>
                         {isEditing ? (
                            <input name="phone" value={formData.phone} onChange={handleChange} className="bg-gray-700 text-white px-2 py-1 rounded w-full" />
                         ) : (
                            <p className="text-gray-300 font-medium">{formData.phone || "--"}</p>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-8 mt-10 border-b border-gray-700 overflow-x-auto">
            {['Resume', 'Private Info', 'Salary Info', 'Security'].map((tab) => {
                const tabKey = tab.toLowerCase().replace(' ', '');
                return (
                  <button
                      key={tabKey}
                      onClick={() => { setActiveTab(tabKey); setIsEditing(false); }}
                      className={`pb-4 text-sm font-medium transition-all relative px-2 whitespace-nowrap ${
                          activeTab === tabKey 
                          ? 'text-white border-b-2 border-indigo-500' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                  >
                      {tab}
                  </button>
                )
            })}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[500px]">
        
        {/* TAB 1: PRIVATE INFO */}
        {activeTab === 'privateinfo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 animate-in fade-in duration-300">
                {/* Personal Details */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                       <User className="mr-2 text-indigo-400" size={20}/> Personal Details
                    </h3>
                    <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} disabled={!isEditing} />
                    <InputField label="Residing Address" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} />
                    <InputField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing} />
                    <InputField label="Personal Email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} disabled={!isEditing} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Gender" name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} />
                        <InputField label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                       <DollarSign className="mr-2 text-green-400" size={20}/> Bank Details
                    </h3>
                    <InputField label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} disabled={!isEditing} />
                    <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} disabled={!isEditing} />
                    <InputField label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} disabled={!isEditing} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="PAN No" name="panNo" value={formData.panNo} onChange={handleChange} disabled={!isEditing} />
                        <InputField label="UAN No" name="uanNo" value={formData.uanNo} onChange={handleChange} disabled={!isEditing} />
                    </div>
                </div>
            </div>
        )}

        {/* TAB 2: SALARY INFO */}
        {activeTab === 'salaryinfo' && (
            <div className="animate-in fade-in duration-300">
                {!salary ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <DollarSign size={48} className="mb-4 opacity-20"/>
                        <p>No salary record found. Contact Admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center mb-6">
                            <DollarSign className="mr-2 text-green-400" /> Earnings
                            </h3>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                <span className="text-gray-400">Basic Salary</span>
                                <span className="text-white font-mono font-bold">${salary.basicSalary}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                <span className="text-gray-400">HRA</span>
                                <span className="text-white font-mono font-bold">${salary.hra}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                                <span className="text-gray-400">Allowances</span>
                                <span className="text-white font-mono font-bold">${salary.allowances}</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-bold text-gray-400 mb-4">Deductions</h3>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-red-900/10 border border-red-500/20">
                                    <span className="text-red-300">Tax & PF</span>
                                    <span className="text-red-400 font-mono font-bold">-${salary.deductions}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 p-6 rounded-xl border border-green-500/30 flex items-center justify-between">
                                <div>
                                    <p className="text-green-300 text-sm font-medium uppercase tracking-wider">Net Monthly Salary</p>
                                    <p className="text-3xl font-bold text-white mt-1">${salary.netSalary}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/50">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* TAB 3: PLACEHOLDERS */}
        {(activeTab === 'resume' || activeTab === 'security') && (
             <div className="flex flex-col items-center justify-center h-full text-gray-500">
                 <Lock size={48} className="mb-4 opacity-50"/>
                 <p>This section is under development.</p>
             </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, name, type = "text", value, onChange, disabled }) => (
    <div className="space-y-1 group">
        <label className="text-gray-400 text-xs uppercase font-bold tracking-wider transition-colors group-hover:text-indigo-400">{label}</label>
        {disabled ? (
            <div className="w-full bg-gray-900/50 text-gray-300 px-4 py-2.5 rounded-lg border border-gray-700 font-medium min-h-[46px] flex items-center">
                {value || "-"}
            </div>
        ) : (
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                placeholder={`Enter ${label}`}
            />
        )}
    </div>
);

export default Profile;