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
  ].filter(([, value]) => hasViewValue(value));

  const contentFields = [
    [t('vocabulary.fields.translation'), vocabulary.translation, true],
    [t('vocabulary.fields.synonyms'), vocabulary.synonyms, false],
  ].filter(([, value]) => hasViewValue(value));

  const detailFields = [
    [t('vocabulary.fields.easyMeaning'), vocabulary.easyMeaning],
    [t('vocabulary.fields.meaningClue'), vocabulary.meaningClue],
    [t('vocabulary.fields.meaning'), vocabulary.meaning],
    [t('vocabulary.fields.sentenceOne'), vocabulary.sentenceOne],
    [t('vocabulary.fields.sentenceTwo'), vocabulary.sentenceTwo],
    [t('vocabulary.fields.additionalInfo'), vocabulary.additionalInfo],
  ].filter(([, value]) => hasViewValue(value));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('vocabulary.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {vocabulary.name}
            </Typography>
            {(hasViewValue(vocabulary.phoneticUs) || hasViewValue(vocabulary.phoneticUk) || vocabulary.phoneticUsAudioUrl || vocabulary.phoneticUkAudioUrl) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                {hasViewValue(vocabulary.phoneticUs) && (
                  <Typography variant="body1" color="text.secondary">
                    US /{vocabulary.phoneticUs}/
                  </Typography>
                )}
                {vocabulary.phoneticUsAudioUrl && (
                  <IconButton size="small" onClick={playAudio}>
                    <Volume2 size={18} />
                  </IconButton>
                )}
                {hasViewValue(vocabulary.phoneticUk) && (
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>
                    UK /{vocabulary.phoneticUk}/
                  </Typography>
                )}
                {vocabulary.phoneticUkAudioUrl && (
                  <IconButton size="small" onClick={playUkAudio}>
                    <Volume2 size={18} />
                  </IconButton>
                )}
              </Box>
              )}
          </Box>

          {contentFields.length > 0 && (
            <>
              <Divider />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {contentFields.map(([label, value, rich]) => (
                  <Box key={String(label)}>
                    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                    {rich ? <RichHtmlView value={value} /> : <Typography>{String(value)}</Typography>}
                  </Box>
                ))}
              </Box>
            </>
          )}

          {detailFields.map(([label, value]) => (
            <Box key={String(label)}>
              <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
              <RichHtmlView value={value} />
            </Box>
          ))}

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
