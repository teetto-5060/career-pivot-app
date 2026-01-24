import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Card({ children, className = "", onClick, selected = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 ${
        onClick ? "cursor-pointer hover:shadow-xl" : ""
      } ${selected ? "border-4 border-primary" : "border-2 border-gray-200"} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`text-2xl font-bold text-gray-900 ${className}`}>{children}</h3>;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`${className}`}>{children}</div>;
}
