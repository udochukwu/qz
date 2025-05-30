'use client';
import React from 'react';
import { UploadWizard } from './upload-wizard/upload-wizard';
import { HeroTitle } from './hero-title';
import { styled } from 'styled-system/jsx';
import { Navbar } from './navbar';
import { BackgroundSwirl } from './background-swirl';
import { Examples } from './examples';
import { ArrowDownLeft, ArrowDownRight } from 'lucide-react';
import { css } from 'styled-system/css';
import { FAQ } from './faq';
import { FooterView } from './footer-view';

const LandingPage = () => {
  return (
    <styled.div overflowX="hidden" w="100%">
      <Navbar />
      <styled.div overflowX="hidden" w="100%" display="flex" flexDir="column" gap={16} alignItems="center">
        <styled.section maxW="5xl" mx="auto" px={4}>
          <styled.main
            justifyContent="flex-start"
            display="flex"
            flexDir="column"
            gap={8}
            alignItems="center"
            textAlign="center">
            <HeroTitle />
            <styled.div px={{ base: 0, sm: 8 }} w="100%">
              <UploadWizard />
            </styled.div>
          </styled.main>
        </styled.section>
        <Examples />
        <FAQ />
        <FooterView />
        <styled.div zIndex={-1} pos="absolute" top={0} w="100%" h="100%" overflowX="hidden" overflowY="hidden">
          <styled.div w="100%" h="100svh" overflowX="hidden" overflowY="hidden" pos="relative">
            <styled.div position="absolute" top={0} left="-25%">
              <BackgroundSwirl />
            </styled.div>
          </styled.div>
        </styled.div>
      </styled.div>
    </styled.div>
  );
};

export default LandingPage;
