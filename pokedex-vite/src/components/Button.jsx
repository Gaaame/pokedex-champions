import React from "react";

const Button = ({ label, onClick, type = "button", disabled = false }) => {
  return (
    <button className="btn" type={type} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
