import { BlockUIFromMobile } from '@/components/block-ui-from-mobile';
import { ProductTour } from '@/features/onboarding/components/product-tour';
import { Flex } from 'styled-system/jsx';

export default function ClassesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BlockUIFromMobile>
      <ProductTour />
      <Flex flexDirection="row" height="100vh" width="100%">
        <Flex flexDirection="column" height="100%" width="100%" backgroundColor="#F8F8F8">
          {children}
        </Flex>
      </Flex>
    </BlockUIFromMobile>
  );
}
