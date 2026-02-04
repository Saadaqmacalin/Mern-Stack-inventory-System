import React, { useEffect, useState } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddSupplier = () => {
  const { actions, loading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const supplier = location.state?.supplier;

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    category: "",
    status: "Active",
    address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "SO"
    }
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        companyName: supplier.companyName || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        category: Array.isArray(supplier.category) ? supplier.category.join(", ") : supplier.category || "",
        status: supplier.status || "Active",
        address: {
            street: supplier.address?.street || "",
            city: supplier.address?.city || "",
            state: supplier.address?.state || "",
            zipCode: supplier.address?.zipCode || "",
            country: supplier.address?.country || "SO",
        }
      });
    }
  }, [supplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
        const addressField = name.split(".")[1];
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [addressField]: value
            }
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
        ...formData,
        category: formData.category.split(",").map(c => c.trim()).filter(Boolean)
    };

    try {
      let result;
      if (supplier) {
        result = await actions.updateSupplier(supplier._id, dataToSubmit);
      } else {
        result = await actions.addSupplier(dataToSubmit);
      }

      if (result.success) {
        actions.addNotification({
           type: 'success',
           message: supplier ? "Supplier updated successfully" : "Supplier created successfully"
        });
        navigate("/suppliers");
      } else {
        actions.addNotification({ type: 'error', message: result.error || 'Failed to save supplier' });
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
              {supplier ? "Edit Supplier Partner" : "Onboard New Supplier"}
            </h2>
            <p className="text-gray-400 font-medium italic">Build and manage your global supply chain network</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/suppliers")}
            className="text-gray-400 hover:text-red-500"
          >
            <FaXmark size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-10">
          <div className="space-y-8">
             <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">01</div>
                <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600">Organizational Identity</h3>
             </div>
             
             <Input
                label="Registered Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Nexus Global Systems"
                required
             />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                    label="Official Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    required
                />
                <Input
                    label="Primary Phone Line"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+252..."
                    required
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                    label="Product Categories (comma separated)"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Electronics, Hardware, Cloud Services..."
                    required
                />
                <Input
                    label="Partnership Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    as="select"
                >
                    <option value="Active">Active Partner</option>
                    <option value="Inactive">On-Hold / Inactive</option>
                    <option value="Pending">Vetting Process</option>
                    <option value="Blacklisted">Blacklisted</option>
                </Input>
             </div>
          </div>

          <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 space-y-8">
             <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-black">02</div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-700">Physical Headquarters</h3>
             </div>
             
             <div className="space-y-6">
                <Input label="Street Address" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Line 1" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <Input label="City" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" />
                    </div>
                    <div className="md:col-span-1">
                         <Input label="State/Prov" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" />
                    </div>
                    <div className="md:col-span-1">
                        <Input label="Postal Code" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} placeholder="Zip" />
                    </div>
                    <div className="md:col-span-1">
                        <Input label="Country" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="Country" />
                    </div>
                </div>
             </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row justify-end items-center gap-4">
               <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/suppliers")}
                className="w-full md:w-auto text-gray-400 hover:text-red-500 font-bold"
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
                  <FaFloppyDisk className="mr-2" />
                  {supplier ? "Update Partner" : "Confirm Partnership"}
               </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSupplier;
