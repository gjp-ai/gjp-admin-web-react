import { createEduQuestionService } from '../../question-common/serviceFactory';
import type { FreeTextQuestion, FreeTextQuestionFormData } from '../types/freeTextQuestion.types';

export type FreeTextQuestionQueryParams = import('../../question-common/types').EduQuestionQueryParams;

export const freeTextQuestionService = createEduQuestionService<FreeTextQuestion, FreeTextQuestionFormData>(
  '/v1/edu-free-text-questions',
);
