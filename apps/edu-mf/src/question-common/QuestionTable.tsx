import { Box, CardMedia, Chip, Typography } from '@mui/material';
import { createColumnHelper } from '@tanstack/react-table';
import { memo, useEffect, useMemo, useState } from 'react';
import { apiClient } from '../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../shared-lib/src/api/api.types';
import { createStatusChip, DataTable } from '../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from './constants';
import type { EduQuestionBase, QuestionImage } from './types';

const columnHelper = createColumnHelper<EduQuestionBase>();

const columnLabels: Record<string, string> = {
  curriculum: 'Curriculum',
  gradeLevel: 'Grade',
  difficultyLevel: 'Difficulty',
  isActive: 'Status',
  lang: 'Language',
  schedule: 'Schedule',
  updatedAt: 'Updated',
  term: 'Term',
  week: 'Week',
};

const getColumnLabel = (field: string) => columnLabels[field]
  || field.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());

const stripHtmlTags = (value: unknown) => String(value || '')
  .replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .trim();

const renderColumnCell = (field: string, value: unknown) => {
  if (field === 'isActive') {
    return createStatusChip(String(value), STATUS_MAPS.active);
  }
  if (field === 'updatedAt') {
    if (!value) return <Typography variant="body2">-</Typography>;
    const stringValue = String(value);
    const match = stringValue.match(/\d{4}-\d{2}-\d{2}/);
    return <Typography variant="body2">{match ? match[0] : stringValue}</Typography>;
  }
  return String(value ?? '-');
};

const renderCurriculumCell = (question: EduQuestionBase) => {
  const grade = String(question.gradeLevel || '').trim();
  const subject = String(question.subject || '').trim();
  const topic = String(question.topic || '').trim();
  if (!grade && !subject && !topic) return '-';

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.35 }}>
        {[grade, subject].filter(Boolean).join(' / ') || '-'}
      </Typography>
      {topic && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
          {topic.replace(/_/g, ' ')}
        </Typography>
      )}
    </Box>
  );
};

const renderScheduleCell = (question: EduQuestionBase) => {
  const term = question.term ?? null;
  const week = question.week ?? null;
  if (term === null && week === null) return '-';

  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {term !== null && <Chip label={`T${term}`} size="small" variant="outlined" />}
      {week !== null && <Chip label={`W${week}`} size="small" variant="outlined" />}
    </Box>
  );
};

const renderConfiguredColumnCell = (field: string, question: EduQuestionBase, value: unknown) => {
  if (field === 'curriculum') return renderCurriculumCell(question);
  if (field === 'schedule') return renderScheduleCell(question);
  return renderColumnCell(field, value);
};

type QuestionImageReferenceKey =
  | 'multipleChoiceQuestionId'
  | 'fillBlankQuestionId'
  | 'freeTextQuestionId'
  | 'trueFalseQuestionId';

interface QuestionTableProps<T extends EduQuestionBase> {
  entityNamePlural: string;
  questions: T[];
  pagination: any;
  tableFields?: string[];
  tableColumns?: string[];
  questionImageReferenceKey?: QuestionImageReferenceKey;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onQuestionAction: (question: T, action: 'view' | 'edit' | 'delete') => void;
}

const QuestionTable = memo(<T extends EduQuestionBase>({
  entityNamePlural,
  questions,
  pagination,
  tableFields,
  tableColumns,
  questionImageReferenceKey,
  onPageChange,
  onPageSizeChange,
  onQuestionAction,
}: QuestionTableProps<T>) => {
  const extraFields = tableFields || [];
  const [firstImagesByQuestionId, setFirstImagesByQuestionId] = useState<Record<string, QuestionImage>>({});

  useEffect(() => {
    if (!questionImageReferenceKey || !questions.length) {
      setFirstImagesByQuestionId({});
      return;
    }

    let active = true;
    Promise.all(
      questions.map(async (question) => {
        try {
          const response = await apiClient.get('/v1/edu-question-images', {
            params: { [questionImageReferenceKey]: question.id, isActive: true },
          }) as ApiResponse<QuestionImage[]>;
          return [question.id, response.data?.[0]] as const;
        } catch {
          return [question.id, undefined] as const;
        }
      }),
    ).then((entries) => {
      if (!active) return;
      setFirstImagesByQuestionId(Object.fromEntries(entries.filter((entry): entry is [string, QuestionImage] => Boolean(entry[1]))));
    });

    return () => {
      active = false;
    };
  }, [questionImageReferenceKey, questions]);

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
        cell: (info) => {
          const firstImage = firstImagesByQuestionId[info.row.original.id];
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, maxWidth: 360 }}>
              {firstImage && (
                <CardMedia
                  component="img"
                  image={firstImage.fileUrl || firstImage.originalUrl || ''}
                  alt={firstImage.filename}
                  sx={{ width: 56, height: 42, borderRadius: 1, objectFit: 'cover', flex: '0 0 auto', border: '1px solid', borderColor: 'divider' }}
                />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {stripHtmlTags(info.getValue()) || '-'}
                </Typography>
              </Box>
            </Box>
          );
        },
        size: 380,
      }),
      ...(tableColumns || extraFields).map((field) =>
        columnHelper.accessor((row) => row[String(field)], {
          id: String(field),
          header: getColumnLabel(String(field)),
          cell: (info) => renderConfiguredColumnCell(String(field), info.row.original, info.getValue()),
          size: field === 'curriculum' ? 240 : field === 'schedule' ? 120 : 120,
        }),
      ),
      ...(tableColumns ? [] : [
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
          header: 'Updated',
          cell: (info) => {
            const value = info.getValue();
            if (!value) return <Typography variant="body2">-</Typography>;
            const match = value.match(/\d{4}-\d{2}-\d{2}/);
            return <Typography variant="body2">{match ? match[0] : value}</Typography>;
          },
          size: 120,
        }),
      ]),
    ],
    [extraFields, firstImagesByQuestionId, tableColumns],
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
