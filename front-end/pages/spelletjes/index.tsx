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
import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import ErrorAlert from '@/components/ErrorAlert';
import intensityService from '@/services/IntensityService';
import tagService from '@/services/TagService';
import TagInput from '@/components/gameForm/TagInput';
import FilterInput from '@/components/game/Filters';

const Home = () => {
  const router = useRouter();

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [games, setGames] = useState<Game[]>([]);
  const [intensities, setIntensities] = useState<Intensity[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Filter state
  const [filters, setFilters] = useState<Filter>({
    tags: [],
    intensityId: null,
    groups: null,
    duration: null,
  });

  const checkAuth = async () => {
    try {
      const { status, user: authUser } = await userService.checkAuth();
      if (!status || !authUser) {
        router.push('/login');
        return;
      }

      setCurrentUser(authUser);
    } catch (e) {
      console.error('Something went wrong while checking authentication', e);
      throw new Error('Something went wrong while checking authentication');
    }
  };

  const fetchData = async () => {
    try {
      const intensitiesResponse = await intensityService.getAll()
      const intensitiesData: Intensity[] = await intensitiesResponse.json();
      setIntensities(intensitiesData);

      const tagsResponse = await tagService.getAll()
      const tagsData: Tag[] = await tagsResponse.json();
      setTags(tagsData);
    } catch (error) {
      setError('Er is een fout opgetreden bij het laden van de gegevens');
      console.error('Error fetching data:', error);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      let response;

      // Conditional fetching based on filters
      if (
        filters.tags.length > 0 ||
        filters.intensityId !== null ||
        filters.groups !== null ||
        (filters.duration !== null && filters.duration > 0)
      ) {
        // Call the service with filters
        response = await gameService.getFilteredGames(filters);
      } else {
        // Call the service without filters
        response = await gameService.getGames();
      }

      // Check if the response is valid
      if (!response || !response.ok) {
        console.error('Er is iets misgelopen', response ? response.statusText : 'No response');
        setError('Er is iets misgelopen, probeer het later opnieuw.');
        return; // Early return if the response is invalid
      }

      // Parse the JSON result from the response
      const result = await response.json();
      setGames(result); // Set the games to state
    } catch (error) {
      // Handle unexpected errors
      console.error('Error fetching data:', error);
      setError('Er is iets misgelopen, probeer het later opnieuw.');
    } finally {
      setLoading(false); // Set loading to false after the request finishes
    }
  };


  useEffect(() => {
    const effect = async () => {
      await checkAuth();
      await fetchData()
      await fetchGames();
    };

    effect();
  }, []);

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchGames();
  };

  if (loading) return <Loader />;

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
          {error && (
            <ErrorAlert
              message={error}
              onDismiss={() => setError('')}
              className="mb-4"
            />
          )}

          <section className="px-4 py-4 mx-auto xl:px-0">
            {/* Filter UI */}
            <FilterInput
              filters={filters}
              setFilters={setFilters}
              handleApplyFilters={handleApplyFilters}
              handleFilterChange={handleFilterChange}
              loading={loading}
              tags={tags}
              intensities={intensities}
            />


            {/* Games Grid */}
            <div className="mx-auto w-full">
              {games.length > 0 ? (
                <GameGrid>
                  {games.map((game) => (
                    <div key={game.id} className="space-y-3">
                      <GameCard game={game} />
                      <Author user={game.user} />
                    </div>
                  ))}
                </GameGrid>
              ) : (
                <p className='text-center py-10'>Er werden spijtig genoeg geen spellen gevonden 😢.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
