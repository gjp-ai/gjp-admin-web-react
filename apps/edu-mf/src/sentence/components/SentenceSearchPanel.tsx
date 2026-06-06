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
import { useTranslation } from 'react-i18next';
import { CHANNEL_OPTIONS } from '../../../../shared-lib/src';
import { TERM_OPTIONS, WEEK_OPTIONS } from '../../question-common/constants';
import { getStoredAppSettingOptions } from '../../question-common/appSettingOptions';
import {
  DIFFICULTY_LEVEL_OPTIONS,
  DIFFICULTY_LEVEL_SETTING_KEY,
  LANGUAGE_OPTIONS,
  SENTENCE_TAG_SETTING_KEY,
} from '../constants';
import '../i18n/translations';
import type { SentenceSearchFormData } from '../types/sentence.types';

interface SentenceSearchPanelProps {
  searchFormData: SentenceSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof SentenceSearchFormData, value: string | null) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SentenceSearchPanel = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}: SentenceSearchPanelProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dependenciesSelected = Boolean(searchFormData.channel && searchFormData.lang);
  const difficultyOptions = getStoredAppSettingOptions(DIFFICULTY_LEVEL_SETTING_KEY, searchFormData.channel, searchFormData.lang);
  const selectedTags = String(searchFormData.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);
  const tagOptions = [...new Set([
    ...selectedTags,
    ...getStoredAppSettingOptions(SENTENCE_TAG_SETTING_KEY, searchFormData.channel, searchFormData.lang),
  ])];

  const handleFormChange = (field: keyof SentenceSearchFormData, value: string | null) => {
    onFormChange(field, value);
    if (field === 'channel' || field === 'lang') {
      onFormChange('difficultyLevel', '');
      onFormChange('tags', '');
    }
  };

  const renderSelect = (
    field: keyof SentenceSearchFormData,
    label: string,
    options: { value: string; label: string }[] | readonly { value: string; label: string }[],
    disabled = false,
    emptyLabel = t('common.all'),
  ) => (
    <FormControl fullWidth size="small">
      <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>
      <Select value={searchFormData[field] || ''} disabled={disabled} onChange={(e) => handleFormChange(field, e.target.value)}>
        <MenuItem value="">{emptyLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

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
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>{t('sentence.fields.name')}</FormLabel>
            <TextField
              size="small"
              placeholder={t('sentence.placeholders.searchName')}
              value={searchFormData.name || ''}
              onChange={(e) => handleFormChange('name', e.target.value)}
            />
          </FormControl>
          {renderSelect('channel', t('sentence.fields.channel'), CHANNEL_OPTIONS)}
          {renderSelect('lang', t('sentence.fields.language'), LANGUAGE_OPTIONS)}
          {renderSelect(
            'difficultyLevel',
            t('sentence.fields.difficultyLevel'),
            difficultyOptions.length ? difficultyOptions.map((option) => ({ value: option, label: option })) : DIFFICULTY_LEVEL_OPTIONS,
            !dependenciesSelected,
          )}
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>{t('sentence.fields.tags')}</FormLabel>
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
                handleFormChange('tags', [...new Set(normalizedTags)].join(','));
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
          {renderSelect('term', t('sentence.fields.term'), TERM_OPTIONS, false, 'None')}
          {renderSelect('week', t('sentence.fields.week'), WEEK_OPTIONS, false, 'None')}
          {renderSelect('isActive', t('sentence.fields.status'), [
            { value: 'true', label: t('sentence.fields.isActive') },
            { value: 'false', label: t('common.inactive') },
          ])}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
          <Button onClick={onClear} disabled={loading}>
            {t('common.clear')}
          </Button>
          <Button variant="contained" startIcon={<Search size={16} />} onClick={onSearch} disabled={loading}>
            {t('common.search')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentenceSearchPanel;
