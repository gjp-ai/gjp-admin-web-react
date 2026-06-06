import { apiClient } from '../../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../../shared-lib/src/api/api.types';
import { sanitizeRichTextPayload } from '../../question-common/richTextPayload';
import type {
  Phrase,
  PhraseFormData,
  PhrasePaginatedResponse,
} from '../types/phrase.types';

export interface PhraseQueryParams {
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

type PhrasePayload = Omit<
  PhraseFormData,
  'phoneticAudioUploadMethod' | 'phoneticAudioFile'
>;

class PhraseService {
  private readonly crudUrl = '/v1/edu-phrases';

  async getPhrases(params?: PhraseQueryParams): Promise<ApiResponse<PhrasePaginatedResponse>> {
    return apiClient.get(this.crudUrl, { params });
  }

  async createPhrase(data: PhrasePayload): Promise<ApiResponse<Phrase>> {
    return apiClient.post(this.crudUrl, sanitizeRichTextPayload(data));
  }

  async createPhraseByUpload(data: PhraseFormData): Promise<ApiResponse<Phrase>> {
    return apiClient.post(this.crudUrl, this.toFormData(sanitizeRichTextPayload(data)));
  }

  async updatePhrase(id: string, data: PhrasePayload): Promise<ApiResponse<Phrase>> {
    return apiClient.put(`${this.crudUrl}/${id}`, sanitizeRichTextPayload(data));
  }

  async updatePhraseWithFile(id: string, data: PhraseFormData): Promise<ApiResponse<Phrase>> {
    return apiClient.put(`${this.crudUrl}/${id}`, this.toFormData(sanitizeRichTextPayload(data)));
  }

  async deletePhrase(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.crudUrl}/${id}/permanent`);
  }

  private toFormData(data: PhraseFormData): FormData {
    const formData = new FormData();
    const appendString = (key: keyof PhrasePayload, value: unknown) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    };

    appendString('name', data.name);
    appendString('phonetic', data.phonetic);
    appendString('phoneticAudioFilename', data.phoneticAudioFilename);
    appendString('phoneticAudioOriginalUrl', data.phoneticAudioOriginalUrl);
    appendString('synonyms', data.synonyms);
    appendString('translation', data.translation);
    appendString('meaningClue', data.meaningClue);
    appendString('meaning', data.meaning);
    appendString('easyMeaning', data.easyMeaning);
    appendString('sentenceOne', data.sentenceOne);
    appendString('sentenceTwo', data.sentenceTwo);
    appendString('difficultyLevel', data.difficultyLevel);
    appendString('dictionaryUrl', data.dictionaryUrl);
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

export const phraseService = new PhraseService();
