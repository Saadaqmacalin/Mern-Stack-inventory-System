import React, { useState } from "react";
import { FaXmark, FaFloppyDisk, FaUserShield } from "react-icons/fa6";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AddUser = () => {
  const { actions, loading } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    status: "USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await actions.addUser(formData);

      if (result.success) {
        actions.addNotification({
           id: Date.now(), // Add ID for notification
           type: 'success',
           message: "User created successfully"
        });
        navigate("/users"); // Redirect to users list where this was called from
      } else {
        // Error handling is managed by context, but we can show explicit checks here
      }
    } catch (error) {
       console.error("Error creating user:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 pb-20">
      <Card className="overflow-hidden border-none shadow-xl shadow-gray-100/50">
        <div className="flex justify-between items-center mb-8 bg-white p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-black text-gray-900 leading-none mb-2">
              Create New User
            </h2>
            <p className="text-gray-400 font-medium italic">Grant system access to new members</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/users")}
            className="text-gray-400 hover:text-red-500"
          >
            <FaXmark size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-10">
          <div className="space-y-8">
             <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
             />

             <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
             />

             <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Secure password"
                required
             />

             <Input
                label="Access Role"
                name="status"
                value={formData.status}
                onChange={handleChange}
                as="select"
                icon={FaUserShield}
             >
                <option value="USER">Standard User</option>
                <option value="ADMIN">System Administrator</option>
             </Input>
          </div>

          <div className="pt-4 flex flex-col md:flex-row justify-end items-center gap-4">
               <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate("/users")}
                className="w-full md:w-auto text-gray-400 hover:text-red-500 font-bold"
               >
                  Cancel
               </Button>
               <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                size="lg"
                className="w-full md:w-auto px-10 h-12 text-base font-black rounded-2xl shadow-xl shadow-indigo-100"
               >
                  <FaFloppyDisk className="mr-2" />
                  Create Account
               </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
