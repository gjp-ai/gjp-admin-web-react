
export const getEmptyVideoFormData = (lang = 'EN') => ({
  name: '',
  filename: '',
  coverImageFilename: '',
  sourceName: '',
  originalUrl: '',
  coverImageFile: null,
  description: '',
  sizeBytes: 0,
  tags: '',
  lang,
  channel: '',
  displayOrder: 999,
  isActive: true,
  uploadMethod: 'file' as const,
  file: null,
});
