import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode,
  onClick?: () => any, // onClick is optional
  loading?: boolean,
  className?: string
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  loading,
  className
}) => {
  return (
    <button
      onClick={onClick ? () => onClick() : undefined}
      disabled={loading}
      className={`button ${loading
        ? 'button-disabled'
        : 'button-primary'
        } flex items-center justify-center ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div
            className="border-2 border-white rounded-full border-t-transparent animate-spin"
            style={{
              width: "1.5em", // Same as the font size of the text
              height: "1.5em", // Same as the font size of the text
              borderWidth: "0.2em" // Adjust thickness relative to size
            }}
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
