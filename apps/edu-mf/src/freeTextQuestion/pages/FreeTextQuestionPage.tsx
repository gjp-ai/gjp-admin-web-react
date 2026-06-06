import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS } from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { freeTextQuestionService } from '../services/freeTextQuestionService';
import type { FreeTextQuestion, FreeTextQuestionFormData } from '../types/freeTextQuestion.types';
import { getEmptyFreeTextQuestionFormData } from '../utils/getEmptyFreeTextQuestionFormData';

const fields: EduQuestionFieldConfig<FreeTextQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', rows: 0, row: 1 },
  { key: 'answer', label: 'Answer', type: 'richText', rows: 0, row: 2 },
  { key: 'explanation', label: 'Explanation', type: 'richText', rows: 0, row: 3 },
  { key: 'difficultyLevel', label: 'Difficulty', type: 'select', options: DIFFICULTY_LEVEL_OPTIONS, row: 4 },
  
  { key: 'gradeLevel', label: 'Grade', type: 'select', row: 5 },
  { key: 'subject', label: 'Subject', type: 'select', row: 5 },
  { key: 'topic', label: 'Topic', type: 'select', row: 5 },
  { key: 'channel', label: 'Channel', type: 'select', row: 6 },
  { key: 'tags', label: 'Tags', appSettingName: 'edu_mcq_tags', row: 6 },
  { key: 'lang', label: 'Language', type: 'select', options: LANGUAGE_OPTIONS, row: 6 },
  { key: 'term', label: 'Term', type: 'number', row: 7 },
  { key: 'week', label: 'Week', type: 'number', row: 7 },
  { key: 'displayOrder', label: 'Order', type: 'number', row: 7 },

  { key: 'description', label: 'Description', type: 'richText', rows: 0, row: 8 },
  { key: 'questionA', label: 'Question A', type: 'richText', rows: 0, row: 9 },
  { key: 'answerA', label: 'Answer A', type: 'richText', rows: 0, row: 10 },
  { key: 'questionB', label: 'Question B', type: 'richText', rows: 0, row: 11 },
  { key: 'answerB', label: 'Answer B', type: 'richText', rows: 0, row: 12 },
  { key: 'questionC', label: 'Question C', type: 'richText', rows: 0, row: 13 },
  { key: 'answerC', label: 'Answer C', type: 'richText', rows: 0, row: 14 },
  { key: 'questionD', label: 'Question D', type: 'richText', rows: 0, row: 15 },
  { key: 'answerD', label: 'Answer D', type: 'richText', rows: 0, row: 16 },
  { key: 'questionE', label: 'Question E', type: 'richText', rows: 0, row: 17 },
  { key: 'answerE', label: 'Answer E', type: 'richText', rows: 0, row: 18 },
  { key: 'questionF', label: 'Question F', type: 'richText', rows: 0, row: 19 },
  { key: 'answerF', label: 'Answer F', type: 'richText', rows: 0, row: 20 },
];

const FreeTextQuestionPage = createQuestionCrudPage<FreeTextQuestion, FreeTextQuestionFormData>({
  entityName: 'Free Text Question',
  entityNamePlural: 'Free Text Questions',
  routeName: 'FreeTextQuestion',
  service: freeTextQuestionService,
  defaultFormData: getEmptyFreeTextQuestionFormData(),
  fields,
  tableFields: ['description'],
  questionImageReferenceKey: 'freeTextQuestionId',
});

export default FreeTextQuestionPage;
