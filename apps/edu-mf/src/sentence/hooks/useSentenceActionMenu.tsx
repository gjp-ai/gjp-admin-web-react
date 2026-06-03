import { useMemo } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Sentence } from '../types/sentence.types';

interface UseSentenceActionMenuParams {
  onView: (sentence: Sentence) => void;
  onEdit: (sentence: Sentence) => void;
  onDelete: (sentence: Sentence) => void;
}

export const useSentenceActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UseSentenceActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        label: t('sentence.actions.view'),
        icon: <Eye size={16} />,
        action: onView,
        color: 'info' as const,
      },
      {
        label: t('sentence.actions.edit'),
        icon: <Edit size={16} />,
        action: onEdit,
        color: 'primary' as const,
      },
      {
        label: t('sentence.actions.delete'),
        icon: <Trash2 size={16} />,
        action: onDelete,
        color: 'error' as const,
      },
    ],
    [onDelete, onEdit, onView, t],
  );
};
