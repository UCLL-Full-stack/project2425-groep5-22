import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Game, User } from '@/types';
import userService from '@/services/UserService';
import { useRouter } from 'next/router';
import gameService from '@/services/GameService';
import Loader from '@/components/Loader';
import GameGrid from '@/components/game/Grid';
import GameCard from '@/components/game/Card';
import Author from '@/components/game/Author';
import Button from '@/components/Button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Home = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<Game[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

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
      throw new Error('Something went wrong while checking authentication');
    }
  };


  const fetchData = async () => {
    try {
      const response = await gameService.getGames();
      const result: Game[] = await response.json();
      setGames(result);
    } catch (error) {
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

    effect();
  }, []);

  if (loading) return <Loader />

  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar user={currentUser ?? {} as User} />

      <div className="min-h-screen px-5 py-10 space-y-10 3xl:px-0">
        <main>
          <section className="px-4 py-4 mx-auto xl:px-0">
            <div className="mx-auto">
              <GameGrid>
                {games.map((game) => (
                  <div key={game.id} className="space-y-3">
                    <GameCard game={game} />
                    <Author user={game.user} />
                  </div>
                ))}
              </GameGrid>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;