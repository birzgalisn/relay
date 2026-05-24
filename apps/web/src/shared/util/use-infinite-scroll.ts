import { useEffect, useEffectEvent } from 'react';

export type UseInfiniteScrollOptions = {
  hasMore: boolean;
  isLoading?: boolean;
  /** Distance from the bottom (px) before `onLoadMore` runs. */
  threshold?: number;
  onLoadMore: () => void;
};

function distanceFromDocumentBottom(): number {
  return document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
}

/** Listens to document scroll for bottom-proximity pagination. */
export function useInfiniteScroll({
  hasMore,
  isLoading = false,
  threshold = 200,
  onLoadMore,
}: UseInfiniteScrollOptions): void {
  const onScroll = useEffectEvent(() => {
    if (!hasMore || isLoading) {
      return;
    }

    if (distanceFromDocumentBottom() <= threshold) {
      onLoadMore();
    }
  });

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    onScroll();
  }, [hasMore, isLoading]);
}
