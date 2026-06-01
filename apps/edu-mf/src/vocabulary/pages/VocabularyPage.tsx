import { Box, Collapse } from '@mui/material';
import React from 'react';
import DeleteVocabularyDialog from '../components/DeleteVocabularyDialog';
import VocabularyDialog from '../components/VocabularyDialog';
import VocabularyPageHeader from '../components/VocabularyPageHeader';
import VocabularySearchPanel from '../components/VocabularySearchPanel';
import VocabularyTable from '../components/VocabularyTable';
import VocabularyTableSkeleton from '../components/VocabularyTableSkeleton';
import VocabularyViewDialog from '../components/VocabularyViewDialog';
import { useVocabularies } from '../hooks/useVocabularies';
import { useVocabularyDialog } from '../hooks/useVocabularyDialog';
import { useVocabularySearch } from '../hooks/useVocabularySearch';
import '../i18n/translations';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyQueryParams } from '../services/vocabularyService';
import type { Vocabulary, VocabularyFormData, VocabularySearchFormData } from '../types/vocabulary.types';
import { getEmptyVocabularyFormData } from '../utils/getEmptyVocabularyFormData';

const VocabularyPage: React.FC = () => {
  const {
    allVocabularies,
    filteredVocabularies,
    setFilteredVocabularies,
    pagination,
    loading,
    pageSize,
    loadVocabularies,
    handlePageChange,
    handlePageSizeChange,
  } = useVocabularies();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useVocabularySearch(allVocabularies);
  const dialog = useVocabularyDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Vocabulary | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const vocabularyToFormData = (vocabulary: Vocabulary): VocabularyFormData => ({
    name: vocabulary.name || '',
    phoneticUs: vocabulary.phoneticUs || '',
    phoneticUsAudioFilename: vocabulary.phoneticUsAudioFilename || '',
    phoneticUsAudioOriginalUrl: vocabulary.phoneticUsAudioOriginalUrl || '',
    phoneticUsAudioUploadMethod: vocabulary.phoneticUsAudioOriginalUrl ? 'url' : 'file',
    phoneticUsAudioFile: null,
    phoneticUk: vocabulary.phoneticUk || '',
    phoneticUkAudioFilename: vocabulary.phoneticUkAudioFilename || '',
    phoneticUkAudioOriginalUrl: vocabulary.phoneticUkAudioOriginalUrl || '',
    phoneticUkAudioUploadMethod: vocabulary.phoneticUkAudioOriginalUrl ? 'url' : 'file',
    phoneticUkAudioFile: null,
    partOfSpeech: vocabulary.partOfSpeech || '',
    synonyms: vocabulary.synonyms || '',
    translation: vocabulary.translation || '',
    meaningClue: vocabulary.meaningClue || '',
    meaning: vocabulary.meaning || '',
    easyMeaning: vocabulary.easyMeaning || '',
    sentenceOne: vocabulary.sentenceOne || '',
    sentenceTwo: vocabulary.sentenceTwo || '',
    difficultyLevel: vocabulary.difficultyLevel || 'easy',
    dictionaryUrl: vocabulary.dictionaryUrl || '',
    additionalInfo: vocabulary.additionalInfo || '',
    term: vocabulary.term ?? undefined,
    week: vocabulary.week ?? undefined,
    channel: vocabulary.channel || 'All',
    tags: vocabulary.tags || '',
    lang: vocabulary.lang || dialog.getCurrentLanguage(),
    displayOrder: vocabulary.displayOrder ?? 0,
    isActive: vocabulary.isActive ?? true,
  });

  const buildSearchParams = (formData: VocabularySearchFormData = searchFormData): VocabularyQueryParams => {
    const params: VocabularyQueryParams = {};
    if (formData.name?.trim()) params.name = formData.name.trim();
    if (formData.lang?.trim()) params.lang = formData.lang.trim();
    if (formData.tags?.trim()) params.tags = formData.tags.trim();
    if (formData.channel?.trim()) params.channel = formData.channel.trim();
    if (formData.difficultyLevel?.trim()) params.difficultyLevel = formData.difficultyLevel.trim();
    if (formData.partOfSpeech?.trim()) params.partOfSpeech = formData.partOfSpeech.trim();
    if (formData.term?.trim()) params.term = Number(formData.term);
    if (formData.week?.trim()) params.week = Number(formData.week);
    if (formData.isActive === 'true') params.isActive = true;
    if (formData.isActive === 'false') params.isActive = false;
    return params;
  };

  const handleSearchFieldChange = (field: keyof VocabularySearchFormData, value: string | null) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredVocabularies(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredVocabularies(allVocabularies);
  };

  const handleApiSearch = async () => {
    await loadVocabularies(buildSearchParams(), 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    loadVocabularies(buildSearchParams(), newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    loadVocabularies(buildSearchParams(), 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyVocabularyFormData());
    dialog.setSelectedVocabulary(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      dialog.setLoading(true);
      if (dialog.actionType === 'create') {
        if (dialog.formData.phoneticUsAudioFile || dialog.formData.phoneticUkAudioFile) {
          await vocabularyService.createVocabularyByUpload(dialog.formData);
        } else {
          const {
            phoneticUsAudioUploadMethod,
            phoneticUsAudioFile,
            phoneticUkAudioUploadMethod,
            phoneticUkAudioFile,
            ...payload
          } = dialog.formData;
          void phoneticUsAudioUploadMethod;
          void phoneticUsAudioFile;
          void phoneticUkAudioUploadMethod;
          void phoneticUkAudioFile;
          await vocabularyService.createVocabulary(payload);
        }
      } else if (dialog.actionType === 'edit' && dialog.selectedVocabulary) {
        if (dialog.formData.phoneticUsAudioFile || dialog.formData.phoneticUkAudioFile) {
          await vocabularyService.updateVocabularyWithFile(dialog.selectedVocabulary.id, dialog.formData);
        } else {
          const {
            phoneticUsAudioUploadMethod,
            phoneticUsAudioFile,
            phoneticUkAudioUploadMethod,
            phoneticUkAudioFile,
            ...payload
          } = dialog.formData;
          void phoneticUsAudioUploadMethod;
          void phoneticUsAudioFile;
          void phoneticUkAudioUploadMethod;
          void phoneticUkAudioFile;
          await vocabularyService.updateVocabulary(dialog.selectedVocabulary.id, payload);
        }
      }
      await loadVocabularies(buildSearchParams());
      dialog.setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save vocabulary', error);
      throw error;
    } finally {
      dialog.setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <VocabularyPageHeader
        onCreateVocabulary={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <VocabularySearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredVocabularies.length ? (
        <VocabularyTableSkeleton />
      ) : (
        <VocabularyTable
          vocabularies={filteredVocabularies}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onVocabularyAction={(vocabulary, action) => {
            if (action === 'delete') {
              setDeleteTarget(vocabulary);
              return;
            }
            dialog.setSelectedVocabulary(vocabulary);
            dialog.setActionType(action);
            if (action === 'edit') {
              dialog.setFormData(vocabularyToFormData(vocabulary));
            }
            dialog.setDialogOpen(true);
          }}
        />
      )}

      {(dialog.actionType === 'create' || dialog.actionType === 'edit') && (
        <VocabularyDialog
          open={dialog.dialogOpen}
          title={dialog.actionType === 'create' ? 'Create Vocabulary' : 'Edit Vocabulary'}
          formData={dialog.formData}
          loading={dialog.loading}
          submitLabel={dialog.actionType === 'create' ? 'Create' : 'Save'}
          onClose={() => dialog.setDialogOpen(false)}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedVocabulary && (
        <VocabularyViewDialog
          open={dialog.dialogOpen}
          vocabulary={dialog.selectedVocabulary}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      <DeleteVocabularyDialog
        open={!!deleteTarget}
        vocabulary={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await vocabularyService.deleteVocabulary(deleteTarget.id);
            await loadVocabularies(buildSearchParams());
          } catch (error) {
            console.error('Failed to delete vocabulary', error);
          } finally {
            setDeleting(false);
            setDeleteTarget(null);
          }
        }}
      />
    </Box>
  );
};

export default VocabularyPage;
