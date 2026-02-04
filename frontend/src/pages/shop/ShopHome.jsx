import React, { useEffect } from 'react';
import { useCustomerPortal } from '../../contexts/CustomerPortalContext';
import Card from '../../Components/ui/Card';
import Button from '../../Components/ui/Button';
import Badge from '../../Components/ui/Badge';
import { FaCartPlus, FaMagnifyingGlass, FaArrowRight } from 'react-icons/fa6';

const ShopHome = () => {
    const { products, categories, loading, actions } = useCustomerPortal();
    const [search, setSearch] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    useEffect(() => {
        actions.fetchProducts();
        actions.fetchCategories();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.productName.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.categoryId?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-indigo-950 px-8 py-20 text-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.5),transparent)] animate-pulse"></div>
                <div className="relative z-10 space-y-6">
                    <Badge variant="secondary" className="bg-white/10 text-indigo-200 border-none px-4 py-1">New Collection 2026</Badge>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        Next-Gen <span className="text-indigo-400">Inventory</span> Solutions
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        Seamlessly browse through our exclusive catalog of professional-grade products tailored for high-performance enterprises.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-24 z-40 bg-[#fcfcfd]/80 backdrop-blur-md py-4">
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    <button 
                        onClick={() => setSelectedCategory('All')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === 'All' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200'}`}
                    >
                        All Items
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat._id}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCategory === cat.name ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-100 hover:border-indigo-200'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search our catalog..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[400px] bg-slate-100 rounded-[2rem] animate-pulse"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <Card key={product._id} className="group overflow-hidden border-none shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col h-full">
                            <div className="relative aspect-square overflow-hidden bg-slate-50">
                                <img 
                                    src={product.image || 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400&auto=format&fit=crop'} 
                                    alt={product.productName}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4">
                                    <Badge variant={product.stockQuantity > 10 ? 'success' : 'warning'}>
                                        {product.stockQuantity > 10 ? 'In Stock' : `Only ${product.stockQuantity} Left`}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-2">{product.categoryId?.name || 'Uncategorized'}</span>
                                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{product.productName}</h3>
                                    <p className="text-slate-400 text-sm font-medium line-clamp-2 mb-4">{product.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                                    <Button 
                                        onClick={() => actions.addToCart(product)}
                                        variant="primary" 
                                        size="sm" 
                                        className="rounded-xl shadow-lg shadow-indigo-100 group-hover:px-6 transition-all"
                                    >
                                        <FaCartPlus className="group-hover:mr-2" />
                                        <span className="hidden group-hover:inline">Add</span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaMagnifyingGlass className="text-slate-300 text-2xl" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">No results found</h2>
                    <p className="text-slate-400 font-medium">Try adjusting your filters or search keywords</p>
                </div>
            )}
        </div>
    );
};

export default ShopHome;
