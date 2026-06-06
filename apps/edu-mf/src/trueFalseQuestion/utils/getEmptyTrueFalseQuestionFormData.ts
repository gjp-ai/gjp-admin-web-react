import type { TrueFalseQuestionFormData } from '../types/trueFalseQuestion.types';

export const getEmptyTrueFalseQuestionFormData = (): TrueFalseQuestionFormData => ({
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
