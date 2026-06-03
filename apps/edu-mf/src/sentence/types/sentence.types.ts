export interface Sentence {
  id: string;
  name: string;
  phonetic?: string | null;
  phoneticAudioFilename?: string | null;
  phoneticAudioUrl?: string | null;
  translation?: string | null;
  explanation?: string | null;
  difficultyLevel?: string | null;
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
}

export interface SentencePaginatedResponse {
  content: Sentence[];
  page?: number;
  number?: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type SentenceActionType = 'create' | 'edit' | 'view';

export interface SentenceFormData {
  name: string;
  phonetic: string;
  phoneticAudioFilename: string;
  phoneticAudioUploadMethod: 'file' | 'filename';
  phoneticAudioFile: File | null;
  translation: string;
  explanation: string;
  difficultyLevel: string;
  term?: number;
  week?: number;
  channel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SentenceSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  channel?: string;
  difficultyLevel?: string;
  term?: string;
  week?: string;
  isActive?: string | null;
}
