import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, Calendar, Search, MapPin, ArrowRight, User as UserIcon, Coffee } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  
  // State for Employee View
  const [status, setStatus] = useState('LOADING');
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [leaveStats, setLeaveStats] = useState(0); // NEW: Total approved leaves for employee
  
  // State for Admin View
  const [adminRecords, setAdminRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. DATA FETCHING
  const fetchEmployeeData = async () => {
    try {
      const statusRes = await api.get('/attendance/status');
      setStatus(statusRes.data.status);
      if (statusRes.data.data) setTodayRecord(statusRes.data.data);

      const historyRes = await api.get('/attendance/my-history');
      setHistory(historyRes.data);

      // NEW: Fetch Leave Stats for the logged-in employee
      const statsRes = await api.get(`/users/stats/${user.id}`);
      setLeaveStats(statsRes.data.totalLeaveDays);
    } catch (error) {
      console.error("Employee fetch error:", error);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Admin fetches attendance for specific date
      const { data } = await api.get(`/attendance/all?date=${selectedDate}`);
      
      // NEW: We assume the backend updated the 'all' endpoint to include totalLeaveDays per user
      // or we map the results. For this implementation, we display what the API returns.
      setAdminRecords(data);
    } catch (error) {
      console.error("Admin fetch error:", error);
      toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAdminData();
    } else {
      fetchEmployeeData();
    }
  }, [user, selectedDate]);

  // 2. HANDLERS
  const handleAction = async () => {
    try {
      if (status === 'NOT_CHECKED_IN') {
        const res = await api.post('/attendance/check-in');
        if (res.data.message.includes("Late")) {
            toast('Checked In (Late)', { icon: '⚠️', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        } else {
            toast.success("Checked In Successfully!");
        }
      } else if (status === 'CHECKED_IN') {
        await api.put('/attendance/check-out');
        toast.success("Checked Out. Have a great evening!");
      }
      fetchEmployeeData();
    } catch (error) {
      toast.error("Action failed. Please try again.");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 3. ADMIN VIEW
  if (user?.role === 'ADMIN') {
    const filteredRecords = adminRecords.filter(record => 
      record.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Attendance Monitor</h1>
            <p className="text-gray-500 text-sm">Real-time tracking for {new Date(selectedDate).toDateString()}</p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative group">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search name or ID..." 
                className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-600"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/40 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800/50 text-gray-500 text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4 text-center">Work Hours</th>
                {/* NEW COLUMN FOR ADMIN */}
                <th className="px-6 py-4 text-center">Total Leaves</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-indigo-500/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xs font-bold mr-4 border border-gray-700 group-hover:border-indigo-500/50 transition-colors">
                          {record.user.firstName[0]}{record.user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-gray-200 font-semibold text-sm group-hover:text-white transition-colors">{record.user.firstName} {record.user.lastName}</p>
                          <p className="text-[10px] text-gray-600 font-mono uppercase tracking-tighter">{record.user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 font-mono text-sm font-medium">
                                {formatTime(record.checkIn)}
                            </span>
                            {record.isLate && (
                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-tighter">
                                    Late
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{formatTime(record.checkOut)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-indigo-400 font-bold text-sm bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        {record.workHours ? `${record.workHours}h` : '--'}
                      </span>
                    </td>
                    {/* NEW CELL FOR ADMIN */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-rose-400 font-bold text-sm bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                        {record.user.totalApprovedLeaves || 0} Days
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border
                        ${record.status === 'PRESENT' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                      `}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Search size={48} className="mb-2" />
                      <p className="text-sm font-medium">No records found for this date</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 4. EMPLOYEE VIEW
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
      
      {/* NEW: LEAVE STATS HEADER CARD FOR EMPLOYEE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-800 shadow-xl flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Approved Leaves</p>
              <p className="text-3xl font-black text-rose-500 tracking-tighter">{leaveStats} Days</p>
            </div>
            <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-500 border border-rose-500/20 group-hover:scale-110 transition-transform">
              <Coffee size={24} />
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-800 shadow-xl flex items-center justify-between group md:col-span-2">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Status</p>
              <p className="text-3xl font-black text-indigo-400 tracking-tighter uppercase">{status.replace('_', ' ')}</p>
            </div>
            <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
              <Clock size={24} />
            </div>
          </div>
      </div>

      {/* TODAY'S HERO CARD */}
      <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl flex flex-col lg:row-reverse lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 w-full lg:w-1/2">
          <div className="inline-flex items-center gap-2 bg-gray-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-gray-700 mb-6">
             <MapPin size={12} /> Office HQ • Live
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Daily Log</h1>
          <p className="text-gray-400 font-medium text-lg mb-8">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          
          <div className="grid grid-cols-2 gap-6 p-6 bg-gray-800/40 rounded-3xl border border-gray-800 backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Entry Time</p>
              <p className="text-3xl font-mono text-green-400 font-bold">
                {todayRecord ? formatTime(todayRecord.checkIn) : '--:--'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Exit Time</p>
              <p className="text-3xl font-mono text-red-500 font-bold">
                {todayRecord?.checkOut ? formatTime(todayRecord.checkOut) : '--:--'}
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE BUTTON */}
        <div className="relative lg:w-1/2 flex justify-center">
            <button
            onClick={handleAction}
            disabled={status === 'CHECKED_OUT' || status === 'LOADING'}
            className={`
                group relative w-64 h-64 rounded-full border-[10px] flex flex-col items-center justify-center transition-all duration-500 transform
                ${status === 'NOT_CHECKED_IN' ? 'border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.15)]' : ''}
                ${status === 'CHECKED_IN' ? 'border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.15)]' : ''}
                ${status === 'CHECKED_OUT' ? 'border-gray-800 bg-gray-900 text-gray-600 opacity-80' : ''}
                hover:scale-105 active:scale-95
            `}
            >
            {status === 'LOADING' ? (
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-indigo-500"></div>
            ) : (
                <>
                <div className="mb-3 transition-transform group-hover:scale-110 duration-300">
                    {status === 'NOT_CHECKED_IN' && <Clock size={56} strokeWidth={1.5} />}
                    {status === 'CHECKED_IN' && <ArrowRight size={56} strokeWidth={1.5} />}
                    {status === 'CHECKED_OUT' && <CheckCircle size={56} strokeWidth={1.5} />}
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter">
                    {status === 'NOT_CHECKED_IN' ? 'Check In' : status === 'CHECKED_IN' ? 'Check Out' : 'Done'}
                </span>
                </>
            )}
            
            {/* Pulsing ring for active state */}
            {status !== 'CHECKED_OUT' && (
                <div className={`absolute -inset-4 rounded-full border-2 animate-pulse opacity-20 ${status === 'NOT_CHECKED_IN' ? 'border-green-500' : 'border-red-500'}`}></div>
            )}
            </button>
        </div>
      </div>

      {/* RECENT HISTORY TABLE */}
      <div className="bg-gray-900/50 rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-black text-white flex items-center gap-3">
            <Calendar className="text-indigo-500" size={20} /> History
          </h2>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Last 30 Days</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-800/30 text-gray-500 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Entry</th>
                <th className="px-8 py-4">Exit</th>
                <th className="px-8 py-4">Hours</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-800/40 transition-colors group">
                  <td className="px-8 py-5 text-gray-300 font-semibold group-hover:text-white transition-colors">
                    {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 text-green-400 font-mono text-sm">{formatTime(record.checkIn)}</td>
                  <td className="px-8 py-5 text-red-400 font-mono text-sm">{formatTime(record.checkOut)}</td>
                  <td className="px-8 py-5">
                    <span className="text-indigo-400 font-bold bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10 text-xs">
                        {record.workHours ? `${record.workHours}h` : '-'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${
                        record.status === 'PRESENT' ? 'bg-green-500/5 text-green-500 border-green-500/10' : 'bg-red-500/5 text-red-500 border-red-500/10'
                    }`}>
                        {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;