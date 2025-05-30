'use client';

import { Button } from '@/components/elements/button';
import { Input } from '@/components/elements/input';
import { css } from 'styled-system/css';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  login_secret: z.string().min(1, 'Login Secret is required'),
  subscription_status: z.boolean(),
});

type Schema = z.infer<typeof schema>;

export default function TesterLoginForm() {
  const { register, handleSubmit } = useForm<Schema>({
    defaultValues: {
      login_secret: '',
      subscription_status: false,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      await signIn('tester', {
        login_secret: data.login_secret,
        subscription_status: data.subscription_status,
        redirect: true,
        callbackUrl: '/',
      });
    } catch (error) {
      console.error('Failed to login as tester:', error);
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
      <Input {...register('login_secret')} placeholder="Test Login Secret" type="password" />
      <div className={css({ display: 'flex', alignItems: 'center', gap: 2 })}>
        <input
          type="checkbox"
          id="subscription-status"
          {...register('subscription_status')}
          className={css({ width: '16px', height: '16px' })}
        />
        <label>Subscribed User</label>
      </div>
      <Button type="submit" size={'md'} variant={'subtle'}>
        Login as Test User
      </Button>
    </form>
  );
}
