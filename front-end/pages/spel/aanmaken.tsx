import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Game, Intensity, Tag } from '@/types';
import Loader from '@/components/Loader';
import ErrorAlert from '@/components/ErrorAlert';
import FormField from '@/components/game/FormField';
import TagInput from '@/components/game/TagInput';
import GameService from '@/services/GameService';
import IntensityService from '@/services/IntensityService';
import TagService from '@/services/TagService';
import { useRouter } from 'next/router';

const Create = () => {
  const router = useRouter();

  // Game
  const [game, setGame] = useState<Game>({
    name: '',
    user: {
      id: 1,
      name: "John Doe",
      email: "john@jeugdwerk.org",
      password: "password123"
    },
    explanation: '',
    duration: 0,
    groups: true,
    intensity: {} as Intensity,
    tags: []
  });

  // UI state
  const [intensities, setIntensities] = useState<Intensity[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [apiError, setApiError] = useState<string>('');

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const intensitiesResponse = await IntensityService.getAll()
      const intensitiesData: Intensity[] = await intensitiesResponse.json();
      setIntensities(intensitiesData);

      const tagsResponse = await TagService.getAll()
      const tagsData: Tag[] = await tagsResponse.json();
      setAvailableTags(tagsData);
    } catch (error) {
      setApiError('Er is een fout opgetreden bij het laden van de gegevens');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!game.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }

    if (!game.explanation.trim()) {
      newErrors.explanation = 'Beschrijving is verplicht';
    }

    if (game.duration <= 0) {
      newErrors.duration = 'Duur moet groter zijn dan 0';
    }

    if (!game.intensity.id) {
      newErrors.intensity = 'Selecteer een intensiteit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const response = await GameService.createGame(game);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create game');
      }

      setGame({
        name: '',
        user: game.user, // Preserve user data
        explanation: '',
        duration: 0,
        groups: true,
        intensity: {} as Intensity,
        tags: []
      });

      router.push('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      setApiError('Er is een fout opgetreden bij het opslaan van het spel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    setGame(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
  };

  const handleTagRemove = (tagToRemove: string) => {
    setGame(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <>
      <Head>
        <title>Spel Aanmaken</title>
        <meta name="description" content="Spel Aanmaken" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-screen-lg mx-auto space-y-4 p-4">
        {apiError && (
          <ErrorAlert
            message={apiError}
            onDismiss={() => setApiError('')}
            className="mb-4"
          />
        )}


        <div className="flex justify-between items-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isSubmitting && <Loader />}
            {isSubmitting ? 'Bezig met opslaan...' : 'Opslaan'}
          </button>
        </div>

        <div className="space-y-6">
          <FormField error={errors.name}>
            <input
              type="text"
              value={game.name}
              onChange={(e) => {
                setGame(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              placeholder="Geef mij een naam"
              className="px-3 py-2 w-full rounded-lg bg-gray-200 text-gray-700 placeholder:text-gray-500 text-2xl font-bold"
            />
          </FormField>

          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">
              <FormField error={errors.explanation}>
                <textarea
                  value={game.explanation}
                  onChange={(e) => {
                    setGame(prev => ({ ...prev, explanation: e.target.value }));
                    setErrors(prev => ({ ...prev, explanation: undefined }));
                  }}
                  rows={20}
                  placeholder="Geef een beschrijving van je spel"
                  className="px-3 py-2 w-full rounded-lg bg-gray-200 text-gray-700 placeholder:text-gray-500"
                />
              </FormField>
            </div>

            <div className="space-y-4">
              <FormField label="Duur (minuten)" error={errors.duration}>
                <input
                  type="number"
                  value={game.duration}
                  onChange={(e) => {
                    setGame(prev => ({ ...prev, duration: Number(e.target.value) }));
                    setErrors(prev => ({ ...prev, duration: undefined }));
                  }}
                  className="px-3 py-2 w-full rounded-lg bg-gray-200 text-gray-700"
                  step={1}
                  min={0}
                />
              </FormField>

              <FormField label="Groepen">
                <select
                  value={game.groups.toString()}
                  onChange={(e) => setGame(prev => ({
                    ...prev,
                    groups: e.target.value === 'true'
                  }))}
                  className="px-3 py-2 w-full rounded-lg bg-gray-200 text-gray-700"
                >
                  <option value="true">Ja</option>
                  <option value="false">Nee</option>
                </select>
              </FormField>

              <FormField label="Intensiteit" error={errors.intensity}>
                <select
                  value={game.intensity?.id || ''}
                  onChange={(e) => {
                    const selectedIntensity = intensities.find(
                      i => i.id === Number(e.target.value)
                    );
                    if (selectedIntensity) {
                      setGame(prev => ({ ...prev, intensity: selectedIntensity }));
                      setErrors(prev => ({ ...prev, intensity: undefined }));
                    }
                  }}
                  className="px-3 py-2 w-full rounded-lg bg-gray-200 text-gray-700"
                >
                  <option value="">Selecteer intensiteit</option>
                  {intensities.map(intensity => (
                    <option key={intensity.id} value={intensity.id}>
                      {intensity.intensity}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Tags">
                <TagInput
                  availableTags={availableTags}
                  selectedTags={game.tags}
                  onTagSelect={handleTagSelect}
                  onTagRemove={handleTagRemove}
                  error={errors.tags}
                />
              </FormField>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Create;