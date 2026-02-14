import React from 'react';
import UsersList from '../Components/Users/UsersList';

const Users = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Control system access and roles</p>
        </div>
      </div>
      
      <UsersList />
    </div>
  );
};

export default Users;
