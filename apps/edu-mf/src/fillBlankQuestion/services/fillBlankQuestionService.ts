import { createEduQuestionService } from '../../question-common/serviceFactory';
import type { FillBlankQuestion, FillBlankQuestionFormData } from '../types/fillBlankQuestion.types';

export type FillBlankQuestionQueryParams = import('../../question-common/types').EduQuestionQueryParams;

export const fillBlankQuestionService = createEduQuestionService<FillBlankQuestion, FillBlankQuestionFormData>(
  '/v1/edu-fill-blank-questions',
);
