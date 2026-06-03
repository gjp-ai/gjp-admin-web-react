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
import type { Phrase } from '../types/phrase.types';

interface PhraseViewDialogProps {
  open: boolean;
  phrase: Phrase;
  onClose: () => void;
}

const PhraseViewDialog = ({ open, phrase, onClose }: PhraseViewDialogProps) => {
  const { t } = useTranslation();

  const playAudio = () => {
    if (!phrase.phoneticAudioUrl) return;
    new Audio(phrase.phoneticAudioUrl).play().catch((error) => {
      console.error('Failed to play phrase audio', error);
    });
  };

  const metadata = [
    [t('phrase.fields.difficultyLevel'), phrase.difficultyLevel],
    [t('phrase.fields.channel'), phrase.channel],
    [t('phrase.fields.language'), phrase.lang],
    [t('phrase.fields.term'), phrase.term],
    [t('phrase.fields.week'), phrase.week],
    [t('phrase.fields.displayOrder'), phrase.displayOrder],
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('phrase.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {phrase.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="body1" color="text.secondary">
                Phonetic: {phrase.phonetic ? `/${phrase.phonetic}/` : '-'}
              </Typography>
              {phrase.phoneticAudioUrl && (
                <IconButton size="small" onClick={playAudio}>
                  <Volume2 size={18} />
                </IconButton>
              )}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.translation')}</Typography>
              <Typography>{phrase.translation || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.synonyms')}</Typography>
              <Typography>{phrase.synonyms || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.easyMeaning')}</Typography>
              <Typography>{phrase.easyMeaning || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.meaningClue')}</Typography>
              <Typography>{phrase.meaningClue || '-'}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.meaning')}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{phrase.meaning || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.sentenceOne')}</Typography>
            <Typography>{phrase.sentenceOne || '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.sentenceTwo')}</Typography>
            <Typography>{phrase.sentenceTwo || '-'}</Typography>
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
              <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.status')}</Typography>
              {createStatusChip(String(phrase.isActive), STATUS_MAPS.active)}
            </Box>
          </Box>

          {phrase.tags && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t('phrase.fields.tags')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {phrase.tags.split(',').filter(Boolean).map((tag) => (
                  <Chip key={tag.trim()} label={tag.trim()} size="small" />
                ))}
              </Box>
            </Box>
          )}

          {phrase.dictionaryUrl && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('phrase.fields.dictionaryUrl')}</Typography>
              <Typography component="a" href={phrase.dictionaryUrl} target="_blank" rel="noopener noreferrer">
                {phrase.dictionaryUrl}
              </Typography>
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

export default PhraseViewDialog;
