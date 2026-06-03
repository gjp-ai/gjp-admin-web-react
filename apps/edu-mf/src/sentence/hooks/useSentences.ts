import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaginatedResponse } from '../../../../shared-lib/src/api/api.types';
import { SENTENCE_CONSTANTS } from '../constants';
import { sentenceService } from '../services/sentenceService';
import type { SentenceQueryParams } from '../services/sentenceService';
import type { Sentence } from '../types/sentence.types';

export const useSentences = () => {
  const [allSentences, setAllSentences] = useState<Sentence[]>([]);
  const [filteredSentences, setFilteredSentences] = useState<Sentence[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Sentence> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(SENTENCE_CONSTANTS.DEFAULT_PAGE_SIZE);
  const hasInitiallyLoaded = useRef(false);

  const loadSentences = useCallback(async (params?: SentenceQueryParams, page?: number, size?: number) => {
    const actualPage = page ?? currentPage;
    const actualSize = size ?? pageSize;

    setLoading(true);
    try {
      const response = await sentenceService.getSentences({
        page: actualPage,
        size: actualSize,
        sort: SENTENCE_CONSTANTS.SORT_FIELD,
        direction: SENTENCE_CONSTANTS.SORT_DIRECTION,
        ...params,
      });
      const responseData = response.data as any;
      let sentences: Sentence[] = [];

      if (Array.isArray(responseData)) {
        sentences = responseData;
      } else if (responseData && 'content' in responseData) {
        sentences = responseData.content;
        setPagination(responseData);
      }

      setAllSentences(sentences);
      setFilteredSentences(sentences);
    } catch (err: any) {
      setError(err?.message || 'Failed to load sentences');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      loadSentences();
    }
  }, [loadSentences]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  return {
    allSentences,
    filteredSentences,
    setFilteredSentences,
    pagination,
    loading,
    error,
    pageSize,
    loadSentences,
    handlePageChange,
    handlePageSizeChange,
  };
};
