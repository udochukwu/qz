import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react';
import { Divider, HStack, styled } from 'styled-system/jsx';
import { Card } from '@/components/elements/card';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/elements/icon-button';
import { Select } from '@/components/elements/select';
import { ChevronDown, XIcon } from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES } from '@/lib/languages';
import i18n from '@/lib/i18n';
import { useUserStore } from '@/stores/user-store';
import axiosClient from '@/lib/axios';
import { Modal } from '@/components/modal/modal';

function LanguageModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }) {
  const { t } = useTranslation();
  const { langcode, setLangcode } = useUserStore();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find(lang => lang.code === langcode) || SUPPORTED_LANGUAGES[0],
  );

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    }

    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  const onChangeLanguage = async (value: string[]) => {
    const cL = SUPPORTED_LANGUAGES.find(lang => lang.code === value[0]) || SUPPORTED_LANGUAGES[0];
    setCurrentLanguage(cL);

    const res = await axiosClient.post('/user/info', {
      langcode: cL.code,
    });

    setLangcode(res.data?.langcode || cL.code);
    i18n.changeLanguage(res.data?.langcode || cL.code);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={isOpen => setIsOpen(isOpen)}
      width="md"
      contentProps={{ overflowY: 'visible' }}>
      <Card.Root borderRadius="3xl" style={{ overflow: 'visible' }}>
        <Card.Header paddingY={3} paddingX={8}>
          <HStack justifyContent="space-between">
            <Card.Title style={{ margin: '0 !important' }} fontWeight="medium">
              {t('language.title')}
            </Card.Title>
            <IconButton
              borderRadius="full"
              backgroundColor="#F3F3F3"
              aria-label={t('chat.feedback.close')}
              variant="ghost"
              color="#828286"
              marginTop={0.5}
              onClick={() => setIsOpen(false)}
              size="xs">
              <XIcon />
            </IconButton>
          </HStack>
        </Card.Header>
        <Divider />
        <Card.Body alignItems="start" paddingY={7} paddingX={9}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Select.Root
              value={[currentLanguage.code]}
              open={dropdownVisible}
              onOpenChange={details => setDropdownVisible(details.open)}
              onValueChange={({ value }) => {
                onChangeLanguage(value);
              }}
              items={SUPPORTED_LANGUAGES}>
              <Select.Trigger
                onClick={event => {
                  event.stopPropagation();
                  setDropdownVisible(prev => !prev);
                }}
                style={{ zIndex: 1000, position: 'relative' }}>
                <Select.ValueText fontSize="sm" color="#3E3C46">
                  <styled.div display="flex" alignItems="center" gap={2}>
                    <styled.span>{currentLanguage.flag}</styled.span>
                    <styled.span>{currentLanguage.language}</styled.span>
                  </styled.div>
                </Select.ValueText>
                <Select.Indicator>
                  <ChevronDown />
                </Select.Indicator>
              </Select.Trigger>
              {dropdownVisible && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    overflowY: 'auto',
                    maxHeight: '200px',
                    transform: 'translateY(8px)',
                  }}>
                  {SUPPORTED_LANGUAGES.map(l => (
                    <Select.Item key={l.code} item={l.code}>
                      <Select.ItemText fontSize="sm" color="#3E3C46">
                        <styled.div display="flex" alignItems="center" gap={2}>
                          <styled.span>{l.flag}</styled.span>
                          <styled.span>{t(`language.${l.code}`)}</styled.span>
                        </styled.div>
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </div>
              )}
            </Select.Root>
          </div>
        </Card.Body>
      </Card.Root>
    </Modal>
  );
}

export default LanguageModal;
