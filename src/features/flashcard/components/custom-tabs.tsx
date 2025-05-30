import { Tabs } from '@/components/elements/tabs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';
import { Flashcard } from '../../flashcard/types/flashcard';
import EditableFlashcard from './editable-flashcard';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useAddMoreFlashcards } from '../hooks/use-add-more-flashcards';
import { useParams } from 'next/navigation';
import mixpanel from 'mixpanel-browser';
import { EventName } from '@/providers/custom-tracking-provider';

interface CustomTabsProps {
  flashcards: Flashcard[];
  onDeleteClicked: (card: Flashcard) => void;
  onTabChange?: (tab: string) => void;
}
export const CustomTabs = ({ flashcards, onDeleteClicked, onTabChange }: CustomTabsProps) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const { t } = useTranslation();
  const { mutate: addMoreFlashcards, isLoading: isAddingFlashCards } = useAddMoreFlashcards();
  const { set_id } = useParams();

  const handleTabChange = (valueChangeDetails: { value: string }) => {
    setSelectedTab(valueChangeDetails.value);
    onTabChange?.(valueChangeDetails.value);
  };

  const handleAddMore = () => {
    addMoreFlashcards({ number_of_flashcards: 5, setId: set_id as string });
    mixpanel.track(EventName.FlashcardAddMoreClicked, {
      already_approved: true,
    });
  };

  return (
    <Tabs.Root
      key={flashcards.map(f => f.flashcard_id).join(',')}
      defaultValue="all"
      value={selectedTab}
      onValueChange={handleTabChange}>
      <styled.div display="flex" justifyContent="space-between">
        <styled.div display="flex" gap="4" alignItems="center">
          <p
            className={css({
              fontWeight: 'medium',
              fontSize: '1rem',
              lineHeight: '1.8125rem',
              margin: '0px',
            })}>
            {t('flashcards.termsInThisSet', { setLength: flashcards.length })}
          </p>
          <styled.button
            color={'#6D56FA'}
            bg={'rgba(109, 86, 250, 0.1)'}
            borderRadius={'10px'}
            paddingX={'10px'}
            paddingY={'5px'}
            display={'flex'}
            alignItems={'center'}
            gap={'2px'}
            fontSize={'sm'}
            fontWeight={'medium'}
            onClick={handleAddMore}
            disabled={isAddingFlashCards}
            cursor={'pointer'}
            transition={'all 0.2s ease-in-out'}
            _disabled={{
              opacity: 0.5,
              cursor: 'wait',
            }}>
            <PlusIcon size={12} />
            {t('flashcards.review.addMore')}
          </styled.button>
        </styled.div>

        <Tabs.List gap="4" display="flex">
          <Tabs.Trigger value="all">
            <p
              className={css({
                fontWeight: 'medium',
                fontSize: '1rem',
                lineHeight: '0.84rem',
                color: selectedTab === 'all' ? '#3E3C46' : '#86849299',
                marginBottom: '5px',
              })}>
              {t('flashcards.tabs.all')}
            </p>
          </Tabs.Trigger>
          <Tabs.Trigger value="starred">
            <p
              className={css({
                fontWeight: 'medium',
                fontSize: '1rem',
                lineHeight: '0.84rem',
                color: selectedTab === 'starred' ? '#3E3C46' : '#86849299',
                marginBottom: '5px',
              })}>
              {t('flashcards.tabs.starred', {
                starredLength: flashcards.filter(flashcard => flashcard.is_favorite).length,
              })}
            </p>
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
      </styled.div>

      <div
        className={css({
          position: 'relative',
          minHeight: '200px',
          marginTop: '20px',
        })}>
        <Tabs.Content
          value="all"
          p="0"
          className={css({
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
          })}
          key={flashcards.map(f => f.question + f.answer + f.flashcard_id).join(',')}>
          <AnimatePresence mode="wait">
            <motion.div
              className={css({ width: '100%' })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              {flashcards.map((card: Flashcard, index: number) => (
                <EditableFlashcard
                  cardIndex={index}
                  card={card}
                  key={card.flashcard_id}
                  onDeleteClicked={() => onDeleteClicked(card)}
                  page="flashcard"
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </Tabs.Content>

        <Tabs.Content
          value="starred"
          p="0"
          className={css({
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
          })}
          key={flashcards
            .filter(f => f.is_favorite)
            .map(f => f.question + f.answer + f.flashcard_id)
            .join(',')}>
          <AnimatePresence mode="wait">
            <motion.div
              className={css({ width: '100%' })}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              {flashcards
                .filter(flashcard => flashcard.is_favorite)
                .map((card, index) => (
                  <EditableFlashcard
                    cardIndex={index}
                    key={card.flashcard_id}
                    page="flashcard"
                    card={card}
                    onDeleteClicked={() => onDeleteClicked(card)}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  );
};
