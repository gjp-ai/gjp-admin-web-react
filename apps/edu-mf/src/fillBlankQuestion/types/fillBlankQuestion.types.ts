import type { EduQuestionBase, EduQuestionFormData, EduQuestionPaginatedResponse } from '../../question-common/types';

export interface FillBlankQuestion extends EduQuestionBase {}

export interface FillBlankQuestionFormData extends EduQuestionFormData {}

export type FillBlankQuestionPaginatedResponse = EduQuestionPaginatedResponse<FillBlankQuestion>;
