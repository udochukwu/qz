import { CRUDFilesPost } from '../types/api-types';

export function getCRUDFilesID(payload: CRUDFilesPost): string | null {
  const filesWorkspaceId: string | undefined | null = payload?.chat_id ?? payload.workspace_id;
  if (filesWorkspaceId != null) {
    return filesWorkspaceId;
  }
  const isGlobalContext = !payload || Object.values(payload).every(value => value === undefined || value === null);
  if (isGlobalContext) {
    return null;
  }

  throw new Error('Must pass either a chat ID or a workspace ID for non-global contexts');
}
