import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Users, UserCheck, Clock, FileText, TrendingUp,
  X, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, ExternalLink
} from 'lucide-react';

const EmployeeList = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryForm, setSalaryForm] = useState({ basicSalary: 0, hra: 0, allowances: 0, deductions: 0 });

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const empRes = await api.get('/users');
      setEmployees(empRes.data);
      if (isAdmin) {
        const statRes = await api.get('/admin/stats');
        setStats(statRes.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const getTenure = (dateString) => {
    if (!dateString) return 'N/A';
    const start = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} Days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} Months`;
    return `${(diffDays / 365).toFixed(1)} Years`;
  };

  const handleCardClick = async (id) => {
    setLoadingProfile(true);
    try {
      const res = await api.get(`/users/${id}`);
      setSelectedEmp(res.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const openSalaryModal = async () => {
    setShowSalaryModal(true);
    try {
      const res = await api.get(`/salary/${selectedEmp.id}`);
      setSalaryForm(res.data);
    } catch (e) {
      setSalaryForm({ basicSalary: 0, hra: 0, allowances: 0, deductions: 0 });
    }
  };

  const handleSaveSalary = async () => {
    try {
      await api.post(`/salary/${selectedEmp.id}`, salaryForm);
      alert("Salary Updated Successfully!");
      setShowSalaryModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update salary");
    }
  };

  return (
    <div className="space-y-8 relative p-4 lg:p-0">
      {/* 1. ADMIN ONLY: ANALYTICS SNAPSHOT */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={stats?.totalEmployees}
            icon={<Users className="text-indigo-400" />}
            onClick={() => navigate('/employees')}
          />
          <StatCard
            title="Present Today"
            value={stats?.presentToday}
            icon={<UserCheck className="text-green-400" />}
            onClick={() => navigate('/attendance')}
          />
          <StatCard
            title="Pending Leaves"
            value={stats?.pendingLeaves}
            icon={<Clock className="text-yellow-400" />}
            onClick={() => navigate('/leaves')}
          />
          <StatCard
            title="Avg. Approval"
            value="4.2 hrs"
            icon={<TrendingUp className="text-blue-400" />}
            subText="↓ 12% vs last week"
          />
        </div>
      )}

      {/* 2. SHARED LAYOUT: DIRECTORY & LOGS */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>

        {/* EMPLOYEE CARDS DIRECTORY */}
        <div className={isAdmin ? 'lg:col-span-2' : 'col-span-full'}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Employee Directory</h2>
            <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
              {employees.length} Members
            </span>
          </div>

          {/* EMPLOYEE CARDS DIRECTORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {employees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleCardClick(emp.id)}
                className="group relative bg-gray-800/40 border border-gray-700/50 rounded-[2rem] p-8 transition-all duration-500 hover:border-indigo-500/50 hover:bg-gray-800/80 hover:-translate-y-3 cursor-pointer shadow-xl hover:shadow-indigo-500/10 flex flex-col items-center overflow-hidden"
              >
                {/* Centered Profile Logo/Avatar */}
                <div className="relative mb-6">
                  {/* Pulsing ring for visual interest */}
                  <div className="absolute -inset-2 rounded-full bg-indigo-500/10 animate-pulse group-hover:bg-indigo-500/20 transition-colors"></div>

                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/20 to-indigo-900/40 text-indigo-400 flex items-center justify-center font-black text-3xl border-2 border-indigo-500/30 shadow-2xl group-hover:border-indigo-500/60 transition-all duration-500 group-hover:scale-110">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>

                  {/* Status indicator (Optional - can represent 'Online' or 'Checked In') */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-gray-800 rounded-full shadow-lg"></div>
                </div>

                {/* Primary Info - Centered Text */}
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                    {emp.firstName} {emp.lastName}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Briefcase size={14} className="text-indigo-400" />
                    <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                      {emp.role}
                    </span>
                  </div>
                </div>

                {/* Bottom Data Section - Full Width */}
                <div className="w-full pt-6 border-t border-gray-700/50 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-gray-500">Employee ID</span>
                    <span className="text-gray-300 font-mono bg-gray-900/50 px-2 py-1 rounded">
                      {emp.employeeId}
                    </span>
                  </div>

                  {/* Interactive 'View Profile' Trigger */}
                  <div className="flex justify-between items-center text-[10px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span>View Detailed Profile</span>
                    <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ADMIN ONLY: AUDIT LOGS */}
        {isAdmin && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden h-fit shadow-xl">
            <div className="p-6 border-b border-gray-700 bg-gray-800/50">
              <h2 className="text-lg font-bold text-white flex items-center">
                <FileText className="mr-2 text-indigo-400" size={18} /> Recent Activity
              </h2>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {stats?.logs?.map(log => (
                <div key={log.id} className="group text-sm border-l-2 border-gray-700 hover:border-indigo-500 pl-3 py-1 transition-colors">
                  <p className="text-gray-300 group-hover:text-white">{log.details}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {!stats?.logs?.length && <p className="text-gray-500 text-center py-8 italic">No recent activity logs.</p>}
            </div>
          </div>
        )}
      </div>

      {/* POPUPS (SelectedEmp & Salary Modal remain functionally the same with polished styles) */}
      {selectedEmp && <EmployeeDetailPopup selectedEmp={selectedEmp} setSelectedEmp={setSelectedEmp} isAdmin={isAdmin} openSalaryModal={openSalaryModal} getTenure={getTenure} />}

      {isAdmin && showSalaryModal && (
        <SalaryModal
          salaryForm={salaryForm}
          setSalaryForm={setSalaryForm}
          setShowSalaryModal={setShowSalaryModal}
          handleSaveSalary={handleSaveSalary}
          selectedEmp={selectedEmp}
        />
      )}
    </div>
  );
};

// Sub-components for cleaner structure
const StatCard = ({ title, value, icon, onClick, subText }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg cursor-pointer hover:bg-gray-750 hover:scale-[1.02] transition-all duration-300 group"
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-gray-400 font-medium text-sm">{title}</h3>
      <div className="p-2 bg-gray-900 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-white">{value || 0}</p>
    {subText && <p className="text-xs text-green-400 mt-1">{subText}</p>}
  </div>
);

const EmployeeDetailPopup = ({ selectedEmp, setSelectedEmp, isAdmin, openSalaryModal, getTenure }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
    <div className="bg-gray-800 border border-gray-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
      <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-indigo-800">
        <button onClick={() => setSelectedEmp(null)} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition"><X size={20} /></button>
      </div>
      <div className="px-8 pb-8 -mt-12 relative">
        <div className="w-24 h-24 rounded-2xl bg-gray-900 border-4 border-gray-800 flex items-center justify-center text-3xl font-bold text-indigo-400 shadow-xl mb-6">
          {selectedEmp.firstName[0]}{selectedEmp.lastName[0]}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{selectedEmp.firstName} {selectedEmp.lastName}</h2>
        <span className="inline-block bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase border border-indigo-500/20 mb-8">{selectedEmp.role}</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-700 pb-2">Communication</h3>
            <div className="flex items-center gap-3 text-sm"><Mail size={16} className="text-gray-400" /> <span className="text-gray-200">{selectedEmp.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><Phone size={16} className="text-gray-400" /> <span className="text-gray-200">{selectedEmp.phone || "N/A"}</span></div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-700 pb-2">Professional</h3>
            <div className="flex items-center gap-3 text-sm"><Calendar size={16} className="text-gray-400" /> <span className="text-gray-200">Joined: {new Date(selectedEmp.joiningDate).toLocaleDateString()}</span></div>
            <div className="flex items-center gap-3 text-sm"><Clock size={16} className="text-gray-400" /> <span className="text-gray-200">Tenure: {getTenure(selectedEmp.joiningDate)}</span></div>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-10 pt-6 border-t border-gray-700 flex gap-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-600/20">View Records</button>
            <button onClick={openSalaryModal} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"><DollarSign size={16} /> Manage Payroll</button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SalaryModal = ({ salaryForm, setSalaryForm, setShowSalaryModal, handleSaveSalary, selectedEmp }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
    <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
      <h3 className="text-2xl font-bold text-white mb-2">Manage Salary</h3>
      <p className="text-gray-400 text-sm mb-8">Update payroll for <span className="text-indigo-400 font-bold">{selectedEmp?.firstName}</span></p>
      <div className="space-y-5">
        <SalaryInput label="Basic Salary" value={salaryForm.basicSalary} onChange={v => setSalaryForm({ ...salaryForm, basicSalary: v })} />
        <div className="grid grid-cols-2 gap-4">
          <SalaryInput label="HRA" value={salaryForm.hra} onChange={v => setSalaryForm({ ...salaryForm, hra: v })} />
          <SalaryInput label="Allowances" value={salaryForm.allowances} onChange={v => setSalaryForm({ ...salaryForm, allowances: v })} />
        </div>
        <SalaryInput label="Deductions" value={salaryForm.deductions} onChange={v => setSalaryForm({ ...salaryForm, deductions: v })} isRed />
      </div>
      <div className="flex gap-4 mt-10">
        <button onClick={() => setShowSalaryModal(false)} className="flex-1 bg-transparent border border-gray-700 text-gray-400 py-3 rounded-xl hover:bg-gray-800 transition">Cancel</button>
        <button onClick={handleSaveSalary} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-500 transition">Update</button>
      </div>
    </div>
  </div>
);

const SalaryInput = ({ label, value, onChange, isRed }) => (
  <div>
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">{label}</label>
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full bg-gray-800 border ${isRed ? 'border-red-900/30' : 'border-gray-700'} rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
    />
  </div>
);

export default EmployeeList;