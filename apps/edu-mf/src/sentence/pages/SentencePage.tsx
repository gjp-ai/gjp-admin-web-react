import { Box, Collapse } from '@mui/material';
import React from 'react';
import DeleteSentenceDialog from '../components/DeleteSentenceDialog';
import SentenceDialog from '../components/SentenceDialog';
import SentencePageHeader from '../components/SentencePageHeader';
import SentenceSearchPanel from '../components/SentenceSearchPanel';
import SentenceTable from '../components/SentenceTable';
import SentenceTableSkeleton from '../components/SentenceTableSkeleton';
import SentenceViewDialog from '../components/SentenceViewDialog';
import { useSentences } from '../hooks/useSentences';
import { useSentenceDialog } from '../hooks/useSentenceDialog';
import { useSentenceSearch } from '../hooks/useSentenceSearch';
import '../i18n/translations';
import { sentenceService } from '../services/sentenceService';
import type { SentenceQueryParams } from '../services/sentenceService';
import type { Sentence, SentenceFormData, SentenceSearchFormData } from '../types/sentence.types';
import { getEmptySentenceFormData } from '../utils/getEmptySentenceFormData';

const SentencePage: React.FC = () => {
  const {
    allSentences,
    filteredSentences,
    setFilteredSentences,
    pagination,
    loading,
    pageSize,
    loadSentences,
    handlePageChange,
    handlePageSizeChange,
  } = useSentences();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useSentenceSearch(allSentences);
  const dialog = useSentenceDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Sentence | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const sentenceToFormData = (sentence: Sentence): SentenceFormData => ({
    name: sentence.name || '',
    phonetic: sentence.phonetic || '',
    phoneticAudioFilename: sentence.phoneticAudioFilename || '',
    phoneticAudioUploadMethod: 'file',
    phoneticAudioFile: null,
    translation: sentence.translation || '',
    explanation: sentence.explanation || '',
    difficultyLevel: sentence.difficultyLevel || 'easy',
    term: sentence.term ?? undefined,
    week: sentence.week ?? undefined,
    channel: sentence.channel || 'All',
    tags: sentence.tags || '',
    lang: sentence.lang || dialog.getCurrentLanguage(),
    displayOrder: sentence.displayOrder ?? 0,
    isActive: sentence.isActive ?? true,
  });

  const buildSearchParams = (formData: SentenceSearchFormData = searchFormData): SentenceQueryParams => {
    const params: SentenceQueryParams = {};
    if (formData.name?.trim()) params.name = formData.name.trim();
    if (formData.lang?.trim()) params.lang = formData.lang.trim();
    if (formData.tags?.trim()) params.tags = formData.tags.trim();
    if (formData.channel?.trim()) params.channel = formData.channel.trim();
    if (formData.difficultyLevel?.trim()) params.difficultyLevel = formData.difficultyLevel.trim();
    if (formData.term?.trim()) params.term = Number(formData.term);
    if (formData.week?.trim()) params.week = Number(formData.week);
    if (formData.isActive === 'true') params.isActive = true;
    if (formData.isActive === 'false') params.isActive = false;
    return params;
  };

  const handleSearchFieldChange = (field: keyof SentenceSearchFormData, value: string | null) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredSentences(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredSentences(allSentences);
  };

  const handleApiSearch = async () => {
    await loadSentences(buildSearchParams(), 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    loadSentences(buildSearchParams(), newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    loadSentences(buildSearchParams(), 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptySentenceFormData());
    dialog.setSelectedSentence(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      dialog.setLoading(true);
      if (dialog.actionType === 'create') {
        if (dialog.formData.phoneticAudioFile) {
          await sentenceService.createSentenceByUpload(dialog.formData);
        } else {
          const {
            phoneticAudioUploadMethod,
            phoneticAudioFile,
            ...payload
          } = dialog.formData;
          void phoneticAudioUploadMethod;
          void phoneticAudioFile;
          await sentenceService.createSentence(payload);
        }
      } else if (dialog.actionType === 'edit' && dialog.selectedSentence) {
        if (dialog.formData.phoneticAudioFile) {
          await sentenceService.updateSentenceWithFile(dialog.selectedSentence.id, dialog.formData);
        } else {
          const {
            phoneticAudioUploadMethod,
            phoneticAudioFile,
            ...payload
          } = dialog.formData;
          void phoneticAudioUploadMethod;
          void phoneticAudioFile;
          await sentenceService.updateSentence(dialog.selectedSentence.id, payload);
        }
      }
      await loadSentences(buildSearchParams());
      dialog.setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save sentence', error);
      throw error;
    } finally {
      dialog.setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <SentencePageHeader
        onCreateSentence={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <SentenceSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredSentences.length ? (
        <SentenceTableSkeleton />
      ) : (
        <SentenceTable
          sentences={filteredSentences}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onSentenceAction={(sentence, action) => {
            if (action === 'delete') {
              setDeleteTarget(sentence);
              return;
            }
            dialog.setSelectedSentence(sentence);
            dialog.setActionType(action);
            if (action === 'edit') {
              dialog.setFormData(sentenceToFormData(sentence));
            }
            dialog.setDialogOpen(true);
          }}
        />
      )}

      {(dialog.actionType === 'create' || dialog.actionType === 'edit') && (
        <SentenceDialog
          open={dialog.dialogOpen}
          title={dialog.actionType === 'create' ? 'Create Sentence' : 'Edit Sentence'}
          formData={dialog.formData}
          loading={dialog.loading}
          submitLabel={dialog.actionType === 'create' ? 'Create' : 'Save'}
          onClose={() => dialog.setDialogOpen(false)}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedSentence && (
        <SentenceViewDialog
          open={dialog.dialogOpen}
          sentence={dialog.selectedSentence}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      <DeleteSentenceDialog
        open={!!deleteTarget}
        sentence={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await sentenceService.deleteSentence(deleteTarget.id);
            await loadSentences(buildSearchParams());
          } catch (error) {
            console.error('Failed to delete sentence', error);
          } finally {
            setDeleting(false);
            setDeleteTarget(null);
          }
        }}
      />
    </Box>
  );
};

export default SentencePage;
