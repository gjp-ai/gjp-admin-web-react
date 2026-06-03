import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Sentence } from '../types/sentence.types';

interface DeleteSentenceDialogProps {
  open: boolean;
  sentence?: Sentence | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteSentenceDialog = ({
  open,
  sentence,
  loading,
  onClose,
  onConfirm,
}: DeleteSentenceDialogProps) => {
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
      <DialogTitle>{t('sentence.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('sentence.messages.deleteConfirm')} "{sentence?.name}"?</Typography>
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

export default DeleteSentenceDialog;
