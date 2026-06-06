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
  PHRASE_TAG_SETTING_KEY,
} from '../constants';
import '../i18n/translations';
import type { PhraseFormData } from '../types/phrase.types';

interface CachedAppSetting {
  name?: string;
  value?: string;
  lang?: string;
  channel?: string | null;
}

interface PhraseDialogProps {
  open: boolean;
  title: string;
  formData: PhraseFormData;
  loading?: boolean;
  submitLabel: string;
  onClose: () => void;
  onFormChange: (field: keyof PhraseFormData, value: any) => void;
  onSubmit: () => Promise<void>;
}

const PhraseDialog = ({
  open,
  title,
  formData,
  loading,
  submitLabel,
  onClose,
  onFormChange,
  onSubmit,
}: PhraseDialogProps) => {
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
      console.error(`[PhraseDialog] Error loading ${settingName}:`, error);
      return [];
    }
  };

  const availableDifficultyLevels = useMemo(
    () => getAppSettingOptions(DIFFICULTY_LEVEL_SETTING_KEY),
    [formData.channel, formData.lang],
  );

  const availableTags = useMemo(
    () => getAppSettingOptions(PHRASE_TAG_SETTING_KEY),
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
    const nextName = field === 'name' ? value : formData.name;
    const nextLang = field === 'lang' ? value : formData.lang;
    if (!nextName.trim()) return;
    const url =
      nextLang === 'ZH'
        ? `https://zd.hwxnet.com/search.do?keyword=${nextName.trim()}`
        : `https://dictionary.cambridge.org/dictionary/english/${nextName.trim()}`;
    onFormChange('dictionaryUrl', url);
  };

  const renderRichTextField = (field: keyof PhraseFormData, label: string) => (
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

  const renderAudioSection = () => {
    const uploadMethod = formData.phoneticAudioUploadMethod;
    const selectedFile = formData.phoneticAudioFile;
    return (
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {t('phrase.fields.phoneticAudio')}
        </Typography>
        <TextField
          label={t('phrase.fields.phonetic')}
          value={formData.phonetic}
          onChange={(e) => onFormChange('phonetic', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <RadioGroup
          row
          value={uploadMethod}
          onChange={(e) => onFormChange('phoneticAudioUploadMethod', e.target.value)}
        >
          <FormControlLabel value="url" control={<Radio />} label={t('phrase.fields.byUrl')} />
          <FormControlLabel value="file" control={<Radio />} label={t('phrase.fields.uploadFile')} />
        </RadioGroup>
        {uploadMethod === 'file' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Button component="label" variant="outlined" startIcon={<Upload size={16} />}>
              {t('phrase.fields.chooseAudioFile')}
              <input
                hidden
                type="file"
                accept="audio/*"
                onChange={(e) => onFormChange('phoneticAudioFile', e.target.files?.[0] || null)}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2">
                {t('phrase.fields.selectedFile')}: {selectedFile.name}
              </Typography>
            )}
          </Box>
        ) : (
          <TextField
            label={t('phrase.fields.phoneticAudioOriginalUrl')}
            value={formData.phoneticAudioOriginalUrl}
            onChange={(e) => onFormChange('phoneticAudioOriginalUrl', e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            InputProps={{ startAdornment: <Link size={16} /> }}
          />
        )}
        <TextField
          label={t('phrase.fields.phoneticAudioFilename')}
          value={formData.phoneticAudioFilename}
          onChange={(e) => onFormChange('phoneticAudioFilename', e.target.value)}
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
              label={t('phrase.fields.name')}
              value={formData.name}
              onChange={(e) => handleNameOrLangChange('name', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('phrase.fields.synonyms')}
              value={formData.synonyms}
              onChange={(e) => onFormChange('synonyms', e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            {renderAudioSection()}
          </Box>

          <TextField
            label={t('phrase.fields.dictionaryUrl')}
            value={formData.dictionaryUrl}
            onChange={(e) => onFormChange('dictionaryUrl', e.target.value)}
            fullWidth
          />

          {renderRichTextField('translation', t('phrase.fields.translation'))}
          {renderRichTextField('meaningClue', t('phrase.fields.meaningClue'))}
          {renderRichTextField('easyMeaning', t('phrase.fields.easyMeaning'))}
          {renderRichTextField('meaning', t('phrase.fields.meaning'))}
          {renderRichTextField('sentenceOne', t('phrase.fields.sentenceOne'))}
          {renderRichTextField('sentenceTwo', t('phrase.fields.sentenceTwo'))}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('phrase.fields.channel')}
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
                {t('phrase.fields.language')}
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
                {t('phrase.fields.difficultyLevel')}
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
            <FormControl fullWidth>
              <Typography variant="caption" sx={{ mb: 0.5 }}>
                {t('phrase.fields.tags')}
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
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {renderNumberSelect('term', t('phrase.fields.term'), TERM_OPTIONS)}
            {renderNumberSelect('week', t('phrase.fields.week'), WEEK_OPTIONS)}
          </Box>

          <TextField
              label={t('phrase.fields.displayOrder')}
              type="number"
              value={formData.displayOrder}
              onChange={(e) => onFormChange('displayOrder', Number(e.target.value))}
              fullWidth
            />

          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />}
            label={t('phrase.fields.isActive')}
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

export default PhraseDialog;
