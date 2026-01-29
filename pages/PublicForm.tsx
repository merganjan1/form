
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formService } from '../services/formService';
import { Form, QuestionType } from '../types';

const PublicForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadForm(id);
  }, [id]);

  const loadForm = async (formId: string) => {
    const data = await formService.getFormById(formId);
    if (data) {
      setForm(data);
      // Initialize default values for better UX
      const initialAnswers: Record<string, any> = {};
      data.questions.forEach(q => {
        if (q.type === QuestionType.CHECKBOX) initialAnswers[q.id] = [];
      });
      setAnswers(initialAnswers);
    } else {
      setError("Kechirasiz, ushbu so'rovnoma topilmadi yoki o'chirib tashlangan.");
    }
  };

  const handleInputChange = (qid: string, value: any) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const clearForm = () => {
    if (window.confirm("Haqiqatan ham barcha javoblarni o'chirib, formani qaytadan to'ldirmoqchimisiz?")) {
      const resetAnswers: Record<string, any> = {};
      form?.questions.forEach(q => {
        if (q.type === QuestionType.CHECKBOX) resetAnswers[q.id] = [];
      });
      setAnswers(resetAnswers);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    // Validation
    const missingRequired = form.questions.filter(q => {
      if (!q.required) return false;
      const answer = answers[q.id];
      if (q.type === QuestionType.CHECKBOX) return !answer || answer.length === 0;
      return !answer || (typeof answer === 'string' && answer.trim() === '');
    });

    if (missingRequired.length > 0) {
      alert(`Iltimos, barcha majburiy (*) savollarga javob bering.`);
      const firstMissing = document.getElementById(`q-${missingRequired[0].id}`);
      firstMissing?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      await formService.submitResponse({
        formId: id,
        answers: answers
      });
      navigate('/thanks');
    } catch (err) {
      alert("Xatolik yuz berdi. Iltimos, internet aloqasini tekshirib, qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forma topilmadi</h1>
        <p className="text-gray-500 max-w-md mb-8">{error}</p>
        <button onClick={() => navigate('/')} className="text-[#003366] font-bold hover:underline">Asosiy sahifaga qaytish</button>
      </div>
    );
  }

  if (!form) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366] mb-4"></div>
      <p className="text-gray-500 font-medium">So'rovnoma yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto pb-20 px-4">
      {/* Form Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 border-t-[12px] border-t-[#003366]">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title || 'Sarlavhasiz shakl'}</h1>
          <p className="text-gray-600 whitespace-pre-wrap leading-relaxed mb-6">{form.description || 'Ushbu so\'rovnoma uchun tavsif berilmagan.'}</p>
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium">
            <span className="text-red-500">* Majburiy savollar</span>
            <span className="text-gray-400">Yaratuvchi: {form.creatorEmail}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {form.questions.map((q) => (
          <div 
            key={q.id} 
            id={`q-${q.id}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-shadow hover:shadow-md"
          >
            <label className="block text-lg font-medium text-gray-900 mb-8 leading-tight">
              {q.title} {q.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Radio / Multiple Choice */}
            {q.type === QuestionType.RADIO && (
              <div className="space-y-3">
                {q.options?.map(opt => (
                  <label 
                    key={opt.id} 
                    className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${answers[q.id] === opt.text ? 'border-[#003366] bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
                  >
                    <input 
                      type="radio"
                      name={q.id} 
                      checked={answers[q.id] === opt.text}
                      onChange={() => handleInputChange(q.id, opt.text)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${answers[q.id] === opt.text ? 'border-[#003366]' : 'border-gray-300'}`}>
                      {answers[q.id] === opt.text && <div className="w-2.5 h-2.5 rounded-full bg-[#003366]"></div>}
                    </div>
                    <span className={`text-sm font-medium ${answers[q.id] === opt.text ? 'text-[#003366]' : 'text-gray-700'}`}>{opt.text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Checkbox / Multiple Answer */}
            {q.type === QuestionType.CHECKBOX && (
              <div className="space-y-3">
                {q.options?.map(opt => {
                  const isChecked = (answers[q.id] || []).includes(opt.text);
                  return (
                    <label 
                      key={opt.id} 
                      className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${isChecked ? 'border-[#003366] bg-blue-50/20' : 'border-gray-50 hover:border-gray-100'}`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const current = answers[q.id] || [];
                          const next = isChecked 
                            ? current.filter((v: string) => v !== opt.text)
                            : [...current, opt.text];
                          handleInputChange(q.id, next);
                        }}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition ${isChecked ? 'border-[#003366] bg-[#003366]' : 'border-gray-300'}`}>
                        {isChecked && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${isChecked ? 'text-[#003366]' : 'text-gray-700'}`}>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Dropdown / List */}
            {q.type === QuestionType.DROPDOWN && (
              <select 
                value={answers[q.id] || ""}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full max-w-xs p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:outline-none transition-all text-sm font-medium"
              >
                <option value="" disabled>Tanlang</option>
                {q.options?.map(opt => (
                  <option key={opt.id} value={opt.text}>{opt.text}</option>
                ))}
              </select>
            )}

            {/* Short Text */}
            {q.type === QuestionType.SHORT_TEXT && (
              <input 
                type="text" 
                value={answers[q.id] || ""}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full border-b-2 border-gray-100 focus:border-[#003366] focus:outline-none py-3 text-lg transition bg-transparent placeholder-gray-300"
                placeholder="Javobingizni bu yerga yozing..."
              />
            )}

            {/* Paragraph */}
            {q.type === QuestionType.PARAGRAPH && (
              <textarea 
                value={answers[q.id] || ""}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full border-b-2 border-gray-100 focus:border-[#003366] focus:outline-none py-3 text-base transition bg-transparent resize-none placeholder-gray-300"
                placeholder="Batafsil javobingizni bu yerga yozing..."
                rows={2}
              />
            )}
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12">
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full sm:w-auto min-w-[160px] bg-[#003366] hover:bg-[#002244] text-white py-4 px-10 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Yuborilmoqda...
              </>
            ) : 'Yuborish'}
          </button>
          
          <button 
            type="button"
            onClick={clearForm}
            className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors px-6 py-4"
          >
            Formani tozalash
          </button>
        </div>
      </form>

      {/* Footer info */}
      <footer className="mt-20 text-center border-t border-gray-200 pt-10">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
          Ushbu forma "TIU form" orqali yaratilgan.
        </p>
        <div className="flex items-center justify-center gap-2 opacity-30 grayscale">
          <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
             <span className="text-white font-black text-[8px]">TIU</span>
          </div>
          <span className="font-bold text-gray-900">TIU form</span>
        </div>
      </footer>
    </div>
  );
};

export default PublicForm;
