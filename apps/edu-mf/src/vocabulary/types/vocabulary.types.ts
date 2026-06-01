export interface Vocabulary {
  id: string;
  name: string;
  phoneticUs?: string | null;
  phoneticUsAudioFilename?: string | null;
  phoneticUsAudioUrl?: string | null;
  phoneticUsAudioOriginalUrl?: string | null;
  phoneticUk?: string | null;
  phoneticUkAudioFilename?: string | null;
  phoneticUkAudioUrl?: string | null;
  phoneticUkAudioOriginalUrl?: string | null;
  partOfSpeech?: string | null;
  synonyms?: string | null;
  translation?: string | null;
  meaningClue?: string | null;
  meaning?: string | null;
  easyMeaning?: string | null;
  sentenceOne?: string | null;
  sentenceTwo?: string | null;
  difficultyLevel?: string | null;
  dictionaryUrl?: string | null;
  additionalInfo?: string | null;
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

export interface VocabularyPaginatedResponse {
  content: Vocabulary[];
  page?: number;
  number?: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type VocabularyActionType = 'create' | 'edit' | 'view';

export interface VocabularyFormData {
  name: string;
  phoneticUs: string;
  phoneticUsAudioFilename: string;
  phoneticUsAudioOriginalUrl: string;
  phoneticUsAudioUploadMethod: 'url' | 'file';
  phoneticUsAudioFile: File | null;
  phoneticUk: string;
  phoneticUkAudioFilename: string;
  phoneticUkAudioOriginalUrl: string;
  phoneticUkAudioUploadMethod: 'url' | 'file';
  phoneticUkAudioFile: File | null;
  partOfSpeech: string;
  synonyms: string;
  translation: string;
  meaningClue: string;
  meaning: string;
  easyMeaning: string;
  sentenceOne: string;
  sentenceTwo: string;
  difficultyLevel: string;
  dictionaryUrl: string;
  additionalInfo: string;
  term?: number;
  week?: number;
  channel: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
}

export interface VocabularySearchFormData {
  name?: string;
  lang?: string;
  tags?: string;
  channel?: string;
  difficultyLevel?: string;
  partOfSpeech?: string;
  term?: string;
  week?: string;
  isActive?: string | null;
}
