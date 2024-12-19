import { Filter, Game, Intensity, Tag } from '@/types';
import React, { useEffect, useState } from 'react';
import { Clock, Users, PersonStanding } from 'lucide-react';
import Link from 'next/link';
import TagInput from '../gameForm/TagInput';
import Button from '../Button';
import intensityService from '@/services/IntensityService';
import tagService from '@/services/TagService';

type Props = {
  filters: Filter,
  setFilters: Function,
  handleFilterChange: Function
  loading: boolean,
  tags: Tag[],
  intensities: Intensity[]
}

const FilterInput: React.FC<Props> = ({ filters, setFilters, handleFilterChange, loading, tags, intensities }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <TagInput
          availableTags={tags}
          selectedTags={filters.tags}
          onTagSelect={(tag: string) => setFilters((prev: Filter) => ({
            ...prev,
            tags: [
              ...prev.tags, tag
            ]
          }))}
          onTagRemove={(tag: string) => setFilters((prev: Filter) => ({
            ...prev,
            tags: [
              ...prev.tags.filter((thisTag: string) => tag !== thisTag)
            ]
          }))}
          error={undefined}
          canCreateNewTag={false}
        />


      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Intensiteit</label>
        <select
          className="input"
          value={filters.intensityId?.toString()}
          onChange={(e) =>
            handleFilterChange('intensityId', e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Alle intensiteiten</option>
          {intensities.map(intensity => (
            <option value={intensity.id}>{intensity.intensity}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Groepen</label>
        <select
          className="input"
          value={filters.groups?.toString()}
          onChange={(e) =>
            handleFilterChange('groups', e.target.value === 'true' ? true : false)
          }
        >
          <option value="">Beide</option>
          <option value="true">Ja</option>
          <option value="false">Neen</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tijd (minuten)</label>
        <input
          type="number"
          placeholder="120"
          value={filters.duration?.toString()}
          className="input"
          onChange={(e) =>
            handleFilterChange('duration', e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>
    </div>
  );
};

export default FilterInput;
