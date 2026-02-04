import React, { useEffect } from 'react';
import { useCustomerPortal } from '../../contexts/CustomerPortalContext';
import Card from '../../Components/ui/Card';
import Badge from '../../Components/ui/Badge';
import { FaClock, FaBoxOpen, FaChevronRight } from 'react-icons/fa6';

const MyOrders = () => {
    const { orders, loading, actions } = useCustomerPortal();

    useEffect(() => {
        actions.fetchMyOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600';
            case 'Delivered': return 'bg-emerald-100 text-emerald-600';
            case 'Shipped': return 'bg-blue-100 text-blue-600';
            case 'Cancelled': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    if (loading && orders.length === 0) {
        return <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse"></div>)}
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-bottom duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Order History</h1>
                    <p className="text-slate-400 font-medium italic">Track your procurement lifecycle</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Active</span>
                    <span className="text-3xl font-black text-indigo-600">{orders.length}</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <FaBoxOpen className="text-slate-200 text-6xl mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-slate-900">No orders yet</h2>
                    <p className="text-slate-400 font-medium">Your purchase history will appear here once you place an order.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map(order => (
                        <Card key={order._id} className="p-8 border-none shadow-sm hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-500 group flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                                    <FaClock size={24} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-slate-900">{order.orderNumber}</span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-400">
                                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0">
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.items.length} Product(s)</p>
                                </div>
                                <div className="flex items-center gap-4 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                    <span className="hidden md:inline text-xs font-black uppercase tracking-widest">Details</span>
                                    <FaChevronRight />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
