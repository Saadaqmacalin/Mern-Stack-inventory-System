import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { FaTimes, FaSave, FaPlus, FaTrash, FaTruck, FaCheckCircle, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

const AddOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, customers, products, loading } = useAppContext();
  const orderToEdit = location.state?.order;

  const [formData, setFormData] = useState({
    customerId: "",
    orderNumber: `ORD-${Date.now()}`,
    status: "Pending",
    orderDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    items: [],
    shippingAddress: { street: "", city: "", state: "", zipCode: "", country: "SO" },
    billingAddress: { street: "", city: "", state: "", zipCode: "", country: "SO" },
    paymentMethod: "Cash",
    paymentStatus: "Pending",
    subTotal: 0,
    taxAmount: 0,
    shippingCost: 0,
    discount: 0,
    totalAmount: 0,
    notes: ""
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0
  });

  useEffect(() => {
    actions.fetchCustomers();
    actions.fetchProducts();
  }, []);

  useEffect(() => {
    if (orderToEdit) {
      setFormData({
        customerId: orderToEdit.customerId?._id || orderToEdit.customerId,
        orderNumber: orderToEdit.orderNumber,
        status: orderToEdit.status,
        orderDate: new Date(orderToEdit.orderDate).toISOString().split("T")[0],
        expectedDeliveryDate: orderToEdit.expectedDeliveryDate ? new Date(orderToEdit.expectedDeliveryDate).toISOString().split("T")[0] : "",
        items: orderToEdit.items.map(item => ({
            productId: item.productId?._id || item.productId,
            name: item.productId?.productName || "Unknown Product",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice || (item.quantity * item.unitPrice)
        })),
        shippingAddress: orderToEdit.shippingAddress || { street: "", city: "", state: "", zipCode: "", country: "SO" },
        billingAddress: orderToEdit.billingAddress || { street: "", city: "", state: "", zipCode: "", country: "SO" },
        paymentMethod: orderToEdit.paymentMethod || "Cash",
        paymentStatus: orderToEdit.paymentStatus || "Pending",
        subTotal: orderToEdit.totalAmount - (orderToEdit.taxAmount || 0) - (orderToEdit.shippingCost || 0) + (orderToEdit.discount || 0),
        taxAmount: orderToEdit.taxAmount || 0,
        shippingCost: orderToEdit.shippingCost || 0,
        discount: orderToEdit.discount || 0,
        totalAmount: orderToEdit.totalAmount,
        notes: orderToEdit.notes || ""
      });
    }
  }, [orderToEdit, actions]);

  // Calculate totals whenever items change
  useEffect(() => {
    const subTotal = formData.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const taxAmount = subTotal * 0.05; // 5% tax example
    const totalAmount = subTotal + taxAmount + (Number(formData.shippingCost) || 0) - (Number(formData.discount) || 0);
    
    setFormData(prev => ({
        ...prev,
        subTotal,
        taxAmount,
        totalAmount
    }));
  }, [formData.items, formData.discount, formData.shippingCost]);

  const handleProductSelect = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p._id === productId);
    if (product) {
        setCurrentItem({
            productId: product._id,
            name: product.productName,
            quantity: 1,
            unitPrice: product.price || 0,
            totalPrice: product.price || 0
        });
    }
  };

  const addItem = () => {
    if (!currentItem.productId) return;
    
    const existingIndex = formData.items.findIndex(item => item.productId === currentItem.productId);
    
    if (existingIndex >= 0) {
        const newItems = [...formData.items];
        newItems[existingIndex].quantity += parseInt(currentItem.quantity);
        newItems[existingIndex].totalPrice = newItems[existingIndex].quantity * newItems[existingIndex].unitPrice;
        setFormData(prev => ({ ...prev, items: newItems }));
    } else {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                ...currentItem,
                totalPrice: currentItem.quantity * currentItem.unitPrice
            }]
        }));
    }
    
    setCurrentItem({ productId: "", quantity: 1, unitPrice: 0, totalPrice: 0 });
  };

  const removeItem = (index) => {
      const newItems = [...formData.items];
      newItems.splice(index, 1);
      setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
        actions.addNotification({ type: 'warning', message: "Please add at least one item to the order." });
        return;
    }

    let result;
    if (orderToEdit) {
        result = await actions.updateOrder(orderToEdit._id, formData);
    } else {
        result = await actions.addOrder(formData);
    }

    if (result.success) {
      actions.addNotification({
        type: 'success',
        message: orderToEdit ? "Order updated successfully" : "Order created successfully"
      });
      navigate("/orders");
    } else {
       actions.addNotification({
        type: 'error',
        message: result.error || "Failed to save order"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4 pb-20">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {orderToEdit ? "Edit Order" : "New Purchase Order"}
            </h1>
            <p className="text-gray-500 font-medium">#{formData.orderNumber}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/orders")}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes className="mr-2" /> Cancel
          </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-8">
                <Card className="p-0 overflow-hidden border-none shadow-lg shadow-gray-100">
                    <div className="bg-white p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FaCalendarAlt className="text-indigo-600" /> General Information
                        </h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Customer"
                            name="customerId"
                            value={formData.customerId}
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                            required
                            as="select"
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </Input>
                        <Input
                            label="Order Status"
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            as="select"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </Input>
                        <Input
                            label="Order Date"
                            type="date"
                            name="orderDate"
                            value={formData.orderDate}
                            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                            required
                        />
                        <Input
                            label="Expected Delivery"
                            type="date"
                            name="expectedDeliveryDate"
                            value={formData.expectedDeliveryDate}
                            onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                            required
                        />
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden border-none shadow-lg shadow-gray-100">
                    <div className="bg-white p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                           🛒 Order Items
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="md:col-span-2">
                                <Input
                                    label="Select Product"
                                    name="productId"
                                    value={currentItem.productId}
                                    onChange={handleProductSelect}
                                    as="select"
                                >
                                    <option value="">Choose item...</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.productName} - ${p.price} (Stock: {p.quantity})</option>
                                    ))}
                                </Input>
                            </div>
                            <Input
                                label="Qty"
                                type="number"
                                value={currentItem.quantity}
                                onChange={(e) => {
                                    const qty = parseInt(e.target.value) || 0;
                                    setCurrentItem(prev => ({
                                        ...prev, 
                                        quantity: qty,
                                        totalPrice: qty * prev.unitPrice
                                    }));
                                }}
                            />
                            <Button 
                                type="button" 
                                onClick={addItem}
                                variant="primary"
                                className="h-[46px] w-full"
                                disabled={!currentItem.productId}
                            >
                                <FaPlus /> Add
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-4 px-2">Description</th>
                                        <th className="pb-4 px-2 text-center">Unit Price</th>
                                        <th className="pb-4 px-2 text-center">Qty</th>
                                        <th className="pb-4 px-2 text-right">Amount</th>
                                        <th className="pb-4 px-2 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {formData.items.length === 0 ? (
                                        <tr><td colSpan="5" className="py-8 text-center text-gray-400 font-medium">No items added</td></tr>
                                    ) : (
                                        formData.items.map((item, index) => (
                                            <tr key={index} className="group">
                                                <td className="py-4 px-2 font-bold text-gray-900">
                                                    {products.find(p => p._id === item.productId)?.productName || item.name}
                                                </td>
                                                <td className="py-4 px-2 text-center text-gray-500">${item.unitPrice.toFixed(2)}</td>
                                                <td className="py-4 px-2 text-center">
                                                    <span className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-bold">{item.quantity}</span>
                                                </td>
                                                <td className="py-4 px-2 text-right font-black text-indigo-600">${item.totalPrice.toFixed(2)}</td>
                                                <td className="py-4 px-2 text-center">
                                                    <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                        <FaTrash size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="border-none shadow-lg shadow-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaTruck className="text-indigo-600" /> Shipping Address</h3>
                        <div className="space-y-4">
                            <Input placeholder="Street Address" value={formData.shippingAddress.street} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, street: e.target.value}})} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="City" value={formData.shippingAddress.city} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, city: e.target.value}})} />
                                <Input placeholder="Country" value={formData.shippingAddress.country} onChange={e => setFormData({...formData, shippingAddress: {...formData.shippingAddress, country: e.target.value}})} />
                            </div>
                        </div>
                    </Card>
                    <Card className="border-none shadow-lg shadow-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FaMoneyBillWave className="text-indigo-600" /> Billing Details</h3>
                        <div className="space-y-4">
                             <Input
                                label="Payment Method"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                as="select"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Mobile Money">Mobile Money</option>
                            </Input>
                            <Input
                                label="Payment Status"
                                value={formData.paymentStatus}
                                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                as="select"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Failed">Failed</option>
                            </Input>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Right Column: Summary */}
            <div className="space-y-8">
                <Card className="border-none shadow-xl shadow-indigo-100/50 bg-indigo-900 text-white">
                    <h3 className="text-lg font-bold mb-6 text-indigo-200 uppercase tracking-widest px-2">Order Summary</h3>
                    <div className="space-y-4 px-2">
                        <div className="flex justify-between font-medium opacity-80">
                            <span>Subtotal</span>
                            <span>${formData.subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium opacity-80">
                            <span>Tax (5%)</span>
                            <span>${formData.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center font-medium py-2 border-y border-white/10">
                            <span className="opacity-80">Shipping</span>
                            <input 
                                type="number" 
                                className="w-20 text-right bg-transparent border-none focus:ring-0 font-bold text-white placeholder-white/50" 
                                value={formData.shippingCost}
                                onChange={e => setFormData({...formData, shippingCost: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                        <div className="flex justify-between items-center font-medium pb-2 border-b border-white/10 text-red-300">
                            <span className="opacity-80">Discount</span>
                            <input 
                                type="number" 
                                className="w-20 text-right bg-transparent border-none focus:ring-0 font-bold text-red-300 placeholder-red-300/50" 
                                value={formData.discount}
                                onChange={e => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                        <div className="pt-4">
                            <div className="flex justify-between text-3xl font-black">
                                <span className="text-indigo-200">Total</span>
                                <span>${formData.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <Button
                            type="submit"
                            loading={loading}
                            variant="primary"
                            className="w-full bg-white text-indigo-900 hover:bg-indigo-50 border-none h-14 text-lg font-black rounded-xl"
                        >
                            {loading ? "Processing..." : (orderToEdit ? "Update Order" : "Place Order")}
                        </Button>
                    </div>
                </Card>

                <Card className="border-none shadow-lg shadow-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Internal Notes</h3>
                    <textarea 
                        className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 min-h-[150px] transition-all text-sm"
                        placeholder="Add any additional instructions or private notes..."
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                    />
                </Card>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
