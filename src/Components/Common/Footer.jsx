import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-lg"></div>
      <div className="relative container mx-auto px-6">
        <div className="grid grid-cols-4 gap-4 text-left">
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Newsletter</h4>
            <hr className="border-t border-white/20 my-1" />
            <p className="text-xs text-gray-400">
              Be the first to hear about new products, exclusive events, and
              online offers.
            </p>
            <p className="text-xs text-gray-400">
              Sign up and get 10% off your first order.
            </p>
            <div className="flex mt-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-1 text-xs bg-gray-700 text-white rounded-l"
              />
              <button className="bg-black text-white p-1 rounded-r text-xs">
                Subscribe
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Shop</h4>
            <hr className="border-t border-white/20 my-1" />
            <p className="text-xs text-gray-400">Men's Top Wear</p>
            <p className="text-xs text-gray-400">Women's Top Wear</p>
            <p className="text-xs text-gray-400">Men's Bottom Wear</p>
            <p className="text-xs text-gray-400">Women's Bottom Wear</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Support</h4>
            <hr className="border-t border-white/20 my-1" />
            <p className="text-xs text-gray-400">Contact Us</p>
            <p className="text-xs text-gray-400">About Us</p>
            <p className="text-xs text-gray-400">FAQs</p>
            <p className="text-xs text-gray-400">Features</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-300">Follow Us</h4>
            <hr className="border-t border-white/20 my-1" />
            <div className="flex space-x-2 mb-2">
              <FaFacebookF className="text-white" />
              <AiFillInstagram className="text-white" />
              <BsTwitter className="text-white" />
            </div>
            <p className="text-xs text-gray-400 flex items-center">
              <FiPhone className="mr-1" /> Call Us
            </p>
            <p className="text-xs text-gray-400">📞 0123-456-789</p>
          </div>
        </div>
        <div className="mt-4 text-center space-y-2">
          <hr className="border-t-2 border-white/20 w-1/2 mx-auto bg-gradient-to-r from-red-500 to-transparent" />
          <p className="text-gray-400 text-sm">
            © 2025, <span className="text-white font-semibold">CompileTab</span>
            . All Rights Reserved.
          </p>
          <hr className="border-t-2 border-white/20 w-1/3 mx-auto bg-gradient-to-r from-transparent to-red-500" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
