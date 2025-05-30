import { queryClient } from '@/providers/Providers';
import { Quest, QuestData } from '../types/quest-types';

export const invalidateQuests = (quest_key: keyof QuestData) => {
  const questData = queryClient.getQueryData<Quest>('quests');
  if (questData) {
    if (!questData.quest_completed && !questData.quest_data[quest_key]) {
      queryClient.invalidateQueries('quests');
    }
  }
  //Edge case: If the quest data is not available, return false to refetch data later on
  else {
    queryClient.invalidateQueries('quests');
  }
};
