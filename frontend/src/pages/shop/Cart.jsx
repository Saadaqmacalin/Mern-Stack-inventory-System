import React from 'react';
import { useCustomerPortal } from '../../contexts/CustomerPortalContext';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../Components/ui/Card';
import Button from '../../Components/ui/Button';
import { FaTrashCan, FaMinus, FaPlus, FaArrowRight, FaBagShopping } from 'react-icons/fa6';

const Cart = () => {
    const { cart, actions, loading, isCustomerAuthenticated } = useCustomerPortal();
    const navigate = useNavigate();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        if (!isCustomerAuthenticated) {
            navigate('/shop/auth', { state: { from: '/shop/cart' } });
            return;
        }

        const orderData = {
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            shippingAddress: { country: "SO", city: "Mogadishu" }, // Defaults for demo
            billingAddress: { country: "SO", city: "Mogadishu" },
            paymentMethod: "Mobile Money",
            notes: "Self-ordered via customer portal"
        };

        const result = await actions.placeOrder(orderData);
        if (result.success) {
            navigate('/shop/orders');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-40 animate-in fade-in duration-700">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <FaBagShopping className="text-indigo-600 text-4xl" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Your bag is empty</h2>
                <p className="text-slate-400 font-medium mb-10">Time to fill it with something extraordinary!</p>
                <Link to="/shop">
                    <Button variant="primary" size="lg" className="rounded-full px-12 h-14 font-black">
                        Start Shopping <FaArrowRight className="ml-2" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12 items-start animate-in slide-in-from-bottom duration-700">
            {/* Cart Items */}
            <div className="flex-1 space-y-6 w-full">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Shopping Bag <span className="text-indigo-600">({cart.length})</span></h1>
                    <button onClick={() => actions.clearCart()} className="text-xs font-black uppercase tracking-widest text-rose-500 hover:text-rose-600">Clear All</button>
                </div>

                {cart.map(item => (
                    <Card key={item.productId} className="p-0 overflow-hidden border-none shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
                        <div className="w-32 h-32 bg-slate-50 overflow-hidden shrink-0">
                            <img src={item.image || 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400&auto=format&fit=crop'} alt={item.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6 pr-8">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 mb-1">{item.productName}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category?.name}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                    <button 
                                        onClick={() => actions.updateCartQty(item.productId, Math.max(1, item.quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                    >
                                        <FaMinus size={12} />
                                    </button>
                                    <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                                    <button 
                                        onClick={() => actions.updateCartQty(item.productId, item.quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                                <div className="text-right min-w-[100px]">
                                    <p className="text-xl font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${item.price.toFixed(2)} / unit</p>
                                </div>
                                <button 
                                    onClick={() => actions.removeFromCart(item.productId)}
                                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    <FaTrashCan />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Summary Sidebar */}
            <div className="w-full lg:w-[400px] sticky top-32">
                <Card className="bg-white border-none shadow-2xl shadow-indigo-100/50 p-8 rounded-[2.5rem]">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Order Summary</h2>
                    
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-slate-500 font-bold">
                            <span>Subtotal</span>
                            <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-bold">
                            <span>Service Tax (5%)</span>
                            <span className="text-slate-900">${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-bold">
                            <span>Shipping</span>
                            <span className="text-emerald-500 font-black uppercase text-[10px] tracking-widest">Free Express</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-between items-end mb-10">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                        <span className="text-4xl font-black text-indigo-600">${total.toFixed(2)}</span>
                    </div>

                    <Button 
                        onClick={handleCheckout}
                        loading={loading}
                        variant="primary" 
                        size="lg" 
                        className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Checkout Now <FaArrowRight className="ml-2" />
                    </Button>
                    
                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
                        🔒 Secured by LuxeSmart Encryption
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Cart;
