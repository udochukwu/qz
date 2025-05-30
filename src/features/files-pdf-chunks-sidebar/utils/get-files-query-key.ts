import { CRUDFilesPost } from '../types/api-types';
import { getCRUDFilesID } from './get-crud-files-id';

export function getFilesQueryKey(crudPayload?: CRUDFilesPost, excludeWorkspace?: CRUDFilesPost): (string | null)[] {
  if (excludeWorkspace) {
    const excludeId = getCRUDFilesID(excludeWorkspace);
    if (excludeId === null) {
      throw new Error('Cannot exclude files based on global context.');
    }
    return ['files-exclude', excludeId];
  }

  const id = crudPayload ? getCRUDFilesID(crudPayload) : null;
  if (id === null) {
    return ['files'];
  }

  return ['files', id];
}
