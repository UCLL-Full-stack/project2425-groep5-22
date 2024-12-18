import React from 'react';
import { User } from '@/types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type Props = {
  user: User,
  className?: string
};

const MoreFrom: React.FC<Props> = ({ user, className }) => {
  return (
    <section className={`w-full rounded-2xl overflow-hidden ${className}`}>
      <div className="px-6 pt-8 pb-6 mx-auto max-w-screen-2xl">
        <div className="space-y-4 text-center">
          <Link href={`/profiel/${user.username}`} className="block">
            <div className="inline-block">
              <img
                loading="lazy"
                src={`https://api.dicebear.com/8.x/initials/png?seed=${user.username}`}
                className="object-cover w-24 h-24 mx-auto transition-transform duration-300 rounded-full"
                alt={`${user.username} profile picture`}
              />
            </div>
          </Link>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
          </div>
        </div>

        <div className="w-full pt-6 mt-8 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-700">
              Meer van {user.username}
            </h4>
            <Link
              href={`/profiel/${user.username}`}
              className="flex items-center text-sm font-medium transition-colors text-primary hover:text-primary/75 group"
            >
              Bekijk profiel
              <ChevronRight
                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreFrom;