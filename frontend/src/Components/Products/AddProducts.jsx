import React, { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddProducts = () => {
  const { categories = [], suppliers = [], actions, loading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    productName: "",
    categoryId: "",
    supplierId: "",
    description: "",
    price: "",
    costPrice: "",
    status: "active",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        categoryId: product.categoryId?._id || product.categoryId || "",
        supplierId: product.supplierId?._id || product.supplierId || "",
        description: product.description || "",
        price: product.price || "",
        costPrice: product.costPrice || "",
        status: product.status || "active",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      if (product) {
        result = await actions.updateProduct(product._id, formData);
      } else {
        result = await actions.addProduct(formData);
      }

      if (result.success) {
        actions.addNotification({
           type: 'success',
           message: product ? "Product updated successfully" : "Product created successfully"
        });
        navigate("/products");
      } else {
        actions.addNotification({ type: 'error', message: result.error || 'Failed to save product' });
      }
    } catch (error) {
      actions.addNotification({ type: 'error', message: "An unexpected error occurred" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
      <Card className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
        <div className="flex justify-between items-center mb-8 bg-white p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-none mb-2">
              {product ? "Edit Product" : "Define New Product"}
            </h2>
            <p className="text-gray-400 font-medium">Capture essential details for your inventory catalog</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/products")}
            className="text-gray-400 hover:text-red-500"
          >
            <FaTimes size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-10">
          <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600 mb-4 px-1">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Product Display Name"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Wireless Headphones"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Category"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                        required
                        as="select"
                      >
                        <option value="">Select...</option>
                        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </Input>
                      <Input
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        as="select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Input>
                  </div>
              </div>

              <Input
                label="Product Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                as="textarea"
                placeholder="Brief summary of the product features..."
                rows={3}
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="p-8 bg-indigo-50/30 rounded-3xl border border-indigo-100/50 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-indigo-700">Procurement & Sourcing</h3>
                  <Input
                    label="Primary Supplier"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                    as="select"
                  >
                    <option value="">Select partner...</option>
                    {suppliers.map((s) => <option key={s._id} value={s._id}>{s.name || s.companyName}</option>)}
                  </Input>
                  <div className="pt-2">
                      <p className="text-xs text-indigo-400 font-medium leading-relaxed">
                          Ensure the correct supplier is linked for automated reordering and cost tracking.
                      </p>
                  </div>
              </div>

              <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">Financial Metrics</h3>
                  <div className="grid grid-cols-2 gap-6">
                      <Input
                        label="Selling Price ($)"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                      <Input
                        label="Cost Basis ($)"
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                  </div>
                  <div className="flex justify-between items-center py-4 px-6 bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-100/50">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gross Margin </span>
                      <span className={`text-xl font-black ${formData.price - formData.costPrice > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(formData.price - formData.costPrice || 0).toFixed(2)}
                      </span>
                  </div>
              </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-end items-center gap-4">
               <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/products")}
                className="w-full md:w-auto text-gray-400 hover:text-gray-600 font-bold"
               >
                  Discard Changes
               </Button>
               <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                size="lg"
                className="w-full md:w-auto px-16 h-14 text-lg font-black rounded-2xl shadow-xl shadow-indigo-100"
               >
                  <FaSave className="mr-2" />
                  {product ? "Update Product" : "Finalize & Save"}
               </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddProducts;
