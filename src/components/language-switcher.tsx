import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/lib/languages';
import { Select } from '@/components/elements/select';
import { styled } from 'styled-system/jsx';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const items = SUPPORTED_LANGUAGES.map(({ code, language, flag }) => ({
    value: code,
    label: (
      <LanguageOption>
        <span>{flag}</span>
        <span>{language}</span>
      </LanguageOption>
    ),
  }));

  return (
    <Select.Root value={[i18n.language]} onValueChange={({ value }) => i18n.changeLanguage(value[0])} items={items}>
      <Select.Trigger>
        <Select.ValueText>
          {currentLanguage.flag} {currentLanguage.language}
        </Select.ValueText>
      </Select.Trigger>
      <Select.Positioner>
        <Select.Content>
          {items.map(({ value, label }) => (
            <Select.Item key={value} item={value}>
              <Select.ItemText>{label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};

const LanguageOption = styled('div', {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});
