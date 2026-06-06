import { Box, Chip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { Volume2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createStatusChip, DataTable } from '../../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from '../constants';
import { useVocabularyActionMenu } from '../hooks/useVocabularyActionMenu';
import '../i18n/translations';
import type { Vocabulary } from '../types/vocabulary.types';

const columnHelper = createColumnHelper<Vocabulary>();

interface VocabularyTableProps {
  vocabularies: Vocabulary[];
  pagination: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onVocabularyAction: (vocabulary: Vocabulary, action: 'view' | 'edit' | 'delete') => void;
}

const VocabularyTable = memo(({
  vocabularies,
  pagination,
  onPageChange,
  onPageSizeChange,
  onVocabularyAction,
}: VocabularyTableProps) => {
  const { t } = useTranslation();

  const actionMenuItems = useVocabularyActionMenu({
    onView: (vocabulary) => onVocabularyAction(vocabulary, 'view'),
    onEdit: (vocabulary) => onVocabularyAction(vocabulary, 'edit'),
    onDelete: (vocabulary) => onVocabularyAction(vocabulary, 'delete'),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('vocabulary.fields.name'),
        cell: (info) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {info.getValue()}
            </Typography>
          </Box>
        ),
        size: 220,
      }),
      columnHelper.display({
        id: 'phonetics',
        header: 'Phonetics',
        cell: (info) => {
          const vocabulary = info.row.original;
          const renderPhonetic = (label: string, value?: string | null, audioUrl?: string | null) => {
            const playAudio = () => {
              if (!audioUrl) return;
              new Audio(audioUrl).play().catch((error) => {
                console.error('Failed to play vocabulary audio', error);
              });
            };
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 20 }}>
                <Typography variant="caption" color="text.secondary" sx={{ width: 20 }}>
                  {label}
                </Typography>
                <Typography variant="body2">{value || '-'}</Typography>
                {audioUrl && (
                  <Box component="button" onClick={playAudio} sx={{ border: 0, bgcolor: 'transparent', p: 0, display: 'flex', cursor: 'pointer' }}>
                    <Volume2 size={14} />
                  </Box>
                )}
              </Box>
            );
          };
          return (
            <Box>
              {renderPhonetic('US', vocabulary.phoneticUs, vocabulary.phoneticUsAudioUrl)}
              {renderPhonetic('UK', vocabulary.phoneticUk, vocabulary.phoneticUkAudioUrl)}
            </Box>
          );
        },
        size: 170,
      }),
      columnHelper.display({
        id: 'channelLanguage',
        header: 'Source',
        cell: (info) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {info.row.original.channel || '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {info.row.original.lang || '-'}
            </Typography>
          </Box>
        ),
        size: 140,
      }),
      columnHelper.accessor('partOfSpeech', {
        header: 'POS',
        cell: (info) => info.getValue() || '-',
        size: 120,
      }),
      columnHelper.accessor('tags', {
        header: t('vocabulary.fields.tags'),
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
      columnHelper.accessor('displayOrder', {
        header: t('vocabulary.fields.displayOrder'),
        cell: (info) => info.getValue() ?? 0,
        size: 90,
      }),
      columnHelper.accessor('isActive', {
        header: t('vocabulary.fields.status'),
        cell: (info) => createStatusChip(String(info.getValue()), STATUS_MAPS.active),
        size: 100,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('vocabulary.fields.updatedAt'),
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

  if (!vocabularies.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {t('vocabulary.noRecordsFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={vocabularies}
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
      onRowDoubleClick={(row) => onVocabularyAction(row, 'view')}
    />
  );
});

VocabularyTable.displayName = 'VocabularyTable';

export default VocabularyTable;
