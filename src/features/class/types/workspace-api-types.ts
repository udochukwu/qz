import { WorkspaceClass } from '@/types';

export interface CreateWorkspacePost {
  class_name: string | undefined;
  class_files: {
    workspace_file_id: string;
  }[];
}
export interface RenameWorkspacePost {
  workspace_id: string;
  new_class_name: string;
}
export type RenameWorkspaceResponse = {
  message: string;
};

export type CreateWorkspaceResponse = {
  message: 'Workspace created successfully.';
  workspace_id: string;
};
export type ShareWorkspacePost = {
  workspace_id: string;
};
export type ShareWorkspaceResponse = {
  message: string;
  share_id: string;
};

export type AddChatToWorkspacePost = {
  chat_id: string;
  workspace_id: string;
};
export type AddChatToWorkspaceResponse = {
  message: 'Chat added to class successfully.';
  success: true;
};
export type GetWorkspacesResponse = {
  classes: WorkspaceClass[];
};
