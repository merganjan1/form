
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
    if (data) setForm(data);
    else setError("Forma topilmadi.");
  };

  const handleInputChange = (qid: string, value: any) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !id) return;

    const missingRequired = form.questions.filter(q => q.required && !answers[q.id]);
    if (missingRequired.length > 0) {
      alert(`Iltimos, majburiy savollarga javob bering.`);
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
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!form) return <div className="p-10 text-center">Yuklanmoqda...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{form.title || 'Yangi forma'}</h1>
        <p className="text-gray-500 whitespace-pre-wrap">{form.description || 'Forma tavsifi'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {form.questions.map((q) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <label className="block text-lg font-medium text-gray-900 mb-6">
              {q.title} {q.required && <span className="text-red-500">*</span>}
            </label>

            {(q.type === QuestionType.RADIO || q.type === QuestionType.CHECKBOX) && (
              <div className="space-y-3">
                {q.options?.map(opt => {
                  const isSelected = q.type === QuestionType.RADIO 
                    ? answers[q.id] === opt.text 
                    : (answers[q.id] || []).includes(opt.text);
                  
                  return (
                    <label 
                      key={opt.id} 
                      className={`flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-[#003366] bg-blue-50/20' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <input 
                        type={q.type === QuestionType.RADIO ? 'radio' : 'checkbox'}
                        name={q.id} 
                        onChange={() => {
                          if (q.type === QuestionType.RADIO) {
                            handleInputChange(q.id, opt.text);
                          } else {
                            const current = answers[q.id] || [];
                            const next = isSelected 
                              ? current.filter((v: string) => v !== opt.text)
                              : [...current, opt.text];
                            handleInputChange(q.id, next);
                          }
                        }}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${isSelected ? 'border-[#003366]' : 'border-gray-300'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#003366]"></div>}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-[#003366]' : 'text-gray-700'}`}>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === QuestionType.SHORT_TEXT && (
              <input 
                type="text" 
                required={q.required}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full border-b border-gray-200 focus:border-[#003366] focus:outline-none pb-2 transition bg-transparent"
                placeholder="Javobingizni yozing..."
              />
            )}

            {q.type === QuestionType.PARAGRAPH && (
              <textarea 
                required={q.required}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full border-b border-gray-200 focus:border-[#003366] focus:outline-none pb-2 transition bg-transparent resize-none"
                placeholder="Javobingizni yozing..."
                rows={2}
              />
            )}

            {q.type === QuestionType.DROPDOWN && (
              <select 
                required={q.required}
                value={answers[q.id] || ''}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                className="w-full border-b border-gray-200 focus:border-[#003366] focus:outline-none pb-2 transition bg-transparent cursor-pointer"
              >
                <option value="">-- Variantni tanlang --</option>
                {q.options?.map(opt => (
                  <option key={opt.id} value={opt.text}>{opt.text}</option>
                ))}
              </select>
            )}
          </div>
        ))}

        <button 
          type="submit" 
          disabled={submitting}
          className="w-full mt-8 bg-[#003366] hover:bg-[#002244] text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? 'Yuborilmoqda...' : 'Yuborish'}
        </button>
      </form>
    </div>
  );
};

export default PublicForm;
