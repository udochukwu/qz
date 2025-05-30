import { ReactNode } from 'react';
import { WorkspaceFile } from '../types/types';

export interface FileManagerColumnExtension {
  header: ReactNode;
  contentGenerator: FileManagerColumnExtensionRowContent;
}

export type FileManagerColumnExtensionRowContent = (workspaceFile: WorkspaceFile) => ReactNode;
