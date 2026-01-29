
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { formService } from '../services/formService';
import { Form } from '../types';

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    if (!auth.currentUser) return;
    try {
      const data = await formService.getFormsByCreator(auth.currentUser.uid);
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Haqiqatan ham ushbu formani oʻchirib tashlamoqchimisiz?')) {
      await formService.deleteForm(id);
      fetchForms();
    }
  };

  const createNewForm = async (title: string = 'Untitled Form') => {
    if (!auth.currentUser) return;
    const newFormId = await formService.createForm({
      title: title,
      description: '',
      creatorId: auth.currentUser.uid,
      creatorEmail: auth.currentUser.email || '',
      questions: [{
        id: crypto.randomUUID(),
        type: 'SHORT_TEXT' as any,
        title: 'Untitled Question',
        required: false
      }]
    });
    navigate(`/builder/${newFormId}`);
  };

  const filteredForms = forms.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f1f3f4] -mt-8 -mx-4">
      {/* Top Search Area */}
      <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-center sticky top-0 z-10 shadow-sm">
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-3 py-2.5 bg-[#f1f3f4] border-transparent rounded-lg leading-5 focus:bg-white focus:ring-1 focus:ring-[#003366] focus:border-[#003366] sm:text-sm transition-all outline-none"
            placeholder="Qidiruv"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Simplified Create New Form Section */}
      <div className="px-8 pt-8 pb-12 bg-[#f1f3f4]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-medium text-gray-700">Yangi shakl yaratish</h2>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {/* Blank Form Template */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => createNewForm('Untitled Form')}
                className="w-40 h-28 bg-white border border-gray-200 rounded-md hover:border-[#003366] transition-all shadow-sm flex items-center justify-center group"
              >
                <div className="w-12 h-12 flex items-center justify-center">
                   <svg width="40" height="40" viewBox="0 0 40 40">
                    <path d="M20 10V30" stroke="#4285F4" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M10 20H30" stroke="#EA4335" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M20 20L30 20" stroke="#FBBC05" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M20 20L20 10" stroke="#34A853" strokeWidth="4" strokeLinecap="round"/>
                   </svg>
                </div>
              </button>
              <p className="mt-2 text-sm font-medium text-gray-700">Bo'sh shakl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Forms Section */}
      <div className="px-8 py-8 bg-white min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-medium text-gray-800">Oxirgi shakllar</h2>
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-gray-600 flex items-center gap-1 hover:bg-gray-100 px-3 py-1.5 rounded-md">
                Egasining ismi: har kim
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4 4 4-4" /></svg>
              </button>
              <div className="flex items-center border-l border-gray-200 pl-4 gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                <button className="p-2 rounded-full hover:bg-gray-100"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg></button>
                <button className="p-2 rounded-full hover:bg-gray-100"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg></button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">Shakllar topilmadi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredForms.map(form => (
                <div key={form.id} className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#003366] transition-all cursor-pointer shadow-sm relative">
                  <Link to={`/builder/${form.id}`} className="flex-grow flex flex-col">
                    <div className="h-40 bg-blue-50/30 flex items-center justify-center border-b border-gray-100 group-hover:bg-blue-50 transition-colors">
                      <svg className="w-16 h-16 text-blue-100 group-hover:text-blue-200 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 19v-2h10v2H7zm0-4v-2h10v2H7zm0-4V9h10v2H7z" />
                      </svg>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 truncate mb-1">{form.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="p-0.5 bg-[#003366] rounded-sm">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 19v-2h10v2H7zm0-4v-2h10v2H7zm0-4V9h10v2H7z" />
                          </svg>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Ochildi: {new Date(form.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Menu Button */}
                  <div className="absolute bottom-2 right-1 flex items-center">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(form.id, e);
                      }}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
