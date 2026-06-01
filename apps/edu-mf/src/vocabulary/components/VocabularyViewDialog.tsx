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
import type { Vocabulary } from '../types/vocabulary.types';

interface VocabularyViewDialogProps {
  open: boolean;
  vocabulary: Vocabulary;
  onClose: () => void;
}

const VocabularyViewDialog = ({ open, vocabulary, onClose }: VocabularyViewDialogProps) => {
  const { t } = useTranslation();

  const playAudio = () => {
    if (!vocabulary.phoneticUsAudioUrl) return;
    new Audio(vocabulary.phoneticUsAudioUrl).play().catch((error) => {
      console.error('Failed to play vocabulary audio', error);
    });
  };

  const playUkAudio = () => {
    if (!vocabulary.phoneticUkAudioUrl) return;
    new Audio(vocabulary.phoneticUkAudioUrl).play().catch((error) => {
      console.error('Failed to play vocabulary audio', error);
    });
  };

  const metadata = [
    [t('vocabulary.fields.partOfSpeech'), vocabulary.partOfSpeech],
    [t('vocabulary.fields.difficultyLevel'), vocabulary.difficultyLevel],
    [t('vocabulary.fields.channel'), vocabulary.channel],
    [t('vocabulary.fields.language'), vocabulary.lang],
    [t('vocabulary.fields.term'), vocabulary.term],
    [t('vocabulary.fields.week'), vocabulary.week],
    [t('vocabulary.fields.displayOrder'), vocabulary.displayOrder],
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('vocabulary.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {vocabulary.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Typography variant="body1" color="text.secondary">
                US {vocabulary.phoneticUs ? `/${vocabulary.phoneticUs}/` : '-'}
              </Typography>
              {vocabulary.phoneticUsAudioUrl && (
                <IconButton size="small" onClick={playAudio}>
                  <Volume2 size={18} />
                </IconButton>
              )}
              <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
                UK {vocabulary.phoneticUk ? `/${vocabulary.phoneticUk}/` : '-'}
              </Typography>
              {vocabulary.phoneticUkAudioUrl && (
                <IconButton size="small" onClick={playUkAudio}>
                  <Volume2 size={18} />
                </IconButton>
              )}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.translation')}</Typography>
              <Typography>{vocabulary.translation || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.synonyms')}</Typography>
              <Typography>{vocabulary.synonyms || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.easyMeaning')}</Typography>
              <Typography>{vocabulary.easyMeaning || '-'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.meaningClue')}</Typography>
              <Typography>{vocabulary.meaningClue || '-'}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.meaning')}</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{vocabulary.meaning || '-'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.sentenceOne')}</Typography>
            <Typography>{vocabulary.sentenceOne || '-'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.sentenceTwo')}</Typography>
            <Typography>{vocabulary.sentenceTwo || '-'}</Typography>
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
              <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.status')}</Typography>
              {createStatusChip(String(vocabulary.isActive), STATUS_MAPS.active)}
            </Box>
          </Box>

          {vocabulary.tags && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t('vocabulary.fields.tags')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {vocabulary.tags.split(',').filter(Boolean).map((tag) => (
                  <Chip key={tag.trim()} label={tag.trim()} size="small" />
                ))}
              </Box>
            </Box>
          )}

          {vocabulary.dictionaryUrl && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">{t('vocabulary.fields.dictionaryUrl')}</Typography>
              <Typography component="a" href={vocabulary.dictionaryUrl} target="_blank" rel="noopener noreferrer">
                {vocabulary.dictionaryUrl}
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

export default VocabularyViewDialog;
