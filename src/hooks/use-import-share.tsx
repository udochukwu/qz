'use client';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { sendErrorMessage } from '@/utils/send-error-message';
import axiosClient from '@/lib/axios';
import { SuccessfulResponse } from '@/types/api-types';

interface ImportSharePayload {
  share_id: string;
}

interface ImportShareResponse {
  id: string;
  type: 'class' | 'chat' | 'file' | 'flashcard_set';
  message: string;
}

const importShare = async (payload: ImportSharePayload): Promise<ImportShareResponse> => {
  const res = await axiosClient.post<ImportSharePayload, SuccessfulResponse<ImportShareResponse>>('/share', payload);
  return res.data;
};

export const useImportShare = (onSuccess?: (payload: ImportShareResponse) => void) => {
  return useMutation(importShare, {
    onSuccess: (successResponse: ImportShareResponse) => {
      onSuccess?.(successResponse);
    },
    onError: (e: AxiosError) => {
      sendErrorMessage(e);
    },
  });
};
