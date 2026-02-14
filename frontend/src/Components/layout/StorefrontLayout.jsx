import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaBagShopping, FaArrowRightFromBracket, FaCartShopping, FaBars, FaXmark } from 'react-icons/fa6';
import { useCustomerPortal } from '../../contexts/CustomerPortalContext';
import Button from '../ui/Button';
import Footer from './Footer';

const StorefrontLayout = () => {
    const { isCustomerAuthenticated, customer, cart, actions } = useCustomerPortal();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const navigate = useNavigate();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        actions.logout();
        navigate('/shop');
    };

    return (
        <div className="min-h-screen bg-[#fcfcfd] font-sans text-slate-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/shop" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                <FaBagShopping className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                LUXE<span className="text-indigo-600">SMART</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/shop" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Catalog</Link>
                            {isCustomerAuthenticated && (
                                <Link to="/shop/orders" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">My Orders</Link>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <Link to="/shop/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                                <FaCartShopping className="text-xl" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="h-6 w-px bg-slate-100 mx-2 hidden md:block"></div>

                            {isCustomerAuthenticated ? (
                                <div className="flex items-center gap-4">
                                     <div className="hidden md:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</span>
                                        <span className="text-xs font-bold text-slate-900">{customer?.name}</span>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={handleLogout}
                                        className="text-slate-400 hover:text-rose-500"
                                    >
                                        <FaArrowRightFromBracket />
                                    </Button>
                                </div>
                            ) : (
                                <Link to="/shop/auth">
                                    <Button variant="primary" size="sm" className="rounded-full px-6">
                                        Sign In
                                    </Button>
                                </Link>
                            )}

                            {/* Mobile Menu Toggle removed */}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu removed */}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StorefrontLayout;
