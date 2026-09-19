'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, LogOut } from "lucide-react";

export default function Nav() {
  const pathname = usePathname();
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('de_auth');
    const expires = localStorage.getItem('de_auth_expires');
    if (token && expires && Date.now() > parseInt(expires)) {
      localStorage.removeItem('de_auth');
      localStorage.removeItem('de_auth_expires');
      setAuth(false);
    } else if (token) {
      setAuth(true);
      const saved = localStorage.getItem('de_profile');
      if (saved) setProfile(JSON.parse(saved));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('de_auth');
    localStorage.removeItem('de_auth_expires');
    localStorage.removeItem('de_profile');
    setAuth(false);
    setProfile(null);
    window.location.href = '/';
  }

  const isHome = pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060810]/70 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#8b5cf6] flex items-center justify-center text-sm font-bold">DE</div>
          <span className="font-bold text-lg tracking-tight">Digital Explorers</span>
        </Link>
        <div className="flex items-center gap-2">
          {auth ? (
            <>
              <Link href="/dashboard"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Dashboard</button></Link>
              <Link href="/worlds"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Mondes</button></Link>
              <Link href="/pricing"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Tarifs</button></Link>
              {profile && <span className="text-xs text-violet-400 mr-2 hidden sm:block">{profile.pseudonym}</span>}
              <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors" title="Se déconnecter"><LogOut className="w-4 h-4" /></button>
            </>
          ) : (
            <>
              <Link href={isHome ? "#mondes" : "/worlds"}><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Mondes</button></Link>
              <Link href="/pricing"><button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">Tarifs</button></Link>
              <Link href="/auth/login"><button className="px-4 py-2 text-sm border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-all">Connexion</button></Link>
              <Link href="/auth/signup"><button className="px-5 py-2 text-sm bg-gradient-to-r from-[#ff6b6b] to-[#8b5cf6] rounded-full font-semibold hover:opacity-90 transition-opacity ml-1">Commencer</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
