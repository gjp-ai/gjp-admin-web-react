import { createEduQuestionService } from '../../question-common/serviceFactory';
import type { MultipleChoiceQuestion, MultipleChoiceQuestionFormData } from '../types/multipleChoiceQuestion.types';

export type MultipleChoiceQuestionQueryParams = import('../../question-common/types').EduQuestionQueryParams;

export const multipleChoiceQuestionService = createEduQuestionService<MultipleChoiceQuestion, MultipleChoiceQuestionFormData>(
  '/v1/edu-multiple-choice-questions',
);
