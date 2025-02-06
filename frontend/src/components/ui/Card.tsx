import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-2xl rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
