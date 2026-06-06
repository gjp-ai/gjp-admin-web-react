import { Box, Button, Collapse, Typography } from '@mui/material';
import { Plus, Search } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginatedResponse } from '../../../shared-lib/src/api/api.types';
import DeleteQuestionDialog from './DeleteQuestionDialog';
import QuestionDialog from './QuestionDialog';
import QuestionSearchPanel from './QuestionSearchPanel';
import QuestionTable from './QuestionTable';
import QuestionViewDialog from './QuestionViewDialog';
import type {
  EduQuestionActionType,
  EduQuestionBase,
  EduQuestionCrudConfig,
  EduQuestionFormData,
  EduQuestionQueryParams,
  EduQuestionSearchFormData,
} from './types';

const emptySearchFormData: EduQuestionSearchFormData = {
  question: '',
  lang: '',
  tags: '',
  channel: '',
  difficultyLevel: '',
  gradeLevel: '',
  subject: '',
  topic: '',
  term: '',
  week: '',
  isActive: null,
};

const buildSearchParams = (formData: EduQuestionSearchFormData): EduQuestionQueryParams => {
  const params: EduQuestionQueryParams = {};
  if (formData.question?.trim()) params.question = formData.question.trim();
  if (formData.lang?.trim()) params.lang = formData.lang.trim();
  if (formData.tags?.trim()) params.tags = formData.tags.trim();
  if (formData.channel?.trim()) params.channel = formData.channel.trim();
  if (formData.difficultyLevel?.trim()) params.difficultyLevel = formData.difficultyLevel.trim();
  if (formData.gradeLevel?.trim()) params.gradeLevel = formData.gradeLevel.trim();
  if (formData.subject?.trim()) params.subject = formData.subject.trim();
  if (formData.topic?.trim()) params.topic = formData.topic.trim();
  if (formData.term?.trim()) params.term = Number(formData.term);
  if (formData.week?.trim()) params.week = Number(formData.week);
  if (formData.isActive === 'true') params.isActive = true;
  if (formData.isActive === 'false') params.isActive = false;
  return params;
};

const applyClientSideFilters = <T extends EduQuestionBase>(
  questions: T[],
  formData: EduQuestionSearchFormData,
) => questions.filter((question) => {
  if (formData.question && !question.question?.toLowerCase().includes(formData.question.toLowerCase())) return false;
  if (formData.lang && question.lang !== formData.lang) return false;
  if (formData.tags && !question.tags?.toLowerCase().includes(formData.tags.toLowerCase())) return false;
  if (formData.channel && !question.channel?.toLowerCase().includes(formData.channel.toLowerCase())) return false;
  if (formData.difficultyLevel && question.difficultyLevel !== formData.difficultyLevel) return false;
  if (formData.gradeLevel && question.gradeLevel !== formData.gradeLevel) return false;
  if (formData.subject && question.subject !== formData.subject) return false;
  if (formData.topic && question.topic !== formData.topic) return false;
  if (formData.isActive === 'true' && !question.isActive) return false;
  if (formData.isActive === 'false' && question.isActive) return false;
  return true;
});

const questionToFormData = <T extends EduQuestionBase, F extends EduQuestionFormData>(
  question: T,
  defaultFormData: F,
): F => ({
  ...defaultFormData,
  ...Object.fromEntries(
    Object.keys(defaultFormData).map((key) => [
      key,
      question[key] ?? defaultFormData[key],
    ]),
  ),
  term: question.term ?? undefined,
  week: question.week ?? undefined,
  displayOrder: question.displayOrder ?? defaultFormData.displayOrder,
  isActive: question.isActive ?? defaultFormData.isActive,
} as F);

