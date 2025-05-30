'use server';
import { redirect } from 'next/navigation';

export async function redirectToExpiryPage() {
  redirect('/auth/expire');
}
