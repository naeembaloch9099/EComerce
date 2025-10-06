import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastProvider } from "./context/ToastContext";
import { ProductProvider } from "./context/ProductContext";
import UserLayout from "./Components/Layout/UserLayout";
import ProtectedRoute from "./Components/Common/ProtectedRoute";
import AdminRoute from "./Components/Common/AdminRoute";
import Home from "./Pages/Home/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Favorites from "./Pages/Favorites";
import Login from "./Pages/Login/Login";
import Admin from "./Pages/Admin";
import Checkout from "./Pages/Checkout/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation/OrderConfirmation";
import TestOrders from "./Pages/TestOrders";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import PaymentDemo from "./Pages/PaymentDemo";
import PaymentFlowTest from "./Components/Testing/PaymentFlowTest";
import RouteDebugger from "./Components/Testing/RouteDebugger";
import WorkingOrders from "./Pages/WorkingOrders";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { OrderProvider } from "./context/OrderContext";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OrderProvider>
            <ProductProvider>
              <ToastProvider>
                <BrowserRouter>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <UserLayout>
                          <Home />
                        </UserLayout>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                      path="/men"
                      element={
                        <UserLayout>
                          <Home />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/women"
                      element={
                        <UserLayout>
                          <Home />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/topwear"
                      element={
                        <UserLayout>
                          <Home />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/bottomwear"
                      element={
                        <UserLayout>
                          <Home />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/collection"
                      element={
                        <UserLayout>
                          <Collection />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/product/:id"
                      element={
                        <UserLayout>
                          <ProductDetail />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <UserLayout>
                          <About />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <UserLayout>
                          <Contact />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        <UserLayout>
                          <Favorites />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <UserLayout>
                          <Checkout />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/order-confirmation"
                      element={
                        <UserLayout>
                          <OrderConfirmation />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <UserLayout>
                          <WorkingOrders />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/payment-demo"
                      element={
                        <UserLayout>
                          <PaymentDemo />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/payment-test"
                      element={
                        <UserLayout>
                          <PaymentFlowTest />
                        </UserLayout>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <Admin />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </BrowserRouter>
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  gutter={8}
                  containerClassName=""
                  containerStyle={{}}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#fff",
                      color: "#363636",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      border: "1px solid #e5e7eb",
                    },
                    success: {
                      duration: 2000,
                      style: {
                        background: "#10b981",
                        color: "#fff",
                      },
                      iconTheme: {
                        primary: "#fff",
                        secondary: "#10b981",
                      },
                    },
                    error: {
                      duration: 3000,
                      style: {
                        background: "#ef4444",
                        color: "#fff",
                      },
                      iconTheme: {
                        primary: "#fff",
                        secondary: "#ef4444",
                      },
                    },
                  }}
                />
              </ToastProvider>
            </ProductProvider>
          </OrderProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
