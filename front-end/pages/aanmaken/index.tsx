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
import useSWR from 'swr';

const Create = () => {
  // const router = useRouter();

  // // Data states
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
  //     setLoading(true);

  //     const intensitiesResponse = await intensityService.getAll()
  //     const intensitiesData: Intensity[] = await intensitiesResponse.json();
  //     setIntensities(intensitiesData);

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

  //   effect();
  // }, []);

  // const handleSubmit = async (game: Game) => {
  //   setApiError('');

  //   try {
  //     const response = await gameService.createGame({
  //       ...game,
  //       user: currentUser ?? {} as User
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to create game');
  //     }

  //     router.push('/');
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setApiError('Er is een fout opgetreden bij het opslaan van het spel');
  //     throw error;
  //   }
  // };

  // if (loading) {
  //   return <Loader />;
  // }

  const router = useRouter();
  const [apiError, setApiError] = useState<string>('');

  const checkAuth = async () => {
    const { status, user } = await userService.checkAuth();
    if (!status || !user) {
      router.push('/login?status=notLoggedIn');
    }
    return user;
  };

  const getTagsAndIntensity = async () => {
    const responses = await Promise.all([
      tagService.getAll(),
      intensityService.getAll(),
    ])

    const [tagResponse, intensityResponse] = responses;
    const tags: Tag[] = await tagResponse.json();
    const intensities: Intensity[] = await intensityResponse.json();

    return { tags, intensities }
  }

  const {
    data: currentUser,
    error: authError,
  } = useSWR('auth', checkAuth)

  const {
    data,
    error,
    isLoading,
  } = useSWR(currentUser ? 'tagsAndIntensity' : null, getTagsAndIntensity);

  const handleSubmit = async (game: Game) => {
    setApiError('');

    try {
      const response = await gameService.createGame({
        ...game,
        user: currentUser ?? {} as User
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create game');
      }

      const newGame: Game = await response.json();

      router.push('/spel/' + newGame.id + "/" + newGame.name.toLowerCase().replace(' ', '-'));
    } catch (error) {
      console.error('Error submitting form:', error);
      setApiError('Er is een fout opgetreden bij het opslaan van het spel');
      throw error;
    }
  };

  if (!currentUser || isLoading || authError) return <Loader />

  return (
    <>
      <Head>
        <title>Jeugdwerk</title>
        <meta name="description" content="Spel Aanmaken" />
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
          <>
            {apiError && (
              <Alert
                message={apiError}
                onDismiss={() => setApiError('')}
                className="mb-4"
              />
            )}
            <Form
              intensities={data.intensities}
              availableTags={data.tags}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </main>
    </>
  );
};

export default Create;