import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

const TimeOff = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'PAID',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      const endpoint = user.role === 'ADMIN' ? '/leaves/all' : '/leaves/my-leaves';
      const { data } = await api.get(endpoint);
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error); // Fixed: Used 'error'
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves/apply', formData);
      toast.success("Leave Request Sent!");
      fetchLeaves();
      setFormData({ type: 'PAID', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      console.error("Apply error:", error); // Fixed: Used 'error'
      toast.error("Failed to apply");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.put('/leaves/status', { leaveId: id, status });
      toast.success(`Leave ${status}`);
      fetchLeaves();
    } catch (error) {
      console.error("Status update error:", error); // Fixed: Used 'error'
      toast.error("Action failed");
    }
  };

  // Fixed: Used 'loading' state
  if (loading) return <div className="text-center text-gray-500 mt-10">Loading Time Off Data...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Time Off Management</h1>

      {/* EMPLOYEE: Apply Form */}
      {user.role === 'EMPLOYEE' && (
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-lg font-bold text-white mb-4">Request Time Off</h2>
          <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              className="bg-gray-900 text-white p-2 rounded border border-gray-700"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="PAID">Paid Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="UNPAID">Unpaid Leave</option>
            </select>
            <input 
              type="text" placeholder="Reason" required
              className="bg-gray-900 text-white p-2 rounded border border-gray-700"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
            <input 
              type="date" required
              className="bg-gray-900 text-white p-2 rounded border border-gray-700"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
            <input 
              type="date" required
              className="bg-gray-900 text-white p-2 rounded border border-gray-700"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            />
            <button type="submit" className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold">
              Submit Request
            </button>
          </form>
        </div>
      )}

      {/* LIST VIEW (Shared) */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
            <tr>
              {user.role === 'ADMIN' && <th className="px-6 py-4">Employee</th>}
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Dates</th>
              <th className="px-6 py-4">Status</th>
              {user.role === 'ADMIN' && <th className="px-6 py-4">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-700/30">
                {user.role === 'ADMIN' && (
                  <td className="px-6 py-4 text-white font-bold">
                    {leave.user.firstName} {leave.user.lastName}
                  </td>
                )}
                <td className="px-6 py-4 text-gray-300">{leave.type}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold
                    ${leave.status === 'APPROVED' ? 'bg-green-900 text-green-400' : 
                      leave.status === 'REJECTED' ? 'bg-red-900 text-red-400' : 'bg-yellow-900 text-yellow-400'}
                  `}>
                    {leave.status}
                  </span>
                </td>
                {user.role === 'ADMIN' && leave.status === 'PENDING' && (
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => handleStatus(leave.id, 'APPROVED')} className="p-1 bg-green-600 rounded text-white hover:bg-green-700"><Check size={16}/></button>
                    <button onClick={() => handleStatus(leave.id, 'REJECTED')} className="p-1 bg-red-600 rounded text-white hover:bg-red-700"><X size={16}/></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {leaves.length === 0 && <div className="p-6 text-center text-gray-500">No leave records found.</div>}
      </div>
    </div>
  );
};

export default TimeOff;