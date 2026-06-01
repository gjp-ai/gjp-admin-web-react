import { useMemo } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Vocabulary } from '../types/vocabulary.types';

interface UseVocabularyActionMenuParams {
  onView: (vocabulary: Vocabulary) => void;
  onEdit: (vocabulary: Vocabulary) => void;
  onDelete: (vocabulary: Vocabulary) => void;
}

export const useVocabularyActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseVocabularyActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        label: t('vocabulary.actions.view'),
        icon: <Eye size={16} />,
        action: onView,
        color: 'info' as const,
      },
      {
        label: t('vocabulary.actions.edit'),
        icon: <Edit size={16} />,
        action: onEdit,
        color: 'primary' as const,
      },
      {
        label: t('vocabulary.actions.delete'),
        icon: <Trash2 size={16} />,
        action: onDelete,
        color: 'error' as const,
      },
    ],
    [onDelete, onEdit, onView, t],
  );
};
