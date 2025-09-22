import React from "react";
import "./LuxuryCard.css";

const LuxuryCard = ({
  children,
  className = "",
  hover = true,
  gradient = false,
  badge = null,
  ...props
}) => {
  return (
    <div
      className={`luxury-card ${hover ? "hover-effect" : ""} ${
        gradient ? "gradient-bg" : ""
      } ${className}`}
      {...props}
    >
      {badge && (
        <div className={`card-badge ${badge.type || "primary"}`}>
          {badge.text}
        </div>
      )}
      {children}
    </div>
  );
};

export default LuxuryCard;
