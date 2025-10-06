import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for Windows key + S (Meta key + S) or Ctrl + S
      // Using metaKey for Windows key and ctrlKey as fallback
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault(); // Prevent default browser save dialog
        console.log("Admin shortcut triggered!"); // Debug log
        navigate("/admin");
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
};

export default useKeyboardShortcuts;
