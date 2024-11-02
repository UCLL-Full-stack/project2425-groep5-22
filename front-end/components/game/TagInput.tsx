import React, { useState, useEffect } from 'react';
import { Tag } from '@/types';

type Props = {
  availableTags: Tag[],
  selectedTags: string[],
  onTagSelect: any,
  onTagRemove: any,
  error: string | undefined
}

const TagInput: React.FC<Props> = ({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  error
}) => {
  const [tagInput, setTagInput] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    const filtered = availableTags.filter(tag =>
      tag.tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.includes(tag.tag)
    );
    setFilteredTags(filtered);
  }, [tagInput, availableTags, selectedTags]);

  const handleCreateTag = () => {
    if (tagInput.trim()) {
      onTagSelect(tagInput.trim());
      setTagInput('');
      setShowDropdown(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Zoek of voeg tags toe"
          className={`px-3 py-2 w-full rounded-lg bg-gray-200 text-gray-700 placeholder:text-gray-500 ${error ? 'border-2 border-red-500' : 'border-none'
            }`}
        />

        {showDropdown && (tagInput || filteredTags.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
            {filteredTags.map(tag => (
              <div
                key={tag.id}
                onClick={() => {
                  onTagSelect(tag.tag);
                  setTagInput('');
                  setShowDropdown(false);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {tag.tag}
              </div>
            ))}
            {tagInput && !filteredTags.find(tag => tag.tag.toLowerCase() === tagInput.toLowerCase()) && (
              <div
                onClick={handleCreateTag}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-primary"
              >
                + Maak nieuwe tag "{tagInput}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <div
            key={tag}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-primary/20 text-primary rounded-full"
          >
            {tag}
            <button
              onClick={() => onTagRemove(tag)}
              className=" rounded-full hover:bg-primary/30 transition-all px-2 py-0.5"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;