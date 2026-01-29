
import React from 'react';
import { signInWithGoogle, logout, MockUser } from '../firebase';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: MockUser | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-[#002B5B] text-white px-8 py-3 flex items-center justify-between shadow-sm">
      <Link to="/" className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
           <div className="w-6 h-6 border-4 border-white rounded-full flex items-center justify-center">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
           </div>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Forma Platformasi</h1>
          <p className="text-[10px] text-blue-200 font-medium">Osongina forma yarating va javoblarni yig'ing</p>
        </div>
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user.displayName}</p>
              <p className="text-[10px] text-blue-100">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/30 bg-gray-200 overflow-hidden">
               <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={logout}
              className="border border-white/40 hover:bg-white/10 text-white px-4 py-1.5 rounded-md text-xs font-semibold transition"
            >
              Chiqish
            </button>
          </div>
        ) : (
          <button 
            onClick={signInWithGoogle}
            className="bg-white text-[#002B5B] px-5 py-2 rounded-md text-sm font-bold transition hover:bg-blue-50"
          >
            Kirish
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
