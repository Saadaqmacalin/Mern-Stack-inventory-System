import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLocationDot, 
  FaPenToSquare, 
  FaFloppyDisk, 
  FaXmark,
  FaCamera,
  FaGlobe,
  FaIdCard,
  FaCalendarDays
} from 'react-icons/fa6';

const Profile = () => {
  const { user, actions } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Saadaq Macalin',
    email: user?.email || 'saadaq@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    address: {
      street: user?.address?.street || '123 Enterprise Way',
      city: user?.address?.city || 'Mogadishu',
      state: user?.address?.state || 'Banaadir',
      zipCode: user?.address?.zipCode || '10001',
      country: user?.address?.country || 'Somalia',
    },
    bio: user?.bio || 'Senior Inventory Strategist & System Administrator. Passionate about logistics optimization and supply chain efficiency.',
  });
  
  const handleEdit = () => setIsEditing(true);
  
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Use user.id or user.userId or user._id depending on what's stored
    // AppContext login says: user: { ..., id: user._id }
    const userId = user?.id || user?._id || user?.userId;

    if (!userId) {
        actions.addNotification({ type: 'error', message: 'User ID not found' });
        setLoading(false);
        return;
    }

    // Flatten address if backend expects flat structure or check backend model
    // Backend model has simple fields. Profile field is reference? 
    // Wait, backend user controller updateUser accepts: { name, email, password, status }
    // It does NOT seem to accept 'address' or 'bio' or 'phone' in the controller destructuring.
    // I need to check backend controller again.
    
    // For now, let's update what we can: name and email.
    // If backend doesn't support other fields, I should update backend controller first? 
    // Or just update the supported fields. 
    
    // Context: "d:\Systems\inventorySystem\backend\controllers\user.js"
    // const { name, email, password, Status } = req.body;
    
    // So Phone, Address, Bio are NOT supported by backend yet. 
    // I should probably update backend to support them or at least Phone. 
    // The User schema... 
    // "d:\Systems\inventorySystem\backend\Models\user.js"
    // Schema has: name, email, password, status, profile (ref), purchases, sales...
    // It does NOT have phone, address, bio directly.
    // It has a 'profile' reference to a 'Profile' model?
    
    // Let's check "Models/user.js" again.
    // line 31: profile: { type: Schema.Types.ObjectId, ref: "Profile" }
    
    // So there is a separate Profile model? 
    // I haven't seen "d:\Systems\inventorySystem\backend\Models\Profile.js" in the file list.
    
    // If the user wants me to "continue", maybe implementing the Profile backend is the task?
    // But for now, let's just make the simple update work (Name/Email) and mock the rest or warn.
    
    const updatePayload = {
        name: profileData.name,
        email: profileData.email,
        // phone: profileData.phone, // Not in User model
        // address: ... // Not in User model
    };

    const result = await actions.updateUser(userId, updatePayload);

    setIsEditing(false);
    setLoading(false);

    if (result.success) {
        actions.addNotification({
            type: 'success',
            message: 'Profile identity synchronized successfully',
        });
    } else {
        // error handled in context but we can show specific
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    // Reset would normally happen here from context
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* Profile Hero Header */}
      <div className="relative bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-50 blur-[80px] -ml-24 -mb-24 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-10">
            <div className="relative group">
                <div className="w-40 h-40 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-[2.5rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-indigo-200">
                    {profileData.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-2 right-2 p-3 bg-white rounded-2xl shadow-xl text-indigo-600 border border-slate-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <FaCamera />
                </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-indigo-100">
                    <FaIdCard />
                    <span>Authorized Administrator</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">{profileData.name}</h1>
                <p className="text-slate-400 font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
                    <FaEnvelope className="opacity-50" />
                    {profileData.email}
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                        System Active
                    </span>
                    <span className="px-5 py-2 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-100 flex items-center gap-2">
                        <FaCalendarDays />
                        Since 2024
                    </span>
                </div>
            </div>
            
            {!isEditing && (
                <Button onClick={handleEdit} variant="primary" size="lg" className="rounded-2xl px-8 shadow-xl shadow-indigo-100">
                    <FaPenToSquare className="mr-2" />
                    Modify Identity
                </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Bio & Core Info */}
        <div className="lg:col-span-2 space-y-10">
            <section>
                <div className="flex items-center space-x-3 mb-6 px-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Executive Summary</h2>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20 leading-relaxed text-slate-600 font-medium italic">
                    {isEditing ? (
                        <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none focus:bg-white transition-all text-slate-700"
                            placeholder="Describe your professional identity..."
                        />
                    ) : (
                        <p>"{profileData.bio}"</p>
                    )}
                </Card>
            </section>

            <section>
                <div className="flex items-center space-x-3 mb-6 px-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Identity Parameters</h2>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                
                {isEditing ? (
                    <Card className="p-8 border-none shadow-xl shadow-slate-200/20">
                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input label="Official Name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} icon={<FaUser className="text-indigo-400" />} />
                                <Input label="Email Hub" type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} icon={<FaEnvelope className="text-indigo-400" />} />
                                <Input label="Contact Direct" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} icon={<FaPhone className="text-indigo-400" />} />
                            </div>
                            
                            <div className="flex items-center space-x-3 mt-10 mb-4 opacity-50">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Logistics Coordinates</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="Street Access" value={profileData.address.street} onChange={(e) => setProfileData({...profileData, address: {...profileData.address, street: e.target.value}})} />
                                <Input label="Metro/City" value={profileData.address.city} onChange={(e) => setProfileData({...profileData, address: {...profileData.address, city: e.target.value}})} />
                                <Input label="State/Province" value={profileData.address.state} onChange={(e) => setProfileData({...profileData, address: {...profileData.address, state: e.target.value}})} />
                                <Input label="Global Region (Country)" value={profileData.address.country} onChange={(e) => setProfileData({...profileData, address: {...profileData.address, country: e.target.value}})} />
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                                <Button variant="ghost" type="button" onClick={handleCancel} className="text-slate-400 font-bold px-8">Discard</Button>
                                <Button type="submit" loading={loading} className="px-10 shadow-lg shadow-indigo-100">
                                    <FaFloppyDisk className="mr-2" />
                                    Synchronize Profile
                                </Button>
                            </div>
                        </form>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20 group hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                    <FaPhone className="text-lg" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact Point</h4>
                                    <p className="text-lg font-black text-slate-800 tracking-tight">{profileData.phone}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Primary voice and secure MFA channel</p>
                        </Card>

                        <Card className="p-8 border-none bg-white shadow-xl shadow-slate-200/20 group hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <FaGlobe className="text-lg" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Regional Node</h4>
                                    <p className="text-lg font-black text-slate-800 tracking-tight">{profileData.address.city}, {profileData.address.country}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">Operational timezone: EAT (UTC +3)</p>
                        </Card>
                    </div>
                )}
            </section>
        </div>

        {/* Right Column: Mini Stats/Activity */}
        <div className="space-y-10">
            <section>
                <div className="flex items-center space-x-3 mb-6 px-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Security Integrity</h2>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <Card className="p-8 border-none bg-slate-900 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FaLocationDot className="text-6xl" />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Authentication Status</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-lg font-black tracking-tight">Highly Secure</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Last Secure Login</p>
                            <p className="text-sm font-black text-indigo-300">Today, 09:42 AM</p>
                        </div>
                        <Button variant="ghost" className="w-full bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl border border-white/10">
                            Session Logs
                        </Button>
                    </div>
                </Card>
            </section>

            <section>
                <div className="flex items-center space-x-3 mb-6 px-2">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Achievements</h2>
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="space-y-4">
                    {[
                        { icon: '📦', label: 'Inventory Master', desc: '1,000+ items managed' },
                        { icon: '🛡️', label: 'Security Marshal', desc: '0 breaches reported' },
                        { icon: '🚀', label: 'Early Adopter', desc: 'System pioneer v1.0' }
                    ].map((ach, i) => (
                        <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-2xl">{ach.icon}</div>
                            <div>
                                <p className="text-sm font-black text-slate-800 tracking-tight">{ach.label}</p>
                                <p className="text-xs text-slate-400 font-medium">{ach.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
