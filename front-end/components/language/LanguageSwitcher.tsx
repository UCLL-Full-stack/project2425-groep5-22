import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

// Define a type for the language icons
type LanguageIcons = {
  [key in 'nl' | 'en']: string;
};

// Language icons (you can replace these with actual flag icons or SVGs)
const languageIcons: LanguageIcons = {
  nl: '🇳🇱',
  en: '🇬🇧',
};

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { locale } = router;
  const [isOpen, setIsOpen] = useState(false);

  // Define the available languages as a const assertion to help TypeScript
  const languages = ['nl', 'en'] as const;
  type Language = typeof languages[number];

  const changeLanguage = (lang: Language) => {
    const newLocale = lang;
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
    setIsOpen(false);
  };

  const currentLocale = (locale || 'nl') as Language;

  return (
    <div className="fixed z-50 bottom-6 right-6">
      <div className="relative">
        {/* Main Language Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-16 h-16 text-3xl text-white transition-all duration-300 rounded-full shadow-lg bg-primary-one hover:bg-primary-two"
        >
          {languageIcons[currentLocale]}
        </button>

        {/* Language Selection Dropdown */}
        {isOpen && (
          <div className="absolute right-0 mb-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg bottom-full">
            {languages.filter(lang => lang !== currentLocale).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className="flex items-center w-full px-4 py-2 space-x-2 text-left hover:bg-gray-100"
              >
                <span className="text-2xl">{languageIcons[lang]}</span>
                <span className="text-sm">{lang.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;