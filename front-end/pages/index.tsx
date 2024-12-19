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
    }
  };


  const fetchData = async () => {
    try {
      const response = await gameService.getGamesRandom();
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
        <header className="relative z-0 w-full h-full overflow-x-hidden bg-center bg-no-repeat bg-cover rounded-2xl" style={{
          backgroundImage: "url('https://jeugdwerk.org/images/header.jpg')"
        }}>
          <div className="w-full h-full bg-black bg-cover bg-opacity-40">
            <div className="grid px-3 py-16 sm:pt-20 sm:px-12 place-items-center">
              <div className="w-full sm:w-[36rem] text-center py-8">
                <p className="text-xl font-bold text-white sm:text-3xl">
                  Ontdek de wereld van jeugdwerk. Door animatoren, voor animatoren</p>
                <p className="mt-1 text-white">
                  Jeugdwerk is een platform gemaakt voor animatoren om inspiratie op te doen en te delen met elkaar
                </p>
              </div>
            </div>
          </div>
        </header>
        <main>
          <section className="px-4 py-4 mx-auto xl:px-0">
            <div className="mx-auto">
              <div className="items-end justify-between sm:flex">
                <h2 className="max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
                  Spelletjes
                </h2>
              </div>

              <GameGrid>
                {games.map((game) => (
                  <div key={game.id} className="space-y-3">
                    <GameCard game={game} />
                    <Author user={game.user} />
                  </div>
                ))}
              </GameGrid>
              <div className="flex items-center justify-center w-full mt-3">
                <Link href="/spelletjes">
                  <Button>Bekijk meer spelletjes <ArrowRight /></Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;