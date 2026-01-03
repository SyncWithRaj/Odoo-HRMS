import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, Calendar, Search } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  
  // State for Employee View
  const [status, setStatus] = useState('LOADING');
  const [history, setHistory] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  
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
    } catch (error) {
      console.error("Employee fetch error:", error);
    }
  };

  const fetchAdminData = async () => {
    try {
      const { data } = await api.get(`/attendance/all?date=${selectedDate}`);
      setAdminRecords(data);
    } catch (error) {
      console.error("Admin fetch error:", error);
      toast.error("Failed to load admin data");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Check for "LATE" message from backend
        if (res.data.message.includes("Late")) {
            toast('Checked In (Late)', { icon: '⚠️' });
        } else {
            toast.success("Checked In!");
        }
      } else if (status === 'CHECKED_IN') {
        await api.put('/attendance/check-out');
        toast.success("Checked Out!");
      }
      fetchEmployeeData();
    } catch (error) {
      console.error(error);
      toast.error("Action failed");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 3. ADMIN VIEW (Master Table with Late Badges)
  if (user?.role === 'ADMIN') {
    const filteredRecords = adminRecords.filter(record => 
      record.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg gap-4">
          <h1 className="text-2xl font-bold text-white">Attendance Monitor</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative">
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Employee..." 
                className="w-full bg-gray-900 border border-gray-700 text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Work Hours</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold mr-3">
                          {record.user.firstName[0]}{record.user.lastName[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium">{record.user.firstName} {record.user.lastName}</p>
                          <p className="text-xs text-gray-500">{record.user.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    
                    {/* CHECK IN CELL WITH LATE BADGE */}
                    <td className="px-6 py-4">
                        <div className="flex items-center">
                            <span className="text-green-400 font-mono text-sm">
                                {formatTime(record.checkIn)}
                            </span>
                            {record.isLate && (
                                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                    LATE
                                </span>
                            )}
                        </div>
                    </td>

                    <td className="px-6 py-4 text-red-400 font-mono text-sm">{formatTime(record.checkOut)}</td>
                    <td className="px-6 py-4 text-indigo-300 font-bold text-sm">
                      {record.workHours ? `${record.workHours} hrs` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold
                        ${record.status === 'PRESENT' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}
                      `}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No attendance records found for {selectedDate}.
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
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Today's Attendance</h1>
          <p className="text-gray-400">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Check In</p>
              <p className="text-2xl font-mono text-green-400 font-bold">
                {todayRecord ? formatTime(todayRecord.checkIn) : '--:--'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Check Out</p>
              <p className="text-2xl font-mono text-red-400 font-bold">
                {todayRecord?.checkOut ? formatTime(todayRecord.checkOut) : '--:--'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleAction}
          disabled={status === 'CHECKED_OUT' || status === 'LOADING'}
          className={`
            w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,0,0,0.3)]
            ${status === 'NOT_CHECKED_IN' ? 'border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-400' : ''}
            ${status === 'CHECKED_IN' ? 'border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-400' : ''}
            ${status === 'CHECKED_OUT' ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : ''}
            ${status === 'LOADING' ? 'border-gray-600 animate-pulse text-gray-500' : ''}
          `}
        >
          {status === 'LOADING' && <span className="text-lg font-bold">LOADING...</span>}
          {status === 'NOT_CHECKED_IN' && <><CheckCircle className="w-12 h-12 mb-2" /><span className="text-xl font-bold">CHECK IN</span></>}
          {status === 'CHECKED_IN' && <><Clock className="w-12 h-12 mb-2" /><span className="text-xl font-bold">CHECK OUT</span></>}
          {status === 'CHECKED_OUT' && <><CheckCircle className="w-12 h-12 mb-2" /><span className="text-xl font-bold">DONE</span></>}
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white flex items-center"><Calendar className="w-5 h-5 mr-2 text-indigo-400" /> Recent History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Work Hours</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-gray-700/30 transition">
                  <td className="px-6 py-4 text-white font-medium">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-green-400 font-mono">{formatTime(record.checkIn)}</td>
                  <td className="px-6 py-4 text-red-400 font-mono">{formatTime(record.checkOut)}</td>
                  <td className="px-6 py-4 text-indigo-300 font-bold">{record.workHours ? `${record.workHours} hrs` : '-'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${record.status === 'PRESENT' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>{record.status}</span></td>
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