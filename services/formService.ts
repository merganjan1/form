
import { Form, FormResponse } from '../types';

/**
 * MOCK FIRESTORE SERVICE
 * Persists data to localStorage to provide "full-stack" functionality without a backend.
 */

const STORAGE_KEY_FORMS = 'gemini_forms_data';
const STORAGE_KEY_RESPONSES = 'gemini_forms_responses';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getForms = (): Form[] => {
  const data = localStorage.getItem(STORAGE_KEY_FORMS);
  return data ? JSON.parse(data) : [];
};

const saveForms = (forms: Form[]) => {
  localStorage.setItem(STORAGE_KEY_FORMS, JSON.stringify(forms));
};

const getResponses = (): FormResponse[] => {
  const data = localStorage.getItem(STORAGE_KEY_RESPONSES);
  return data ? JSON.parse(data) : [];
};

const saveResponses = (responses: FormResponse[]) => {
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
};

export const formService = {
  async createForm(formData: Omit<Form, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    await delay(500);
    const forms = getForms();
    const newForm: Form = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    forms.push(newForm);
    saveForms(forms);
    return newForm.id;
  },

  async updateForm(id: string, formData: Partial<Form>): Promise<void> {
    await delay(300);
    const forms = getForms();
    const index = forms.findIndex(f => f.id === id);
    if (index !== -1) {
      forms[index] = { ...forms[index], ...formData, updatedAt: Date.now() };
      saveForms(forms);
    }
  },

  async deleteForm(id: string): Promise<void> {
    await delay(300);
    const forms = getForms();
    const filtered = forms.filter(f => f.id !== id);
    saveForms(filtered);
    
    // Also cleanup responses
    const responses = getResponses();
    const filteredResponses = responses.filter(r => r.formId !== id);
    saveResponses(filteredResponses);
  },

  async getFormById(id: string): Promise<Form | null> {
    await delay(200);
    const forms = getForms();
    return forms.find(f => f.id === id) || null;
  },

  async getFormsByCreator(creatorId: string): Promise<Form[]> {
    await delay(400);
    const forms = getForms();
    return forms.filter(f => f.creatorId === creatorId).sort((a, b) => b.createdAt - a.createdAt);
  },

  async submitResponse(responseData: Omit<FormResponse, 'id' | 'submittedAt'>): Promise<string> {
    await delay(600);
    const responses = getResponses();
    const newResponse: FormResponse = {
      ...responseData,
      id: crypto.randomUUID(),
      submittedAt: Date.now()
    };
    responses.push(newResponse);
    saveResponses(responses);
    return newResponse.id;
  },

  async getResponsesByForm(formId: string): Promise<FormResponse[]> {
    await delay(300);
    const responses = getResponses();
    return responses.filter(r => r.formId === formId).sort((a, b) => b.submittedAt - a.submittedAt);
  }
};
