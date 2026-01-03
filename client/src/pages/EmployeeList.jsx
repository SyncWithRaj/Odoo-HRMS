import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users, UserCheck, Clock, FileText, TrendingUp } from 'lucide-react';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await api.get('/users');
        setEmployees(empRes.data);
        
        const statRes = await api.get('/admin/stats');
        setStats(statRes.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* ANALYTICS SNAPSHOT - 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Total Employees */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Total Employees</h3>
            <Users className="text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalEmployees || 0}</p>
        </div>
        
        {/* Card 2: Present Today */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Present Today</h3>
            <UserCheck className="text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.presentToday || 0}</p>
        </div>
        
        {/* Card 3: Pending Leaves */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Pending Leaves</h3>
            <Clock className="text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.pendingLeaves || 0}</p>
        </div>

        {/* Card 4: SLA Monitoring (Enterprise Feature) */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Avg. Approval Time</h3>
            <TrendingUp className="text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-2">4.2 hrs</p>
          <p className="text-xs text-green-400 mt-1">↓ 12% vs last week</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* EMPLOYEE LIST */}
        <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white">Employee Directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-900 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {employees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 text-white font-bold">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{emp.employeeId}</td>
                    <td className="px-6 py-4 text-indigo-400 text-xs font-bold">{emp.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AUDIT LOGS */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-bold text-white flex items-center">
              <FileText className="mr-2 text-gray-400" size={18}/> Audit Logs
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {stats?.logs?.map(log => (
              <div key={log.id} className="text-sm border-l-2 border-indigo-500 pl-3">
                <p className="text-gray-300">{log.details}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
            {!stats?.logs?.length && <p className="text-gray-500 text-center">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;