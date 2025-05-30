export interface QuestData {
  finish_on_boarding: boolean;
  upload_file: boolean;
  ask_a_question: boolean;
  create_class: boolean;
  explainer_video: boolean;
}

export interface Quest {
  quest_completed: boolean;
  quest_data: QuestData;
}
