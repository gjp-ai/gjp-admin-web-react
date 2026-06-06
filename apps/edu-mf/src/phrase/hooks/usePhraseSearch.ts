import { useState } from 'react';
import type { Phrase, PhraseSearchFormData } from '../types/phrase.types';

export const usePhraseSearch = (allPhrases: Phrase[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<PhraseSearchFormData>({
    name: '',
    lang: '',
    tags: '',
    channel: '',
    difficultyLevel: '',
    term: '',
    week: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof PhraseSearchFormData, value: string | null) =>
    setSearchFormData((previousFormData) => ({ ...previousFormData, [field]: value }));
  const handleClearSearch = () =>
    setSearchFormData({
      name: '',
      lang: '',
      tags: '',
      channel: '',
      difficultyLevel: '',
      term: '',
      week: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: PhraseSearchFormData) => {
    const { name, lang, tags, channel, difficultyLevel, isActive } = formData;
    return allPhrases.filter((phrase) => {
      if (name && !phrase.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && phrase.lang !== lang) return false;
      if (tags && !phrase.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (channel && !phrase.channel?.toLowerCase().includes(channel.toLowerCase())) return false;
      if (difficultyLevel && phrase.difficultyLevel !== difficultyLevel) return false;
      if (isActive === 'true' && !phrase.isActive) return false;
      if (isActive === 'false' && phrase.isActive) return false;
      return true;
    });
  };

  return {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  };
};
