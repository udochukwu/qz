import { ClipboardIcon, ClipboardCheckIcon, Download, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { HStack, styled } from 'styled-system/jsx';
import { motion } from 'framer-motion';
import * as Sentry from '@sentry/nextjs';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/elements/icon-button';

interface MessageFooterProps {
  showCopy: boolean;
  onCopy: () => void;
  onDownload: () => Promise<void>;
  isPro: boolean;
}

// Create a custom spinning icon component specifically for the footer
const FooterSpinningIcon = () => {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{
        ease: 'linear',
        duration: 1,
        repeat: Infinity,
      }}
      style={{ display: 'inline-block' }}>
      <Loader2Icon color="gray" size={16} />
    </motion.span>
  );
};

export default function AIMessageFooter({ onCopy, onDownload, showCopy, isPro = false }: MessageFooterProps) {
  const { t } = useTranslation();

  const [hasCopied, setHasCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = () => {
    onCopy();
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1000);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } catch (error) {
      // Log to Sentry
      Sentry.captureException(error, {
        tags: {
          component: 'AIMessageFooter',
          action: 'download',
        },
      });

      // Show user-friendly error message
      toast.error(t('chat.message.ai.error'));

      // Log to console in development
    } finally {
      // Ensure loading state is cleared even if there's an error
      setTimeout(() => {
        setIsDownloading(false);
      }, 500);
    }
  };

  return (
    <HStack gap="16px" alignItems={'flex-start'} marginLeft={'65px'}>
      {showCopy && (
        <styled.div>
          {hasCopied ? (
            <styled.img src="/icons/ic_check.svg" alt="" height="18px" width="18px" />
          ) : (
            <ClipboardIcon
              onClick={handleCopy}
              color="gray"
              size={16}
              style={{
                cursor: 'pointer',
              }}
            />
          )}
        </styled.div>
      )}
      {showCopy && (
        <styled.div style={{ cursor: isDownloading ? 'default' : 'pointer' }}>
          {isDownloading ? (
            <FooterSpinningIcon />
          ) : (
            <styled.img src="/icons/ic_download.svg" alt="" height="16px" width="16px" onClick={handleDownload} />
          )}
        </styled.div>
      )}
    </HStack>
  );
}
