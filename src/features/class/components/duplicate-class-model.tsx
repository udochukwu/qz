import { Modal } from '@/components/modal/modal';
import { Copy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { HStack, VStack, styled } from 'styled-system/jsx';
import { Input } from '@/components/elements/input';
import { Controller } from 'react-hook-form';
import { emojis } from '@/lib/class-emojis';
import { SelectClassEmoji } from './select-class-emoji';
import { useNameForm } from '@/hooks/use-name-form';
import { getClassNameAndEmoji } from '../util/get-class-name';
import { Button } from '@/components/elements/button';
import { useTranslation } from 'react-i18next';

interface DuplicateClassModelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspace_id?: string;
  class_name?: string;
}

const DuplicateClassModel = ({ isOpen, setIsOpen, workspace_id, class_name }: DuplicateClassModelProps) => {
  const { control, reset } = useNameForm();
  const [extractEmoji, extractedTitle] = getClassNameAndEmoji(class_name);
  const [selectedEmoji, setSelectedEmoji] = useState<string>(extractEmoji);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      setSelectedEmoji(extractEmoji);
      reset({ name: extractedTitle });
    }
  }, [isOpen, extractEmoji, extractedTitle, reset]);

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <styled.div padding={'50px'} display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
        <styled.div display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Copy height={'30px'} width={'30px'} />
        </styled.div>
        <styled.div marginTop={'35px'} textAlign={'center'}>
          <styled.p fontSize={'2xl'} fontWeight={500} marginTop={'0px'} marginBottom={'0px'}>
            {t('class.workspace.duplicateClassTitle')}
          </styled.p>
          <styled.p fontSize={'md'} color={'#15112B80'} textAlign={'center'} marginTop={'10px'}>
            {class_name}&nbsp;{t('class.workspace.duplicateClassDescription')}
          </styled.p>
        </styled.div>
        <styled.div display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <SelectClassEmoji onEmojiSelect={setSelectedEmoji} items={emojis} selectedEmoji={selectedEmoji} />
          <Controller
            control={control}
            name="name"
            rules={{ required: t('rules.required.name') }}
            render={({ field: { onChange, value }, fieldState }) => (
              <VStack alignItems="flex-start" w="100%">
                <Input
                  value={value}
                  onChange={e => onChange(e.currentTarget.value)}
                  borderColor={'#CACACA'}
                  height={'56px'}
                  minW={'382px'}
                  borderRadius={'lg'}
                />
                {fieldState.error && (
                  <styled.p textStyle="xs" color="red">
                    {fieldState.error?.message}
                  </styled.p>
                )}
              </VStack>
            )}
          />
        </styled.div>
        <HStack>
          <Button
            width="full"
            minW={'239px'}
            marginTop={'13px'}
            fontSize={'md'}
            height={'53px'}
            backgroundColor={'#6D56FA1A'}
            color={'#6D56FA'}>
            {t('common.cancel')}
          </Button>
          <Button
            width="full"
            minW={'239px'}
            marginTop={'13px'}
            fontSize={'md'}
            height={'53px'}
            backgroundColor={'#6D56FA'}
            color={'#FFFFFF'}>
            {t('common.duplicate')}
          </Button>
        </HStack>
      </styled.div>
    </Modal>
  );
};

export default DuplicateClassModel;
