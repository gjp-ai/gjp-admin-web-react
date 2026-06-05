import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS, TRUE_FALSE_ANSWER_OPTIONS } from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { trueFalseQuestionService } from '../services/trueFalseQuestionService';
import type { TrueFalseQuestion, TrueFalseQuestionFormData } from '../types/trueFalseQuestion.types';
import { getEmptyTrueFalseQuestionFormData } from '../utils/getEmptyTrueFalseQuestionFormData';

const fields: EduQuestionFieldConfig<TrueFalseQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', grid: 'full', rows: 1 },
  { key: 'answer', label: 'Answer', required: true, type: 'select', options: TRUE_FALSE_ANSWER_OPTIONS },
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

const TrueFalseQuestionPage = createQuestionCrudPage<TrueFalseQuestion, TrueFalseQuestionFormData>({
  entityName: 'True/False Question',
  entityNamePlural: 'True/False Questions',
  routeName: 'TrueFalseQuestion',
  service: trueFalseQuestionService,
  defaultFormData: getEmptyTrueFalseQuestionFormData(),
  fields,
});

export default TrueFalseQuestionPage;
