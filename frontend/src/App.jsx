import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetUsers from "./Components/User/GetUsers";
import UserRegistration from "./Components/User/UserRegistration";
import "./index.css";
import MainLayout from "./Components/MainLayout";


function App() {
  return (
    <Routes>
      <Route element={<MainLayout/>}>
        <Route path="/" element={<GetUsers />} />
        <Route path="/userRegistration" element={<UserRegistration />} />{" "}
      </Route>
    </Routes>
  );
}

export default App;
