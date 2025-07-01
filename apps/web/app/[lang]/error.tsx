'use client';

import { Button } from '@/components/ui/button';

const ErrorBoundary = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(error.message);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="mt-2">
        <Button variant="secondary" onClick={() => reset()} className="mr-2">
          Try again
        </Button>
        <Button onClick={() => (window.location.href = '/')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
