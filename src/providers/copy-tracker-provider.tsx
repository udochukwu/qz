import React from 'react';
import { useTrackCopy } from '@/hooks/use-track-copy';

interface CopyTrackingProviderProps {
  children: React.ReactNode;
}

export const CopyTrackingProvider: React.FC<CopyTrackingProviderProps> = ({ children }) => {
  useTrackCopy();

  return <>{children}</>;
};
