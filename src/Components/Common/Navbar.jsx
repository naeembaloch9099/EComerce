import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ cartItems = [], setIsCartOpen, setIsLoginOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <nav className="bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 hover:text-red-600 transition-colors"
        >
          Rabbit
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
          <li>
            <Link
              to="/collection?category=men"
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              MEN
            </Link>
          </li>
          <li>
            <Link
              to="/collection?category=women"
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              WOMEN
            </Link>
          </li>
          <li>
            <Link
              to="/collection?category=topwear"
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              TOP WEAR
            </Link>
          </li>
          <li>
            <Link
              to="/collection?category=bottomwear"
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              BOTTOM WEAR
            </Link>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Bar (desktop only) */}
          <div className="hidden sm:flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="outline-none bg-transparent text-sm w-32 md:w-48"
            />
            <FiSearch className="text-gray-600" />
          </div>

          {/* User Icon */}
          <FiUser
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
            onClick={() => setIsLoginOpen(true)}
          />

          {/* Cart Icon */}
          <div className="relative">
            <FiShoppingCart
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-red-600 cursor-pointer transition-colors"
              onClick={() => setIsCartOpen(true)}
            />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs">
                {getTotalItems()}
              </span>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="lg:hidden p-1">
            {isMobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-600" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
          {/* Mobile Search */}
          <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 bg-gray-50 mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="outline-none bg-transparent text-sm flex-1"
            />
            <FiSearch className="text-gray-600" />
          </div>

          {/* Links */}
          <ul className="flex flex-col gap-4 pt-4">
            <li>
              <Link
                to="/collection?category=men"
                className="block text-gray-700 hover:text-red-600 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                MEN
              </Link>
            </li>
            <li>
              <Link
                to="/collection?category=women"
                className="block text-gray-700 hover:text-red-600 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                WOMEN
              </Link>
            </li>
            <li>
              <Link
                to="/collection?category=topwear"
                className="block text-gray-700 hover:text-red-600 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TOP WEAR
              </Link>
            </li>
            <li>
              <Link
                to="/collection?category=bottomwear"
                className="block text-gray-700 hover:text-red-600 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BOTTOM WEAR
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
