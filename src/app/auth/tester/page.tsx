import { css } from 'styled-system/css';
import TesterLoginForm from '@/features/auth/components/tester-login-form';

export default async function TesterLoginPage() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      })}>
      <TesterLoginForm />
    </div>
  );
}
