import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin" />
    </div>
  );
};

export default Loader;