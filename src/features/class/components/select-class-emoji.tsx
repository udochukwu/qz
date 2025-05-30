import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Select } from '@/components/elements/select';
import { Emoji, emojiToLucideIconMap } from '@/lib/class-emojis';
import React from 'react';

interface SelectClassEmojiProps extends Select.RootProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji: string;
}
export const SelectClassEmoji: React.FC<SelectClassEmojiProps> = ({ selectedEmoji, onEmojiSelect, ...props }) => {
  return (
    <Select.Root
      positioning={{ sameWidth: true }}
      width="5rem"
      onValueChange={({ value }) => {
        onEmojiSelect(value[0]);
      }}
      {...props}>
      <Select.Control>
        <Select.Trigger borderColor={'#CACACA'} w={'4rem'} gap={0} height={'56px'} borderRadius={'lg'}>
          <Select.ValueText placeholder={selectedEmoji} asChild>
            {React.createElement(emojiToLucideIconMap[selectedEmoji as Emoji], { size: 32, color: 'black' })}
          </Select.ValueText>
          <ChevronDownIcon />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner bottom={'100%'} top={'auto'}>
        <Select.Content maxH="16rem" w={'4.75rem'} overflowY="scroll" scrollbarColor={'rgba(0, 0, 0, 0.2) transparent'}>
          <Select.ItemGroup id="classEmoji">
            {props.items?.map(emoji => (
              <Select.Item item={emoji} key={emoji as string}>
                <Select.ItemText>
                  {React.createElement(emojiToLucideIconMap[emoji as Emoji], { size: 20 })}
                </Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