export const createQuestionCrudPage = <T extends EduQuestionBase, F extends EduQuestionFormData>(
  config: EduQuestionCrudConfig<T, F>,
) => {
  const QuestionCrudPage: React.FC = () => {
    const [allQuestions, setAllQuestions] = useState<T[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<T[]>([]);
    const [pagination, setPagination] = useState<PaginatedResponse<T> | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(config.defaultPageSize || 20);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchPanelOpen, setSearchPanelOpen] = useState(false);
    const [searchFormData, setSearchFormData] = useState<EduQuestionSearchFormData>(emptySearchFormData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<EduQuestionActionType>('view');
    const [formData, setFormData] = useState<F>(config.defaultFormData);
    const [selectedQuestion, setSelectedQuestion] = useState<T | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
    const [deleting, setDeleting] = useState(false);
    const hasInitiallyLoaded = useRef(false);

    const loadQuestions = useCallback(async (params?: EduQuestionQueryParams, page?: number, size?: number) => {
      const actualPage = page ?? currentPage;
      const actualSize = size ?? pageSize;

      setLoading(true);
      try {
        const response = await config.service.getQuestions({
          page: actualPage,
          size: actualSize,
          sort: config.sortField || 'updatedAt',
          direction: 'desc',
          ...params,
        });
        const responseData = response.data as any;
        let questions: T[] = [];

        if (Array.isArray(responseData)) {
          questions = responseData;
        } else if (responseData && 'content' in responseData) {
          questions = responseData.content;
          setPagination(responseData);
        }

        setAllQuestions(questions);
        setFilteredQuestions(questions);
      } finally {
        setLoading(false);
      }
    }, [config.service, config.sortField, currentPage, pageSize]);

    useEffect(() => {
      if (!hasInitiallyLoaded.current) {
        hasInitiallyLoaded.current = true;
        loadQuestions();
      }
    }, [loadQuestions]);

    const handleSearchFormChange = (field: keyof EduQuestionSearchFormData, value: string | null) => {
      const nextFormData = { ...searchFormData, [field]: value };
      setSearchFormData(nextFormData);
      setFilteredQuestions(applyClientSideFilters(allQuestions, nextFormData));
    };

    const handleClearFilters = () => {
      setSearchFormData(emptySearchFormData);
      setFilteredQuestions(allQuestions);
    };

    const handleApiSearch = async () => {
      await loadQuestions(buildSearchParams(searchFormData), 0, pageSize);
    };

    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
      loadQuestions(buildSearchParams(searchFormData), newPage, pageSize);
    };

    const handlePageSizeChange = (newPageSize: number) => {
      setPageSize(newPageSize);
      setCurrentPage(0);
      loadQuestions(buildSearchParams(searchFormData), 0, newPageSize);
    };

    const handleCreate = () => {
      setFormData(config.defaultFormData);
      setSelectedQuestion(null);
      setActionType('create');
      setDialogOpen(true);
    };

    const handleSubmit = async () => {
      try {
        setSaving(true);
        if (actionType === 'create') {
          await config.service.createQuestion(formData);
        } else if (actionType === 'edit' && selectedQuestion) {
          await config.service.updateQuestion(selectedQuestion.id, formData);
        }
        await loadQuestions(buildSearchParams(searchFormData));
        setDialogOpen(false);
      } finally {
        setSaving(false);
      }
    };

    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{config.entityNamePlural}</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage education {config.entityNamePlural.toLowerCase()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Search size={16} />} onClick={() => setSearchPanelOpen((open) => !open)}>
              {searchPanelOpen ? 'Hide Search' : 'Show Search'}
            </Button>
            <Button variant="contained" startIcon={<Plus size={16} />} onClick={handleCreate}>
              Create {config.entityName}
            </Button>
          </Box>
        </Box>

        <Collapse in={searchPanelOpen}>
          <QuestionSearchPanel
            searchFormData={searchFormData}
            loading={loading}
            onFormChange={handleSearchFormChange}
            onSearch={handleApiSearch}
            onClear={handleClearFilters}
          />
        </Collapse>

        <QuestionTable
          entityNamePlural={config.entityNamePlural}
          questions={filteredQuestions}
          pagination={pagination}
          tableFields={config.tableFields}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onQuestionAction={(question, action) => {
            const typedQuestion = question as T;
            if (action === 'delete') {
              setDeleteTarget(typedQuestion);
              return;
            }
            setSelectedQuestion(typedQuestion);
            setActionType(action);
            if (action === 'edit') {
              setFormData(questionToFormData(typedQuestion, config.defaultFormData));
            }
            setDialogOpen(true);
          }}
        />

        {(actionType === 'create' || actionType === 'edit') && (
          <QuestionDialog
            open={dialogOpen}
            title={actionType === 'create' ? `Create ${config.entityName}` : `Edit ${config.entityName}`}
            formData={formData}
            fields={config.fields}
            questionId={actionType === 'edit' ? selectedQuestion?.id : undefined}
            questionImageReferenceKey={config.questionImageReferenceKey}
            loading={saving}
            submitLabel={actionType === 'create' ? 'Create' : 'Save'}
            onClose={() => setDialogOpen(false)}
            onFormChange={(field, value) => setFormData((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleSubmit}
          />
        )}

        {actionType === 'view' && selectedQuestion && (
          <QuestionViewDialog
            open={dialogOpen}
            entityName={config.entityName}
            question={selectedQuestion}
            fields={config.fields}
            onClose={() => setDialogOpen(false)}
          />
        )}

        <DeleteQuestionDialog
          open={!!deleteTarget}
          entityName={config.entityName}
          question={deleteTarget}
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if (!deleteTarget) return;
            try {
              setDeleting(true);
              await config.service.deleteQuestion(deleteTarget.id);
              await loadQuestions(buildSearchParams(searchFormData));
            } finally {
              setDeleting(false);
              setDeleteTarget(null);
            }
          }}
        />
      </Box>
    );
  };

  QuestionCrudPage.displayName = `${config.routeName}Page`;

  return QuestionCrudPage;
};
