import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS, TERM_OPTIONS, WEEK_OPTIONS } from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { fillBlankQuestionService } from '../services/fillBlankQuestionService';
import type { FillBlankQuestion, FillBlankQuestionFormData } from '../types/fillBlankQuestion.types';
import { getEmptyFillBlankQuestionFormData } from '../utils/getEmptyFillBlankQuestionFormData';

const fields: EduQuestionFieldConfig<FillBlankQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', rows: 0, row: 1 },
  { key: 'answer', label: 'Answer', required: true, type: 'richText', rows: 0, row: 2 },
  { key: 'explanation', label: 'Explanation', type: 'richText', rows: 0, row: 3 },
  { key: 'channel', label: 'Channel', type: 'select', row: 4 },
  { key: 'lang', label: 'Language', type: 'select', options: LANGUAGE_OPTIONS, row: 4 },
  { key: 'difficultyLevel', label: 'Difficulty', type: 'select', options: DIFFICULTY_LEVEL_OPTIONS, appSettingName: 'difficulty_level', row: 4 },
  { key: 'gradeLevel', label: 'Grade', type: 'select', row: 5 },
  { key: 'subject', label: 'Subject', type: 'select', row: 5 },
  { key: 'topic', label: 'Topic', type: 'select', row: 5 },
  { key: 'tags', label: 'Tags', appSettingName: 'edu_question_tags', row: 6 },
  { key: 'term', label: 'Term', type: 'select', options: TERM_OPTIONS, row: 6 },
  { key: 'week', label: 'Week', type: 'select', options: WEEK_OPTIONS, row: 6 },
  { key: 'displayOrder', label: 'Order', type: 'number', row: 7 },
];

const FillBlankQuestionPage = createQuestionCrudPage<FillBlankQuestion, FillBlankQuestionFormData>({
  entityName: 'Fill Blank Question',
  entityNamePlural: 'Fill Blank Questions',
  routeName: 'FillBlankQuestion',
  service: fillBlankQuestionService,
  defaultFormData: getEmptyFillBlankQuestionFormData(),
  fields,
  tableColumns: ['curriculum', 'difficultyLevel', 'schedule', 'lang', 'isActive', 'updatedAt'],
  searchFields: ['question', 'gradeLevel', 'subject', 'topic', 'term', 'week', 'channel', 'lang', 'difficultyLevel', 'tags', 'isActive'],
  showQuestionImageInTable: true,
  questionImageReferenceKey: 'fillBlankQuestionId',
});

export default FillBlankQuestionPage;
