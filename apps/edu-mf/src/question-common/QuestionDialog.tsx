import {
  Box,
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { CHANNEL_OPTIONS } from '../../../shared-lib/src';
import TiptapTextEditor from '../../../shared-lib/src/ui-components/rich-text/tiptap/tiptapTextEditor';
import {
  DIFFICULTY_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
} from './constants';
import curriculumOptions from './curriculum-options.json';
import type { EduQuestionFieldConfig, EduQuestionFormData } from './types';

interface QuestionDialogProps<F extends EduQuestionFormData> {
  open: boolean;
  title: string;
  formData: F;
  fields: EduQuestionFieldConfig<F>[];
  loading?: boolean;
  submitLabel: string;
  onClose: () => void;
  onFormChange: (field: keyof F, value: unknown) => void;
  onSubmit: () => Promise<void>;
}

const builtinOptions = {
  channel: CHANNEL_OPTIONS,
  lang: LANGUAGE_OPTIONS,
  difficultyLevel: DIFFICULTY_LEVEL_OPTIONS,
};

type CurriculumOptions = Record<string, Record<string, string[]>>;
const curriculum = curriculumOptions as CurriculumOptions;
const gradeOptions = Object.keys(curriculum).map((grade) => ({ value: grade, label: grade }));

const QuestionDialog = <F extends EduQuestionFormData>({
  open,
  title,
  formData,
  fields,
  loading,
  submitLabel,
  onClose,
  onFormChange,
  onSubmit,
}: QuestionDialogProps<F>) => {
  const getFieldOptions = (field: EduQuestionFieldConfig<F>) => {
    const key = String(field.key);
    if (field.options) return field.options;
    if (key === 'gradeLevel') return gradeOptions;
    if (key === 'subject') {
      const grade = String(formData.gradeLevel || '');
      return Object.keys(curriculum[grade] || {}).map((subject) => ({ value: subject, label: subject }));
    }
    if (key === 'topic') {
      const grade = String(formData.gradeLevel || '');
      const subject = String(formData.subject || '');
      return (curriculum[grade]?.[subject] || []).map((topic) => ({ value: topic, label: topic }));
    }
    return builtinOptions[key as keyof typeof builtinOptions];
  };

  const handleFieldChange = (field: EduQuestionFieldConfig<F>, value: unknown) => {
    const key = String(field.key);
    onFormChange(field.key, value);
    if (key === 'gradeLevel') {
      onFormChange('subject', '');
      onFormChange('topic', '');
    }
    if (key === 'subject') {
      onFormChange('topic', '');
    }
  };

  const getStoredTagOptions = () => {
    try {
      const settings = localStorage.getItem('gjp_app_settings');
      if (!settings) return [];
      const parsed = JSON.parse(settings);
      const rows = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.content)
          ? parsed.content
          : Array.isArray(parsed?.data)
            ? parsed.data
            : Array.isArray(parsed?.data?.content)
              ? parsed.data.content
              : [];

      return rows
        .filter((setting: { name?: string }) => String(setting.name || '').toLowerCase().includes('tag'))
        .flatMap((setting: { value?: string }) => String(setting.value || '').split(/[,;\n]/))
        .map((tag: string) => tag.trim())
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  const renderField = (field: EduQuestionFieldConfig<F>) => {
    const key = String(field.key);
    const value = formData[field.key];
    const options = getFieldOptions(field);

    if (key === 'tags') {
      const selectedTags = String(value || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      const tagOptions = [...new Set([...selectedTags, ...getStoredTagOptions()])];
      return (
        <FormControl fullWidth>
          <Typography variant="caption" sx={{ mb: 0.5 }}>
            {field.label}
          </Typography>
          <Autocomplete
            multiple
            freeSolo
            options={tagOptions}
            value={selectedTags}
            onChange={(_event, nextValue) => {
              const normalizedTags = nextValue
                .flatMap((tag) => String(tag).split(','))
                .map((tag) => tag.trim())
                .filter(Boolean);
              handleFieldChange(field, [...new Set(normalizedTags)].join(','));
            }}
            renderTags={(selected, getTagProps) => (
              selected.map((tag, index) => {
                const { key: tagKey, ...tagProps } = getTagProps({ index });
                return <Chip key={tagKey} label={tag} size="small" {...tagProps} />;
              })
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={selectedTags.length ? '' : 'tag1,tag2'}
              />
            )}
          />
        </FormControl>
      );
    }

    if (field.type === 'select' || options) {
      const selectedValue = field.multiple
        ? String(value || '').split(',').filter(Boolean)
        : String(value ?? '');
      return (
        <FormControl fullWidth required={field.required}>
          <Typography variant="caption" sx={{ mb: 0.5 }}>
            {field.label}
          </Typography>
          <Select
            multiple={field.multiple}
            value={selectedValue}
            onChange={(event) => {
              const nextValue = field.multiple
                ? (event.target.value as string[]).join(',')
                : event.target.value;
              handleFieldChange(field, nextValue);
            }}
          >
            {!field.required && !field.multiple && (
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            )}
            {(options || []).map((option: { value: string; label: string }) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (field.type === 'richText') {
      return (
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            {field.label}
          </Typography>
          <TiptapTextEditor
            value={String(value || '')}
            onChange={(html: string) => handleFieldChange(field, html)}
            placeholder={field.label}
            initialRows={field.rows || 0}
          />
        </Box>
      );
    }

    return (
      <TextField
        label={field.label}
        value={value ?? ''}
        onChange={(event) => {
          const nextValue = field.type === 'number'
            ? event.target.value === '' ? undefined : Number(event.target.value)
            : event.target.value;
          handleFieldChange(field, nextValue);
        }}
        fullWidth
        required={field.required}
        multiline={field.multiline}
        rows={field.rows}
        type={field.type === 'number' ? 'number' : 'text'}
      />
    );
  };

  const requiredMissing = fields.some((field) => field.required && !String(formData[field.key] ?? '').trim());
  const hasExplicitRows = fields.some((field) => field.row);

  const renderExplicitRows = () => {
    const rows = [...new Set(fields.map((field) => field.row).filter((row): row is number => typeof row === 'number'))].sort((a, b) => a - b);
    return rows.map((row) => {
      const rowFields = fields.filter((field) => field.row === row);
      return (
        <Box
          key={row}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: `repeat(${Math.min(rowFields.length, 3)}, minmax(0, 1fr))`,
            },
            gap: 2,
          }}
        >
          {rowFields.map((field) => (
            <Box key={String(field.key)}>{renderField(field)}</Box>
          ))}
        </Box>
      );
    });
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
          {hasExplicitRows ? renderExplicitRows() : (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                {fields.filter((field) => field.grid === 'full').map((field) => (
                  <Box key={String(field.key)}>{renderField(field)}</Box>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {fields.filter((field) => field.grid !== 'full' && field.grid !== 'third').map((field) => (
                  <Box key={String(field.key)}>{renderField(field)}</Box>
                ))}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                {fields.filter((field) => field.grid === 'third').map((field) => (
                  <Box key={String(field.key)}>{renderField(field)}</Box>
                ))}
              </Box>
            </>
          )}

          <FormControlLabel
            control={<Switch checked={Boolean(formData.isActive)} onChange={(event) => onFormChange('isActive', event.target.checked)} />}
            label="Active"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading || requiredMissing}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
