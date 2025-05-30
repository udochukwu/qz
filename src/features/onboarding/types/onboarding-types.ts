export enum StudentType {
  Undergraduate = 'Undergraduate Student',
  Graduate = 'Graduate Student',
  Other = 'Other',
}

export enum LMS {
  Canvas = 'canvas',
  Blackboard = 'blackboard',
  None = '',
  // Add other LMS types as needed
}

export interface SchoolOption {
  name: string;
  school_id: string;
}

// Centralized type for school data
export interface StepSchool {
  name: string;
  id: string;
  lms: LMS | ''; // Allow for an empty string if no LMS is selected
  lms_url: string;
  integration_id?: string;
  isLoading?: boolean;
}

export type StepPost =
  | { student_type: StudentType }
  | { school: string; majors: string[] }
  | { lms_linking_step_completed: boolean; route?: string };

export interface Step {
  student_type: StudentType | null;
  school: StepSchool | null;
  majors: string[] | null;
  lms_linking_step_completed: boolean | null;
}

export interface OnboardingStep {
  is_onboarded: boolean;
  steps: Step;
}

export interface OnboardingQuestion {
  key: string;
  question: string;
  options: string[];
  type?: 'dropdown';
}

export interface StepsV2 {
  study_level_step: boolean;
  questions: OnboardingQuestion[];
}

export interface OnboardingV2 {
  is_onboarded: boolean;
  steps: StepsV2;
}

export interface StepPostV2 {
  study_level?: string;
  answers?: Record<string, string>;
}
