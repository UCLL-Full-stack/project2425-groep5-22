import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode
}

const GameGrid: React.FC<Props> = ({
  children
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 py-2 mt-5 overflow-x-auto md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
};

export default GameGrid;
