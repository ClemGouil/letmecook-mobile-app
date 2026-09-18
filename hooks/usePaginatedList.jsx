import { useCallback, useRef, useState } from 'react';

export function usePaginatedList({
  loadPage,
  pageSize = 10,
}) {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);
  const refreshingRef = useRef(false);
  const loadingMoreRef = useRef(false);

  const loadInitial = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const result = await loadPage(0, pageSize);

      setItems(result);
      setOffset(result.length);
      setHasMore(result.length === pageSize);

      return result;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [loadPage, pageSize]);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;

    refreshingRef.current = true;
    setRefreshing(true);

    try {
      const result = await loadPage(0, pageSize);

      setItems(result);
      setOffset(result.length);
      setHasMore(result.length === pageSize);

      return result;
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  }, [loadPage, pageSize]);

  const loadMore = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      loadingRef.current ||
      !hasMore
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const result = await loadPage(offset, pageSize);

      setItems(prev => [...prev, ...result]);
      setOffset(prev => prev + result.length);
      setHasMore(result.length === pageSize);

      return result;
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [loadPage, pageSize, offset, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
  }, []);

  return {
    items,
    offset,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    setItems,
    loadInitial,
    refresh,
    loadMore,
    reset,
  };
}