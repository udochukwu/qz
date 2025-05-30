'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { VStack } from 'styled-system/jsx';
import { SpinningIcon } from '@/components/spinning-icon';
import { useSubscribe } from '@/features/paywall/hooks/use-subscribe';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';
interface Props {
  params: {
    discount_id: string;
    user_id: string;
  };
}

const DiscountPage = ({ params: { discount_id, user_id } }: Props) => {
  const router = useRouter();
  const subscribe = useSubscribe();

  useEffect(() => {
    const handleDiscount = async () => {
      try {
        // Call the subscribe API with the discount id
        const response = await subscribe({
          discount_id,
          user_id,
        });

        if (response.success) {
          window.location.href = response.checkout_page_url;
        } else {
          router.push('/');
        }
        mixpanel.identify(user_id);
        mixpanel.track(EventName.DiscountPageViewed, {
          discount_id,
        });
      } catch (error) {
        console.error('Discount application failed:', error);
        router.push('/');
      }
    };

    handleDiscount();
  }, [discount_id, user_id, router, subscribe]);

  return (
    <VStack h="100vh" w="100%" justify="center">
      <SpinningIcon />
    </VStack>
  );
};

export default DiscountPage;
