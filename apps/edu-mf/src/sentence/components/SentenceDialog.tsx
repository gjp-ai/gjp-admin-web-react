import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Upload } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CHANNEL_OPTIONS } from '../../../../shared-lib/src';
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptap/tiptapTextEditor';
import { TERM_OPTIONS, WEEK_OPTIONS } from '../../question-common/constants';
import {
  DIFFICULTY_LEVEL_SETTING_KEY,
  LANGUAGE_OPTIONS,
  SENTENCE_TAG_SETTING_KEY,
} from '../constants';
import '../i18n/translations';
import type { SentenceFormData } from '../types/sentence.types';

interface CachedAppSetting {
  name?: string;
  value?: string;
  lang?: string;
  channel?: string | null;
}

interface SentenceDialogProps {
  open: boolean;
  title: string;
  formData: SentenceFormData;
  loading?: boolean;
  submitLabel: string;
  onClose: () => void;
  onFormChange: (field: keyof SentenceFormData, value: any) => void;
  onSubmit: () => Promise<void>;
}

const SentenceDialog = ({
  open,
  title,
  formData,
  loading,
  submitLabel,
  onClose,
  onFormChange,
  onSubmit,
}: SentenceDialogProps) => {
  const { t } = useTranslation();
  const channelSelected = Boolean(formData.channel);

  const stripHtmlTags = (value: unknown) => String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  const normalize = (value?: string | null) => (value || '').trim().toLowerCase();

  const normalizeLang = (value?: string | null) => {
    const normalized = normalize(value);
    if (normalized.startsWith('zh') || normalized === 'chinese') return 'zh';
    if (normalized.startsWith('en') || normalized === 'english') return 'en';
    return normalized;
  };

  const parseAppSettings = (): CachedAppSetting[] => {
    const settings = localStorage.getItem('gjp_app_settings');
    if (!settings) return [];

    const parsed = JSON.parse(settings);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.content)) return parsed.content;
    if (Array.isArray(parsed?.data)) return parsed.data;
    if (Array.isArray(parsed?.data?.content)) return parsed.data.content;
    return [];
  };

  const splitSettingValue = (value?: string) =>
    (value || '')
      .split(/[,;\n]/)
      .map((option) => option.trim())
      .filter(Boolean);

  const getAppSettingOptions = (settingName: string) => {
    if (!formData.channel) return [];
    try {
      const appSettings = parseAppSettings();
      const selectedLang = normalizeLang(formData.lang);
      const selectedChannel = normalize(formData.channel);
      const matchingNameAndLang = appSettings.filter(
        (setting) =>
          normalize(setting.name) === normalize(settingName) &&
          normalizeLang(setting.lang) === selectedLang,
      );

      const setting =
        matchingNameAndLang.find((item) => normalize(item.channel) === selectedChannel) ||
        matchingNameAndLang.find((item) => normalize(item.channel) === 'all') ||
        matchingNameAndLang.find((item) => !normalize(item.channel));

      if (!setting) return [];
      return splitSettingValue(setting.value);
    } catch (error) {
      console.error(`[SentenceDialog] Error loading ${settingName}:`, error);
      return [];
    }
  };

  const availableDifficultyLevels = useMemo(
    () => getAppSettingOptions(DIFFICULTY_LEVEL_SETTING_KEY),
    [formData.channel, formData.lang],
  );

  const availableTags = useMemo(
    () => getAppSettingOptions(SENTENCE_TAG_SETTING_KEY),
    [formData.channel, formData.lang],
  );

  const handleTagsChange = (event: any) => {
    const value = event.target.value as string[];
    onFormChange('tags', value.join(','));
  };

  const handleChannelChange = (value: string) => {
    onFormChange('channel', value);
    onFormChange('tags', '');
    onFormChange('difficultyLevel', '');
  };

  const handleNameOrLangChange = (field: 'name' | 'lang', value: string) => {
    onFormChange(field, value);
    if (field === 'lang') {
      onFormChange('tags', '');
      onFormChange('difficultyLevel', '');
    }
  };

  const renderNumberSelect = (
    field: 'term' | 'week',
    label: string,
    options: { value: string; label: string }[],
  ) => (
    <FormControl fullWidth>
      <Typography variant="caption" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Select
        value={formData[field] === undefined ? '' : String(formData[field])}
        onChange={(event) => onFormChange(field, event.target.value === '' ? undefined : Number(event.target.value))}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderAudioSection = () => {
    const uploadMethod = formData.phoneticAudioUploadMethod;
    const selectedFile = formData.phoneticAudioFile;
    return (
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {t('sentence.fields.phoneticAudio')}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            {t('sentence.fields.phonetic')}
          </Typography>
          <TiptapTextEditor
            value={formData.phonetic}
            onChange={(html: string) => onFormChange('phonetic', html)}
            placeholder={t('sentence.fields.phonetic')}
            initialRows={0}
          />
        </Box>
        <RadioGroup
          row
          value={uploadMethod}
          onChange={(e) => onFormChange('phoneticAudioUploadMethod', e.target.value)}
        >
          <FormControlLabel value="file" control={<Radio />} label={t('sentence.fields.uploadFile')} />
          <FormControlLabel value="filename" control={<Radio />} label={t('sentence.fields.byFilename')} />
        </RadioGroup>
        {uploadMethod === 'file' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Button component="label" variant="outlined" startIcon={<Upload size={16} />}>
              {t('sentence.fields.chooseAudioFile')}
              <input
                hidden
                type="file"
                accept="audio/*"
                onChange={(e) => onFormChange('phoneticAudioFile', e.target.files?.[0] || null)}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2">
                {t('sentence.fields.selectedFile')}: {selectedFile.name}
              </Typography>
            )}
          </Box>
        ) : (
          <TextField
            label={t('sentence.fields.phoneticAudioFilename')}
            value={formData.phoneticAudioFilename}
            onChange={(e) => onFormChange('phoneticAudioFilename', e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        )}
        {uploadMethod === 'file' && (
          <TextField
            label={t('sentence.fields.phoneticAudioFilename')}
            value={formData.phoneticAudioFilename}
            onChange={(e) => onFormChange('phoneticAudioFilename', e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            helperText="Optional overrides filename. Leave blank to clean original name."
          />
        )}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            width: { xs: 'calc(100% - 32px)', md: 1100 },
            maxWidth: 'calc(100% - 32px)',
          },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              {t('sentence.fields.name')}
            </Typography>
            <TiptapTextEditor
              value={formData.name}
              onChange={(html: string) => handleNameOrLangChange('name', html)}
              placeholder={t('sentence.fields.name')}
              initialRows={0}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {renderAudioSection()}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              {t('sentence.fields.translation')}
            </Typography>
            <TiptapTextEditor
              value={formData.translation}
              onChange={(html: string) => onFormChange('translation', html)}
              placeholder={t('sentence.fields.translation')}
              initialRows={0}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              {t('sentence.fields.explanation')}
            </Typography>
            <TiptapTextEditor
              value={formData.explanation}
              onChange={(html: string) => onFormChange('explanation', html)}
              placeholder={t('sentence.fields.explanation')}
              initialRows={0}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('sentence.fields.channel')}
              </Typography>
              <Select value={formData.channel} onChange={(e) => handleChannelChange(e.target.value)}>
                {CHANNEL_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('sentence.fields.language')}
              </Typography>
              <Select value={formData.lang} onChange={(e) => handleNameOrLangChange('lang', e.target.value)}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('sentence.fields.difficultyLevel')}
              </Typography>
              <Select
                value={formData.difficultyLevel}
                onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
                disabled={!channelSelected}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {availableDifficultyLevels.length > 0 ? (
                  availableDifficultyLevels.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Select a channel and language to load options</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('sentence.fields.tags')}
              </Typography>
              <Select
                multiple
                value={formData.tags ? formData.tags.split(',').filter(Boolean) : []}
                onChange={handleTagsChange}
                input={<OutlinedInput />}
                disabled={!channelSelected}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Array.isArray(selected) && selected.map((tag) => <Chip key={tag} label={tag} size="small" />)}
                  </Box>
                )}
              >
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Select a channel and language to load tags</MenuItem>
                )}
              </Select>
            </FormControl>
            {renderNumberSelect('term', t('sentence.fields.term'), TERM_OPTIONS)}
            {renderNumberSelect('week', t('sentence.fields.week'), WEEK_OPTIONS)}
          </Box>

          <TextField
              label={t('sentence.fields.displayOrder')}
              type="number"
              value={formData.displayOrder}
              onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
              fullWidth
            />

          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />}
            label={t('sentence.fields.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading || !stripHtmlTags(formData.name)}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SentenceDialog;
