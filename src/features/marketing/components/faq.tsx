'use client';

import { ChevronDownIcon } from 'lucide-react';
import { Accordion } from '@/components/elements/accordion';
import { styled } from 'styled-system/jsx';
import { useTranslation } from 'react-i18next';

const Q_AND_A = [
  {
    question: 'Is Unstuck AI Free?',
    answer: 'Unstuck AI is completely free to use!',
  },
  {
    question: 'Will my documents be published online?',
    answer:
      'No, your documents remain private and secure. Unstuck AI does not publish or share your materials with anyone.',
  },
  {
    question: 'Does Unstuck AI use GPT-4?',
    answer:
      'Unstuck AI uses a combination of advanced AI technologies, including GPT-4, to provide accurate and helpful responses.',
  },
  {
    question: 'Is Unstuck AI Accurate?',
    answer:
      'Yes, Unstuck AI is able to provide a high degree of accuracy by directly referencing your course materials and using the best AI models.',
  },
  {
    question: 'What files does Unstuck AI support?',
    answer:
      'Unstuck AI supports a wide range of file formats including PDFs, PPTXs, DOCXs, YouTube videos, and more. If you have a specific file type that you would like supported, ask our support in the product!',
  },
  {
    question: 'Can Unstuck AI read graphs?',
    answer:
      'Yes, Unstuck AI can analyze and interpret graphs, charts, and other visual data from your uploaded materials!',
  },
];

export const FAQ = (props: Accordion.RootProps) => {
  const { t } = useTranslation();

  return (
    <styled.section w={{ md: '3xl', base: '100%' }} display="flex" flexDir="column" alignItems="center" gap={4} px={8}>
      <styled.h2 fontSize="2xl" fontWeight="medium" w="100%" textAlign="center">
        {t('landing.faq.title')}
      </styled.h2>
      <Accordion.Root defaultValue={['React']} multiple {...props}>
        {Q_AND_A.map((item, id) => (
          <Accordion.Item key={id} value={item?.question}>
            <Accordion.ItemTrigger>
              {item.question}
              <Accordion.ItemIndicator>
                <ChevronDownIcon />
              </Accordion.ItemIndicator>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>{item.answer}</Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </styled.section>
  );
};
