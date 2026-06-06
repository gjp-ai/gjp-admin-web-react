import { useState } from 'react';
import type { Sentence, SentenceSearchFormData } from '../types/sentence.types';

export const useSentenceSearch = (allSentences: Sentence[]) => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchFormData, setSearchFormData] = useState<SentenceSearchFormData>({
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
  const handleSearchFormChange = (field: keyof SentenceSearchFormData, value: string | null) =>
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

  const applyClientSideFiltersWithData = (formData: SentenceSearchFormData) => {
    const { name, lang, tags, channel, difficultyLevel, isActive } = formData;
    return allSentences.filter((sentence) => {
      if (name && !sentence.name?.toLowerCase().includes(name.toLowerCase())) return false;
      if (lang && sentence.lang !== lang) return false;
      if (tags && !sentence.tags?.toLowerCase().includes(tags.toLowerCase())) return false;
      if (channel && !sentence.channel?.toLowerCase().includes(channel.toLowerCase())) return false;
      if (difficultyLevel && sentence.difficultyLevel !== difficultyLevel) return false;
      if (isActive === 'true' && !sentence.isActive) return false;
      if (isActive === 'false' && sentence.isActive) return false;
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
