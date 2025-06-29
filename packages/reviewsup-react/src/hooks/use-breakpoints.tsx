'use client';

import { useEffect, useState } from 'react';

function getColumnsFromWidth(
  width: number,
  breakpoints: Record<string, number>,
) {
  if (width < 640) return breakpoints.sm ?? 1;
  if (width < 768) return breakpoints.md ?? 2;
  return breakpoints.lg ?? 3;
}

export function useBreakpoints(_breakpoints: any) {
  const breakpoints = _breakpoints || {
    sm: 1,
    md: 2,
    lg: 3,
  };

  const [columns, setColumns] = useState(breakpoints.lg);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setColumns(getColumnsFromWidth(width, breakpoints));
    };
    updateColumns(); // run once at mount
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [breakpoints]);

  return columns;
}
