import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Card from '../Components/ui/Card';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import { 
  FaBrain, 
  FaChartLine, 
  FaBox, 
  FaTriangleExclamation, 
  FaLightbulb, 
  FaArrowTrendUp, 
  FaRobot,
  FaShieldHalved,
  FaMicrochip
} from 'react-icons/fa6';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Predictions = () => {
  const { products, loading: productsLoading, actions } = useAppContext();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const init = async () => {
        const result = await actions.fetchInventoryOptimization();
        if (result.success) setOptimization(result.data);
    };
    init();
  }, []);
  
  const handleProductSelect = async (productId) => {
    setSelectedProduct(productId);
    if (productId) {
      setLoading(true);
      const result = await actions.fetchDemandForecast(productId);
      if (result.success) setPredictions(result.data);
      setLoading(false);
    } else {
      setPredictions(null);
    }
  };

  const salesTrendData = useMemo(() => {
    // Generate dummy trend data if needed or use real if available
    return [
      { date: 'Week 1', sales: 4000 },
      { date: 'Week 2', sales: 3000 },
      { date: 'Week 3', sales: 5000 },
      { date: 'Week 4', sales: 4780 },
      { date: 'Week 5', sales: 5890 },
      { date: 'Forecast', sales: 6500, isForecast: true },
    ];
  }, []);
  
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* AI Hero Section */}
      <div className="relative bg-slate-900 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl">
         {/* Abstract BG elements */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] -ml-32 -mb-32"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-500/20">
                    <FaRobot className="animate-bounce" />
                    <span>Neural Inventory Intelligence</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4">
                    Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Forecasting</span>
                </h1>
                <p className="text-slate-400 text-lg font-medium max-w-xl">
                    Our AI models analyze historical patterns, market trends, and seasonal signals to optimize your procurement strategy.
                </p>
            </div>
            <div className="w-full md:w-auto flex flex-col gap-4">
                <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl">
                        <FaBrain className="text-indigo-400 text-2xl" />
                    </div>
                    <div>
                        <p className="text-white font-black leading-tight">Insight Engine v4.2</p>
                        <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Operational Status: Optimal</p>
                    </div>
                </div>
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Demand Forecasting Controls */}
        <Card className="p-8 border-none bg-white shadow-xl shadow-indigo-100/20">
            <div className="flex items-center space-x-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-6">
                <FaMicrochip />
                <span>Demand Engine</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Inventory Projection</h3>
            <p className="text-slate-400 text-sm mb-8">Select a product to initiate neural demand analysis.</p>
            
            <Input
                as="select"
                label="Target Product"
                value={selectedProduct}
                onChange={(e) => handleProductSelect(e.target.value)}
                icon={<FaBox className="text-indigo-400" />}
            >
                <option value="">Select an Item...</option>
                {Array.isArray(products) && products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.productName}
                    </option>
                ))}
            </Input>

            {predictions && (
                <div className="mt-10 space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Neural Recommendation</span>
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${predictions.recommendation === 'REORDER' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                <FaTriangleExclamation />
                            </div>
                            <span className={`text-xl font-black ${predictions.recommendation === 'REORDER' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {predictions.recommendation}
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 font-medium leading-relaxed">
                            {predictions.recommendation === 'REORDER' 
                                ? "Stock is projected to deplete within current lead times. Initiation of reorder recommended immediately."
                                : "Current liquidity levels and trend analysis suggest optimal stock positioning for the next 14 days."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Avg Demand</span>
                            <span className="text-2xl font-black text-slate-800">{predictions.avgDailyDemand}</span>
                            <span className="text-[10px] text-slate-400 block font-bold leading-none mt-1">Units/Day</span>
                        </div>
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stock Level</span>
                            <span className="text-2xl font-black text-slate-800">{predictions.currentStock}</span>
                            <span className="text-[10px] text-slate-400 block font-bold leading-none mt-1">Available Units</span>
                        </div>
                    </div>
                </div>
            )}
        </Card>

        {/* Forecast Visualization */}
        <Card className="lg:col-span-2 p-8 border-none shadow-xl shadow-slate-200/20 overflow-hidden relative">
            <div className="flex justify-between items-center mb-10">
                <div>
                   <h3 className="text-xl font-black text-slate-800 tracking-tight">30-Day Predictive Forecast</h3>
                   <p className="text-slate-400 text-sm font-medium">Confidence intervals based on historical volatility</p>
                </div>
                {predictions && (
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">
                        {selectedProduct ? products.find(p => p._id === selectedProduct)?.productName : "Global trend"}
                    </div>
                )}
            </div>

            <div className="h-80 w-full">
                {predictions?.forecast ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={predictions.forecast}>
                            <defs>
                                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                                tickFormatter={(val) => val.split('/')[1] || val}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                            />
                            <Tooltip 
                                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                                formatter={(val) => [`${val} Units`, 'Predicted Demand']}
                            />
                            <Area 
                                type="monotoneX" 
                                dataKey="predictedDemand" 
                                stroke="#6366f1" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorForecast)" 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <FaArrowTrendUp className="text-8xl text-slate-100 mb-6" />
                        <p className="text-slate-400 font-bold max-w-xs italic">Awaiting product parameters to generate neural network projection</p>
                    </div>
                )}
            </div>
        </Card>
      </div>

      {/* Inventory Optimization Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-2 px-2">
            <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-100">
                <FaShieldHalved className="text-xl" />
            </div>
            <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Liquidity Optimization</h2>
                <p className="text-slate-400 font-medium">Critical items requiring immediate capitalization</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {optimization?.productAnalysis?.slice(0, 4).map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                    {/* Priority Indicator */}
                    <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${
                        item.priority >= 8 ? 'bg-rose-500 shadow-rose-100' : 'bg-amber-500 shadow-amber-100'
                    }`}>
                        P-{item.priority}
                    </div>

                    <h4 className="font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate pr-12">{item.productName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{item.category}</p>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold">Current Stock</span>
                            <span className="font-black text-slate-700">{item.currentStock}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold">Recommended reorder</span>
                            <span className="font-black text-indigo-600">{item.recommendedOrder}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${item.priority >= 8 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                style={{ width: `${(item.currentStock / (item.recommendedOrder || 1)) * 50}%` }}
                            ></div>
                        </div>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl py-3 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-none ring-0"
                    >
                        Review Logistics
                    </Button>
                </div>
            ))}
        </div>
      </div>

      {/* Market Strategy */}
      <Card className="p-8 border-none bg-indigo-600 text-white shadow-2xl shadow-indigo-200/50 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10 scale-150 p-4">
              <FaLightbulb className="text-9xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2">Market Sentiment Insight</h3>
                  <p className="text-indigo-100 font-medium max-w-2xl">
                      Based on current velocity of <span className="text-white font-bold underline decoration-indigo-300">Fast Moving Consumer Goods (FMCG)</span>, we suggest increasing procurement cycles by 15% for the upcoming seasonal peak.
                  </p>
              </div>
              <Button 
                variant="ghost" 
                className="bg-white/10 text-white hover:bg-white/20 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/20 whitespace-nowrap"
              >
                  Recalibrate Models
              </Button>
          </div>
      </Card>
    </div>
  );
};

export default Predictions;
