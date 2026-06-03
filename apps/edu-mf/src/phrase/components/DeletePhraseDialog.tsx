import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { Phrase } from '../types/phrase.types';

interface DeletePhraseDialogProps {
  open: boolean;
  phrase?: Phrase | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeletePhraseDialog = ({
  open,
  phrase,
  loading,
  onClose,
  onConfirm,
}: DeletePhraseDialogProps) => {
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
      <DialogTitle>{t('phrase.delete')}</DialogTitle>
      <DialogContent>
        <Typography>{t('phrase.messages.deleteConfirm')} "{phrase?.name}"?</Typography>
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

export default DeletePhraseDialog;
