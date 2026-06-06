import type { SentenceFormData } from '../types/sentence.types';

export const getEmptySentenceFormData = (defaultLang = 'EN'): SentenceFormData => ({
  name: '',
  phonetic: '',
  phoneticAudioFilename: '',
  phoneticAudioUploadMethod: 'file',
  phoneticAudioFile: null,
  translation: '',
  explanation: '',
  difficultyLevel: '',
  term: undefined,
  week: undefined,
  channel: 'All',
  tags: '',
  lang: defaultLang,
  displayOrder: 999,
  isActive: true,
});
