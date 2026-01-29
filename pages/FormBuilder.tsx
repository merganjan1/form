
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { formService } from '../services/formService';
import { Form, Question, QuestionType } from '../types';

const FormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<Form | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [responsesCount, setResponsesCount] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});

  // View mode derived from query param 'mode'
  const viewMode = searchParams.get('mode') === 'preview' ? 'preview' : 'editor';

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    const data = await formService.getFormById(formId);
    if (data) {
      setForm(data);
      if (data.questions.length > 0) setActiveQuestionId(data.questions[0].id);
      
      const res = await formService.getResponsesByForm(formId);
      setResponsesCount(res.length);
    }
  };

  const setMode = (mode: 'editor' | 'preview') => {
    setSearchParams({ mode });
  };

  const addQuestion = () => {
    if (!form) return;
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: QuestionType.RADIO,
      title: 'Untitled Question',
      required: false,
      options: [
        { id: crypto.randomUUID(), text: 'Variant A' }
      ]
    };
    const updatedForm = { ...form, questions: [...form.questions, newQuestion] };
    setForm(updatedForm);
    setActiveQuestionId(newQuestion.id);
    formService.updateForm(form.id, updatedForm);
  };

  const updateQuestion = (qid: string, updates: Partial<Question>) => {
    if (!form) return;
    const updatedQuestions = form.questions.map(q => 
      q.id === qid ? { ...q, ...updates } : q
    );
    const updatedForm = { ...form, questions: updatedQuestions };
    setForm(updatedForm);
    formService.updateForm(form.id, updatedForm);
  };

  const deleteQuestion = (qid: string) => {
    if (!form) return;
    if (form.questions.length <= 1) return;
    const updatedQuestions = form.questions.filter(q => q.id !== qid);
    const updatedForm = { ...form, questions: updatedQuestions };
    setForm(updatedForm);
    if (activeQuestionId === qid) setActiveQuestionId(updatedQuestions[0]?.id || null);
    formService.updateForm(form.id, updatedForm);
  };

  if (!form) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Navigation Tabs */}
      <div className="bg-[#f0f0f0] rounded-full p-1 mb-8 flex items-center justify-between shadow-sm border border-gray-200">
        <button 
          onClick={() => setMode('editor')}
          className={`flex-1 py-2 text-center text-sm font-bold rounded-full transition-all ${viewMode === 'editor' ? 'bg-[#003366] text-white' : 'text-gray-500 hover:text-[#003366]'}`}
        >
          Forma yaratish
        </button>
        <button 
          onClick={() => setMode('preview')}
          className={`flex-1 py-2 text-center text-sm font-bold rounded-full transition-all ${viewMode === 'preview' ? 'bg-[#003366] text-white' : 'text-gray-500 hover:text-[#003366]'}`}
        >
          Oldindan ko'rish
        </button>
        <button 
          onClick={() => navigate(`/responses/${id}`)}
          className="flex-1 py-2 text-center text-sm font-bold text-gray-500 hover:text-[#003366] transition-colors"
        >
          Javoblar ({responsesCount})
        </button>
      </div>

      {viewMode === 'editor' ? (
        <>
          {/* Editor Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 overflow-hidden">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-6 bg-[#003366] rounded-full"></div>
                  <label className="text-[10px] font-bold text-[#003366] uppercase tracking-[0.2em]">Forma nomi</label>
                </div>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={(e) => {
                    const updated = { ...form, title: e.target.value };
                    setForm(updated);
                    formService.updateForm(form.id, updated);
                  }}
                  className="w-full text-lg font-bold border-b border-gray-100 focus:border-[#003366] focus:outline-none pb-3 transition bg-transparent"
                  placeholder="Yangi forma"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1.5 h-6 bg-[#003366] rounded-full"></div>
                  <label className="text-[10px] font-bold text-[#003366] uppercase tracking-[0.2em]">Forma tavsifi</label>
                </div>
                <textarea 
                  value={form.description}
                  onChange={(e) => {
                    const updated = { ...form, description: e.target.value };
                    setForm(updated);
                    formService.updateForm(form.id, updated);
                  }}
                  className="w-full text-sm text-gray-400 border-b border-gray-100 focus:border-[#003366] focus:outline-none pb-3 transition bg-transparent resize-none"
                  placeholder="Forma tavsifi"
                  rows={1}
                />
              </div>
            </div>

            <div className="mt-12 flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative px-6 bg-white text-[10px] font-bold text-[#003366] tracking-[0.4em] uppercase">Forma Sarlavhasi</span>
            </div>
          </div>

          {/* Editor Questions Section */}
          <div className="space-y-6">
            {form.questions.map((q) => (
              <div 
                key={q.id}
                onClick={() => setActiveQuestionId(q.id)}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all ${activeQuestionId === q.id ? 'ring-2 ring-[#003366]/5' : ''}`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-gray-300 pt-3">
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                  </div>
                  <input 
                    type="text"
                    value={q.title}
                    onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                    className="flex-grow text-base bg-[#f8f9fa] px-5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#003366]"
                    placeholder="Untitled Question"
                  />
                  <select 
                    value={q.type}
                    onChange={(e) => {
                      const type = e.target.value as QuestionType;
                      updateQuestion(q.id, { type });
                    }}
                    className="p-3 bg-[#f8f9fa] border-none rounded-xl focus:outline-none focus:ring-1 focus:ring-[#003366] text-sm font-semibold min-w-[160px]"
                  >
                    <option value={QuestionType.SHORT_TEXT}>Qisqa matn</option>
                    <option value={QuestionType.PARAGRAPH}>Uzun matn</option>
                    <option value={QuestionType.RADIO}>Bir tanlov</option>
                    <option value={QuestionType.CHECKBOX}>Ko'p tanlov</option>
                    <option value={QuestionType.DROPDOWN}>Ro'yxat</option>
                  </select>
                  <button onClick={() => deleteQuestion(q.id)} className="p-2 text-red-400 hover:text-red-500 transition mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                {/* Options List */}
                {(q.type === QuestionType.RADIO || q.type === QuestionType.CHECKBOX || q.type === QuestionType.DROPDOWN) && (
                  <div className="pl-10 space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Variantlar:</p>
                    {q.options?.map((opt, oIdx) => (
                      <div key={opt.id} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 w-4">{oIdx + 1}.</span>
                        <input 
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...(q.options || [])];
                            newOpts[oIdx].text = e.target.value;
                            updateQuestion(q.id, { options: newOpts });
                          }}
                          className="flex-grow text-sm bg-[#f8f9fa] px-5 py-2.5 rounded-lg border-none focus:ring-1 focus:ring-[#003366]"
                        />
                        <button 
                          onClick={() => {
                            const newOpts = q.options?.filter(o => o.id !== opt.id);
                            updateQuestion(q.id, { options: newOpts });
                          }}
                          className="text-red-300 hover:text-red-500 transition"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex-grow bg-[#f8f9fa] rounded-lg px-5">
                        <input 
                          id={`new-opt-${q.id}`}
                          type="text"
                          className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
                          placeholder="Variant matni..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value;
                              if (!val) return;
                              const newOpts = [...(q.options || []), { id: crypto.randomUUID(), text: val }];
                              updateQuestion(q.id, { options: newOpts });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const input = document.getElementById(`new-opt-${q.id}`) as HTMLInputElement;
                          if (input && input.value) {
                            const newOpts = [...(q.options || []), { id: crypto.randomUUID(), text: input.value }];
                            updateQuestion(q.id, { options: newOpts });
                            input.value = '';
                          }
                        }}
                        className="bg-white border border-gray-200 text-xs font-bold py-2.5 px-8 rounded-lg hover:bg-gray-50 transition shadow-sm"
                      >
                        Qo'shish
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center gap-4 pl-10">
                  <button 
                    onClick={() => updateQuestion(q.id, { required: !q.required })}
                    className={`w-11 h-6 rounded-full relative transition-colors ${q.required ? 'bg-[#003366]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${q.required ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </button>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Majburiy savol</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addQuestion}
            className="w-full mt-8 bg-white border border-gray-100 py-5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Savol qo'shish
          </button>
        </>
      ) : (
        /* In-page Preview Mode */
        <div className="animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title || 'Yangi forma'}</h1>
            <p className="text-gray-500 whitespace-pre-wrap">{form.description || 'Forma tavsifi'}</p>
          </div>

          <div className="space-y-4">
            {form.questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <label className="block text-lg font-medium text-gray-900 mb-6">
                  {q.title} {q.required && <span className="text-red-500">*</span>}
                </label>

                {(q.type === QuestionType.RADIO || q.type === QuestionType.CHECKBOX) && (
                  <div className="space-y-3">
                    {q.options?.map(opt => {
                      const isSelected = q.type === QuestionType.RADIO 
                        ? previewAnswers[q.id] === opt.text 
                        : (previewAnswers[q.id] || []).includes(opt.text);
                      
                      return (
                        <div 
                          key={opt.id} 
                          onClick={() => {
                            if (q.type === QuestionType.RADIO) {
                              setPreviewAnswers(prev => ({ ...prev, [q.id]: opt.text }));
                            } else {
                              const current = previewAnswers[q.id] || [];
                              const next = isSelected 
                                ? current.filter((v: string) => v !== opt.text)
                                : [...current, opt.text];
                              setPreviewAnswers(prev => ({ ...prev, [q.id]: next }));
                            }
                          }}
                          className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-[#003366] bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${isSelected ? 'border-[#003366]' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#003366]"></div>}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? 'text-[#003366]' : 'text-gray-700'}`}>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {q.type === QuestionType.SHORT_TEXT && (
                  <input 
                    type="text" 
                    onChange={(e) => setPreviewAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full border-b border-gray-100 focus:border-[#003366] focus:outline-none pb-2 transition bg-transparent"
                    placeholder="Javobingizni yozing..."
                  />
                )}

                {q.type === QuestionType.PARAGRAPH && (
                  <textarea 
                    onChange={(e) => setPreviewAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full border-b border-gray-100 focus:border-[#003366] focus:outline-none pb-2 transition bg-transparent resize-none"
                    placeholder="Javobingizni yozing..."
                    rows={2}
                  />
                )}
              </div>
            ))}

            <button 
              className="w-full mt-8 bg-[#003366] text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
              onClick={() => alert("Bu shunchaki oldindan ko'rish rejimi. Javoblar saqlanmaydi.")}
            >
              Yuborish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
