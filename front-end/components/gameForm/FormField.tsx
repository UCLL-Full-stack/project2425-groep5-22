import React from 'react';

type Props = {
  label?: string,
  error?: string,
  children: any,
  className?: string
}

const FormField: React.FC<Props> = ({
  label,
  error,
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;