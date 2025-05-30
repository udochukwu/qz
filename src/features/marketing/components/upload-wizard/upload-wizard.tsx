import { Tabs } from '@/components/elements/tabs';
import FileUploadMock from './components/file-upload-mock';
import { HStack } from 'styled-system/jsx';
import { YoutubeMock } from './components/youtube-mock';
import { AskQuestionMock } from './components/ask-question-mock';
import { PaperclipIcon, MessageCircle, YoutubeIcon } from 'lucide-react';
import { css } from 'styled-system/css';
import { useTranslation } from 'react-i18next';

export const UploadWizard = () => {
  const { t } = useTranslation();

  const options = [
    {
      id: 'Upload file',
      label: t('common.uploadFile'),
      icon: (
        <PaperclipIcon
          size={'32px'}
          className={css({
            color: '#6D56FA',
            display: { sm: 'block', base: 'none' },
            width: { sm: '16px', base: '8px' },
          })}
        />
      ),
    },
    {
      id: 'Youtube',
      label: t('common.youtube'),
      icon: (
        <YoutubeIcon
          size={'32px'}
          className={css({
            color: '#6D56FA',
            display: { sm: 'block', base: 'none' },
            width: { sm: '16px', base: '8px' },
          })}
        />
      ),
    },
    {
      id: 'Ask a question',
      label: t('common.askQuestion'),
      icon: (
        <MessageCircle
          size={'32px'}
          className={css({
            color: '#6D56FA',
            display: { sm: 'block', base: 'none' },
            width: { sm: '16px', base: '8px' },
          })}
        />
      ),
    },
  ];
  return (
    <Tabs.Root
      defaultValue="Upload file"
      variant="enclosed"
      bg={{ sm: '#ECE9FF/30', base: 'transparent' }}
      border={{ sm: '1px solid #6c56fa20', base: 'none' }}
      pb={{ sm: 2, base: 0 }}
      px={0}
      pt={{ base: 0, sm: 4 }}
      borderRadius="3xl">
      <HStack px={{ sm: 4, base: 0 }} w="full" overflow="auto" justifyContent={{ sm: 'flex-start', base: 'center' }}>
        <div>
          <Tabs.List bg="#6D56FA/5" w="full" border="none" borderRadius="100px" overflow="auto">
            {options.map(option => (
              <Tabs.Trigger
                textStyle={{ sm: 'md', base: '8px' }}
                display="flex"
                gap={{ sm: 2, base: 2 }}
                fontWeight={{ sm: 'medium', base: 'normal' }}
                borderRadius="100px"
                key={option.id}
                value={option.id}>
                {option.icon}
                {option.label}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator borderRadius="100px" />
          </Tabs.List>
        </div>
      </HStack>
      <Tabs.Content value="Upload file">
        <FileUploadMock />
      </Tabs.Content>
      <Tabs.Content value="Youtube">
        <YoutubeMock />
      </Tabs.Content>
      <Tabs.Content value="Ask a question">
        <AskQuestionMock />
      </Tabs.Content>
    </Tabs.Root>
  );
};
