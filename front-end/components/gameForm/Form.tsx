import React, { useState } from 'react';
import { Game, Intensity, Tag, User } from '@/types';
import FormField from '@/components/gameForm/FormField';
import TagInput from '@/components/gameForm/TagInput';
import Button from '@/components/Button';

interface Props {
  initialGame?: Partial<Game>;
  intensities: Intensity[];
  availableTags: Tag[];
  onSubmit: (game: Game) => Promise<void>;
  submitButtonText?: string;
}

const Form: React.FC<Props> = ({
  initialGame = {},
  intensities,
  availableTags,
  onSubmit,
  submitButtonText = 'Opslaan'
}) => {
  const [game, setGame] = useState<Game>({
    name: initialGame.name || '',
    user: initialGame.user || {} as User,
    explanation: initialGame.explanation || '',
    duration: initialGame.duration || 0,
    groups: initialGame.groups ?? true,
    intensity: initialGame.intensity || {} as Intensity,
    tags: initialGame.tags || []
  });

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: { [Key: string]: string } = {};

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
    try {
      await onSubmit(game);
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
      tags: prev.tags.filter(tag => tag === tagToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end w-full">
        <Button onClick={handleSubmit} loading={isSubmitting}>{submitButtonText}</Button>
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
            className="text-2xl font-bold input"
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
                className="input"
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
                className="input"
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
                className="input"
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
                className="input"
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
                selectedTags={game.tags as string[]}
                onTagSelect={handleTagSelect}
                onTagRemove={handleTagRemove}
                error={errors.tags}
              />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;