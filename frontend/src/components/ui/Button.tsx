import React from "react";
/*
A custom UI button component. This button contains
default styling applied to it. So that styling
doesn't have to be repeated each time. It has all
attributes of a default button component and can
children react components 
*/
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-6 py-3 text-lg bg-blue-500 text-white rounded-md hover:bg-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
