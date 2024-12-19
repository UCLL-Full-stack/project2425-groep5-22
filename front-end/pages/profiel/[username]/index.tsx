import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Game, User } from '@/types';
import Loader from '@/components/Loader';
import ErrorAlert from '@/components/ErrorAlert';
import { useRouter } from 'next/router';
import userService from '@/services/UserService';
import gameService from '@/services/GameService';
import Navbar from '@/components/Navbar';
import UserProfile from '@/components/profile/User';
import GameGrid from '@/components/game/Grid';
import GameCard from '@/components/game/Card';
import NoGames from '@/components/game/NoGames';

const Update = () => {
  const router = useRouter();
  const { username } = router.query;

  // Data states
  const [user, setUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);
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


  const fetchProfile = async () => {
    try {
      const response = await userService.getUserByUsername(username as string);
      const result: User = await response.json();
      setUser(result);
    } catch (error) {
      setApiError('Er is een fout opgetreden bij het laden van de gegevens');
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await gameService.getGamesByUsername(username as string);
      const result: Game[] = await response.json();
      if (result.length > 0)
        setGames(result.slice(0, 6));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const effect = async () => {
      await checkAuth();
      await fetchProfile();
      await fetchData();
    };

    if (username)
      effect();
  }, [username]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Profiel</title>
        <meta name="description" content="Spel Bijwerken" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar user={currentUser ?? {} as User} />

      <div className="min-h-screen px-5 py-10 space-y-10 3xl:px-0">
        <main className='px-4 py-16 mx-auto sm:px-6 lg:px-8'>
          {apiError && (
            <ErrorAlert
              message={apiError}
              onDismiss={() => setApiError('')}
              className="mb-4"
            />
          )}

          <UserProfile user={user as User} />
          <GameGrid>
            {games && games.length > 0 ?
              games.map((game) => (
                <div key={game.id} className="space-y-3">
                  <GameCard game={game} />
                </div>
              )) : (
                <NoGames />
              )}
          </GameGrid>
        </main>
      </div>
    </>
  );
};

export default Update;