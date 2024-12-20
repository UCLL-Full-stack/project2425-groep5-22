import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Filter, Game, Intensity, Tag, User } from '@/types';
import userService from '@/services/UserService';
import { useRouter } from 'next/router';
import gameService from '@/services/GameService';
import Loader from '@/components/Loader';
import GameGrid from '@/components/game/Grid';
import GameCard from '@/components/game/Card';
import Author from '@/components/game/Author';
import Navbar from '@/components/Navbar';
import Alert from '@/components/Alert';
import intensityService from '@/services/IntensityService';
import tagService from '@/services/TagService';
import FilterInput from '@/components/game/Filters';
import useSWR from 'swr';

const Games = () => {
  const router = useRouter();
  const [filters, setFilters] = useState<Filter>({
    tags: [],
    intensityId: null,
    groups: null,
    duration: null,
  });

  const checkAuth = async () => {
    const { status, user } = await userService.checkAuth();
    if (!status || !user) {
      router.push('/login?status=notLoggedIn');
    }
    return user;
  };

  const fetchIntensitiesAndTags = async () => {
    const [intensitiesResponse, tagsResponse] = await Promise.all([
      intensityService.getAll(),
      tagService.getAll(),
    ]);

    const intensities: Intensity[] = await intensitiesResponse.json();
    const tags: Tag[] = await tagsResponse.json();

    return { intensities, tags };
  };

  const fetchGamesWithFilters = async (filters: Filter) => {
    try {
      let response;
      if (
        filters.tags.length > 0 ||
        filters.intensityId !== null ||
        filters.groups !== null ||
        (filters.duration !== null && filters.duration > 0)
      ) {
        response = await gameService.getFilteredGames(filters);
      } else {
        response = await gameService.getGames();
      }

      if (!response || !response.ok) {
        throw new Error('Er is iets misgelopen, probeer het later opnieuw.');
      }

      const games: Game[] = await response.json();

      return games;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw new Error('Er is iets misgelopen, probeer het later opnieuw.');
    }
  };

  const { data: currentUser, error: authError } = useSWR('auth', checkAuth);

  const {
    data: intensitiesAndTags,
    error: intensitiesTagsError,
  } = useSWR(currentUser ? 'intensitiesTags' : null, fetchIntensitiesAndTags);

  const { data: games, error: gamesError, isValidating } = useSWR(
    currentUser && intensitiesAndTags ? ['games', filters] : null,
    ([, filters]) => fetchGamesWithFilters(filters)
  );

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      tags: [],
      intensityId: null,
      groups: null,
      duration: null,
    })
  }

  if (!currentUser || !intensitiesAndTags || authError) return <Loader />;

  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar user={currentUser ?? ({} as User)} />

      <div className="min-h-screen px-5 py-10 space-y-10 3xl:px-0">
        <main>
          {(gamesError || intensitiesTagsError) && (
            <Alert
              message="Er is iets misgelopen, probeer het later opnieuw."
              className="mb-4"
            />
          )}

          {intensitiesAndTags && intensitiesAndTags !== undefined && (
            <section className="px-4 py-4 mx-auto xl:px-0">
              {/* Filter UI */}
              <FilterInput
                filters={filters}
                setFilters={setFilters}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
                tags={intensitiesAndTags.tags as Tag[]}
                intensities={intensitiesAndTags.intensities as Intensity[]}
              />

              {/* Games Grid */}
              <div className="w-full mx-auto">
                {isValidating ? (
                  <Loader />
                ) : games && games.length > 0 ? (
                  <GameGrid>
                    {games.map((game) => (
                      <div key={game.id} className="space-y-3">
                        <GameCard game={game} />
                        <Author user={game.user} />
                      </div>
                    ))}
                  </GameGrid>
                ) : (
                  <p className="py-10 text-center">
                    Er werden spijtig genoeg geen spellen gevonden 😢.
                  </p>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default Games;
