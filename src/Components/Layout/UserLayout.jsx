import React from "react";
import TopbarClean from "./TopbarClean";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "../Cart/CartDrawer";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-50/20 via-transparent to-blue-50/20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-200/10 to-orange-200/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <TopbarClean />
        <Navbar />

        {/* Main Content Area */}
        <main>{children}</main>

        <Footer />
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default UserLayout;
