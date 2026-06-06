import { Box, Chip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { Volume2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createStatusChip, DataTable } from '../../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from '../constants';
import { useSentenceActionMenu } from '../hooks/useSentenceActionMenu';
import '../i18n/translations';
import type { Sentence } from '../types/sentence.types';

const columnHelper = createColumnHelper<Sentence>();

interface SentenceTableProps {
  sentences: Sentence[];
  pagination: any;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSentenceAction: (sentence: Sentence, action: 'view' | 'edit' | 'delete') => void;
}

const SentenceTable = memo(({
  sentences,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSentenceAction,
}: SentenceTableProps) => {
  const { t } = useTranslation();

  const actionMenuItems = useSentenceActionMenu({
    onView: (sentence) => onSentenceAction(sentence, 'view'),
    onEdit: (sentence) => onSentenceAction(sentence, 'edit'),
    onDelete: (sentence) => onSentenceAction(sentence, 'delete'),
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: t('sentence.fields.name'),
        cell: (info) => (
          <Box sx={{ maxWidth: 300 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {info.getValue()}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              {info.row.original.translation || '-'}
            </Typography>
          </Box>
        ),
        size: 320,
      }),
      columnHelper.accessor('phonetic', {
        header: t('sentence.fields.phonetic'),
        cell: (info) => {
          const sentence = info.row.original;
          const playAudio = () => {
            if (!sentence.phoneticAudioUrl) return;
            new Audio(sentence.phoneticAudioUrl).play().catch((error) => {
              console.error('Failed to play sentence audio', error);
            });
          };
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                {info.getValue() || '-'}
              </Typography>
              {sentence.phoneticAudioUrl && (
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
        header: t('sentence.fields.difficultyLevel'),
        cell: (info) => info.getValue() || '-',
        size: 120,
      }),
      columnHelper.accessor('tags', {
        header: t('sentence.fields.tags'),
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
      columnHelper.accessor('displayOrder', {
        header: t('sentence.fields.displayOrder'),
        cell: (info) => info.getValue() ?? 0,
        size: 90,
      }),
      columnHelper.accessor('isActive', {
        header: t('sentence.fields.status'),
        cell: (info) => createStatusChip(String(info.getValue()), STATUS_MAPS.active),
        size: 100,
      }),
      columnHelper.accessor('updatedAt', {
        header: t('sentence.fields.updatedAt'),
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

  if (!sentences.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {t('sentence.noRecordsFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={sentences}
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
      onRowDoubleClick={(row) => onSentenceAction(row, 'view')}
    />
  );
});

SentenceTable.displayName = 'SentenceTable';

export default SentenceTable;
