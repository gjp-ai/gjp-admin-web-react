import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import type { EduQuestionBase } from './types';

interface DeleteQuestionDialogProps<T extends EduQuestionBase> {
  open: boolean;
  entityName: string;
  question?: T | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteQuestionDialog = <T extends EduQuestionBase>({
  open,
  entityName,
  question,
  loading,
  onClose,
  onConfirm,
}: DeleteQuestionDialogProps<T>) => (
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
    <DialogTitle>Delete {entityName}</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete "{question?.question}"?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={loading}>Cancel</Button>
      <Button onClick={onConfirm} color="error" disabled={loading}>Delete</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteQuestionDialog;
