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
import { Link, Upload } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CHANNEL_OPTIONS } from '../../../../shared-lib/src';
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptap/tiptapTextEditor';
import { TERM_OPTIONS, WEEK_OPTIONS } from '../../question-common/constants';
import {
  DIFFICULTY_LEVEL_SETTING_KEY,
  LANGUAGE_OPTIONS,
  PART_OF_SPEECH_SETTING_KEY,
  VOCABULARY_TAG_SETTING_KEY,
} from '../constants';
import '../i18n/translations';
import type { VocabularyFormData } from '../types/vocabulary.types';

interface CachedAppSetting {
  name?: string;
  value?: string;
  lang?: string;
  channel?: string | null;
}

interface VocabularyDialogProps {
  open: boolean;
  title: string;
  formData: VocabularyFormData;
  loading?: boolean;
  submitLabel: string;
  onClose: () => void;
  onFormChange: (field: keyof VocabularyFormData, value: any) => void;
  onSubmit: () => Promise<void>;
}

const VocabularyDialog = ({
  open,
  title,
  formData,
  loading,
  submitLabel,
  onClose,
  onFormChange,
  onSubmit,
}: VocabularyDialogProps) => {
  const { t } = useTranslation();
  const channelSelected = Boolean(formData.channel);

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
      console.error(`[VocabularyDialog] Error loading ${settingName}:`, error);
      return [];
    }
  };

  const availablePartOfSpeech = useMemo(
    () => getAppSettingOptions(PART_OF_SPEECH_SETTING_KEY),
    [formData.channel, formData.lang],
  );

  const availableDifficultyLevels = useMemo(
    () => getAppSettingOptions(DIFFICULTY_LEVEL_SETTING_KEY),
    [formData.channel, formData.lang],
  );

  const availableTags = useMemo(
    () => getAppSettingOptions(VOCABULARY_TAG_SETTING_KEY),
    [formData.channel, formData.lang],
  );

  const handleTagsChange = (event: any) => {
    const value = event.target.value as string[];
    onFormChange('tags', value.join(','));
  };

  const handleChannelChange = (value: string) => {
    onFormChange('channel', value);
    onFormChange('tags', '');
    onFormChange('partOfSpeech', '');
    onFormChange('difficultyLevel', '');
  };

  const handleNameOrLangChange = (field: 'name' | 'lang', value: string) => {
    onFormChange(field, value);
    if (field === 'lang') {
      onFormChange('tags', '');
      onFormChange('partOfSpeech', '');
      onFormChange('difficultyLevel', '');
    }
    const nextName = field === 'name' ? value : formData.name;
    const nextLang = field === 'lang' ? value : formData.lang;
    if (!nextName.trim()) return;
    const url =
      nextLang === 'ZH'
        ? `https://zd.hwxnet.com/search.do?keyword=${nextName.trim()}`
        : `https://dictionary.cambridge.org/dictionary/english/${nextName.trim()}`;
    onFormChange('dictionaryUrl', url);
  };

  const renderRichTextField = (field: keyof VocabularyFormData, label: string) => (
    <Box>
      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <TiptapTextEditor
        value={String(formData[field] || '')}
        onChange={(html: string) => onFormChange(field, html)}
        placeholder={label}
        initialRows={0}
      />
    </Box>
  );

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

  const renderAudioSection = (
    phoneticKey: 'phoneticUs' | 'phoneticUk',
    phoneticLabelKey: 'phoneticUs' | 'phoneticUk',
    labelKey: 'phoneticUsAudio' | 'phoneticUkAudio',
    filenameKey: 'phoneticUsAudioFilename' | 'phoneticUkAudioFilename',
    originalUrlKey: 'phoneticUsAudioOriginalUrl' | 'phoneticUkAudioOriginalUrl',
    uploadMethodKey: 'phoneticUsAudioUploadMethod' | 'phoneticUkAudioUploadMethod',
    fileKey: 'phoneticUsAudioFile' | 'phoneticUkAudioFile',
  ) => {
    const uploadMethod = formData[uploadMethodKey];
    const selectedFile = formData[fileKey];
    return (
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {t(`vocabulary.fields.${labelKey}`)}
        </Typography>
        <TextField
          label={t(`vocabulary.fields.${phoneticLabelKey}`)}
          value={formData[phoneticKey]}
          onChange={(e) => onFormChange(phoneticKey, e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <RadioGroup
          row
          value={uploadMethod}
          onChange={(e) => onFormChange(uploadMethodKey, e.target.value)}
        >
          <FormControlLabel value="url" control={<Radio />} label={t('vocabulary.fields.byUrl')} />
          <FormControlLabel value="file" control={<Radio />} label={t('vocabulary.fields.uploadFile')} />
        </RadioGroup>
        {uploadMethod === 'file' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Button component="label" variant="outlined" startIcon={<Upload size={16} />}>
              {t('vocabulary.fields.chooseAudioFile')}
              <input
                hidden
                type="file"
                accept="audio/*"
                onChange={(e) => onFormChange(fileKey, e.target.files?.[0] || null)}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2">
                {t('vocabulary.fields.selectedFile')}: {selectedFile.name}
              </Typography>
            )}
          </Box>
        ) : (
          <TextField
            label={t(`vocabulary.fields.${originalUrlKey}`)}
            value={formData[originalUrlKey]}
            onChange={(e) => onFormChange(originalUrlKey, e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            InputProps={{ startAdornment: <Link size={16} /> }}
          />
        )}
        <TextField
          label={t(`vocabulary.fields.${filenameKey}`)}
          value={formData[filenameKey]}
          onChange={(e) => onFormChange(filenameKey, e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label={t('vocabulary.fields.name')}
              value={formData.name}
              onChange={(e) => handleNameOrLangChange('name', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('vocabulary.fields.synonyms')}
              value={formData.synonyms}
              onChange={(e) => onFormChange('synonyms', e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {renderAudioSection('phoneticUs', 'phoneticUs', 'phoneticUsAudio', 'phoneticUsAudioFilename', 'phoneticUsAudioOriginalUrl', 'phoneticUsAudioUploadMethod', 'phoneticUsAudioFile')}
            {renderAudioSection('phoneticUk', 'phoneticUk', 'phoneticUkAudio', 'phoneticUkAudioFilename', 'phoneticUkAudioOriginalUrl', 'phoneticUkAudioUploadMethod', 'phoneticUkAudioFile')}
          </Box>

          <TextField
            label={t('vocabulary.fields.dictionaryUrl')}
            value={formData.dictionaryUrl}
            onChange={(e) => onFormChange('dictionaryUrl', e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('vocabulary.fields.channel')}
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
                {t('vocabulary.fields.language')}
              </Typography>
              <Select value={formData.lang} onChange={(e) => handleNameOrLangChange('lang', e.target.value)}>
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('vocabulary.fields.partOfSpeech')}
              </Typography>
              <Select
                value={formData.partOfSpeech}
                onChange={(e) => onFormChange('partOfSpeech', e.target.value)}
                disabled={!channelSelected}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {availablePartOfSpeech.length > 0 ? (
                  availablePartOfSpeech.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>Select a channel and language to load options</MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('vocabulary.fields.difficultyLevel')}
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

          {renderRichTextField('translation', t('vocabulary.fields.translation'))}
          {renderRichTextField('meaningClue', t('vocabulary.fields.meaningClue'))}
          {renderRichTextField('easyMeaning', t('vocabulary.fields.easyMeaning'))}
          {renderRichTextField('meaning', t('vocabulary.fields.meaning'))}
          {renderRichTextField('sentenceOne', t('vocabulary.fields.sentenceOne'))}
          {renderRichTextField('sentenceTwo', t('vocabulary.fields.sentenceTwo'))}
          {renderRichTextField('additionalInfo', t('vocabulary.fields.additionalInfo'))}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('vocabulary.fields.tags')}
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
            {renderNumberSelect('term', t('vocabulary.fields.term'), TERM_OPTIONS)}
            {renderNumberSelect('week', t('vocabulary.fields.week'), WEEK_OPTIONS)}
            
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr' }, gap: 2 }}>
            <TextField
              label={t('vocabulary.fields.displayOrder')}
              type="number"
              value={formData.displayOrder}
              onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
              fullWidth
            />
          </Box>

          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />}
            label={t('vocabulary.fields.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading || !formData.name.trim()}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VocabularyDialog;
