import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { PHRASE_CONSTANTS } from '../constants';
import { phraseService } from '../services/phraseService';
import type { PhraseQueryParams } from '../services/phraseService';
import type { Phrase } from '../types/phrase.types';

export const usePhrases = () => {
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Phrase> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(PHRASE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadPhrases = useCallback(async (params?: PhraseQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const response = await phraseService.getPhrases({
        page: actualPage,
        size: actualSize,
        sort: PHRASE_CONSTANTS.SORT_FIELD,
        direction: PHRASE_CONSTANTS.SORT_DIRECTION,
        ...params,
      });
      const responseData = response.data as any;
      let phrases: Phrase[] = [];

      if (Array.isArray(responseData)) {
        phrases = responseData;
      } else if (responseData && 'content' in responseData) {
        phrases = responseData.content;
        setPagination(responseData);
      }

      setAllPhrases(phrases);
      setFilteredPhrases(phrases);
    } catch (err: any) {
      setError(err?.message || 'Failed to load phrases');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadPhrases();
    }
  }, [loadPhrases]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  return {
    allPhrases,
    filteredPhrases,
    setFilteredPhrases,
    pagination,
    loading,
    error,
    pageSize,
    loadPhrases,
    handlePageChange,
    handlePageSizeChange,
  };
};
