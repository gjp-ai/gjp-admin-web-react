import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Copy, Trash2, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../../../shared-lib/src/api/api-client';
import type { ApiResponse } from '../../../shared-lib/src/api/api.types';
import type { QuestionImage } from './types';

type QuestionImageReferenceKey =
  | 'multipleChoiceQuestionId'
  | 'fillBlankQuestionId'
  | 'freeTextQuestionId'
  | 'trueFalseQuestionId';

interface QuestionImageSectionProps {
  questionId: string;
  referenceKey: QuestionImageReferenceKey;
  lang: string;
}

const QuestionImageSection = ({ questionId, referenceKey, lang }: QuestionImageSectionProps) => {
  const [images, setImages] = useState<QuestionImage[]>([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileFilename, setUploadFileFilename] = useState('');
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadImages = useCallback(async () => {
    const response = await apiClient.get('/v1/edu-question-images', {
      params: { [referenceKey]: questionId, isActive: true },
    }) as ApiResponse<QuestionImage[]>;
    setImages(response.data || []);
  }, [questionId, referenceKey]);

  useEffect(() => {
    loadImages().catch((error) => {
      console.error('Failed to load question images', error);
    });
  }, [loadImages]);

  const handleUploadByUrl = async () => {
    if (!uploadUrl.trim() || !uploadFilename.trim()) return;
    try {
      setSaving(true);
      await apiClient.post('/v1/edu-question-images', {
        [referenceKey]: questionId,
        originalUrl: uploadUrl.trim(),
        filename: uploadFilename.trim(),
        lang,
      });
      setUploadUrl('');
      setUploadFilename('');
      await loadImages();
    } finally {
      setSaving(false);
    }
  };

  const handleUploadByFile = async () => {
    if (!uploadFile || !uploadFileFilename.trim()) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append(referenceKey, questionId);
      formData.append('filename', uploadFileFilename.trim());
      formData.append('file', uploadFile);
      formData.append('lang', lang);
      await apiClient.post('/v1/edu-question-images', formData);
      setUploadFile(null);
      setUploadFileFilename('');
      await loadImages();
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;
    try {
      setSaving(true);
      await apiClient.delete(`/v1/edu-question-images/${imageToDelete}/permanent`);
      await loadImages();
    } finally {
      setSaving(false);
      setImageToDelete(null);
    }
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadFile(file);
    if (file) {
      setUploadFileFilename(file.name);
    }
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        Question Images
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2, mb: 2 }}>
        {images.map((image) => (
          <Card key={image.id} sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="100"
              image={image.fileUrl || image.originalUrl || ''}
              alt={image.filename}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography variant="caption" noWrap display="block">
                {image.filename}
              </Typography>
            </CardContent>
            <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.8)', display: 'flex' }}>
              {image.fileUrl && (
                <Tooltip title="Copy URL">
                  <IconButton
                    size="small"
                    onClick={() => navigator.clipboard.writeText(image.fileUrl || '')}
                  >
                    <Copy size={14} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete Image">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setImageToDelete(image.id)}
                >
                  <Trash2 size={14} />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        ))}
        {!images.length && (
          <Typography variant="body2" color="text.secondary">
            No question images.
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" gutterBottom>
        Upload by URL
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 220px auto' }, gap: 1, mb: 2 }}>
        <TextField
          label="Original URL"
          value={uploadUrl}
          onChange={(event) => setUploadUrl(event.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Filename"
          value={uploadFilename}
          onChange={(event) => setUploadFilename(event.target.value)}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={handleUploadByUrl}
          disabled={!uploadUrl || !uploadFilename || saving}
        >
          Upload
        </Button>
      </Box>

      <Typography variant="subtitle2" gutterBottom>
        Upload by File
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto' }, gap: 1, alignItems: 'center' }}>
        <Button component="label" variant="outlined" startIcon={<Upload size={16} />}>
          Choose File
          <input hidden type="file" accept="image/*" onChange={handleImageFileChange} />
        </Button>
        <TextField
          label="Filename"
          value={uploadFileFilename}
          onChange={(event) => setUploadFileFilename(event.target.value)}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={handleUploadByFile}
          disabled={!uploadFile || !uploadFileFilename || saving}
        >
          Upload
        </Button>
      </Box>

      <Dialog open={!!imageToDelete} onClose={() => setImageToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageToDelete(null)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteImage} color="error" disabled={saving}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionImageSection;
