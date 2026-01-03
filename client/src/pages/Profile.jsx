import { useAuth } from '../context/AuthContext';
import { User, DollarSign, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 flex items-center gap-6">
        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
          {user?.firstName[0]}{user?.lastName[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user?.firstName} {user?.lastName}</h1>
          <p className="text-gray-400">{user?.role} • {user?.employeeId}</p>
          <p className="text-indigo-400 mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Salary Information (Layer 2 Feature: Read-Only Payroll) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <DollarSign className="mr-2 text-green-400" /> Salary Structure
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
              <span>Basic Salary</span>
              <span className="font-mono">$50,000</span>
            </div>
            <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
              <span>Housing Allowance (HRA)</span>
              <span className="font-mono">$20,000</span>
            </div>
            <div className="flex justify-between text-gray-300 border-b border-gray-700 pb-2">
              <span>Special Allowances</span>
              <span className="font-mono">$10,000</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2">
              <span>Net Annual Salary</span>
              <span className="font-mono text-green-400">$80,000</span>
            </div>
          </div>
        </div>

        {/* Security / Audit Note */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Shield className="mr-2 text-indigo-400" /> Account Security
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Your account is protected with role-based access control. All critical actions including leave approvals and salary views are logged for audit purposes.
          </p>
          <div className="bg-gray-900 p-4 rounded text-xs font-mono text-gray-500">
            Last Login: {new Date().toLocaleString()} <br/>
            IP: 192.168.1.XX (Internal)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;