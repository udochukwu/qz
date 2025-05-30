'use client';

import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { css } from 'styled-system/css';
import { signIn } from 'next-auth/react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

const schema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  login_secret: z.string().min(1, 'Login Secret is required'),
});

type Schema = z.infer<typeof schema>;

export default function Impersonate() {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<Schema>({
    defaultValues: {
      user_id: '',
      login_secret: '',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      await signIn('credentials', {
        user_id: data.user_id,
        login_secret: data.login_secret,
        redirect: true,
        callbackUrl: '/',
      });
    } catch (error) {
      console.error('Failed to impersonate user:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      })}>
      <Input {...register('user_id')} placeholder={t('auth.impersonate.userId')} />
      <Input {...register('login_secret')} placeholder={t('auth.impersonate.loginSecret')} type="password" />
      <Button type="submit" size={'md'} variant={'subtle'}>
        {t('auth.impersonate.submit')}
      </Button>
    </form>
  );
}
