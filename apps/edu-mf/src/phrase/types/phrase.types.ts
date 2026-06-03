export interface Phrase {
  id: string;
  name: string;
  phonetic?: string | null;
  phoneticAudioFilename?: string | null;
  phoneticAudioUrl?: string | null;
  phoneticAudioOriginalUrl?: string | null;
  synonyms?: string | null;
  translation?: string | null;
  meaningClue?: string | null;
  meaning?: string | null;
  easyMeaning?: string | null;
  sentenceOne?: string | null;
  sentenceTwo?: string | null;
  difficultyLevel?: string | null;
  dictionaryUrl?: string | null;
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

export interface PhrasePaginatedResponse {
  content: Phrase[];
  page?: number;
  number?: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type PhraseActionType = 'create' | 'edit' | 'view';

export interface PhraseFormData {
  name: string;
  phonetic: string;
  phoneticAudioFilename: string;
  phoneticAudioOriginalUrl: string;
  phoneticAudioUploadMethod: 'url' | 'file';
  phoneticAudioFile: File | null;
  synonyms: string;
  translation: string;
  meaningClue: string;
  meaning: string;
  easyMeaning: string;
  sentenceOne: string;
  sentenceTwo: string;
  difficultyLevel: string;
  dictionaryUrl: string;
  term?: number;
  week?: number;
  channel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface PhraseSearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  channel?: string;
  difficultyLevel?: string;
  term?: string;
  week?: string;
  isActive?: string | null;
}
