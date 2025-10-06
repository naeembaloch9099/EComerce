import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export const useAdminRestrictedCart = () => {
  const { addToCart, ...cartMethods } = useCart();
  const { user, isAuthenticated } = useAuth();

  const restrictedAddToCart = (
    product,
    size = "M",
    quantity = 1,
    color = null
  ) => {
    // Check if user is admin
    if (isAuthenticated && user?.role === "admin") {
      toast.error(
        "Admin accounts cannot add items to cart. Please use a customer account."
      );
      return;
    }

    // If not admin, proceed with normal addToCart
    return addToCart(product, size, quantity, color);
  };

  return {
    ...cartMethods,
    addToCart: restrictedAddToCart,
  };
};
