import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const FormData = z.object({
  name: z.string().min(1, 'Name must be atleast one character long!').max(100),
});

type FormValues = z.infer<typeof FormData>;

export const useNameForm = (initialName: string = '') => {
  const form = useForm<FormValues>({
    defaultValues: {
      name: initialName,
    },
    resolver: zodResolver(FormData),
  });

  useEffect(() => {
    form.setValue('name', initialName);
    form.reset();
  }, [initialName, form]);

  return form;
};
