import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Game, Intensity, Tag, User } from '@/types';
import Loader from '@/components/Loader';
import Alert from '@/components/Alert';
import Form from '@/components/gameForm/Form';
import gameService from '@/services/GameService';
import intensityService from '@/services/IntensityService';
import tagService from '@/services/TagService';
import { useRouter } from 'next/router';
import userService from '@/services/UserService';
import NotFound from "next/error";
import useSWR from 'swr';

const Update = () => {
  // const router = useRouter();
  // const { id } = router.query;

  // // Data states
  // const [game, setGame] = useState<Game | null>(null);
  // const [intensities, setIntensities] = useState<Intensity[]>([]);
  // const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  // const [currentUser, setCurrentUser] = useState<User | null>(null);

  // // Loading and error states
  // const [loading, setLoading] = useState<boolean>(true);
  // const [apiError, setApiError] = useState<string>('');

  // const checkAuth = async () => {
  //   try {
  //     const { status, user: authUser } = await userService.checkAuth();
  //     if (!status || !authUser) {
  //       router.push('/login?status=notLoggedIn')
  //       return;
  //     }

  //     setCurrentUser(authUser);
  //   } catch (e) {
  //     console.error('Something went wrong while checking authentication', e)
  //     setApiError('Er ging iets mis met authenticatie te controlleren, probeer het later opnieuw');
  //   }
  // };


  // const fetchData = async () => {
  //   try {
  //     // Fetch game details
  //     const gameResponse = await gameService.getGameById(id as string);
  //     const gameData: Game = await gameResponse.json();
  //     setGame(gameData);

  //     // Fetch intensities
  //     const intensitiesResponse = await intensityService.getAll()
  //     const intensitiesData: Intensity[] = await intensitiesResponse.json();
  //     setIntensities(intensitiesData);

  //     // Fetch tags
  //     const tagsResponse = await tagService.getAll()
  //     const tagsData: Tag[] = await tagsResponse.json();
  //     setAvailableTags(tagsData);
  //   } catch (error) {
  //     setApiError('Er is een fout opgetreden bij het laden van de gegevens');
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const effect = async () => {
  //     await checkAuth();
  //     await fetchData();
  //   };

  //   if (id)
  //     effect();
  // }, [id]);


  // const handleSubmit = async (updatedGame: Game) => {
  //   setApiError('');

  //   try {
  //     const response = await gameService.updateGame(id as string, {
  //       ...updatedGame,
  //       user: currentUser ?? {} as User
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to update game');
  //     }

  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setApiError('Er is een fout opgetreden bij het bijwerken van het spel');
  //     throw error;
  //   }
  // };

  // if (loading) {
  //   return <Loader />;
  // }

  // if (currentUser?.id !== game?.user.id) {
  //   <NotFound statusCode={403} />
  // }

  const router = useRouter();
  const { id } = router.query;
  const [apiError, setApiError] = useState<string>('');

  const checkAuth = async () => {
    const { status, user } = await userService.checkAuth();
    if (!status || !user) {
      router.push('/login?status=notLoggedIn');
    }
    return user;
  };

  const getTagsIntensityAndGame = async () => {
    const responses = await Promise.all([
      tagService.getAll(),
      intensityService.getAll(),
      gameService.getGameById(id as string)
    ])

    const [tagResponse, intensityResponse, gameResponse] = responses;
    const tags: Tag[] = await tagResponse.json();
    const intensities: Intensity[] = await intensityResponse.json();
    const game: Game = await gameResponse.json();

    return { tags, intensities, game }
  }

  const {
    data: currentUser,
    error: authError,
  } = useSWR('auth', checkAuth)

  const {
    data,
    error,
    isLoading,
  } = useSWR(currentUser && id ? 'tagsIntensityAndGame' : null, getTagsIntensityAndGame);

  const handleSubmit = async (updatedGame: Game) => {
    try {
      const response = await gameService.updateGame(id as string, {
        ...updatedGame,
        user: currentUser ?? {} as User
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update game');
      }

      const newUpdatedGame: Game = await response.json();

      router.push('/spel/' + newUpdatedGame.id + "/" + newUpdatedGame.name.toLowerCase().replace(' ', '-'));
    } catch (error) {
      console.error('Error submitting form:', error);
      setApiError('Er is een fout opgetreden bij het bijwerken van het spel');
      throw error;
    }
  };

  if (!currentUser || isLoading || authError) return <Loader />

  if (currentUser.id !== data?.game.user.id) {
    <NotFound statusCode={403} />
  }

  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content="Spel Bijwerken" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-screen-lg p-4 mx-auto space-y-4">
        {error && (
          <Alert
            message={error}
            className="mb-4"
          />
        )}

        {data && (
          currentUser.id !== data.game.user.id ? (
            <NotFound statusCode={403} withDarkMode={false} title="Je hebt geen rechten om dit spel te bewerken." />
          ) : (<>
            {apiError && (
              <Alert
                message={apiError}
                onDismiss={() => setApiError('')}
                className="mb-4"
              />
            )}
            <Form
              initialGame={data.game}
              intensities={data.intensities}
              availableTags={data.tags}
              onSubmit={handleSubmit}
              submitButtonText="Bijwerken"
            />
          </>
          )
        )}
      </main >
    </>
  );
};

export default Update;