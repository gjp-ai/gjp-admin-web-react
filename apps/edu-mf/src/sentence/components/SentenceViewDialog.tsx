import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import RichHtmlView from '../../question-common/RichHtmlView';
import { hasViewValue } from '../../question-common/viewValue';
import { STATUS_MAPS } from '../constants';
import '../i18n/translations';
import type { Sentence } from '../types/sentence.types';

interface SentenceViewDialogProps {
  open: boolean;
  sentence: Sentence;
  onClose: () => void;
}

const SentenceViewDialog = ({ open, sentence, onClose }: SentenceViewDialogProps) => {
  const { t } = useTranslation();

  const playAudio = () => {
    if (!sentence.phoneticAudioUrl) return;
    new Audio(sentence.phoneticAudioUrl).play().catch((error) => {
      console.error('Failed to play sentence audio', error);
    });
  };

  const metadata = [
    [t('sentence.fields.difficultyLevel'), sentence.difficultyLevel],
    [t('sentence.fields.channel'), sentence.channel],
    [t('sentence.fields.language'), sentence.lang],
    [t('sentence.fields.term'), sentence.term],
    [t('sentence.fields.week'), sentence.week],
    [t('sentence.fields.displayOrder'), sentence.displayOrder],
  ].filter(([, value]) => hasViewValue(value));

  const contentFields = [
    [t('sentence.fields.translation'), sentence.translation],
    [t('sentence.fields.explanation'), sentence.explanation],
  ].filter(([, value]) => hasViewValue(value));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('sentence.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Box sx={{ '& > *': { typography: 'h5', fontWeight: 700 } }}>
              <RichHtmlView value={sentence.name} />
            </Box>
            {(hasViewValue(sentence.phonetic) || sentence.phoneticAudioUrl) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                {hasViewValue(sentence.phonetic) && (
                  <Box sx={{ color: 'text.secondary', '& > *': { typography: 'body1' } }}>
                    <RichHtmlView value={`/${sentence.phonetic}/`} />
                  </Box>
                )}
                {sentence.phoneticAudioUrl && (
                  <IconButton size="small" onClick={playAudio}>
                    <Volume2 size={18} />
                  </IconButton>
                )}
              </Box>
              )}
          </Box>

          {contentFields.length > 0 && (
            <>
              <Divider />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                {contentFields.map(([label, value]) => (
                  <Box key={String(label)}>
                    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                    <RichHtmlView value={value} />
                  </Box>
                ))}
              </Box>
            </>
          )}

          <Divider />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 2 }}>
            {metadata.map(([label, value]) => (
              <Box key={String(label)}>
                <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                <Typography variant="body2">{value ?? '-'}</Typography>
              </Box>
            ))}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('sentence.fields.status')}</Typography>
              {createStatusChip(String(sentence.isActive), STATUS_MAPS.active)}
            </Box>
          </Box>

          {sentence.tags && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t('sentence.fields.tags')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {sentence.tags.split(',').filter(Boolean).map((tag) => (
                  <Chip key={tag.trim()} label={tag.trim()} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SentenceViewDialog;
