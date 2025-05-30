import { ArrowDownLeft, ArrowDownRight, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { HStack, Stack, styled } from 'styled-system/jsx';

const EXAMPLES = [
  {
    title: 'Learning Economics 101',
    desc: 'See how Unstuck is already helping students',
    href: '/c/examples/economics',
    alt: 'Economics 101',
    image: '/images/example-3.webp',
    CTA: '💬 Chat about supply & demand',
  },
  {
    title: 'Learning CS 50',
    desc: 'See how Unstuck is already helping students',
    href: '/c/examples/cs',
    alt: 'Computer Science 50',
    image: '/images/brain.webp',
    CTA: '💻 Perfect your algorithms',
  },
  {
    title: 'Learning Biology 102',
    desc: 'See how Unstuck is already helping students',
    href: '/c/examples/biology',
    alt: 'Biology 102',
    image: '/images/example-2.webp',
    CTA: '🥽 Prepare for your bio exam',
  },
];

export const Examples = () => {
  const { t } = useTranslation();

  return (
    <styled.section w="100%" display="flex" flexDir="column" alignItems="center" gap={4}>
      <styled.h2 fontSize="md" fontWeight="medium">
        <ArrowDownRight className={css({ color: '#6D56FA', display: 'inline' })} />
        <span>{t('landing.examples.title')}&nbsp;</span>
        <ArrowDownLeft className={css({ color: '#6D56FA', display: 'inline' })} />
      </styled.h2>
      <HStack mx="auto" gap={4} w="100%" px={8} justifyContent="center" flexDir={{ md: 'row', base: 'column' }}>
        {EXAMPLES.map((ex, idx) => {
          return (
            <Link
              key={idx}
              href={ex.href}
              className={css({ w: { base: '100%', md: '250px' }, color: 'black', textDecoration: 'none' })}>
              <styled.div
                mx="auto"
                _hover={{ bg: '#ECE9FF/30' }}
                borderRadius="2xl"
                dropShadow="3xl"
                border="1px solid #E5E5E5"
                display="flex"
                flexDir="column"
                gap={4}
                w={{ base: '100%', md: '250px' }}
                h="auto">
                <Image
                  src={ex.image}
                  width={300}
                  height={400}
                  objectFit="cover"
                  alt={ex.alt}
                  className={css({
                    h: '150px',
                    w: '100%',
                    borderBottom: '1px solid #E5E5E5',
                    borderRadius: '1rem 1rem 0 0',
                  })}
                />
                <Stack gap={1} w="100%" px={4}>
                  <styled.h3 textStyle="lg" fontWeight="semibold" color="black" m={0} p={0}>
                    {ex.title}
                  </styled.h3>
                  <styled.p m={0} p={0} textStyle="xs" fontWeight="normal" color="#8E8E8E">
                    {ex.desc}
                  </styled.p>
                </Stack>
                <styled.p
                  w="100%"
                  borderTop="1px solid #E5E5E5"
                  px={4}
                  pt={4}
                  pb={1}
                  color="black"
                  display="flex"
                  alignItems="center"
                  fontWeight="light"
                  fontSize="xs">
                  {ex.CTA} <ArrowRight size={12} />
                </styled.p>
              </styled.div>
            </Link>
          );
        })}
      </HStack>
    </styled.section>
  );
};
