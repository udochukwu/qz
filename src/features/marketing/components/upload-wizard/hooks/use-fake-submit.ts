import { useRouter } from 'next13-progressbar';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const useFakeSubmit = () => {
  const [query, setQuery] = useState<string>('');
  const router = useRouter();

  const onSubmit = (source_button: string) => {
    console.log('source_button', source_button);
    if (query.length < 1) {
      toast.error('Please write atleast 5 characters for your question');
      return;
    }
    router.push(`/auth/login?source_button=${source_button}`);
  };

  return { onSubmit, query, setQuery };
};
