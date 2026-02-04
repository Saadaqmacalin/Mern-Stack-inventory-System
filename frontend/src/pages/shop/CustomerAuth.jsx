import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomerPortal } from '../../contexts/CustomerPortalContext';
import Card from '../../Components/ui/Card';
import Input from '../../Components/ui/Input';
import Button from '../../Components/ui/Button';
import { FaUserPlus, FaArrowRightToBracket, FaBagShopping } from 'react-icons/fa6';

const CustomerAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { actions, loading, error } = useCustomerPortal();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/shop';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = isLogin 
            ? await actions.login({ email: formData.email, password: formData.password })
            : await actions.register(formData);

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="max-w-md mx-auto py-20 animate-in fade-in zoom-in duration-700">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
                    <FaBagShopping className="text-white text-2xl" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                    {isLogin ? 'Welcome Back' : 'Join the Elite'}
                </h1>
                <p className="text-slate-400 font-medium">
                    {isLogin ? 'Enter your credentials to access your account' : 'Create an account to start your professional journey'}
                </p>
            </div>

            <Card className="p-8 border-none shadow-2xl shadow-indigo-100/50 rounded-[2.5rem]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    )}

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                    />

                    {!isLogin && (
                        <Input
                            label="Phone Number"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+252..."
                            required
                        />
                    )}

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <Button type="submit" variant="primary" size="lg" className="w-full h-14 rounded-2xl font-black shadow-lg shadow-indigo-100" loading={loading}>
                        {isLogin ? <><FaArrowRightToBracket className="mr-2" /> Sign In</> : <><FaUserPlus className="mr-2" /> Register Account</>}
                    </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                        {isLogin ? "Don't have an account?" : "Already Have an account?"}
                    </p>
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-black hover:text-indigo-700 underline underline-offset-4"
                    >
                        {isLogin ? 'Create one now' : 'Login here'}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default CustomerAuth;
