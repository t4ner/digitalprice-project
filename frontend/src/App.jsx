import React from "react";

import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminPanel from "./components/AdminPanel";
import Theme from "./components/Theme";

const App = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-gray-700 to-slate-500">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/:username" element={<Theme />} />
      </Routes>
    </div>
  );
};

export default App;
