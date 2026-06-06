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

export const DIFFICULTY_LEVEL_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const TERM_OPTIONS = [1, 2, 3, 4].map((value) => ({
  value: String(value),
  label: String(value),
}));

export const WEEK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((value) => ({
  value: String(value),
  label: String(value),
}));

export const TRUE_FALSE_ANSWER_OPTIONS = [
  { value: 'TRUE', label: 'True' },
  { value: 'FALSE', label: 'False' },
];

export const MULTIPLE_CHOICE_ANSWER_OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];
