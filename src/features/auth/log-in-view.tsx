import React from 'react';
import { AuthFormView } from './auth-form-view';
import { Flex } from 'styled-system/jsx';

export const LoginView = () => {
  return (
    <Flex flex={1} justifyContent={'center'} alignItems={'center'} backgroundColor={'rgba(248, 248, 249, 1)'}>
      <AuthFormView title={['auth.common.login', 'auth.common.toUnstuckAI']} />
    </Flex>
  );
};
