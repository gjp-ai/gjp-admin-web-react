import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS } from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { fillBlankQuestionService } from '../services/fillBlankQuestionService';
import type { FillBlankQuestion, FillBlankQuestionFormData } from '../types/fillBlankQuestion.types';
import { getEmptyFillBlankQuestionFormData } from '../utils/getEmptyFillBlankQuestionFormData';

const fields: EduQuestionFieldConfig<FillBlankQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', grid: 'full', rows: 1 },
  { key: 'answer', label: 'Answer', required: true, multiline: true, rows: 2, grid: 'full' },
  { key: 'explanation', label: 'Explanation', type: 'richText', grid: 'full', rows: 1 },
  { key: 'channel', label: 'Channel', type: 'select' },
  { key: 'lang', label: 'Language', type: 'select', options: LANGUAGE_OPTIONS },
  { key: 'difficultyLevel', label: 'Difficulty', type: 'select', options: DIFFICULTY_LEVEL_OPTIONS },
  { key: 'gradeLevel', label: 'Grade', type: 'select' },
  { key: 'subject', label: 'Subject', type: 'select' },
  { key: 'topic', label: 'Topic', type: 'select' },
  { key: 'term', label: 'Term', type: 'number', grid: 'third' },
  { key: 'week', label: 'Week', type: 'number', grid: 'third' },
  { key: 'displayOrder', label: 'Order', type: 'number', grid: 'third' },
  { key: 'tags', label: 'Tags', grid: 'full' },
];

const FillBlankQuestionPage = createQuestionCrudPage<FillBlankQuestion, FillBlankQuestionFormData>({
  entityName: 'Fill Blank Question',
  entityNamePlural: 'Fill Blank Questions',
  routeName: 'FillBlankQuestion',
  service: fillBlankQuestionService,
  defaultFormData: getEmptyFillBlankQuestionFormData(),
  fields,
});

export default FillBlankQuestionPage;
