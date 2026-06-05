import { createEduQuestionService } from '../../question-common/serviceFactory';
import type { TrueFalseQuestion, TrueFalseQuestionFormData } from '../types/trueFalseQuestion.types';

export type TrueFalseQuestionQueryParams = import('../../question-common/types').EduQuestionQueryParams;

export const trueFalseQuestionService = createEduQuestionService<TrueFalseQuestion, TrueFalseQuestionFormData>(
  '/v1/edu-true-false-questions',
);
