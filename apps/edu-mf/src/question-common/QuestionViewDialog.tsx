import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { createStatusChip } from '../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from './constants';
import type { EduQuestionBase, EduQuestionFieldConfig, EduQuestionFormData } from './types';

interface QuestionViewDialogProps<T extends EduQuestionBase, F extends EduQuestionFormData> {
  open: boolean;
  entityName: string;
  question: T;
  fields: EduQuestionFieldConfig<F>[];
  onClose: () => void;
}

const QuestionViewDialog = <T extends EduQuestionBase, F extends EduQuestionFormData>({
  open,
  entityName,
  question,
  fields,
  onClose,
}: QuestionViewDialogProps<T, F>) => {
  const metadata = [
    ['Difficulty', question.difficultyLevel],
    ['Grade', question.gradeLevel],
    ['Subject', question.subject],
    ['Topic', question.topic],
    ['Channel', question.channel],
    ['Language', question.lang],
    ['Term', question.term],
    ['Week', question.week],
    ['Order', question.displayOrder],
    ['Success', question.successCount],
    ['Fail', question.failCount],
  ];

  const visibleFields = fields.filter((field) => ![
    'question',
    'answer',
    'explanation',
    'difficultyLevel',
    'gradeLevel',
    'subject',
    'topic',
    'channel',
    'lang',
    'term',
    'week',
    'displayOrder',
    'tags',
  ].includes(String(field.key)));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>View {entityName}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, whiteSpace: 'pre-wrap' }}>
              {question.question}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Answer: {question.answer || '-'}
            </Typography>
          </Box>

          {visibleFields.length > 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
              {visibleFields.map((field) => (
                <Box key={String(field.key)}>
                  <Typography variant="subtitle2" color="text.secondary">{field.label}</Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{String(question[String(field.key)] ?? '-')}</Typography>
                </Box>
              ))}
            </Box>
          )}

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Explanation</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{question.explanation || '-'}</Typography>
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
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              {createStatusChip(String(question.isActive), STATUS_MAPS.active)}
            </Box>
          </Box>

          {question.tags && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {question.tags.split(',').filter(Boolean).map((tag) => (
                  <Chip key={tag.trim()} label={tag.trim()} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionViewDialog;
