import { apiClient } from '../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../shared-lib/src/api/api.types';
import type {
  EduQuestionBase,
  EduQuestionFormData,
  EduQuestionPaginatedResponse,
  EduQuestionQueryParams,
  EduQuestionService,
} from './types';

export const createEduQuestionService = <T extends EduQuestionBase, F extends EduQuestionFormData>(
  crudUrl: string,
): EduQuestionService<T, F> => ({
  getQuestions(params?: EduQuestionQueryParams): Promise<ApiResponse<EduQuestionPaginatedResponse<T>>> {
    return apiClient.get(crudUrl, { params });
  },

  createQuestion(data: F): Promise<ApiResponse<T>> {
    return apiClient.post(crudUrl, data);
  },

  updateQuestion(id: string, data: F): Promise<ApiResponse<T>> {
    return apiClient.put(`${crudUrl}/${id}`, data);
  },

  deleteQuestion(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${crudUrl}/${id}/permanent`);
  },
});
