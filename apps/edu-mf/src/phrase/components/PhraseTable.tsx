import { Box, Chip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { Volume2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createStatusChip, DataTable } from '../../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from '../constants';
import { usePhraseActionMenu } from '../hooks/usePhraseActionMenu';
import '../i18n/translations';
import type { Phrase } from '../types/phrase.types';

const columnHelper = createColumnHelper<Phrase>();

interface PhraseTableProps {
  phrases: Phrase[];
  pagination: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onPhraseAction: (phrase: Phrase, action: 'view' | 'edit' | 'delete') => void;
}

const PhraseTable = memo(({
  phrases,
  pagination,
  onPageChange,
  onPageSizeChange,
  onPhraseAction,
}: PhraseTableProps) => {
  const { t } = useTranslation();

  const actionMenuItems = usePhraseActionMenu({
    onView: (phrase) => onPhraseAction(phrase, 'view'),
    onEdit: (phrase) => onPhraseAction(phrase, 'edit'),
    onDelete: (phrase) => onPhraseAction(phrase, 'delete'),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('phrase.fields.name'),
        cell: (info) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {info.getValue()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {info.row.original.translation || info.row.original.easyMeaning || '-'}
            </Typography>
          </Box>
        ),
        size: 220,
      }),
      columnHelper.accessor('phonetic', {
        header: t('phrase.fields.phonetic'),
        cell: (info) => {
          const phrase = info.row.original;
          const playAudio = () => {
            if (!phrase.phoneticAudioUrl) return;
            new Audio(phrase.phoneticAudioUrl).play().catch((error) => {
              console.error('Failed to play phrase audio', error);
            });
          };
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2">{info.getValue() || '-'}</Typography>
              {phrase.phoneticAudioUrl && (
                <Box component="button" onClick={playAudio} sx={{ border: 0, bgcolor: 'transparent', p: 0, display: 'flex', cursor: 'pointer' }}>
                  <Volume2 size={14} />
                </Box>
              )}
            </Box>
          );
        },
        size: 160,
      }),
      columnHelper.accessor('difficultyLevel', {
        header: t('phrase.fields.difficultyLevel'),
        cell: (info) => info.getValue() || '-',
        size: 120,
      }),
      columnHelper.accessor('tags', {
        header: t('phrase.fields.tags'),
        cell: (info) => {
          const tags = info.getValue();
          if (!tags) return '-';
          return (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {tags.split(',').filter(Boolean).slice(0, 3).map((tag) => (
                <Chip key={tag.trim()} label={tag.trim()} size="small" />
              ))}
            </Box>
          );
        },
        size: 180,
      }),
      columnHelper.accessor('channel', {
        header: t('phrase.fields.channel'),
        cell: (info) => info.getValue() || '-',
        size: 100,
      }),
      columnHelper.accessor('lang', {
        header: t('phrase.fields.language'),
        cell: (info) => info.getValue() || '-',
        size: 90,
      }),
      columnHelper.accessor('displayOrder', {
        header: t('phrase.fields.displayOrder'),
        cell: (info) => info.getValue() ?? 0,
        size: 90,
      }),
      columnHelper.accessor('isActive', {
        header: t('phrase.fields.status'),
        cell: (info) => createStatusChip(String(info.getValue()), STATUS_MAPS.active),
        size: 100,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('phrase.fields.updatedAt'),
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <Typography variant="body2">-</Typography>;
          const match = value.match(/\d{4}-\d{2}-\d{2}/);
          return <Typography variant="body2">{match ? match[0] : value}</Typography>;
        },
        size: 120,
      }),
    ],
    [t],
  );

  if (!phrases.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {t('phrase.noRecordsFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={phrases}
      columns={columns}
      manualPagination
      pageCount={pagination?.totalPages}
      totalRows={pagination?.totalElements}
      currentPage={pagination?.number ?? pagination?.page ?? 0}
      pageSize={pagination?.size ?? 20}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      actionMenuItems={actionMenuItems}
      showSearch={false}
      onRowDoubleClick={(row) => onPhraseAction(row, 'view')}
    />
  );
});

PhraseTable.displayName = 'PhraseTable';

export default PhraseTable;
