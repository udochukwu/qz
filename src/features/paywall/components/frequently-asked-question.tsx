import React, { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { HStack, styled } from 'styled-system/jsx';
import { IconButton } from '@/components/elements/icon-button';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function FrequentlyAskedQuestions() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const { t } = useTranslation();
  const questions = [
    {
      qs: t('purchase.questions.question1.que'),
      answ: t('purchase.questions.question1.ans'),
    },
    {
      qs: t('purchase.questions.question2.que'),
      answ: t('purchase.questions.question2.ans'),
    },
    {
      qs: t('purchase.questions.question3.que'),
      answ: t('purchase.questions.question3.ans'),
    },
    {
      qs: t('purchase.questions.question4.que'),
      answ: t('purchase.questions.question4.ans'),
    },
    {
      qs: t('purchase.questions.question5.que'),
      answ: t('purchase.questions.question5.ans'),
    },
  ];
  return (
    <styled.div mt="10" paddingLeft={'5rem'} paddingRight={'3rem'}>
      <styled.h3 color="#3E3C46" fontSize={{ lg: '2rem', xl: '2.2rem', '2xl': '3rem' }}>
        {t('purchase.title3')}
      </styled.h3>
      <styled.div>
        <styled.div>
          {questions.map((qs, ind) => {
            const isExpanded = ind === expandedIndex;

            return (
              <motion.div
                key={ind}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ overflow: 'hidden', borderRadius: '11px', marginBottom: '8px' }}>
                <HStack
                  justifyContent="space-between"
                  borderRadius="11px"
                  flex={1}
                  alignItems={isExpanded ? 'flex-start' : 'center'}
                  mb="2"
                  p="3"
                  cursor="pointer"
                  onClick={() => (isExpanded ? setExpandedIndex(-1) : setExpandedIndex(ind))}
                  borderWidth={1}
                  borderColor={isExpanded ? 'primary.9' : '#3E3C461A'}>
                  <styled.div w="100%">
                    <styled.div display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                      <styled.p color="#3E3C46" m="0" fontWeight="500" fontSize={{ lg: '1rem', '2xl': '1.3rem' }}>
                        {qs.qs}
                      </styled.p>
                      <IconButton _hover={{ bg: 'transparent' }} borderRadius="full" variant="ghost">
                        <styled.div
                          justifyContent="center"
                          alignItems="center"
                          display="flex"
                          w="8"
                          h="8"
                          borderRadius="full"
                          bg={isExpanded ? 'primary.11' : 'primary.4'}>
                          {isExpanded ? (
                            <ChevronDown color="white" size={20} />
                          ) : (
                            <ChevronUp style={{ color: 'var(--colors-primary-9)' }} size={20} />
                          )}
                        </styled.div>
                      </IconButton>
                    </styled.div>
                    <FAQItem answer={qs.answ} isExpanded={isExpanded} />
                  </styled.div>
                </HStack>
              </motion.div>
            );
          })}
        </styled.div>
      </styled.div>
    </styled.div>
  );
}

function FAQItem({ answer, isExpanded }: { answer: string; isExpanded: boolean }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ overflow: 'hidden', width: '90%' }}>
      <div>
        <styled.p color="#3E3C46E5" mb={0} mt="1" fontWeight="400" fontSize={{ lg: '0.8rem', '2xl': '1rem' }}>
          {answer}
        </styled.p>
      </div>
    </motion.div>
  );
}
