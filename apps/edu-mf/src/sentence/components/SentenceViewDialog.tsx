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
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('sentence.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, whiteSpace: 'pre-wrap' }}>
              {sentence.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="body1" color="text.secondary">
                Phonetic: {sentence.phonetic ? `/${sentence.phonetic}/` : '-'}
              </Typography>
              {sentence.phoneticAudioUrl && (
                <IconButton size="small" onClick={playAudio}>
                  <Volume2 size={18} />
                </IconButton>
              )}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('sentence.fields.translation')}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{sentence.translation || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('sentence.fields.explanation')}</Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{sentence.explanation || '-'}</Typography>
            </Box>
          </Box>

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
