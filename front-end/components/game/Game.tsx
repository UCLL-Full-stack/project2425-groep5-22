import React, { useState } from 'react';
import { Clock, Group, Pen, Trash, Link, Download, Share, Users, PersonStanding } from 'lucide-react';
import { Game, Tag, User } from '@/types';
import Button from '../Button';
import GameService from '@/services/GameService';
import Alert from '../Alert';
import { useRouter } from 'next/router';

type Props = {
  game: Game;
  user: User;
};

const GameDetails: React.FC<Props> = ({ game, user }) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState<boolean>(false)
  const [error, setError] = useState<string>('');

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs} uur${mins > 0 ? ` en ${mins} minuten` : ''}`;
    }
    return `${mins} minuten`;
  };

  const handleDelete = async () => {
    setDeleting(true);
    if (window.confirm('Ben je zeker dat je dit spel wilt verwijderen?')) {
      try {
        const response = await GameService.deleteGame(game.id?.toString() as string);

        if (!response.ok) {
          if (response.status == 403) {
            setError('Je hebt geen rechten om dit spel te verwijderen.')
            return
          }
          setError(response.statusText);
          return;
        }

        router.push('/');
        return
      } catch {
        setError('Er is iets misgelopen, probeer het later opnieuw.')
        return
      }
    }
    setDeleting(false);
  };

  return (
    <section className="relative w-full rounded-2xl">
      <div className="">
        <div className="w-full p-3 sm:p-5 md:p-7 lg:p-0">
          <div className="my-10 space-y-5">
            {error && (
              <Alert
                message={error}
                onDismiss={() => setError('')}
                className="mb-4"
              />
            )}

            <div className="text-center">
              <h1 className="text-3xl font-bold uppercase break-words text-primary sm:text-4xl">
                {game.name}
              </h1>
            </div>

            <div className="flex flex-col space-y-3 sm:space-y-0 sm:space-x-4 sm:flex-row sm:justify-between md:block md:space-x-0 md:space-y-4 md:absolute top-16 right-4 sm:right-6 lg:right-8">
              {user.id === game.user.id && (
                <div className="flex space-x-2 md:space-x-0 md:space-y-2 md:block">
                  <a href={`/bewerken/${game.id}`}>
                    <Button>
                      <Pen className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button onClick={handleDelete} loading={deleting} className='bg-red-500'>
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
              {game.tags && game.tags.length > 0 && (
                <div className="mt-6 mb-0 space-x-2 space-y-2">
                  {(game.tags as Tag[]).map((tag) => (
                    <div className="relative inline-block py-1 text-xs">
                      <div className="absolute inset-0 flex text-primary">
                        <svg height="100%" viewBox="0 0 50 100">
                          <path
                            d="M49.9,0a17.1,17.1,0,0,0-12,5L5,37.9A17,17,0,0,0,5,62L37.9,94.9a17.1,17.1,0,0,0,12,5ZM25.4,59.4a9.5,9.5,0,1,1,9.5-9.5A9.5,9.5,0,0,1,25.4,59.4Z"
                            fill="currentColor" />
                        </svg>
                        <div className="flex-grow h-full -ml-px rounded-r-sm bg-primary">
                        </div>
                      </div>
                      <span className="relative pr-px font-semibold text-white uppercase">
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{tag.tag}<span>&nbsp;&nbsp;&nbsp;</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameDetails;