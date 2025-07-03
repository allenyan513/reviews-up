'use client';
import { api } from '../api';
import { useEffect, useState } from 'react';
import { ShowcaseEntity } from '@reviewsup/api/showcases';

export function useShowcase(showcaseId: string) {
  const [showcase, setShowcase] = useState<ShowcaseEntity>();
  const [error, setError] = useState<Error>();

  async function fetchShowcase() {
    try {
      const response = await api.showcase.getShowcaseByShortId(showcaseId);
      setShowcase(response);
    } catch (err) {
      setError(err as Error);
    }
  }

  useEffect(() => {
    if (!showcaseId) {
      setError(new Error('Showcase ID is required'));
      return;
    }
    fetchShowcase();
  }, [showcaseId]);

  return {
    showcase,
    error,
  };
}
