import React from "react";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import AuthDebugger from "../Components/Common/AuthDebugger";

const Admin = () => {
  const isDevelopment = import.meta.env.DEV;

  return (
    <>
      <AdminDashboard />
      {isDevelopment && <AuthDebugger />}
    </>
  );
};

export default Admin;
