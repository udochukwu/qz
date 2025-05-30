import { redirect } from 'next/navigation';

export default async function RecordPageRedirect() {
  redirect('/?tab=Record&recording=true');
  return null;
}
