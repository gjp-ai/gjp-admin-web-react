import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import { sanitizeRichTextPayload } from '../../question-common/richTextPayload';
import type {
  Vocabulary,
  VocabularyFormData,
  VocabularyPaginatedResponse,
} from '../types/vocabulary.types';

export interface VocabularyQueryParams {
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
  partOfSpeech?: string;
}

type VocabularyPayload = Omit<
  VocabularyFormData,
  'phoneticUsAudioUploadMethod' | 'phoneticUsAudioFile' | 'phoneticUkAudioUploadMethod' | 'phoneticUkAudioFile'
>;

class VocabularyService {
  private readonly crudUrl = '/v1/edu-vocabularies';

  async getVocabularies(params?: VocabularyQueryParams): Promise<ApiResponse<VocabularyPaginatedResponse>> {
    return apiClient.get(this.crudUrl, { params });
  }

  async createVocabulary(data: VocabularyPayload): Promise<ApiResponse<Vocabulary>> {
    return apiClient.post(this.crudUrl, sanitizeRichTextPayload(data));
  }

  async createVocabularyByUpload(data: VocabularyFormData): Promise<ApiResponse<Vocabulary>> {
    return apiClient.post(this.crudUrl, this.toFormData(sanitizeRichTextPayload(data)));
  }

  async updateVocabulary(id: string, data: VocabularyPayload): Promise<ApiResponse<Vocabulary>> {
    return apiClient.put(`${this.crudUrl}/${id}`, sanitizeRichTextPayload(data));
  }

  async updateVocabularyWithFile(id: string, data: VocabularyFormData): Promise<ApiResponse<Vocabulary>> {
    return apiClient.put(`${this.crudUrl}/${id}`, this.toFormData(sanitizeRichTextPayload(data)));
  }

  async deleteVocabulary(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}/permanent`);
  }

  private toFormData(data: VocabularyFormData): FormData {
    const formData = new FormData();
    const appendString = (key: keyof VocabularyPayload, value: unknown) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    };

    appendString('name', data.name);
    appendString('phoneticUs', data.phoneticUs);
    appendString('phoneticUsAudioFilename', data.phoneticUsAudioFilename);
    appendString('phoneticUsAudioOriginalUrl', data.phoneticUsAudioOriginalUrl);
    appendString('phoneticUk', data.phoneticUk);
    appendString('phoneticUkAudioFilename', data.phoneticUkAudioFilename);
    appendString('phoneticUkAudioOriginalUrl', data.phoneticUkAudioOriginalUrl);
    appendString('partOfSpeech', data.partOfSpeech);
    appendString('synonyms', data.synonyms);
    appendString('translation', data.translation);
    appendString('meaningClue', data.meaningClue);
    appendString('meaning', data.meaning);
    appendString('easyMeaning', data.easyMeaning);
    appendString('sentenceOne', data.sentenceOne);
    appendString('sentenceTwo', data.sentenceTwo);
    appendString('difficultyLevel', data.difficultyLevel);
    appendString('dictionaryUrl', data.dictionaryUrl);
    appendString('additionalInfo', data.additionalInfo);
    appendString('term', data.term);
    appendString('week', data.week);
    appendString('channel', data.channel);
    appendString('tags', data.tags);
    appendString('lang', data.lang);
    appendString('displayOrder', data.displayOrder);
    appendString('isActive', data.isActive);

    if (data.phoneticUsAudioFile) {
      formData.append('phoneticUsAudioFile', data.phoneticUsAudioFile);
    }
    if (data.phoneticUkAudioFile) {
      formData.append('phoneticUkAudioFile', data.phoneticUkAudioFile);
    }

    return formData;
  }
}

export const vocabularyService = new VocabularyService();
