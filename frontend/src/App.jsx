import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetUsers from "./Components/User/GetUsers.jsx";
import UserRegistration from "./Components/User/UserRegistration.jsx";
import "./index.css";
import MainLayout from "./Components/MainLayout.jsx";
import Dashboard from "./Components/Dashboards/Dashboard.jsx";
import Login from "./Components/User/Login.jsx";
import {UserProvider} from "./Components/User/userContext.jsx"
import Categories from "./Components/Categories/Categories.jsx";
function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Users" element={<GetUsers />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/userRegistration" element={<UserRegistration />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
