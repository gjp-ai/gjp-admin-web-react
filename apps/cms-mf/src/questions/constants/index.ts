export const STATUS_MAPS: {
  active: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }>;
} = {
  active: {
    true: { label: 'Active', color: 'success' },
    false: { label: 'Inactive', color: 'default' },
  },
};

export const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'ZH', label: 'Chinese' },
];

export const QUESTION_TAG_SETTING_KEY = 'question_tags';

export const QUESTION_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100, 500, 1000],
  SORT_FIELD: 'updatedAt',
  SORT_DIRECTION: 'desc' as const,
};
