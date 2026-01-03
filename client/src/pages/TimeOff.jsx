import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Check, X, Calendar, Clock, FileText, Send, Coffee } from 'lucide-react';

const TimeOff = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    type: 'PAID',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Helper function to calculate duration between two dates
  const calculateDuration = (start, end) => {
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Helper to calculate total approved days for a specific list of leaves
  const getTotalApprovedDays = (leaveList) => {
    return leaveList
      .filter(l => l.status === 'APPROVED')
      .reduce((sum, l) => sum + calculateDuration(l.startDate, l.endDate), 0);
  };

  const fetchLeaves = async () => {
    try {
      const endpoint = user.role === 'ADMIN' ? '/leaves/all' : '/leaves/my-leaves';
      const { data } = await api.get(endpoint);
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Submitting request...");
    try {
      await api.post('/leaves/apply', formData);
      toast.success("Leave Request Sent!", { id: loadId });
      fetchLeaves();
      setFormData({ type: 'PAID', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      toast.error("Failed to submit request", { id: loadId });
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.put('/leaves/status', { leaveId: id, status });
      toast.success(`Request ${status.toLowerCase()}`);
      fetchLeaves();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 animate-pulse">
        <Clock className="text-gray-600 mb-2" size={40} />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Time Off Records...</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-700">
      
      {/* HEADER & SUMMARY */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Time Off Management</h1>
          <p className="text-gray-500 font-medium mt-1">Manage absence requests and leave balances</p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="flex gap-4 flex-wrap justify-end">
            {/* NEW: Total Days Taken (Employee Only) */}
            {user.role === 'EMPLOYEE' && (
              <div className="bg-indigo-500/10 px-6 py-3 rounded-2xl border border-indigo-500/20 backdrop-blur-md">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Coffee size={12}/> Approved Days
                  </p>
                  <p className="text-xl font-black text-white">{getTotalApprovedDays(leaves)}</p>
              </div>
            )}
            
            <div className="bg-gray-900/50 px-6 py-3 rounded-2xl border border-gray-800 backdrop-blur-md">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending</p>
                <p className="text-xl font-black text-yellow-500">{leaves.filter(l => l.status === 'PENDING').length}</p>
            </div>
            <div className="bg-gray-900/50 px-6 py-3 rounded-2xl border border-gray-800 backdrop-blur-md">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Approved</p>
                <p className="text-xl font-black text-green-500">{leaves.filter(l => l.status === 'APPROVED').length}</p>
            </div>
        </div>
      </div>

      {/* EMPLOYEE: REQUEST FORM */}
      {user.role === 'EMPLOYEE' && (
        <div className="bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Send className="text-indigo-500" size={20} /> Request New Leave
          </h2>
          
          <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Leave Type</label>
                <select 
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                <option value="PAID">Paid Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="UNPAID">Unpaid Leave</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
                <input 
                type="date" required
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">End Date</label>
                <input 
                type="date" required
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reason / Notes</label>
                <input 
                type="text" placeholder="Vacation, medical, etc." required
                className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
            </div>

            <button type="submit" className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
              Submit Request to HR
            </button>
          </form>
        </div>
      )}

      {/* HISTORY TABLE */}
      <div className="bg-gray-900/40 rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
                <FileText className="text-indigo-500" size={20} /> Request Logs
            </h2>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global View</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800/50 text-gray-500 text-[10px] uppercase font-black tracking-widest">
              <tr>
                {user.role === 'ADMIN' && <th className="px-8 py-4">Employee</th>}
                <th className="px-8 py-4">Type</th>
                <th className="px-8 py-4">Duration</th>
                <th className="px-8 py-4">Reason</th>
                <th className="px-8 py-4">Status</th>
                {/* NEW: Total Leaves Column for Admin */}
                {user.role === 'ADMIN' && <th className="px-8 py-4 text-center">Total (Approved)</th>}
                {user.role === 'ADMIN' && <th className="px-8 py-4 text-right">Review</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-indigo-500/5 transition-colors group">
                  {user.role === 'ADMIN' && (
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                {leave.user.firstName[0]}{leave.user.lastName[0]}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm leading-none">{leave.user.firstName} {leave.user.lastName}</p>
                                <p className="text-[10px] text-gray-600 font-mono mt-1">ID: {leave.user.employeeId}</p>
                            </div>
                        </div>
                    </td>
                  )}
                  <td className="px-8 py-5">
                      <span className="text-indigo-400 font-black text-[10px] uppercase tracking-widest bg-indigo-500/5 px-2.5 py-1 rounded-md border border-indigo-500/10">
                        {leave.type}
                      </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                        <span className="text-gray-300 text-sm font-medium">
                            {new Date(leave.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">
                            {calculateDuration(leave.startDate, leave.endDate)} Days
                        </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-400 text-sm italic">
                    {leave.reason || 'No reason provided'}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                      ${leave.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        leave.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}
                    `}>
                      {leave.status}
                    </span>
                  </td>
                  {/* NEW: Admin data cell to show total leaves for this employee */}
                  {user.role === 'ADMIN' && (
                    <td className="px-8 py-5 text-center">
                      <span className="text-xs font-mono font-bold text-gray-400">
                        {getTotalApprovedDays(leaves.filter(l => l.userId === leave.userId))} Days
                      </span>
                    </td>
                  )}
                  {user.role === 'ADMIN' && (
                    <td className="px-8 py-5 text-right">
                        {leave.status === 'PENDING' ? (
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => handleStatus(leave.id, 'APPROVED')} 
                                    className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all border border-green-500/20"
                                    title="Approve"
                                >
                                    <Check size={16}/>
                                </button>
                                <button 
                                    onClick={() => handleStatus(leave.id, 'REJECTED')} 
                                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                    title="Reject"
                                >
                                    <X size={16}/>
                                </button>
                            </div>
                        ) : (
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Finalized</span>
                        )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {leaves.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center opacity-20">
                <Calendar size={64} className="mb-4" />
                <p className="font-black uppercase tracking-widest text-sm">No Time Off History Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeOff;