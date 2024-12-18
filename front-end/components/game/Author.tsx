import { User } from '@/types';
import Link from 'next/link';
import React from 'react';

type Props = {
  user: User
}

const Author: React.FC<Props> = ({ user }) => {
  return (
    <div className="mt-2">
      <Link
        href={`/profiel/${user.username}`}
        className="inline-flex items-center space-x-2 transition-opacity duration-300 hover:opacity-80"
      >
        <img
          loading="lazy"
          src={`https://api.dicebear.com/8.x/initials/png?seed=${user.username}`}
          className="object-cover w-8 h-8 rounded-full"
          alt={`${user.username} profile picture`}
        />
        <span className="text-sm font-medium text-gray-700">
          {user.username}
        </span>
      </Link>
    </div>
  );
};

export default Author;