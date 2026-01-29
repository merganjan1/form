
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
  const [showSendModal, setShowSendModal] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const publicLink = `${window.location.origin}/#/form/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!form) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Top Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-[#003366]">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <span className="font-bold">{form.title || 'Sarlavhasiz shakl'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSendModal(true)}
            className="bg-[#003366] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#002244] transition flex items-center gap-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            Yuborish
          </button>
        </div>
      </div>

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
                    placeholder="Savol matni"
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

                {(q.type === QuestionType.RADIO || q.type === QuestionType.CHECKBOX || q.type === QuestionType.DROPDOWN) && (
                  <div className="pl-10 space-y-3">
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
                    <button 
                      onClick={() => {
                        const newOpts = [...(q.options || []), { id: crypto.randomUUID(), text: 'Yangi variant' }];
                        updateQuestion(q.id, { options: newOpts });
                      }}
                      className="ml-10 text-sm font-bold text-[#003366] hover:underline"
                    >
                      + Variant qo'shish
                    </button>
                  </div>
                )}

                <div className="mt-8 flex items-center gap-4 pl-10 border-t border-gray-50 pt-6">
                  <div className="flex-grow"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Majburiy</span>
                    <button 
                      onClick={() => updateQuestion(q.id, { required: !q.required })}
                      className={`w-11 h-6 rounded-full relative transition-colors ${q.required ? 'bg-[#003366]' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${q.required ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addQuestion}
            className="w-full mt-8 bg-white border border-dashed border-gray-300 py-5 rounded-xl text-sm font-bold text-gray-400 hover:text-[#003366] hover:border-[#003366] transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Yangi savol qo'shish
          </button>
        </>
      ) : (
        /* Preview Mode - Fixed and Enhanced */
        <div className="animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 border-t-[12px] border-t-[#003366]">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title || 'Untitled Form'}</h1>
            <p className="text-gray-500 whitespace-pre-wrap">{form.description || 'Forma tavsifi yo\'q'}</p>
          </div>

          <div className="space-y-4">
            {form.questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <label className="block text-lg font-medium text-gray-900 mb-6">
                  {q.title} {q.required && <span className="text-red-500">*</span>}
                </label>
                
                <div className="space-y-3">
                  {(q.type === QuestionType.RADIO || q.type === QuestionType.CHECKBOX) && (
                    <div className="space-y-2">
                      {q.options?.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-transparent">
                          <div className={`w-5 h-5 border-2 flex items-center justify-center ${q.type === QuestionType.RADIO ? 'rounded-full' : 'rounded'} border-gray-300`}></div>
                          <span className="text-sm text-gray-700">{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === QuestionType.DROPDOWN && (
                    <div className="w-full max-w-xs p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 flex justify-between items-center">
                      Tanlang...
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  )}

                  {q.type === QuestionType.SHORT_TEXT && (
                    <div className="w-full border-b-2 border-gray-100 py-2 text-gray-300 italic text-sm">
                      Qisqa javob matni
                    </div>
                  )}

                  {q.type === QuestionType.PARAGRAPH && (
                    <div className="w-full border-b-2 border-gray-100 py-2 text-gray-300 italic text-sm">
                      Uzun javob matni
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex items-center justify-between px-2">
             <button disabled className="bg-[#003366]/50 text-white px-8 py-3 rounded-xl font-bold cursor-not-allowed">Yuborish</button>
             <button disabled className="text-sm font-bold text-gray-300 cursor-not-allowed">Formani tozalash</button>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSendModal(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 relative shadow-2xl animate-in zoom-in duration-200">
            <button 
              onClick={() => setShowSendModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Formani yuborish</h2>
            <p className="text-gray-500 mb-8 text-sm">Ushbu havolani nusxalang va so'rovnomada qatnashishi kerak bo'lgan insonlarga yuboring.</p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">So'rovnoma havolasi</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 group">
                  <div className="text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                  <input 
                    readOnly 
                    value={publicLink} 
                    className="bg-transparent flex-grow text-sm font-medium text-gray-600 outline-none truncate"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${copied ? 'bg-green-500 text-white' : 'bg-[#003366] text-white hover:bg-[#002244]'}`}
                  >
                    {copied ? 'Nusxalandi!' : 'Nusxalash'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Javoblar real vaqtda yangilanadi.</span>
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="text-sm font-bold text-gray-400 hover:text-gray-900"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
