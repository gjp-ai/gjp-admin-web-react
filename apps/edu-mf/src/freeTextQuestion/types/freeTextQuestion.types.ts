import type { EduQuestionBase, EduQuestionFormData, EduQuestionPaginatedResponse } from '../../question-common/types';

export interface FreeTextQuestion extends EduQuestionBase {
  description?: string | null;
  questionA?: string | null;
  answerA?: string | null;
  questionB?: string | null;
  answerB?: string | null;
  questionC?: string | null;
  answerC?: string | null;
  questionD?: string | null;
  answerD?: string | null;
  questionE?: string | null;
  answerE?: string | null;
  questionF?: string | null;
  answerF?: string | null;
}

export interface FreeTextQuestionFormData extends EduQuestionFormData {
  description: string;
  questionA: string;
  answerA: string;
  questionB: string;
  answerB: string;
  questionC: string;
  answerC: string;
  questionD: string;
  answerD: string;
  questionE: string;
  answerE: string;
  questionF: string;
  answerF: string;
}

export type FreeTextQuestionPaginatedResponse = EduQuestionPaginatedResponse<FreeTextQuestion>;
