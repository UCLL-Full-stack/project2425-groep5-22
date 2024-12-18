import React from 'react';
import { Clock, Group, Pen, Trash, Link, Download, Share, Users, PersonStanding } from 'lucide-react';
import { Game, User } from '@/types';
import Button from '../Button';

type Props = {
  game: Game;
  user: User | null;
};

const GameDetails: React.FC<Props> = ({ game, user }) => {
  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs} uur${mins > 0 ? ` en ${mins} minuten` : ''}`;
    }
    return `${mins} minuten`;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to remove this game?')) {
      // Handle game deletion logic here, e.g., an API call
    }
  };

  return (
    <section className="relative w-full rounded-2xl">
      <div className="">
        <div className="w-full p-3 sm:p-5 md:p-7 lg:p-0">
          <div className="my-10 space-y-5">
            <div className="text-center">
              <h1 className="text-3xl font-bold uppercase break-words text-primary sm:text-4xl">
                {game.name}
              </h1>
            </div>

            <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row sm:justify-between md:block md:space-x-0 md:space-y-4 md:absolute top-16 right-4 sm:right-6 lg:right-8">
              {user?.id === game.user.id && (
                <div className="flex space-x-2 md:space-x-0 md:space-y-2 md:block">
                  <a href={`/bewerken/${game.id}`}>
                    <Button>
                      <Pen className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button onClick={handleDelete} className='bg-red-500'>
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <div className='space-y-3'>
              <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                Over
              </h2>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {formatDuration(game.duration)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {game.groups ? 'In groepen' : 'Individueel'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PersonStanding className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {game.intensity.intensity}
                </span>
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-bold text-primary sm:text-3xl">
                Uitleg
              </h2>
              <div
                className="p-3 text-gray-700 rounded-md"
                dangerouslySetInnerHTML={{
                  __html: game.explanation.replace(/\n/g, '<br />')
                }}
              />
            </div>

            <div>
              <h2 className="mb-2 text-2xl font-bold text-primary sm:text-3xl">
                Bestanden
              </h2>
              {user?.id === game.user.id ? (
                <div>Bestandenbeheer</div>
              ) : (
                <div>Bestanden</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameDetails;