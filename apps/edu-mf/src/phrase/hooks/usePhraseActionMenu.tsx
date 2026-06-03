import { useMemo } from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Phrase } from '../types/phrase.types';

interface UsePhraseActionMenuParams {
  onView: (phrase: Phrase) => void;
  onEdit: (phrase: Phrase) => void;
  onDelete: (phrase: Phrase) => void;
}

export const usePhraseActionMenu = ({
  onView,
  onEdit,
  onDelete,
}: UsePhraseActionMenuParams) => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        label: t('phrase.actions.view'),
        icon: <Eye size={16} />,
        action: onView,
        color: 'info' as const,
      },
      {
        label: t('phrase.actions.edit'),
        icon: <Edit size={16} />,
        action: onEdit,
        color: 'primary' as const,
      },
      {
        label: t('phrase.actions.delete'),
        icon: <Trash2 size={16} />,
        action: onDelete,
        color: 'error' as const,
      },
    ],
    [onDelete, onEdit, onView, t],
  );
};
