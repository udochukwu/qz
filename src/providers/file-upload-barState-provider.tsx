import React, { useState } from 'react';

interface CopyTrackingProviderProps {
  children: React.ReactNode;
}

export interface IFileUploadBarState {
  isExpanded: boolean;
  toggle: (state: boolean) => void;
}

export const FileUploadContext = React.createContext<IFileUploadBarState>({
  isExpanded: false,
  toggle: () => {},
} as IFileUploadBarState);

export const FileUploadBarStateProvider: React.FC<CopyTrackingProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = (state: boolean) => setIsExpanded(state);

  return (
    <FileUploadContext.Provider value={{ isExpanded, toggle: toggleExpanded }}>{children}</FileUploadContext.Provider>
  );
};
