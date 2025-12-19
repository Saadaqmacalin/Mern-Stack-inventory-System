import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetUsers from "./Components/User/GetUsers.jsx";
import UserRegistration from "./Components/User/UserRegistration.jsx";
import "./index.css";
import MainLayout from "./Components/MainLayout.jsx";
import Dashboard from "./Components/Dashboards/Dashboard.jsx";
import Login from "./Components/User/Login.jsx";
import {UserProvider} from "./Components/User/userContext.jsx"
import DisplayCategories from "./Components/Categories/DisplayCategories.jsx";
import AddCategory from "./Components/Categories/AddCategory.jsx";
import { CategoryProvider } from "./Components/Categories/Categories.jsx";
import Products from "./Components/Products/Products.jsx";
import ResetPassword from "./Components/User/ResetPassword.jsx";
function App() {
  return (
    <UserProvider>
      <CategoryProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword/>}/>
        <Route element={<MainLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Users" element={<GetUsers />} />
          <Route path="/DisplayCategories" element={<DisplayCategories />} />
          <Route path="/addCategory" element={<AddCategory/>} />
          <Route path="/products" element={<Products/>}/>
          <Route path="/userRegistration" element={<UserRegistration />} />
        </Route>
      </Routes>
      </CategoryProvider>
    </UserProvider>
  );
}

export default App;
