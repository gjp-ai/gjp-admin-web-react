import { Box, Chip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { createStatusChip, DataTable } from '../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from './constants';
import type { EduQuestionBase } from './types';

const columnHelper = createColumnHelper<EduQuestionBase>();

interface QuestionTableProps<T extends EduQuestionBase> {
  entityNamePlural: string;
  questions: T[];
  pagination: any;
  tableFields?: string[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onQuestionAction: (question: T, action: 'view' | 'edit' | 'delete') => void;
}

const QuestionTable = memo(<T extends EduQuestionBase>({
  entityNamePlural,
  questions,
  pagination,
  tableFields,
  onPageChange,
  onPageSizeChange,
  onQuestionAction,
}: QuestionTableProps<T>) => {
  const extraFields = tableFields || [];
  const actionMenuItems = useMemo(
    () => [
      { label: 'View', action: (row: EduQuestionBase) => onQuestionAction(row as T, 'view'), color: 'info' as const },
      { label: 'Edit', action: (row: EduQuestionBase) => onQuestionAction(row as T, 'edit'), color: 'primary' as const },
      { label: 'Delete', action: (row: EduQuestionBase) => onQuestionAction(row as T, 'delete'), color: 'error' as const },
    ],
    [onQuestionAction],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('question', {
        header: 'Question',
        cell: (info) => (
          <Box sx={{ maxWidth: 360 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {String(info.getValue() || '-')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              {String(info.row.original.answer || '-')}
            </Typography>
          </Box>
        ),
        size: 380,
      }),
      ...extraFields.map((field) =>
        columnHelper.accessor((row) => row[String(field)], {
          id: String(field),
          header: String(field).replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()),
          cell: (info) => String(info.getValue() ?? '-'),
          size: 120,
        }),
      ),
      columnHelper.accessor('difficultyLevel', {
        header: 'Difficulty',
        cell: (info) => info.getValue() || '-',
        size: 110,
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
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
        size: 170,
      }),
      columnHelper.accessor('channel', {
        header: 'Channel',
        cell: (info) => info.getValue() || '-',
        size: 90,
      }),
      columnHelper.accessor('lang', {
        header: 'Language',
        cell: (info) => info.getValue() || '-',
        size: 90,
      }),
      columnHelper.accessor('displayOrder', {
        header: 'Order',
        cell: (info) => info.getValue() ?? 0,
        size: 80,
      }),
      columnHelper.accessor('isActive', {
        header: 'Status',
        cell: (info) => createStatusChip(String(info.getValue()), STATUS_MAPS.active),
        size: 100,
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Updated At',
        cell: (info) => {
          const value = info.getValue();
          if (!value) return <Typography variant="body2">-</Typography>;
          const match = value.match(/\d{4}-\d{2}-\d{2}/);
          return <Typography variant="body2">{match ? match[0] : value}</Typography>;
        },
        size: 120,
      }),
    ],
    [extraFields],
  );

  if (!questions.length) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">No {entityNamePlural.toLowerCase()} found</Typography>
      </Box>
    );
  }

  return (
    <DataTable
      data={questions}
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
      onRowDoubleClick={(row: EduQuestionBase) => onQuestionAction(row as T, 'view')}
    />
  );
});

QuestionTable.displayName = 'QuestionTable';

export default QuestionTable;
