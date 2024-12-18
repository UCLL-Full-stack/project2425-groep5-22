import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Game, User } from '@/types';
import Loader from '@/components/Loader';
import ErrorAlert from '@/components/ErrorAlert';
import gameService from '@/services/GameService';
import { useRouter } from 'next/router';
import userService from '@/services/UserService';
import GameDetails from '@/components/game/Game';
import Navbar from '@/components/Navbar';
import MoreFrom from '@/components/game/MoreFrom';

const Update = () => {
  const router = useRouter();
  const { id } = router.query;

  // Data states
  const [game, setGame] = useState<Game | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string>('');

  const checkAuth = async () => {
    try {
      const { status, user: authUser } = await userService.checkAuth();
      if (!status || !authUser) {
        router.push('/login')
        return;
      }

      setCurrentUser(authUser);
    } catch (e) {
      console.error('Something went wrong while checking authentication', e)
      setApiError('Er ging iets mis met authenticatie te controlleren, probeer het later opnieuw');
    }
  };


  const fetchData = async () => {
    try {
      // Fetch game details
      const gameResponse = await gameService.getGameById(id as string);
      const gameData: Game = await gameResponse.json();
      setGame(gameData);
    } catch (error) {
      setApiError('Er is een fout opgetreden bij het laden van de gegevens');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const effect = async () => {
      await checkAuth();
      await fetchData();
    };

    if (id)
      effect();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Spel Bijwerken</title>
        <meta name="description" content="Spel Bijwerken" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar user={currentUser ?? {} as User} />

      <div className="min-h-screen px-5 py-10 space-y-10 3xl:px-0">
        <main className='max-w-screen-lg px-4 py-16 mx-auto sm:px-6 lg:px-8'>
          {apiError && (
            <ErrorAlert
              message={apiError}
              onDismiss={() => setApiError('')}
              className="mb-4"
            />
          )}

          <GameDetails game={game as Game} user={currentUser} />
          <MoreFrom user={game?.user as User} />
        </main>
      </div>
    </>
  );
};

export default Update;