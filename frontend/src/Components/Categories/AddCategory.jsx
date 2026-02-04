import React, { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddCategory = () => {
  const { actions, loading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      if (category) {
        result = await actions.updateCategory(category._id, formData);
      } else {
        result = await actions.addCategory(formData);
      }

      if (result.success) {
        actions.addNotification({
           type: 'success',
           message: category ? "Category updated successfully" : "Category created successfully"
        });
        navigate("/categories");
      } else {
        actions.addNotification({ type: 'error', message: result.error || 'Failed to save category' });
      }
    } catch (error) {
      actions.addNotification({ type: 'error', message: "An unexpected error occurred" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 px-4">
      <Card className="overflow-hidden border-none shadow-2xl shadow-indigo-100/50">
        <div className="bg-white p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {category ? "Modify Category" : "New Classification"}
            </h2>
            <p className="text-gray-400 font-medium text-sm">Define how your inventory items are grouped</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/categories")}
            className="text-gray-300 hover:text-red-500"
          >
            <FaTimes size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <Input
            label="Category Title"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Raw Materials, Finished Goods"
            required
            className="text-lg font-bold"
          />
          
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Context & Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief explanation of what belongs in this category..."
              rows={5}
              className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all"
            />
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row justify-end items-center gap-4">
             <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/categories")}
                className="w-full md:w-auto text-gray-400 font-bold"
             >
                Cancel
             </Button>
             <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                size="lg"
                className="w-full md:w-auto px-12 rounded-xl shadow-lg shadow-indigo-100/50"
             >
                <FaSave className="mr-2" />
                {category ? "Apply Changes" : "Create Category"}
             </Button>
          </div>
        </form>
      </Card>
      
      <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/30">
        <p className="text-xs text-indigo-400 font-medium leading-relaxed">
            <span className="font-black mr-1">Pro Tip:</span> 
            Clear and distinct categories help in generating more accurate reports and maintaining stock levels efficiently.
        </p>
      </div>
    </div>
  );
};

export default AddCategory;
