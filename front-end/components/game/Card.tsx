import { Game, Tag } from '@/types';
import React from 'react';
import { Clock, Users, PersonStanding } from 'lucide-react';
import Link from 'next/link';

type Props = {
  game: Game
}

const GameCard: React.FC<Props> = ({ game }) => {
  // Create a URL-friendly slug
  const gameSlug = game.name.toLowerCase().replace(/\s+/g, '-');

  // Convert duration to hours and minutes
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs} uur${mins > 0 ? ` en ${mins} minuten` : ''}`;
    }
    return `${mins} minuten`;
  };

  return (
    <div className="w-full max-h-full space-y-2 group">
      <div className="h-full">
        <Link
          href={`/spel/${game.id}/${gameSlug}`}
          className="flex h-full p-6 transition-all duration-300 bg-games bg-opacity-10 group-hover:bg-opacity-20 rounded-2xl"
        >
          <div className="w-full h-full text-dark-games">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold break-words text-games">{game.name}</h1>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-games">
                <Clock
                  className="w-4 h-4 stroke-current"
                  strokeWidth={2}
                />
                <p className="text-base">{formatDuration(game.duration)}</p>
              </div>
              <div className="flex items-center space-x-3 text-games">
                <Users
                  className="w-4 h-4 stroke-current"
                  strokeWidth={2}
                />
                <p className="text-base">
                  {game.groups ? "Groepsspel" : "Individueel spel"}
                </p>
              </div>
              <div className="flex items-center space-x-3 text-games">
                <PersonStanding
                  className="w-4 h-4 stroke-current"
                  strokeWidth={2}
                />
                <p className="text-base">{game.intensity.intensity}</p>
              </div>
            </div>

            {game.tags && game.tags.length > 0 && (
              <div className="mt-6 mb-0 space-x-2 space-y-2">
                {(game.tags as Tag[]).slice(0, 2).map((tag) => (
                  <div className="relative inline-block py-1 text-xs">
                    <div className="absolute inset-0 flex text-games">
                      <svg height="100%" viewBox="0 0 50 100">
                        <path
                          d="M49.9,0a17.1,17.1,0,0,0-12,5L5,37.9A17,17,0,0,0,5,62L37.9,94.9a17.1,17.1,0,0,0,12,5ZM25.4,59.4a9.5,9.5,0,1,1,9.5-9.5A9.5,9.5,0,0,1,25.4,59.4Z"
                          fill="currentColor" />
                      </svg>
                      <div className="flex-grow h-full -ml-px rounded-r-sm bg-games">
                      </div>
                    </div>
                    <span className="relative pr-px font-semibold text-white uppercase">
                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{tag.tag}<span>&nbsp;&nbsp;&nbsp;</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-xs text-right text-gray-500">
              {game.createdAt && new Date(game.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Link>
      </div >
    </div >
  );
};

export default GameCard;
