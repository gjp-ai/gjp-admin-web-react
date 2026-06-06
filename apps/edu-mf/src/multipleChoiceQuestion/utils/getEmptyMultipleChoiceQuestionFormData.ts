import type { MultipleChoiceQuestionFormData } from '../types/multipleChoiceQuestion.types';

export const getEmptyMultipleChoiceQuestionFormData = (): MultipleChoiceQuestionFormData => ({
  question: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  answer: '',
  explanation: '',
  difficultyLevel: 'easy',
  gradeLevel: '',
  subject: '',
  topic: '',
  term: undefined,
  week: undefined,
  channel: 'All',
  tags: '',
  lang: 'EN',
  displayOrder: 999,
  isActive: true,
});
