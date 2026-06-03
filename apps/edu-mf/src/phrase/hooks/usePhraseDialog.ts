import { useState } from 'react';
import type {
  Phrase,
  PhraseActionType,
  PhraseFormData,
} from '../types/phrase.types';
import { getEmptyPhraseFormData } from '../utils/getEmptyPhraseFormData';

export const usePhraseDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<PhraseActionType>('view');
  const [formData, setFormData] = useState<PhraseFormData>(getEmptyPhraseFormData());
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLanguage = () => formData.lang || 'EN';

  return {
    dialogOpen,
    setDialogOpen,
    actionType,
    setActionType,
    formData,
    setFormData,
    selectedPhrase,
    setSelectedPhrase,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};
