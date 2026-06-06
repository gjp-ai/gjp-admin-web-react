import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { Search } from 'lucide-react';
import { CHANNEL_OPTIONS } from '../../../shared-lib/src';
import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS, TERM_OPTIONS, WEEK_OPTIONS } from './constants';
import curriculumOptions from './curriculum-options.json';
import type { EduQuestionFieldConfig, EduQuestionSearchFormData } from './types';

interface QuestionSearchPanelProps {
  searchFormData: EduQuestionSearchFormData;
  fields: EduQuestionFieldConfig<any>[];
  searchFields?: (keyof EduQuestionSearchFormData)[];
  loading?: boolean;
  onFormChange: (field: keyof EduQuestionSearchFormData, value: string | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

const builtinOptions = {
  channel: CHANNEL_OPTIONS,
  lang: LANGUAGE_OPTIONS,
  difficultyLevel: DIFFICULTY_LEVEL_OPTIONS,
  term: TERM_OPTIONS,
  week: WEEK_OPTIONS,
};

type CurriculumOptions = Record<string, Record<string, string[]>>;
const curriculum = curriculumOptions as CurriculumOptions;
const gradeOptions = Object.keys(curriculum).map((grade) => ({ value: grade, label: grade }));
type SelectOption = { value: string; label: string };

const normalizeOptions = (options: { value: unknown; label: unknown }[] | readonly { value: unknown; label: unknown }[]): SelectOption[] => (
  options.map((option) => ({ value: String(option.value), label: String(option.label) }))
);

const defaultSearchFields: (keyof EduQuestionSearchFormData)[] = [
  'question',
  'channel',
  'lang',
  'difficultyLevel',
  'isActive',
  'tags',
  'gradeLevel',
  'subject',
  'topic',
  'term',
  'week',
];

const QuestionSearchPanel = ({
  searchFormData,
  fields,
  searchFields,
  loading,
  onFormChange,
  onSearch,
  onClear,
}: QuestionSearchPanelProps) => {
  const theme = useTheme();
  const fieldsByKey = Object.fromEntries(fields.map((field) => [String(field.key), field]));

  const normalize = (value?: string | null) => String(value || '').trim().toLowerCase();

  const normalizeLang = (value?: string | null) => {
    const normalized = normalize(value);
    if (normalized.startsWith('zh') || normalized === 'chinese') return 'zh';
    if (normalized.startsWith('en') || normalized === 'english') return 'en';
    return normalized;
  };

  const getFieldOptions = (fieldKey: keyof EduQuestionSearchFormData): SelectOption[] => {
    const field = fieldsByKey[String(fieldKey)];
    const storedOptions = field?.appSettingName ? getStoredSettingOptions(field.appSettingName, fieldKey === 'difficultyLevel') : [];
    if (storedOptions.length) return storedOptions.map((option) => ({ value: option, label: option }));
    if (field?.options) return normalizeOptions(field.options);
    if (fieldKey === 'gradeLevel') return gradeOptions;
    if (fieldKey === 'subject') {
      const grade = String(searchFormData.gradeLevel || '');
      return Object.keys(curriculum[grade] || {}).map((subject) => ({ value: subject, label: subject }));
    }
    if (fieldKey === 'topic') {
      const grade = String(searchFormData.gradeLevel || '');
      const subject = String(searchFormData.subject || '');
      return (curriculum[grade]?.[subject] || []).map((topic) => ({ value: topic, label: topic }));
    }
    const options = builtinOptions[fieldKey as keyof typeof builtinOptions];
    return options ? normalizeOptions(options) : [];
  };

  const getSettingRows = (): any[] => {
    try {
      const settings = localStorage.getItem('gjp_app_settings');
      if (!settings) return [];
      const parsed = JSON.parse(settings);
      return Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.content)
          ? parsed.content
          : Array.isArray(parsed?.data)
            ? parsed.data
            : Array.isArray(parsed?.data?.content)
              ? parsed.data.content
              : [];
    } catch {
      return [];
    }
  };

  const hasChannelAndLanguage = () => Boolean(String(searchFormData.channel || '').trim() && String(searchFormData.lang || '').trim());

  const getStoredSettingOptions = (settingName?: string, requireChannelAndLanguage = false): string[] => {
    if (!settingName) return [];
    const selectedChannel = String(searchFormData.channel || '').trim();
    if (requireChannelAndLanguage && !hasChannelAndLanguage()) return [];

    try {
      const rows = getSettingRows();

      const selectedLang = normalizeLang(String(searchFormData.lang || ''));
      const matchingNameAndLang = rows.filter((setting: { name?: string; lang?: string }) => {
        const nameMatches = normalize(setting.name) === normalize(settingName);
        const settingLang = normalizeLang(setting.lang);
        return nameMatches && (!settingLang || !selectedLang || settingLang === selectedLang);
      });

      const selectedChannelKey = normalize(selectedChannel);
      const exactChannelSettings = matchingNameAndLang.filter(
        (setting: { channel?: string | null }) => normalize(setting.channel) === selectedChannelKey,
      );
      const allChannelSettings = matchingNameAndLang.filter(
        (setting: { channel?: string | null }) => normalize(setting.channel) === 'all',
      );
      const blankChannelSettings = matchingNameAndLang.filter(
        (setting: { channel?: string | null }) => !normalize(setting.channel),
      );
      const matchingSettings = selectedChannel
        ? exactChannelSettings.length
          ? exactChannelSettings
          : allChannelSettings.length
            ? allChannelSettings
            : blankChannelSettings.length
              ? blankChannelSettings
              : matchingNameAndLang
        : allChannelSettings.length
          ? allChannelSettings
          : blankChannelSettings.length
            ? blankChannelSettings
            : matchingNameAndLang;

      return [...new Set(matchingSettings
        .flatMap((setting: { value?: string }) => String(setting.value || '').split(/[,;\n]/))
        .map((tag: string) => tag.trim())
        .filter(Boolean))];
    } catch {
      return [];
    }
  };

  const getStoredTagOptions = () => getStoredSettingOptions(fieldsByKey.tags?.appSettingName, true);

  const handleFieldChange = (field: keyof EduQuestionSearchFormData, value: string | null) => {
    onFormChange(field, value);
    if (field === 'gradeLevel') {
      onFormChange('subject', '');
      onFormChange('topic', '');
    }
    if (field === 'subject') {
      onFormChange('topic', '');
    }
    if (field === 'channel' || field === 'lang') {
      onFormChange('tags', '');
      onFormChange('difficultyLevel', '');
    }
  };

  const renderSelectField = (field: keyof EduQuestionSearchFormData, label: string) => (
    <FormControl fullWidth size="small">
      <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>
      <Select
        value={searchFormData[field] || ''}
        disabled={field === 'difficultyLevel' && fieldsByKey.difficultyLevel?.appSettingName ? !hasChannelAndLanguage() : false}
        onChange={(e) => handleFieldChange(field, e.target.value)}
      >
        <MenuItem value="">{field === 'term' || field === 'week' ? 'None' : 'All'}</MenuItem>
        {getFieldOptions(field).map((option: { value: string; label: string }) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const selectedTags = String(searchFormData.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const tagOptions = [...new Set([...selectedTags, ...getStoredTagOptions()])];
  const dependenciesSelected = hasChannelAndLanguage();
  const visibleSearchFields = searchFields || defaultSearchFields;

  const renderSearchField = (field: keyof EduQuestionSearchFormData) => {
    if (field === 'question') {
      return (
        <FormControl key={field} fullWidth size="small">
          <FormLabel sx={{ mb: 1 }}>Question</FormLabel>
          <TextField
            size="small"
            placeholder="Search by question"
            value={searchFormData.question || ''}
            onChange={(e) => handleFieldChange('question', e.target.value)}
          />
        </FormControl>
      );
    }

    if (field === 'isActive') {
      return (
        <FormControl key={field} fullWidth size="small">
          <FormLabel sx={{ mb: 1 }}>Status</FormLabel>
          <Select value={searchFormData.isActive || ''} onChange={(e) => handleFieldChange('isActive', e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
      );
    }

    if (field === 'tags') {
      return (
        <FormControl key={field} fullWidth size="small">
          <FormLabel sx={{ mb: 1 }}>Tags</FormLabel>
          <Autocomplete
            multiple
            size="small"
            options={tagOptions}
            value={selectedTags}
            disabled={!dependenciesSelected}
            onChange={(_event, nextValue) => {
              const normalizedTags = nextValue
                .flatMap((tag) => String(tag).split(','))
                .map((tag) => tag.trim())
                .filter(Boolean);
              handleFieldChange('tags', [...new Set(normalizedTags)].join(','));
            }}
            renderTags={(selected, getTagProps) => (
              selected.map((tag, index) => {
                const { key: tagKey, ...tagProps } = getTagProps({ index });
                return <Chip key={tagKey} label={String(tag)} size="small" {...tagProps} />;
              })
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={!dependenciesSelected ? 'Select channel and language first' : selectedTags.length ? '' : 'Select tags'}
              />
            )}
          />
        </FormControl>
      );
    }

    const labels: Record<string, string> = {
      difficultyLevel: 'Difficulty',
      gradeLevel: 'Grade',
      lang: 'Language',
      channel: 'Channel',
      subject: 'Subject',
      topic: 'Topic',
      term: 'Term',
      week: 'Week',
    };
    return <Box key={field}>{renderSelectField(field, labels[field] || String(field))}</Box>;
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#fff',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
          {visibleSearchFields.map(renderSearchField)}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
          <Button onClick={onClear} disabled={loading}>Clear</Button>
          <Button variant="contained" startIcon={<Search size={16} />} onClick={onSearch} disabled={loading}>Search</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionSearchPanel;
