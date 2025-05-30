import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled, VStack } from 'styled-system/jsx';

interface Props {
  isSuccess?: boolean;
  title: string;
  desc: string;
}

export const FeedbackResult = ({ isSuccess, title, desc }: Props) => {
  const { t } = useTranslation();

  return (
    <VStack alignItems="center" justify="center" textAlign="center">
      <styled.h2 fontWeight="700" textStyle="5xl">
        {title}
      </styled.h2>
      <styled.p color="black.500" maxW="md" textStyle="lg">
        {desc}
      </styled.p>
      <styled.div h="20em" pos="relative" w="20em">
        <Image
          alt={`${isSuccess ? t('common.happy') : t('common.sad')} Quizard Robot`}
          layout="fill"
          objectFit="contain"
          src={`/images/feedback/quizard-${isSuccess ? 'happy' : 'sad'}.png`}
        />
      </styled.div>
    </VStack>
  );
};
