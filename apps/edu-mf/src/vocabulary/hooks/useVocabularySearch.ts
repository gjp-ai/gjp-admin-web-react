import { useState } from 'react';
import type { Vocabulary, VocabularySearchFormData } from '../types/vocabulary.types';

export const useVocabularySearch = (allVocabularies: Vocabulary[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<VocabularySearchFormData>({
    name: '',
    lang: '',
    tags: '',
    channel: '',
    difficultyLevel: '',
    partOfSpeech: '',
    term: '',
    week: '',
    isActive: null,
  });

  const handleSearchPanelToggle = () => setSearchPanelOpen(!searchPanelOpen);
  const handleSearchFormChange = (field: keyof VocabularySearchFormData, value: string | null) =>
    setSearchFormData((previousFormData) => ({ ...previousFormData, [field]: value }));
  const handleClearSearch = () =>
    setSearchFormData({
      name: '',
      lang: '',
      tags: '',
      channel: '',
      difficultyLevel: '',
      partOfSpeech: '',
      term: '',
      week: '',
      isActive: null,
    });

  const applyClientSideFiltersWithData = (formData: VocabularySearchFormData) => {
    const { name, lang, tags, channel, difficultyLevel, partOfSpeech, isActive } = formData;
    return allVocabularies.filter((vocabulary) => {
      if (name && !vocabulary.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && vocabulary.lang !== lang) return false;
      if (tags && !vocabulary.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (channel && !vocabulary.channel?.toLowerCase().includes(channel.toLowerCase())) return false;
      if (difficultyLevel && vocabulary.difficultyLevel !== difficultyLevel) return false;
      if (partOfSpeech && !vocabulary.partOfSpeech?.toLowerCase().includes(partOfSpeech.toLowerCase())) return false;
      if (isActive === 'true' && !vocabulary.isActive) return false;
      if (isActive === 'false' && vocabulary.isActive) return false;
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
