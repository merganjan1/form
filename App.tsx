
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, auth, signInWithGoogle } from './firebase';

import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import PublicForm from './pages/PublicForm';
import ResponseDashboard from './pages/ResponseDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using our custom mock observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003366]"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#f1f3f4]">
        <Header user={user} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <LoginPage />} />
            <Route path="/builder/:id?" element={user ? <FormBuilder /> : <Navigate to="/" />} />
            <Route path="/form/:id" element={<PublicForm />} />
            <Route path="/responses/:id" element={user ? <ResponseDashboard /> : <Navigate to="/" />} />
            <Route path="/thanks" element={<ThanksPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

const LoginPage = () => (
  <div className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md w-full">
      <div className="w-16 h-16 bg-[#003366] rounded-2xl flex items-center justify-center mb-8 shadow-lg">
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 19v-2h10v2H7zm0-4v-2h10v2H7zm0-4V9h10v2H7z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Xush kelibsiz!</h1>
      <p className="text-gray-500 text-center mb-10">
        Formalar yaratishni boshlash uchun Google hisobingiz orqali tizimga kiring.
      </p>
      <button 
        onClick={signInWithGoogle}
        className="w-full bg-[#003366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#002244] transition-all active:scale-[0.98] shadow-md"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google orqali kirish
      </button>
    </div>
  </div>
);

const ThanksPage = () => (
  <div className="max-w-xl mx-auto bg-white p-12 rounded-3xl shadow-sm border border-gray-100 mt-10 text-center animate-in zoom-in duration-300">
    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-4">Javobingiz yuborildi!</h1>
    <p className="text-gray-500 mb-10 leading-relaxed">
      Ushbu shaklni to'ldirganingiz uchun tashakkur. Sizning javobingiz muvaffaqiyatli qayd etildi.
    </p>
    <button 
      onClick={() => window.location.hash = '/'} 
      className="bg-[#003366] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#002244] transition shadow-md"
    >
      Asosiy sahifaga qaytish
    </button>
  </div>
);

export default App;
