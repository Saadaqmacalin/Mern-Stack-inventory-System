import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import { 
  FaGear, 
  FaUser, 
  FaBell, 
  FaShieldHalved, 
  FaPalette, 
  FaGlobe, 
  FaLock, 
  FaEnvelopeOpenText,
  FaMoon,
  FaSun
} from 'react-icons/fa6';

const Settings = () => {
  const { user, actions, theme, setTheme } = useAppContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const tabs = [
    { id: 'profile', name: 'Profile', icon: FaUser, desc: 'Personal details' },
    { id: 'notifications', name: 'Notifications', icon: FaBell, desc: 'Alert preferences' },
    { id: 'security', name: 'Security', icon: FaShieldHalved, desc: 'Access & safety' },
    { id: 'general', name: 'General', icon: FaGear, desc: 'App configuration' },
  ];
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    actions.addNotification({
      type: 'success',
      message: 'Profile synchronization complete',
    });
  };
  
  const handleThemeToggle = (newTheme) => {
    setTheme(newTheme);
    actions.addNotification({
      type: 'info',
      message: `System appearance updated to ${newTheme} mode`,
    });
  };
  
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Configuration</h1>
          <p className="text-slate-500 font-medium">Manage your instance protocols and account security</p>
        </div>
        <div className="px-4 py-2 bg-slate-100 rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
            Last modified: Feb 2026
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100' 
                    : 'hover:bg-slate-100/50 text-slate-400'
                }`}
              >
                <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-600'}`}>
                  <Icon className="text-lg" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-black tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{tab.name}</p>
                  <p className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'profile' && (
            <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20">
              <div className="flex items-center space-x-3 mb-10">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <FaEnvelopeOpenText />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Identity Information</h3>
              </div>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  label="Display Name"
                  name="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="e.g. John Wick"
                  required
                />
                <Input
                  label="Email Communications"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
                <Input
                  label="Contact Serial (Phone)"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
                <div className="md:col-span-2 flex justify-end pt-4 border-t border-slate-50">
                  <Button type="submit" size="lg" className="px-10 shadow-lg shadow-indigo-100">
                    Propagate Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20">
               <div className="flex items-center space-x-3 mb-10">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <FaBell />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Transmission Protocols</h3>
              </div>

              <div className="space-y-4">
                {[
                    { title: 'Email Alerts', desc: 'Critical system updates and weekly audits', checked: true },
                    { title: 'Push Notifications', desc: 'Real-time inventory depletion warnings', checked: false },
                    { title: 'SMS Gateway', desc: 'Enterprise security breach emergency multi-cast', checked: false }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                        <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{item.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={item.checked} />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                    </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
             <div className="space-y-8">
                <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                            <FaLock />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Credentials</h3>
                    </div>
                    <form className="space-y-6">
                        <Input label="Current Vault Passkey" type="password" required />
                        <div className="grid grid-cols-2 gap-6">
                            <Input label="New Passkey" type="password" required />
                            <Input label="Confirm Passkey" type="password" required />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button className="px-10 bg-slate-900 hover:bg-black">Rotate Passkey</Button>
                        </div>
                    </form>
                </Card>

                <Card className="p-8 border-none bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute right-0 top-0 p-8 opacity-10">
                        <FaShieldAlt className="text-8xl" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <h4 className="text-lg font-black tracking-tight mb-1">MFA Authentication</h4>
                            <p className="text-slate-400 text-sm font-medium">Add an extra layer of biometric or hardware security</p>
                        </div>
                        <Button variant="ghost" className="bg-white/10 text-white hover:bg-white/20 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10">Initialize 2FA</Button>
                    </div>
                </Card>
             </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <FaPalette />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">System Aesthetics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <button 
                    onClick={() => handleThemeToggle('light')}
                    className={`p-10 rounded-3xl border-2 transition-all group ${theme === 'light' ? 'border-indigo-600 bg-indigo-50/30 shadow-xl shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <FaSun className={`text-4xl mx-auto mb-4 ${theme === 'light' ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    <p className={`text-sm font-black tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-slate-400'}`}>Light Protocol</p>
                  </button>
                  <button 
                    onClick={() => handleThemeToggle('dark')}
                    className={`p-10 rounded-3xl border-2 transition-all group ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <FaMoon className={`text-4xl mx-auto mb-4 ${theme === 'dark' ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    <p className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-slate-900' : 'text-slate-400'}`}>Dark Protocol</p>
                  </button>
                </div>
              </Card>

              <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <FaGlobe />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Localization</h3>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Interface Language</label>
                    <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all">
                        <option value="en">Global English (United States)</option>
                        <option value="es">Spanish (Castilian)</option>
                        <option value="fr">French (Standard)</option>
                        <option value="de">German (Deutsch)</option>
                    </select>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
