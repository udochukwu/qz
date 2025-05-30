import { TFunction } from 'i18next';
import { isWithinInterval, isSameDay, subDays, format, isValid } from 'date-fns';

interface DateGroupable {
  created_at_utc: number;
}

export const groupByDateDescending = <T extends DateGroupable>(
  items: T[] | undefined,
  t: TFunction,
): Record<string, T[]> => {
  if (!items || items.length === 0) {
    return {};
  }

  return groupItems(items, 'dsc', t);
};

export const groupByDateAscending = <T extends DateGroupable>(
  items: T[] | undefined,
  t: TFunction,
): Record<string, T[]> => {
  if (!items || items.length === 0) {
    return {};
  }

  return groupItems(items, 'asc', t);
};

const getGroupKey = (date: Date, oneWeekAgo: Date, t: TFunction): string => {
  if (!isValid(date)) {
    return t('collection.recents');
  }

  if (isWithinInterval(date, { start: oneWeekAgo, end: new Date() })) {
    return t('collection.recents');
  }
  if (isSameDay(date, oneWeekAgo)) {
    return t('collection.sevenDaysAgo');
  }
  return format(date, 'MMMM yyyy');
};

const groupItems = <T extends DateGroupable>(
  items: T[] | undefined,
  sortOrder: 'asc' | 'dsc',
  t: TFunction,
): Record<string, T[]> => {
  if (!items) return {};

  const now = new Date();
  const oneWeekAgo = subDays(now, 7);

  return items
    .filter(item => item.created_at_utc != null)
    .sort((a, b) =>
      sortOrder === 'asc'
        ? Number(a.created_at_utc) - Number(b.created_at_utc)
        : Number(b.created_at_utc) - Number(a.created_at_utc),
    )
    .reduce((acc: Record<string, T[]>, item) => {
      try {
        const date = new Date(Number(item.created_at_utc) * 1000);
        const groupKey = getGroupKey(date, oneWeekAgo, t);
        acc[groupKey] = acc[groupKey] || [];
        acc[groupKey].push(item);
      } catch (error) {
        const fallbackGroup = t('collection.recents');
        acc[fallbackGroup] = acc[fallbackGroup] || [];
        acc[fallbackGroup].push(item);
      }
      return acc;
    }, {});
};
