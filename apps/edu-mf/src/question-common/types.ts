import type { ApiResponse, PaginatedResponse } from '../../../shared-lib/src/api/api.types';

export interface EduQuestionBase {
  id: string;
  question: string;
  answer?: string | null;
  explanation?: string | null;
  difficultyLevel?: string | null;
  failCount?: number | null;
  successCount?: number | null;
  gradeLevel?: string | null;
  subject?: string | null;
  topic?: string | null;
  term?: number | null;
  week?: number | null;
  channel?: string | null;
  tags?: string | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  [key: string]: unknown;
}

export interface EduQuestionFormData {
  question: string;
  answer: string;
  explanation: string;
  difficultyLevel: string;
  gradeLevel: string;
  subject: string;
  topic: string;
  term?: number;
  week?: number;
  channel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  [key: string]: unknown;
}

export interface EduQuestionSearchFormData {
  question?: string;
  lang?: string;
  tags?: string;
  channel?: string;
  difficultyLevel?: string;
  gradeLevel?: string;
  subject?: string;
  topic?: string;
  term?: string;
  week?: string;
  isActive?: string | null;
}

export interface EduQuestionQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  question?: string;
  lang?: string;
  tags?: string;
  channel?: string;
  isActive?: boolean;
  term?: number;
  week?: number;
  difficultyLevel?: string;
  gradeLevel?: string;
  subject?: string;
  topic?: string;
}

export interface EduQuestionPaginatedResponse<T extends EduQuestionBase> extends PaginatedResponse<T> {
  content: T[];
}

export interface EduQuestionService<T extends EduQuestionBase, F extends EduQuestionFormData> {
  getQuestions(params?: EduQuestionQueryParams): Promise<ApiResponse<EduQuestionPaginatedResponse<T>>>;
  createQuestion(data: F): Promise<ApiResponse<T>>;
  updateQuestion(id: string, data: F): Promise<ApiResponse<T>>;
  deleteQuestion(id: string): Promise<ApiResponse<void>>;
}

export type EduQuestionActionType = 'create' | 'edit' | 'view';

export interface EduQuestionFieldConfig<F extends EduQuestionFormData> {
  key: keyof F;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: 'text' | 'number' | 'select' | 'richText';
  options?: { value: string; label: string }[];
  multiple?: boolean;
  appSettingName?: string;
  grid?: 'full' | 'half' | 'third';
  row?: number;
}

export interface EduQuestionCrudConfig<T extends EduQuestionBase, F extends EduQuestionFormData> {
  entityName: string;
  entityNamePlural: string;
  routeName: string;
  service: EduQuestionService<T, F>;
  defaultFormData: F;
  fields: EduQuestionFieldConfig<F>[];
  tableFields?: string[];
  questionImageReferenceKey?: 'multipleChoiceQuestionId' | 'fillBlankQuestionId' | 'freeTextQuestionId' | 'trueFalseQuestionId';
  questionPreviewField?: keyof T;
  sortField?: string;
  defaultPageSize?: number;
}

export interface QuestionImage {
  id: string;
  multipleChoiceQuestionId?: string | null;
  fillBlankQuestionId?: string | null;
  freeTextQuestionId?: string | null;
  trueFalseQuestionId?: string | null;
  filename: string;
  fileUrl?: string | null;
  originalUrl?: string | null;
  width?: number | null;
  height?: number | null;
  lang?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
