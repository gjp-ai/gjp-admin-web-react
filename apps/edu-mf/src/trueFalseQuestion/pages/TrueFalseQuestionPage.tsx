import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS, TRUE_FALSE_ANSWER_OPTIONS } from '../../question-common/constants';
import { createQuestionCrudPage } from '../../question-common/createQuestionCrudPage';
import type { EduQuestionFieldConfig } from '../../question-common/types';
import { trueFalseQuestionService } from '../services/trueFalseQuestionService';
import type { TrueFalseQuestion, TrueFalseQuestionFormData } from '../types/trueFalseQuestion.types';
import { getEmptyTrueFalseQuestionFormData } from '../utils/getEmptyTrueFalseQuestionFormData';

const fields: EduQuestionFieldConfig<TrueFalseQuestionFormData>[] = [
  { key: 'question', label: 'Question', required: true, type: 'richText', rows: 0, row: 1 },
  { key: 'answer', label: 'Answer', required: true, type: 'select', options: TRUE_FALSE_ANSWER_OPTIONS, row: 2 },
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
];

const TrueFalseQuestionPage = createQuestionCrudPage<TrueFalseQuestion, TrueFalseQuestionFormData>({
  entityName: 'True/False Question',
  entityNamePlural: 'True/False Questions',
  routeName: 'TrueFalseQuestion',
  service: trueFalseQuestionService,
  defaultFormData: getEmptyTrueFalseQuestionFormData(),
  fields,
  questionImageReferenceKey: 'trueFalseQuestionId',
});

export default TrueFalseQuestionPage;
