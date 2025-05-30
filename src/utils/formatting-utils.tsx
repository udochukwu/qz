import { TFunction } from 'i18next';

export function formatTimeAgo(epochTimeInSeconds: number, t: TFunction<'translation', undefined>): string {
  const now = Date.now(); // Current time in milliseconds since the Unix Epoch (UTC)
  const epochTime = epochTimeInSeconds * 1000;
  // Calculate the difference in seconds
  const seconds: number = Math.floor((now - epochTime) / 1000);

  let interval: number = seconds / 31536000; // Calculate years
  if (interval > 1) {
    return `${Math.floor(interval)} ${t('common.yearsAgo')}`;
  }
  interval = seconds / 2592000; // Calculate months
  if (interval > 1) {
    return `${Math.floor(interval)} ${t('common.monthsAgo')}`;
  }
  interval = seconds / 86400; // Calculate days
  if (interval > 1) {
    return `${Math.floor(interval)} ${t('common.daysAgo')}`;
  }
  interval = seconds / 3600; // Calculate hours
  if (interval > 1) {
    return `${Math.floor(interval)} ${t('common.hoursAgo')}`;
  }
  interval = seconds / 60; // Calculate minutes
  if (interval > 1) {
    return `${Math.floor(interval)} ${t('common.minutesAgo')}`;
  }
  return t('common.justNow'); // Less than a minute ago
}
