// src/hooks/use-workspace.tsx
import { useMutation, useQueryClient } from 'react-query';
import axiosClient from '@/lib/axios';

// Define an interface for the payload
interface IntegrationPayload {
  integration_id?: string;
  lms_type?: string;
  integration_url?: string;
  integration_api_key: string;
}

// Define an interface for the response (adjust according to actual response structure)
interface IntegrationResponse {
  success: boolean;
  message?: string;
}

const submitIntegration = async (createWorkspacePayload?: IntegrationPayload): Promise<IntegrationResponse> => {
  const res = await axiosClient.post<IntegrationResponse>('/integrations/add', {
    integration_id: createWorkspacePayload?.integration_id,
    lms_type: createWorkspacePayload?.lms_type,
    integration_url: createWorkspacePayload?.integration_url,
    integration_api_key: createWorkspacePayload?.integration_api_key,
    integration_cookies: null,
  });
  return res.data;
};

export const useSubmitIntegration = (
  onSuccess?: (data: IntegrationResponse) => void,
  onError?: (error: any) => void,
) => {
  return useMutation(submitIntegration, { onSuccess, onError });
};
