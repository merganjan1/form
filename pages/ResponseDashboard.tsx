
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formService } from '../services/formService';
import { Form, FormResponse } from '../types';

const ResponseDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData(id);
  }, [id]);

  const loadData = async (formId: string) => {
    try {
      const [formData, responseData] = await Promise.all([
        formService.getFormById(formId),
        formService.getResponsesByForm(formId)
      ]);
      setForm(formData);
      setResponses(responseData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Yuklanmoqda...</div>;
  if (!form) return <div className="p-10 text-center text-red-500">Forma topilmadi</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Navigation Tabs */}
      <div className="bg-[#f0f0f0] rounded-full p-1 mb-8 flex items-center justify-between shadow-sm border border-gray-200">
        <button 
          onClick={() => navigate(`/builder/${id}`)} 
          className="flex-1 py-2 text-center text-sm font-bold text-gray-500 hover:text-[#003366] transition-colors"
        >
          Forma yaratish
        </button>
        <button 
          onClick={() => navigate(`/builder/${id}?mode=preview`)}
          className="flex-1 py-2 text-center text-sm font-bold text-gray-500 hover:text-[#003366] transition-colors"
        >
          Oldindan ko'rish
        </button>
        <button className="flex-1 py-2 text-center text-sm font-bold bg-[#003366] text-white rounded-full transition-all">
          Javoblar ({responses.length})
        </button>
      </div>

      {/* Stats Banner */}
      <div className="bg-[#0055aa] rounded-2xl shadow-lg p-8 mb-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Javoblar statistikasi</h2>
            <p className="text-blue-100 text-sm">Jami {responses.length} ta javob</p>
          </div>
        </div>
        <div className="bg-white/20 px-6 py-4 rounded-2xl flex items-center gap-3">
          <div className="bg-white text-[#0055aa] p-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </div>
          <span className="text-3xl font-bold">{responses.length}</span>
        </div>
      </div>

      {/* Responses Table/List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-20">#</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Yuborilgan vaqt</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Javoblar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {responses.length === 0 ? (
              <tr><td colSpan={3} className="px-8 py-12 text-center text-gray-400">Hozircha javoblar yo'q</td></tr>
            ) : (
              responses.map((res, i) => (
                <tr key={res.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-8 py-4 text-sm font-bold text-[#003366]">{i + 1}</td>
                  <td className="px-8 py-4 text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(res.submittedAt).toLocaleString('uz-UZ')}
                  </td>
                  <td className="px-8 py-4 text-sm text-gray-400 italic">Javob ko'rildi</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detailed Responses Section */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">Batafsil javoblar</h3>
      <div className="space-y-4">
        {responses.map((res, i) => (
          <div key={res.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-bold text-[#003366]">Javob #{i + 1}</h4>
              <span className="text-xs text-gray-400">{new Date(res.submittedAt).toLocaleString('uz-UZ')}</span>
            </div>
            <div className="space-y-4">
              {form.questions.map(q => (
                <div key={q.id} className="border-l-2 border-gray-100 pl-4 py-1">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">{q.title}</p>
                  <p className="text-sm text-gray-800">
                    {Array.isArray(res.answers[q.id]) ? res.answers[q.id].join(', ') : (res.answers[q.id] || <span className="text-gray-300 italic">Javob berilmagan</span>)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponseDashboard;
