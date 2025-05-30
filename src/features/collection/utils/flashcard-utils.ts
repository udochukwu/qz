import { FlashcardSets } from '@/features/flashcard/types/flashcard-api-types';
import { isWithinInterval, isSameDay, subDays, format } from 'date-fns';
import { TFunction } from 'i18next';

/**
 * Options for sorting flashcard sets by date
 * - 'asc': ascending order (oldest first)
 * - 'dsc': descending order (newest first)
 */
export type SortOption = 'asc' | 'dsc';
export const SORT_OPTIONS: SortOption[] = ['asc', 'dsc'];

/**
 * Determines the group key for a flashcard set based on its creation date
 * @param date - The creation date of the flashcard set
 * @param oneWeekAgo - The date one week ago from now
 * @param t - Translation function for internationalization
 * @returns A string representing the group key:
 * - "Recents" if the date is within the last 7 days
 * - "7 days ago" if the date is exactly 7 days ago or older
 * - "Month Year" (e.g. "January 2024") for older dates
 */
const getGroupKey = (date: Date, oneWeekAgo: Date, t: TFunction): string => {
  if (isWithinInterval(date, { start: oneWeekAgo, end: new Date() })) {
    return t('collection.recents');
  }
  if (isSameDay(date, oneWeekAgo)) {
    return t('collection.sevenDaysAgo');
  }
  return format(date, 'MMMM yyyy');
};

/**
 * Groups flashcard sets by date and sorts them within each group
 * @param sets - Array of flashcard sets to group
 * @param order - Sorting order ('asc' or 'dsc')
 * @param t - Translation function for internationalization
 * @returns Record of grouped sets with their group keys
 */
const groupSets = (sets: FlashcardSets[] | undefined, order: 'asc' | 'dsc', t: TFunction): Record<string, FlashcardSets[]> => {
  if (!sets) return {};

  const now = new Date();
  const oneWeekAgo = subDays(now, 7);

  // Group sets by their creation date
  const groupedSets = sets.reduce((acc, set) => {
    if (!set.created_at_utc) return acc;
    
    const date = new Date(set.created_at_utc);
    const groupKey = getGroupKey(date, oneWeekAgo, t);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(set);
    return acc;
  }, {} as Record<string, FlashcardSets[]>);

  // Sort sets within each group
  Object.keys(groupedSets).forEach(key => {
    groupedSets[key] = groupedSets[key].sort((a, b) => {
      if (!a.created_at_utc || !b.created_at_utc) return 0;
      const dateA = new Date(a.created_at_utc);
      const dateB = new Date(b.created_at_utc);
      return order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });
  });

  return groupedSets;
};

/**
 * Groups flashcard sets by date in ascending order (oldest first)
 * @param sets - Array of flashcard sets to group
 * @param t - Translation function for internationalization
 */
export const groupByDateAscending = (sets: FlashcardSets[] | undefined, t: TFunction) => groupSets(sets, 'asc', t);

/**
 * Groups flashcard sets by date in descending order (newest first)
 * @param sets - Array of flashcard sets to group
 * @param t - Translation function for internationalization
 */
export const groupByDateDescending = (sets: FlashcardSets[] | undefined, t: TFunction) => groupSets(sets, 'dsc', t);
