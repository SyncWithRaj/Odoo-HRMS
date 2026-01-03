import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  User, DollarSign, Shield, Save, Briefcase, FileText, Lock, Edit2, Camera, Loader 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState('privateinfo');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [salary, setSalary] = useState(null);
  
  // Image State
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', email: '',
    dateOfBirth: '', address: '', nationality: '', personalEmail: '',
    gender: '', maritalStatus: '',
    bankName: '', accountNumber: '', ifscCode: '', panNo: '', uanNo: '',
    profilePic: '' // Stores the URL from DB
  });

  // 1. Fetch Profile Data
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
            uanNo: data.uanNo || '',
            profilePic: data.profilePic || ''
        });
        if(data.profilePic) setPreviewImage(data.profilePic);
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    };
    fetchProfileData();
  }, []);

  // 2. Fetch Salary (unchanged)
  useEffect(() => {
    const fetchSalary = async () => {
      if (activeTab === 'salaryinfo' && user?.id) {
        try {
          const res = await api.get(`/salary/${user.id}`);
          setSalary(res.data);
        } catch (error) {
          setSalary(null);
        }
      }
    };
    fetchSalary();
  }, [activeTab, user]);

  // Handle Text Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Local preview
    }
  };

  // Trigger File Input Click
  const handleCameraClick = () => {
    if (isEditing) {
        fileInputRef.current.click();
    }
  };

  // Save Profile (Send as FormData)
  const handleSave = async () => {
    setLoading(true);
    const loadId = toast.loading("Updating Profile...");

    try {
      // Create FormData object
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'profilePic') { // Don't send the URL string back
            data.append(key, formData[key]);
        }
      });

      // Append file if selected
      if (selectedFile) {
        data.append('profilePic', selectedFile);
      }

      // Send Request (Content-Type header is handled automatically by browser for FormData)
      await api.put('/users/profile', data);
      
      toast.success("Profile Updated!", { id: loadId });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* --- HEADER --- */}
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 relative overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            
            {/* AVATAR SECTION */}
            <div className="relative group">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 shadow-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 ${isEditing ? 'cursor-pointer' : ''}`}
                     onClick={handleCameraClick}
                >
                    {previewImage ? (
                        <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-4xl font-bold text-white">
                            {formData.firstName?.[0]}{formData.lastName?.[0]}
                        </span>
                    )}
                    
                    {/* Overlay for Editing */}
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    )}
                </div>
                
                {/* Hidden File Input */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
                
                {/* Edit Icon Badge */}
                {isEditing && (
                    <div className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full border-2 border-gray-800 text-white cursor-pointer hover:bg-indigo-500 shadow-lg"
                         onClick={handleCameraClick}>
                        <Camera size={16} />
                    </div>
                )}
            </div>

            {/* INFO SECTION */}
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <div className="flex gap-2 mb-1">
                                    <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg w-32 focus:outline-none focus:border-indigo-500" />
                                    <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg w-32 focus:outline-none focus:border-indigo-500" />
                                </div>
                            ) : (
                                <h1 className="text-3xl font-bold text-white tracking-wide">
                                    {formData.firstName} {formData.lastName}
                                </h1>
                            )}
                        </div>
                        <p className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
                            <Briefcase size={14} className="text-indigo-400" /> {user?.role} • <span className="font-mono text-gray-500">{user?.employeeId}</span>
                        </p>
                    </div>
                    
                    {activeTab === 'privateinfo' && (
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg active:scale-95
                                ${isEditing 
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20' 
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'}`}
                        >
                            {loading ? <Loader className="animate-spin" size={18}/> : (isEditing ? <><Save size={18}/> Save Changes</> : <><Edit2 size={18}/> Edit Profile</>)}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-700 mt-6">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Company Email</label>
                        <p className="text-white font-medium">{formData.email}</p>
                    </div>
                     <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Mobile Contact</label>
                         {isEditing ? (
                            <input name="phone" value={formData.phone} onChange={handleChange} className="bg-gray-700 border border-gray-600 text-white px-3 py-1 rounded-lg w-full text-sm focus:outline-none focus:border-indigo-500" />
                         ) : (
                            <p className="text-gray-300 font-medium">{formData.phone || "--"}</p>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex gap-8 mt-10 border-b border-gray-700 overflow-x-auto">
            {['Private Info', 'Salary Info', 'Documents', 'Security'].map((tab) => {
                const tabKey = tab.toLowerCase().replace(' ', '');
                return (
                  <button
                      key={tabKey}
                      onClick={() => { setActiveTab(tabKey); setIsEditing(false); }}
                      className={`pb-4 text-sm font-bold tracking-wide transition-all relative px-2 whitespace-nowrap ${
                          activeTab === tabKey 
                          ? 'text-white border-b-2 border-indigo-500' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                  >
                      {tab}
                  </button>
                )
            })}
        </div>
      </div>

      {/* --- CONTENT AREA (Tabs) --- */}
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 min-h-[500px] shadow-xl">
        
        {/* TAB 1: PRIVATE INFO */}
        {activeTab === 'privateinfo' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Personal Details */}
                <div className="space-y-6">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center uppercase tracking-widest border-b border-gray-700 pb-2">
                       <User className="mr-2 text-indigo-500" size={18}/> Personal Details
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
                    <h3 className="text-lg font-black text-white mb-6 flex items-center uppercase tracking-widest border-b border-gray-700 pb-2">
                       <DollarSign className="mr-2 text-emerald-500" size={18}/> Bank Details
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

        {/* TAB 2: SALARY INFO (Unchanged) */}
        {activeTab === 'salaryinfo' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {!salary ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <DollarSign size={48} className="mb-4 opacity-20"/>
                        <p>No salary record found. Contact Admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Earnings */}
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700 space-y-4">
                            <h3 className="text-lg font-black text-emerald-400 flex items-center mb-6 uppercase tracking-widest">
                                Earnings
                            </h3>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-colors">
                                <span className="text-gray-400 font-medium text-sm">Basic Salary</span>
                                <span className="text-white font-mono font-bold text-lg">${salary.basicSalary}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-colors">
                                <span className="text-gray-400 font-medium text-sm">HRA</span>
                                <span className="text-white font-mono font-bold text-lg">${salary.hra}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-colors">
                                <span className="text-gray-400 font-medium text-sm">Allowances</span>
                                <span className="text-white font-mono font-bold text-lg">${salary.allowances}</span>
                            </div>
                        </div>

                        {/* Deductions & Net */}
                        <div className="space-y-6">
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700">
                                <h3 className="text-lg font-black text-rose-400 mb-4 uppercase tracking-widest">Deductions</h3>
                                <div className="flex justify-between items-center p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                    <span className="text-rose-200 font-medium text-sm">Tax & PF</span>
                                    <span className="text-rose-400 font-mono font-bold text-lg">-${salary.deductions}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-emerald-900 to-green-900 p-8 rounded-2xl border border-emerald-500/30 flex items-center justify-between shadow-lg shadow-emerald-900/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <p className="text-emerald-300 text-xs font-black uppercase tracking-[0.2em] mb-2">Net Monthly Salary</p>
                                    <p className="text-4xl font-black text-white tracking-tighter">${salary.netSalary}</p>
                                </div>
                                <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/50 backdrop-blur-sm relative z-10">
                                    <DollarSign size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Placeholders */}
        {(activeTab === 'documents' || activeTab === 'security') && (
             <div className="flex flex-col items-center justify-center h-64 text-gray-600 animate-in fade-in">
                 <Lock size={64} className="mb-4 opacity-20"/>
                 <p className="font-bold uppercase tracking-widest text-sm">This section is under development</p>
             </div>
        )}
      </div>
    </div>
  );
};

// Reusable Input Component (Slightly improved styling)
const InputField = ({ label, name, type = "text", value, onChange, disabled }) => (
    <div className="space-y-1 group">
        <label className="text-gray-500 text-[10px] uppercase font-black tracking-widest transition-colors group-focus-within:text-indigo-400 ml-1">{label}</label>
        {disabled ? (
            <div className="w-full bg-gray-900/50 text-gray-400 px-4 py-3 rounded-xl border border-gray-700/50 font-medium text-sm min-h-[48px] flex items-center cursor-not-allowed">
                {value || <span className="opacity-20 italic">Not set</span>}
            </div>
        ) : (
            <input 
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm font-medium placeholder:text-gray-600"
                placeholder={`Enter ${label}`}
            />
        )}
    </div>
);

export default Profile;