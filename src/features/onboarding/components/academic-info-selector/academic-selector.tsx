import type { ComboboxInputValueChangeDetails, ComboboxValueChangeDetails } from '@ark-ui/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState, FC } from 'react';
import { Combobox } from '@/components/elements/combobox';
import { IconButton } from '@/components/elements/icon-button';
import { Input } from '@/components/elements/input';
import { Skeleton } from '@/components/elements/skeleton';

interface AcademicSelectorProps {
  allOptions: string[];
  option: string;
  setOption: (option: string) => void; // Ensure the parameter name matches its usage
  thePrompt: string;
  theName: string;
  isLoading?: boolean;
}

interface OptionItem {
  label: string;
  value: string;
}

export const AcademicSelector: FC<AcademicSelectorProps> = ({
  allOptions,
  option,
  setOption,
  thePrompt,
  theName,
  isLoading,
}) => {
  const data: OptionItem[] = allOptions.map(opt => ({ label: opt, value: opt }));
  const [items, setItems] = useState<OptionItem[]>(data);

  const handleChange = (e: ComboboxInputValueChangeDetails) => {
    const filtered = data.filter(item => item.label.toLowerCase().includes(e.inputValue.toLowerCase()));
    setItems(filtered.length > 0 ? filtered : data);
    setOption(e.inputValue);
  };

  const handleValue = (e: ComboboxValueChangeDetails<string>) => {
    if (e.value.length > 0) {
      setOption(e.value[0]);
    }
  };

  return (
    <Skeleton isLoaded={!isLoading}>
      <Combobox.Root
        width={'2xl'}
        onInputValueChange={handleChange}
        onValueChange={e => handleValue(e as ComboboxValueChangeDetails<string>)}
        items={items}>
        <Combobox.Label>{theName}</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input placeholder={thePrompt} value={option} asChild>
            <Input />
          </Combobox.Input>
          <Combobox.Trigger asChild>
            <IconButton variant="link" aria-label="open" size="xs">
              <ChevronsUpDownIcon />
            </IconButton>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content maxH="200px" overflowY="auto">
            <Combobox.ItemGroup id="anoption">
              {items.map(item => (
                <Combobox.Item key={item.value} item={item}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.ItemGroup>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
    </Skeleton>
  );
};
