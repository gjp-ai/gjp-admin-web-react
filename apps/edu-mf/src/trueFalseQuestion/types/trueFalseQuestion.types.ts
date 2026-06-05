import type { EduQuestionBase, EduQuestionFormData, EduQuestionPaginatedResponse } from '../../question-common/types';

export interface TrueFalseQuestion extends EduQuestionBase {
  answer: 'TRUE' | 'FALSE';
}

export interface TrueFalseQuestionFormData extends EduQuestionFormData {
  answer: 'TRUE' | 'FALSE' | '';
}

export type TrueFalseQuestionPaginatedResponse = EduQuestionPaginatedResponse<TrueFalseQuestion>;
