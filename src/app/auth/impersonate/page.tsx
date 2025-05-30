import { css } from 'styled-system/css';
import ImpersonateForm from '@/features/auth/components/impersonate-form';

export default async function AdminPage() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      })}>
      <ImpersonateForm />
    </div>
  );
}
