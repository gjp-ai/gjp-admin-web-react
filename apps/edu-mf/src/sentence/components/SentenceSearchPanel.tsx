import {
  Box,
  Button,
  Card,
  CardContent,
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
import { DIFFICULTY_LEVEL_OPTIONS, LANGUAGE_OPTIONS } from '../constants';
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
              onChange={(e) => onFormChange('name', e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>{t('sentence.fields.channel')}</FormLabel>
            <Select value={searchFormData.channel || ''} onChange={(e) => onFormChange('channel', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {CHANNEL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>{t('sentence.fields.language')}</FormLabel>
            <Select value={searchFormData.lang || ''} onChange={(e) => onFormChange('lang', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {LANGUAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>{t('sentence.fields.difficultyLevel')}</FormLabel>
            <Select value={searchFormData.difficultyLevel || ''} onChange={(e) => onFormChange('difficultyLevel', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              {DIFFICULTY_LEVEL_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>{t('sentence.fields.status')}</FormLabel>
            <Select value={searchFormData.isActive || ''} onChange={(e) => onFormChange('isActive', e.target.value)}>
              <MenuItem value="">{t('common.all')}</MenuItem>
              <MenuItem value="true">{t('sentence.fields.isActive')}</MenuItem>
              <MenuItem value="false">{t('common.inactive')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            size="small"
            label={t('sentence.fields.tags')}
            value={searchFormData.tags || ''}
            onChange={(e) => onFormChange('tags', e.target.value)}
          />
          <TextField
            size="small"
            label={t('sentence.fields.term')}
            type="number"
            value={searchFormData.term || ''}
            onChange={(e) => onFormChange('term', e.target.value)}
          />
          <TextField
            size="small"
            label={t('sentence.fields.week')}
            type="number"
            value={searchFormData.week || ''}
            onChange={(e) => onFormChange('week', e.target.value)}
          />
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
