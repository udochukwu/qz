import { FileUploadContext } from '@/providers/file-upload-barState-provider';
import { useContext } from 'react';

export const useUploadBarState = () => useContext(FileUploadContext);
