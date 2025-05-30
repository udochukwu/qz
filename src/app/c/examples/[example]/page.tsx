'use client';
import { SpinningIcon } from '@/components/spinning-icon';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { styled } from 'styled-system/jsx';
import { EventName } from '@/providers/custom-tracking-provider';
import mixpanel from 'mixpanel-browser';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/nextjs';

interface Params {
  example: string;
}

export default function ExampleChatPage({ params }: { params: Params }) {
  const { t } = useTranslation();

  const router = useRouter();
  useEffect(() => {
    let getChat = async () => {
      try {
        if (mixpanel && mixpanel.track) {
          mixpanel.track(EventName.ExampleChatStarted, {
            example_name: params.example,
          });
        }
      } catch (error) {
        Sentry.captureException(error);
      }
      let response = await axios.post(`/chat/examples/${params.example}`);
      router.push(`/c/${response.data.chat_id}`);
    };
    getChat();
  }, [params.example, router]);

  return (
    <>
      <styled.section
        display="flex"
        h="100vh"
        w="100%"
        flexDir="column"
        bg="#F8F8F9"
        overflow="clip"
        alignItems="center"
        justifyContent="center">
        <SpinningIcon />
        <styled.h3 textStyle="md" fontWeight="normal" color="#202020">
          {t('chat.example.title', { example: params.example })}
        </styled.h3>
      </styled.section>
    </>
  );
}
