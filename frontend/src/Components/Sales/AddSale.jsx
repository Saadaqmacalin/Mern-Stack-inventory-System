import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Card from "../ui/Card"; // Corrected casing
import Button from "../ui/Button"; // Corrected casing
import Input from "../ui/Input"; // Corrected casing
import { FaTimes, FaSave } from "react-icons/fa";

const AddSale = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, products = [], customers = [], loading } = useAppContext();
  const saleToEdit = location.state?.sale;
  
  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    unitPrice: "",
    status: "Completed",
    invoiceNo: `INV-${Math.floor(Math.random() * 100000)}` 
  });

  useEffect(() => {
    actions.fetchProducts();
    actions.fetchCustomers();
    
    if (saleToEdit) {
      setFormData({
        customerId: saleToEdit.customerId?._id || saleToEdit.customerId,
        productId: saleToEdit.productId?._id || saleToEdit.productId,
        quantity: saleToEdit.quantity,
        unitPrice: saleToEdit.unitPrice,
        status: saleToEdit.status,
        invoiceNo: saleToEdit.invoiceNo
      });
    }
  }, [saleToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        if (name === 'productId') {
            const product = products.find(p => p._id === value);
            if (product) {
                newData.unitPrice = product.price;
            }
        }
        return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    if (saleToEdit) {
      result = await actions.updateSale(saleToEdit._id, formData);
    } else {
      result = await actions.addSale(formData);
    }

    if (result.success) {
      actions.addNotification({
        type: 'success',
        message: saleToEdit ? "Sale updated successfully" : "Sale recorded successfully"
      });
      navigate("/sales");
    } else {
      actions.addNotification({
        type: 'error',
        message: result.error || "Failed to save sale"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <Card className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
        <div className="flex justify-between items-center mb-8 bg-white p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">
              {saleToEdit ? "Edit Sale Record" : "Record New Sale"}
            </h2>
            <p className="text-gray-500 text-sm font-medium">#{formData.invoiceNo}</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/sales")}
            className="text-gray-400 hover:text-red-500"
          >
            <FaTimes />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Customer"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                as="select"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </Input>

              <Input
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                as="select"
              >
                <option value="Completed">Completed (Decrements Stock)</option>
                <option value="Pending">Pending</option>
              </Input>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 space-y-6">
              <Input
                label="Select Product"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                as="select"
              >
                <option value="">Choose item...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.productName} (Stock: {p.quantity})
                  </option>
                ))}
              </Input>

              <div className="grid grid-cols-2 gap-6">
                  <Input
                    label="Quantity"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    min="1"
                  />
                  <Input
                    label="Unit Price ($)"
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
              </div>
          </div>

          {/* Result Card */}
          <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-indigo-900 rounded-3xl text-white shadow-lg shadow-indigo-100">
              <div className="mb-4 md:mb-0">
                  <span className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Total Sale Amount</span>
                  <div className="text-4xl font-black">${(formData.quantity * formData.unitPrice || 0).toFixed(2)}</div>
              </div>
              <Button
                type="submit"
                loading={loading}
                variant="primary"
                size="lg"
                className="w-full md:w-auto bg-white text-indigo-900 border-none px-12 h-14 font-black rounded-2xl shadow-xl shadow-indigo-950/20"
              >
                <FaSave className="mr-2" />
                {loading ? "Processing..." : (saleToEdit ? "Update Sale" : "Complete Record")}
              </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSale;
