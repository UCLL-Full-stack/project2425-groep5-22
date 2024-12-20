import React, { useState, useEffect } from 'react';
import { Tag } from '@/types';
import { X } from 'lucide-react';

type Props = {
  availableTags: Tag[];
  selectedTags: (Tag | string)[];
  onTagSelect: Function;
  onTagRemove: Function;
  error: string | undefined;
  canCreateNewTag: boolean;
};

const TagInput: React.FC<Props> = ({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
  error,
  canCreateNewTag,
}) => {
  const [tagInput, setTagInput] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    // Filter availableTags by checking if the tag is already selected
    const filtered = availableTags.filter(tag =>
      tag.tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTags.some(selectedTag =>
        typeof selectedTag === 'string' ? selectedTag === tag.tag : selectedTag.tag === tag.tag
      )
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
            {tagInput && !filteredTags.find(tag => tag.tag.toLowerCase() === tagInput.toLowerCase()) && canCreateNewTag && (
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
            key={typeof tag === 'string' ? tag : tag.tag} // Use tag or tag.tag as the key
            className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-primary/20 text-primary"
          >
            {typeof tag === 'string' ? tag : tag.tag} {/* Use tag or tag.tag based on type */}
            <button
              onClick={() => onTagRemove(typeof tag === 'string' ? tag : tag.tag)}
              className="rounded-full hover:bg-primary/30 transition-all p-0.5"
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInput;