import React, { useState } from 'react';
import { Select } from '@/components/elements/select';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { styled } from 'styled-system/jsx';

interface Props {
  placeholderValue: string;
  types: string[];
  onFilterChange: (val: string[]) => void;
}

interface ValueChangeDetails {
  value: string[];
}

export const FilterByType = ({ placeholderValue, types, onFilterChange }: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleValueChange = (details: ValueChangeDetails) => {
    const newValue = details.value[0];
    if (!newValue || newValue === selectedValue) {
      setSelectedValue(null);
      onFilterChange([]);
    } else {
      setSelectedValue(newValue);
      onFilterChange([newValue]);
    }
  };

  return (
    <Select.Root w="175px" value={selectedValue ? [selectedValue] : []} onValueChange={handleValueChange} items={types}>
      <Select.Control>
        <Select.Trigger borderColor={'#e7e8ea'} borderRadius={'12px'}>
          <Select.ValueText
            textStyle="xs"
            color={'#15112B'}
            placeholder={placeholderValue}
            fontSize={'16px'}
            fontWeight={400}
          />
          <ChevronDown color="#15112B" />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup id="framework" overflowY={'auto'} maxH={'150px'} minH={'20px'} minW={'100px'}>
            {types.map(item => (
              <Select.Item key={item} item={item} asChild>
                <styled.div
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  borderBottom="1px solid rgba(0, 0, 0, 0.04)"
                  paddingBottom="8px"
                  marginBottom="8px"
                  marginTop="8px">
                  <Select.ItemText textStyle="xs">{item}</Select.ItemText>
                  {item === selectedValue && (
                    <Select.ItemIndicator>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  )}
                </styled.div>
              </Select.Item>
            ))}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
