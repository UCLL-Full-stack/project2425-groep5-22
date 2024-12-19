import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Game, User } from '@/types';
import Loader from '@/components/Loader';
import Alert from '@/components/Alert';
import gameService from '@/services/GameService';
import { useRouter } from 'next/router';
import userService from '@/services/UserService';
import GameDetails from '@/components/game/Game';
import Navbar from '@/components/Navbar';
import MoreFrom from '@/components/game/MoreFrom';
import useSWR from 'swr';

const ViewGame = () => {
  const router = useRouter();
  const { id } = router.query;

  const checkAuth = async () => {
    const { status, user } = await userService.checkAuth();
    if (!status || !user) {
      router.push('/login?status=notLoggedIn');
    }
    return user;
  };

  const getGame = async () => {
    const response = await gameService.getGameById(id as string)
    const game: Game = await response.json();

    return game;
  }

  const {
    data: currentUser,
    error: authError,
  } = useSWR('auth', checkAuth)

  const {
    data: game,
    error: error,
    isLoading,
  } = useSWR(currentUser ? 'game' : null, getGame);

  if (!currentUser || isLoading || authError) return <Loader />

  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content="Spel Bijwerken" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar user={currentUser ?? {} as User} />

      <div className="min-h-screen px-5 py-10 space-y-10 3xl:px-0">
        <main className='max-w-screen-lg px-4 py-16 mx-auto sm:px-6 lg:px-8'>
          {error && (
            <Alert
              message={error}
              className="mb-4"
            />
          )}

          {game && (
            <>
              <GameDetails game={game} user={currentUser} />
              <MoreFrom user={game.user} />
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default ViewGame;