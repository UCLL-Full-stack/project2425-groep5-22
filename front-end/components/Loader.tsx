import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const spinnerClasses = "w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin";

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={spinnerClasses} />
      </div>
    );
  }

  return <div className={spinnerClasses} />;
};

export default Loader;