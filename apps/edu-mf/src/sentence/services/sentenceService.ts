import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import { sanitizeRichTextPayload } from '../../question-common/richTextPayload';
import type {
  Sentence,
  SentenceFormData,
  SentencePaginatedResponse,
} from '../types/sentence.types';

export interface SentenceQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  name?: string;
  lang?: string;
  tags?: string;
  channel?: string;
  isActive?: boolean;
  term?: number;
  week?: number;
  difficultyLevel?: string;
}

type SentencePayload = Omit<
  SentenceFormData,
  'phoneticAudioUploadMethod' | 'phoneticAudioFile'
>;

class SentenceService {
  private readonly crudUrl = '/v1/edu-sentences';

  async getSentences(params?: SentenceQueryParams): Promise<ApiResponse<SentencePaginatedResponse>> {
    return apiClient.get(this.crudUrl, { params });
  }

  async createSentence(data: SentencePayload): Promise<ApiResponse<Sentence>> {
    return apiClient.post(this.crudUrl, sanitizeRichTextPayload(data));
  }

  async createSentenceByUpload(data: SentenceFormData): Promise<ApiResponse<Sentence>> {
    return apiClient.post(this.crudUrl, this.toFormData(sanitizeRichTextPayload(data)));
  }

  async updateSentence(id: string, data: SentencePayload): Promise<ApiResponse<Sentence>> {
    return apiClient.put(`${this.crudUrl}/${id}`, sanitizeRichTextPayload(data));
  }

  async updateSentenceWithFile(id: string, data: SentenceFormData): Promise<ApiResponse<Sentence>> {
    return apiClient.put(`${this.crudUrl}/${id}`, this.toFormData(sanitizeRichTextPayload(data)));
  }

  async deleteSentence(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}/permanent`);
  }

  private toFormData(data: SentenceFormData): FormData {
    const formData = new FormData();
    const appendString = (key: keyof SentencePayload, value: unknown) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    };

    appendString('name', data.name);
    appendString('phonetic', data.phonetic);
    appendString('phoneticAudioFilename', data.phoneticAudioFilename);
    appendString('translation', data.translation);
    appendString('explanation', data.explanation);
    appendString('difficultyLevel', data.difficultyLevel);
    appendString('term', data.term);
    appendString('week', data.week);
    appendString('channel', data.channel);
    appendString('tags', data.tags);
    appendString('lang', data.lang);
    appendString('displayOrder', data.displayOrder);
    appendString('isActive', data.isActive);

    if (data.phoneticAudioFile) {
      formData.append('phoneticAudioFile', data.phoneticAudioFile);
    }

    return formData;
  }
}

export const sentenceService = new SentenceService();
