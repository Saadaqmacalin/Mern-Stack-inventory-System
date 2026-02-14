import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FaPlus, FaTrash, FaUserShield, FaUser } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const UsersList = () => {
    const { users, actions } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        actions.fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            await actions.deleteUser(id);
            actions.addNotification({ type: 'success', message: 'User deleted' });
        }
    };

    return (
        <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <FaUserShield />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Access Management</h3>
                        <p className="text-sm text-slate-400 font-medium">Manage system administrators and operators</p>
                    </div>
                </div>
                <Button onClick={() => navigate('/users/add')}>
                    <FaPlus className="mr-2" /> Add User
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-gray-700">
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                            <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-gray-700/50">
                        {users.map(user => (
                            <tr key={user._id || user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <FaUser size={10} />
                                        </div>
                                        <span className="font-bold text-sm text-slate-700 dark:text-gray-200">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.status === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {user.status || 'USER'}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-slate-500 font-medium">{user.email}</td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => handleDelete(user._id || user.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                        title="Delete User"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="text-center p-8 text-slate-400 font-medium italic">
                        No users found.
                    </div>
                )}
            </div>
        </Card>
    );
};

export default UsersList;
