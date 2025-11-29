import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetUsers from "./Components/User/GetUsers";
import UserRegistration from "./Components/User/UserRegistration";
import "./index.css";
import MainLayout from "./Components/MainLayout";
import Dashboard from "./Components/Dashboards/Dashboard";
import Login from "./Components/User/Login";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route element={<MainLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Users" element={<GetUsers />} />
        <Route path="/userRegistration" element={<UserRegistration />} />{" "}
      </Route>
    </Routes>
  );
}

export default App;
