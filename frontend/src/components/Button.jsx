import { motion } from "framer-motion";

const Button = ({ children, onClick, type = "primary", disabled = false, className = "" }) => {
  const styles = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-300",
    success: "bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300",
    danger: "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300"
  };
  const selectedStyle = styles[type] || styles.primary;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${selectedStyle} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
