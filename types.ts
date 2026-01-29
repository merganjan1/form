
export enum QuestionType {
  SHORT_TEXT = 'SHORT_TEXT',
  PARAGRAPH = 'PARAGRAPH',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN'
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: QuestionOption[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorEmail: string;
  questions: Question[];
  createdAt: number;
  updatedAt: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, any>;
  submittedAt: number;
}
