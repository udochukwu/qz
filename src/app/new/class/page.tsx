import { redirect } from 'next/navigation';

export default async function CreateClassRedirect() {
  redirect('/classes?createWorkspace=true');
  return null;
}
