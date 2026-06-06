import {
  DIFFICULTY_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  MULTIPLE_CHOICE_ANSWER_OPTIONS,
  TERM_OPTIONS,
  WEEK_OPTIONS,
} from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { multipleChoiceQuestionService } from '../services/multipleChoiceQuestionService';
import type { MultipleChoiceQuestion, MultipleChoiceQuestionFormData } from '../types/multipleChoiceQuestion.types';
import { getEmptyMultipleChoiceQuestionFormData } from '../utils/getEmptyMultipleChoiceQuestionFormData';

const fields: EduQuestionFieldConfig<MultipleChoiceQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', rows: 0, row: 1 },
  { key: 'optionA', label: 'Option A', type: 'richText', rows: 0, row: 2 },
  { key: 'optionB', label: 'Option B', type: 'richText', rows: 0, row: 3 },
  { key: 'optionC', label: 'Option C', type: 'richText', rows: 0, row: 4 },
  { key: 'optionD', label: 'Option D', type: 'richText', rows: 0, row: 5 },
  { key: 'answer', label: 'Answer', required: true, type: 'select', options: MULTIPLE_CHOICE_ANSWER_OPTIONS, multiple: true, row: 6 },
  { key: 'explanation', label: 'Explanation', type: 'richText', rows: 0, row: 7 },

  { key: 'channel', label: 'Channel', type: 'select', row: 8 },
  { key: 'lang', label: 'Language', type: 'select', options: LANGUAGE_OPTIONS, row: 8 },
  { key: 'difficultyLevel', label: 'Difficulty', type: 'select', options: DIFFICULTY_LEVEL_OPTIONS, appSettingName: 'difficulty_level', row: 8 },
  
  { key: 'gradeLevel', label: 'Grade', type: 'select', row: 9 },
  { key: 'subject', label: 'Subject', type: 'select', row: 9 },
  { key: 'topic', label: 'Topic', type: 'select', row: 9 },
  
  { key: 'tags', label: 'Tags', appSettingName: 'edu_question_tags', row: 10 },
  { key: 'term', label: 'Term', type: 'select', options: TERM_OPTIONS, row: 10 },
  { key: 'week', label: 'Week', type: 'select', options: WEEK_OPTIONS, row: 10 },
  
  { key: 'displayOrder', label: 'Order', type: 'number', row: 11 },
];

const MultipleChoiceQuestionPage = createQuestionCrudPage<MultipleChoiceQuestion, MultipleChoiceQuestionFormData>({
  entityName: 'Multiple Choice Question',
  entityNamePlural: 'Multiple Choice Questions',
  routeName: 'MultipleChoiceQuestion',
  service: multipleChoiceQuestionService,
  defaultFormData: getEmptyMultipleChoiceQuestionFormData(),
  fields,
  tableColumns: ['curriculum', 'difficultyLevel', 'schedule', 'lang', 'isActive', 'updatedAt'],
  searchFields: ['question', 'gradeLevel', 'subject', 'topic', 'term', 'week', 'channel', 'lang', 'difficultyLevel', 'tags', 'isActive'],
  showQuestionImageInTable: true,
  questionImageReferenceKey: 'multipleChoiceQuestionId',
});

export default MultipleChoiceQuestionPage;
