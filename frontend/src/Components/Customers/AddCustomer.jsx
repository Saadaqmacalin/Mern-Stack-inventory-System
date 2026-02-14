import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { FaTimes, FaSave } from "react-icons/fa";

const AddCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actions, loading } = useAppContext();
  const customerToEdit = location.state?.customer;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
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
    if (customerToEdit) {
      setFormData({
        name: customerToEdit.name || "",
        email: customerToEdit.email || "",
        phone: customerToEdit.phone || "",
        status: customerToEdit.status || "Active",
        address: {
            street: customerToEdit.address?.street || "",
            city: customerToEdit.address?.city || "",
            state: customerToEdit.address?.state || "",
            zipCode: customerToEdit.address?.zipCode || "",
            country: customerToEdit.address?.country || "SO",
        }
      });
    }
  }, [customerToEdit]);

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
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (customerToEdit && !dataToSubmit.password) {
        delete dataToSubmit.password;
    }

    if (customerToEdit) {
        result = await actions.updateCustomer(customerToEdit._id, dataToSubmit);
    } else {
        result = await actions.addCustomer(dataToSubmit);
    }

    if (result.success) {
      actions.addNotification({
        type: 'success',
        message: customerToEdit ? "Customer updated successfully" : "Customer registered successfully"
      });
      navigate("/customers");
    } else {
      actions.addNotification({
        type: 'error',
        message: result.error || "Failed to save customer"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Card>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {customerToEdit ? "Edit Customer" : "Add New Customer"}
          </h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/customers")}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <FaTimes className="mr-2" /> Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer Name"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+252..."
                required
              />
          </div>

          <Input
            label={customerToEdit ? "New Password (Leave blank to keep current)" : "Password"}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters"
            required={!customerToEdit}
          />

          <Input
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            as="select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Input>

          {/* Address Fields */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
             <h3 className="font-semibold text-gray-700 mb-4">Address Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Street" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="Street" />
                 <Input label="City" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="City" />
                 <Input label="State" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="State" />
                 <Input label="Zip Code" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} placeholder="Zip Code" />
                 <Input label="Country" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="Country" />
             </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              loading={loading}
              variant="primary"
              className="w-full md:w-auto"
            >
              <FaSave className="mr-2" />
              {loading ? "Saving..." : (customerToEdit ? "Update Customer" : "Save Customer")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCustomer;
