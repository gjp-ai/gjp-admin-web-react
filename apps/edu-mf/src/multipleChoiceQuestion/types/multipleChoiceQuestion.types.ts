import type { EduQuestionBase, EduQuestionFormData, EduQuestionPaginatedResponse } from '../../question-common/types';

export interface MultipleChoiceQuestion extends EduQuestionBase {
  optionA?: string | null;
  optionB?: string | null;
  optionC?: string | null;
  optionD?: string | null;
}

export interface MultipleChoiceQuestionFormData extends EduQuestionFormData {
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export type MultipleChoiceQuestionPaginatedResponse = EduQuestionPaginatedResponse<MultipleChoiceQuestion>;
