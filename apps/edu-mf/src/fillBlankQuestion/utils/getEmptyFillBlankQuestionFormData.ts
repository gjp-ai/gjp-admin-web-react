import type { FillBlankQuestionFormData } from '../types/fillBlankQuestion.types';

export const getEmptyFillBlankQuestionFormData = (): FillBlankQuestionFormData => ({
  question: '',
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
