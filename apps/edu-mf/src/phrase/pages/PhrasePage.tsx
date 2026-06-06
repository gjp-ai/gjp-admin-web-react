import { Box, Collapse } from '@mui/material';
import React from 'react';
import DeletePhraseDialog from '../components/DeletePhraseDialog';
import PhraseDialog from '../components/PhraseDialog';
import PhrasePageHeader from '../components/PhrasePageHeader';
import PhraseSearchPanel from '../components/PhraseSearchPanel';
import PhraseTable from '../components/PhraseTable';
import PhraseTableSkeleton from '../components/PhraseTableSkeleton';
import PhraseViewDialog from '../components/PhraseViewDialog';
import { usePhrases } from '../hooks/usePhrases';
import { usePhraseDialog } from '../hooks/usePhraseDialog';
import { usePhraseSearch } from '../hooks/usePhraseSearch';
import '../i18n/translations';
import { phraseService } from '../services/phraseService';
import type { PhraseQueryParams } from '../services/phraseService';
import type { Phrase, PhraseFormData, PhraseSearchFormData } from '../types/phrase.types';
import { getEmptyPhraseFormData } from '../utils/getEmptyPhraseFormData';

const PhrasePage: React.FC = () => {
  const {
    allPhrases,
    filteredPhrases,
    setFilteredPhrases,
    pagination,
    loading,
    pageSize,
    loadPhrases,
    handlePageChange,
    handlePageSizeChange,
  } = usePhrases();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = usePhraseSearch(allPhrases);
  const dialog = usePhraseDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Phrase | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const phraseToFormData = (phrase: Phrase): PhraseFormData => ({
    name: phrase.name || '',
    phonetic: phrase.phonetic || '',
    phoneticAudioFilename: phrase.phoneticAudioFilename || '',
    phoneticAudioOriginalUrl: phrase.phoneticAudioOriginalUrl || '',
    phoneticAudioUploadMethod: phrase.phoneticAudioOriginalUrl ? 'url' : 'file',
    phoneticAudioFile: null,
    synonyms: phrase.synonyms || '',
    translation: phrase.translation || '',
    meaningClue: phrase.meaningClue || '',
    meaning: phrase.meaning || '',
    easyMeaning: phrase.easyMeaning || '',
    sentenceOne: phrase.sentenceOne || '',
    sentenceTwo: phrase.sentenceTwo || '',
    difficultyLevel: phrase.difficultyLevel || 'easy',
    dictionaryUrl: phrase.dictionaryUrl || '',
    term: phrase.term ?? undefined,
    week: phrase.week ?? undefined,
    channel: phrase.channel || 'All',
    tags: phrase.tags || '',
    lang: phrase.lang || dialog.getCurrentLanguage(),
    displayOrder: phrase.displayOrder ?? 999,
    isActive: phrase.isActive ?? true,
  });

  const buildSearchParams = (formData: PhraseSearchFormData = searchFormData): PhraseQueryParams => {
    const params: PhraseQueryParams = {};
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

  const handleSearchFieldChange = (field: keyof PhraseSearchFormData, value: string | null) => {
    const nextFormData = { ...searchFormData, [field]: value };
    if (field === 'channel' || field === 'lang') {
      nextFormData.difficultyLevel = '';
      nextFormData.tags = '';
    }
    setFilteredPhrases(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredPhrases(allPhrases);
  };

  const handleApiSearch = async () => {
    await loadPhrases(buildSearchParams(), 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    loadPhrases(buildSearchParams(), newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    loadPhrases(buildSearchParams(), 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyPhraseFormData());
    dialog.setSelectedPhrase(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      dialog.setLoading(true);
      if (dialog.actionType === 'create') {
        if (dialog.formData.phoneticAudioFile) {
          await phraseService.createPhraseByUpload(dialog.formData);
        } else {
          const {
            phoneticAudioUploadMethod,
            phoneticAudioFile,
            ...payload
          } = dialog.formData;
          void phoneticAudioUploadMethod;
          void phoneticAudioFile;
          await phraseService.createPhrase(payload);
        }
      } else if (dialog.actionType === 'edit' && dialog.selectedPhrase) {
        if (dialog.formData.phoneticAudioFile) {
          await phraseService.updatePhraseWithFile(dialog.selectedPhrase.id, dialog.formData);
        } else {
          const {
            phoneticAudioUploadMethod,
            phoneticAudioFile,
            ...payload
          } = dialog.formData;
          void phoneticAudioUploadMethod;
          void phoneticAudioFile;
          await phraseService.updatePhrase(dialog.selectedPhrase.id, payload);
        }
      }
      await loadPhrases(buildSearchParams());
      dialog.setDialogOpen(false);
    } catch (error) {
      console.error('Failed to save phrase', error);
      throw error;
    } finally {
      dialog.setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <PhrasePageHeader
        onCreatePhrase={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <PhraseSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredPhrases.length ? (
        <PhraseTableSkeleton />
      ) : (
        <PhraseTable
          phrases={filteredPhrases}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onPhraseAction={(phrase, action) => {
            if (action === 'delete') {
              setDeleteTarget(phrase);
              return;
            }
            dialog.setSelectedPhrase(phrase);
            dialog.setActionType(action);
            if (action === 'edit') {
              dialog.setFormData(phraseToFormData(phrase));
            }
            dialog.setDialogOpen(true);
          }}
        />
      )}

      {(dialog.actionType === 'create' || dialog.actionType === 'edit') && (
        <PhraseDialog
          open={dialog.dialogOpen}
          title={dialog.actionType === 'create' ? 'Create Phrase' : 'Edit Phrase'}
          formData={dialog.formData}
          loading={dialog.loading}
          submitLabel={dialog.actionType === 'create' ? 'Create' : 'Save'}
          onClose={() => dialog.setDialogOpen(false)}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onSubmit={handleSubmit}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedPhrase && (
        <PhraseViewDialog
          open={dialog.dialogOpen}
          phrase={dialog.selectedPhrase}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      <DeletePhraseDialog
        open={!!deleteTarget}
        phrase={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await phraseService.deletePhrase(deleteTarget.id);
            await loadPhrases(buildSearchParams());
          } catch (error) {
            console.error('Failed to delete phrase', error);
          } finally {
            setDeleting(false);
            setDeleteTarget(null);
          }
        }}
      />
    </Box>
  );
};

export default PhrasePage;
