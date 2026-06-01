import { Box, Button, Typography, useTheme } from '@mui/material';
import { ChevronDown, ChevronUp, Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';

interface VocabularyPageHeaderProps {
  onCreateVocabulary: () => void;
  searchPanelOpen: boolean;
  onToggleSearchPanel: () => void;
}

const VocabularyPageHeader = ({
  onCreateVocabulary,
  searchPanelOpen,
  onToggleSearchPanel,
}: VocabularyPageHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)'
                  : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: theme.palette.mode === 'dark' ? 'transparent' : 'inherit',
            }}
          >
            {t('vocabulary.pageTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('vocabulary.subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<Search size={18} />}
            endIcon={searchPanelOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            onClick={onToggleSearchPanel}
            sx={{ height: 40, textTransform: 'none', fontWeight: 600 }}
          >
            {searchPanelOpen ? t('common.hideSearch') : t('common.showSearch')}
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={onCreateVocabulary}
            sx={{ height: 40, textTransform: 'none', fontWeight: 600 }}
          >
            {t('vocabulary.create')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VocabularyPageHeader;
