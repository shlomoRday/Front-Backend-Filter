import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../screens/Login.screen";
import Users from "../screens/Users.screens";
import Register from "../screens/Register.screens";
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Users />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRouter;
