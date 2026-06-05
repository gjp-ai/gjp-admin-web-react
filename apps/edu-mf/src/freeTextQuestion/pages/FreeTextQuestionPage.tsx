import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS } from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { freeTextQuestionService } from '../services/freeTextQuestionService';
import type { FreeTextQuestion, FreeTextQuestionFormData } from '../types/freeTextQuestion.types';
import { getEmptyFreeTextQuestionFormData } from '../utils/getEmptyFreeTextQuestionFormData';

const fields: EduQuestionFieldConfig<FreeTextQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', grid: 'full', rows: 1 },
  { key: 'answer', label: 'Answer', type: 'richText', grid: 'full', rows: 1 },
  { key: 'description', label: 'Description', type: 'richText', grid: 'full', rows: 1 },
  { key: 'questionA', label: 'Question A', multiline: true, rows: 2 },
  { key: 'answerA', label: 'Answer A', multiline: true, rows: 2 },
  { key: 'questionB', label: 'Question B', multiline: true, rows: 2 },
  { key: 'answerB', label: 'Answer B', multiline: true, rows: 2 },
  { key: 'questionC', label: 'Question C', multiline: true, rows: 2 },
  { key: 'answerC', label: 'Answer C', multiline: true, rows: 2 },
  { key: 'questionD', label: 'Question D', multiline: true, rows: 2 },
  { key: 'answerD', label: 'Answer D', multiline: true, rows: 2 },
  { key: 'questionE', label: 'Question E', multiline: true, rows: 2 },
  { key: 'answerE', label: 'Answer E', multiline: true, rows: 2 },
  { key: 'questionF', label: 'Question F', multiline: true, rows: 2 },
  { key: 'answerF', label: 'Answer F', multiline: true, rows: 2 },
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

const FreeTextQuestionPage = createQuestionCrudPage<FreeTextQuestion, FreeTextQuestionFormData>({
  entityName: 'Free Text Question',
  entityNamePlural: 'Free Text Questions',
  routeName: 'FreeTextQuestion',
  service: freeTextQuestionService,
  defaultFormData: getEmptyFreeTextQuestionFormData(),
  fields,
  tableFields: ['description'],
});

export default FreeTextQuestionPage;
