export const secondsIntoHHMMSS = (seconds: number, prefixHours: boolean = false): string => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const remainingSeconds = String(Math.round(seconds % 60)).padStart(2, '0');

  if (hours === '00' && !prefixHours) {
    return `${minutes}:${remainingSeconds}`;
  }

  return `${hours}:${minutes}:${remainingSeconds}`;
};
