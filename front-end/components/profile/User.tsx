import { User } from '@/types';
import Link from 'next/link';
import React from 'react';

type Props = {
  user: User
}

const UserProfile: React.FC<Props> = ({ user }) => {
  return (
    <div className="mx-auto">
      <div className="w-full">
        <div className="flex flex-col items-center justify-center px-5 pb-12 md:flex-row md:px-0 md:space-x-8 bg-light-section dark:bg-dark-section rounded-2xl">
          <div>
            <img
              loading="lazy"
              src={`https://api.dicebear.com/8.x/initials/png?seed=${user.username}`}
              className="object-cover w-[100px] h-[100px] rounded-full"
              alt={`${user.username} profile picture`}
            />
          </div>
          <div className="mt-2 md:mt-0">
            <div className="text-center md:text-left">
              <p className="flex items-start text-2xl font-bold text-center capitalize md:text-left text-primary md:text-3xl gap-x-2">
                {user.username} {user.role && (
                  <span className='px-2 py-1 text-sm font-medium text-white capitalize rounded bg-primary'>{user.role}</span>
                )}
              </p>
            </div>
            <p className="mt-1 text-center md:text-left">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;