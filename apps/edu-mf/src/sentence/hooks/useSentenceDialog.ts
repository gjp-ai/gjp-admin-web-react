import { useState } from 'react';
import type {
  Sentence,
  SentenceActionType,
  SentenceFormData,
} from '../types/sentence.types';
import { getEmptySentenceFormData } from '../utils/getEmptySentenceFormData';

export const useSentenceDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<SentenceActionType>('view');
  const [formData, setFormData] = useState<SentenceFormData>(getEmptySentenceFormData());
  const [selectedSentence, setSelectedSentence] = useState<Sentence | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLanguage = () => formData.lang || 'EN';

  return {
    dialogOpen,
    setDialogOpen,
    actionType,
    setActionType,
    formData,
    setFormData,
    selectedSentence,
    setSelectedSentence,
    loading,
    setLoading,
    getCurrentLanguage,
  } as const;
};
