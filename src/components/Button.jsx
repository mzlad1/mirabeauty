import React from "react";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon = null,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
