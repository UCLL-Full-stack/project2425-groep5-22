import React from 'react';
import { Frown } from 'lucide-react';

type Props = {
}

const NoGames: React.FC<Props> = () => {
  return (
    <div className="w-full max-h-full space-y-2 group">
      <div className="h-full">
        <div className="h-full p-6 py-12 text-center transition-all duration-300 border-4 border-dashed text-games border-games bg-opacity-10 group-hover:bg-opacity-20 rounded-2xl"
        >
          <Frown className='w-16 h-16 mx-auto' />
          <h3 className='text-lg font-semibold'>Niks gevonden</h3>
          <p>Er werden op dit moment spijtig genoeg nog geen spellen gevonden. 😢</p>
        </div>
      </div >
    </div >
  );
};

export default NoGames;
