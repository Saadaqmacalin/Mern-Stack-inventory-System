import React, { useEffect, useState } from "react";
import { FaTimes, FaSave, FaShoppingCart, FaBarcode } from "react-icons/fa";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddPurchase = () => {
  const { actions, loading, products = [], suppliers = [] } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierId: "",
    productId: "",
    quantity: "",
    unitCost: "",
    status: "Received",
    refNo: `PUR-${Math.floor(100000 + Math.random() * 900000)}` 
  });

  useEffect(() => {
    actions.fetchProducts();
    actions.fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        // Auto-fill cost if product is selected
        if (name === 'productId') {
            const product = products.find(p => p._id === value);
            if (product) {
                newData.unitCost = product.costPrice || 0;
            }
        }
        return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await actions.addPurchase(formData);
      if (result.success) {
        actions.addNotification({
           type: 'success',
           message: "Purchase recorded successfully and stock updated"
        });
        navigate("/purchases");
      } else {
        actions.addNotification({ 
            type: 'error', 
            message: result.error || 'Failed to record purchase' 
        });
      }
    } catch (error) {
      actions.addNotification({ 
        type: 'error', 
        message: "An unexpected error occurred" 
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 pb-20">
      <Card className="overflow-hidden border-none shadow-2xl shadow-indigo-100/50">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 flex justify-between items-center text-white">
          <div>
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <FaShoppingCart className="text-xl" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">Purchase Entry</h2>
            </div>
            <p className="text-indigo-100 font-medium text-sm">Register new inventory intake from suppliers</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/purchases")}
            className="text-white hover:bg-white/10"
          >
            <FaTimes size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Input
                    label="Reference Number"
                    name="refNo"
                    value={formData.refNo}
                    onChange={handleChange}
                    placeholder="PUR-XXXXXX"
                    required
                    icon={<FaBarcode className="text-gray-400" />}
                />
                
                <Input
                    as="select"
                    label="Supplier Partner"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Choose Supplier</option>
                    {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.companyName}
                        </option>
                    ))}
                </Input>
            </div>

            <div className="space-y-6">
                <Input
                    as="select"
                    label="Incoming product"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Item</option>
                    {products.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.productName}
                        </option>
                    ))}
                </Input>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                        min="1"
                    />
                    <Input
                        type="number"
                        label="Unit Cost ($)"
                        name="unitCost"
                        value={formData.unitCost}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                        step="0.01"
                    />
                </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center border border-slate-100 gap-4">
              <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Stock Status</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Received">Immediately Received</option>
                    <option value="Pending">Pending (Draft)</option>
                  </select>
              </div>

              <div className="text-center md:text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Total Procurement Cost</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                    ${formData.quantity && formData.unitCost ? (formData.quantity * formData.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
                </span>
              </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-end items-center gap-4">
             <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/purchases")}
                className="w-full md:w-auto text-gray-400 font-bold"
             >
                Cancel
             </Button>
             <Button 
                type="submit" 
                variant="primary" 
                isLoading={loading}
                size="lg"
                className="w-full md:w-auto px-12 rounded-xl shadow-lg shadow-indigo-100/50"
             >
                <FaSave className="mr-2" />
                Record Purchase
             </Button>
          </div>
        </form>
      </Card>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                  Stock Impact
              </h4>
              <p className="text-xs text-emerald-600 font-medium leading-relaxed">
                  Selecting <span className="font-bold underline">"Received"</span> will automatically increment the current stock of the selected product upon saving.
              </p>
          </div>
          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100/50">
              <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest mb-2 flex items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                  Financial Note
              </h4>
              <p className="text-xs text-indigo-600 font-medium leading-relaxed">
                  The total cost will be recorded in the general ledger for financial reporting and cost of goods calculations.
              </p>
          </div>
      </div>
    </div>
  );
};

export default AddPurchase;
