import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Vocabulary } from '../types/vocabulary.types';

interface DeleteVocabularyDialogProps {
  open: boolean;
  vocabulary?: Vocabulary | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteVocabularyDialog = ({
  open,
  vocabulary,
  loading,
  onClose,
  onConfirm,
}: DeleteVocabularyDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('vocabulary.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('vocabulary.messages.deleteConfirm')} "{vocabulary?.name}"?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" disabled={loading}>
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteVocabularyDialog;
