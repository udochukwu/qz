import { useState } from 'react';

export const useBoolean = (initialValue?: boolean) => {
  const [value, setValue] = useState<boolean>(initialValue ?? false);

  const onToggle = () => {
    setValue(prev => !prev);
  };

  const setTrue = () => {
    setValue(true);
  };

  const setFalse = () => {
    setValue(false);
  };

  return { onToggle, setFalse, setTrue, setValue, value };
};
