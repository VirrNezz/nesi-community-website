import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Share2, UserCircle, Terminal, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import IntroScreen from './components/IntroScreen';
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import FriendlistTab from './components/FriendlistTab';
import ConnectionTab from './components/ConnectionTab';
import ProfileTab from './components/ProfileTab';
import CyberParticles from './components/CyberParticles';
import { ScrollActiveProvider, useScrollActive } from './ScrollContext';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { DatabaseProvider } from './DatabaseContext';
import AdminPanel from './components/AdminPanel';

// Firebase Auth Modules & Instance dari file firebase.ts kamu
import { auth } from './firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';

type TabId = 'home' | 'friends' | 'connections' | 'profile';

// ==========================================
// 1. SYSTEM AUTO-TRANSLATE GLOBAL ENGINE
// ==========================================
const translationCache: Record<string, string> = {};
const LangSystemContext = createContext({ lang: 'en', toggleLang: () => {} });

export function useLang() {
  return useContext(LangSystemContext);
}

export function Translate({ text }: { text: string }) {
  const { lang } = useLang();
  const [translatedText, setTranslatedText] = useState(text);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lang === 'en') {
      setTranslatedText(text);
      return;
    }
    if (translationCache[text]) {
      setTranslatedText(translationCache[text]);
      return;
    }
    setLoading(true);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t&q=${encodeURIComponent(text)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const result = data[0].map((x: any) => x[0]).join('');
        translationCache[text] = result;
        setTranslatedText(result);
      })
      .catch(() => setTranslatedText(text))
      .finally(() => setLoading(false));
  }, [lang, text]);

  return <span className={loading ? "opacity-65 animate-pulse transition-opacity" : ""}>{translatedText}</span>;
}

// ==========================================
// 2. SUB-COMPONENT: ADMIN LOCKSCREEN GATEWAY
// ==========================================
const ADMIN_SHADOW_EMAIL = "admin@fsg-network.local"; // Samakan dengan email di Firebase Console kamu

function AdminGatewayModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_SHADOW_EMAIL) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPassword.trim()) return;
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await signInWithEmailAndPassword(auth, ADMIN_SHADOW_EMAIL, inputPassword);
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrorMessage("PIN/Password Overlord salah!");
      } else {
        setErrorMessage("Gagal terhubung ke Firebase Matrix.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // JIKA BERHASIL LOGIN -> LANGKAHKAN MASUK KE ADMINPANEL ASLI KAMU
  if (user) {
    return <AdminPanel isOpen={true} onClose={() => signOut(auth)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md p-8 rounded-[1.5rem] bg-zinc-950 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-red-400 text-xs transition-colors cursor-pointer"
        >
          [X]
        </button>

        <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center mb-6 mx-auto">
          <Shield size={26} className={submitting ? "animate-spin" : ""} />
        </div>
        <h2 className="text-base font-bold text-white mb-2 uppercase tracking-wider">SECURE OP ACCESS</h2>
        <p className="text-[10px] text-zinc-500 mb-6 uppercase leading-relaxed">Enter the gatekeeper security password to access the system controller.</p>
        
        {authLoading ? (
          <div className="py-4 text-center text-xs text-cyan-400 animate-pulse">VERIFYING HANDSHAKE STATE...</div>
        ) : (
          <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4 text-left text-xs">
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-600" />
              <input
                type={showPassword ? "text" : "password"}
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="INPUT SECURITY PIN..."
                className="w-full bg-slate-900 border border-cyan-800/40 text-cyan-300 rounded-lg pl-12 pr-12 py-3.5 focus:outline-none focus:border-cyan-400 transition-all font-mono tracking-widest uppercase"
                disabled={submitting}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg font-bold text-red-400 text-center uppercase tracking-wide text-[9px]">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !inputPassword}
              className="w-full py-3 bg-cyan-950 hover:bg-cyan-900 border border-cyan-400/50 hover:border-cyan-400 disabled:bg-zinc-900 disabled:text-zinc-600 font-bold uppercase tracking-widest text-cyan-300 rounded-lg transition-all cursor-pointer shadow-lg text-[10px]"
            >
              {submitting ? "COMPILING..." : "AUTHENTICATE CORE_"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// 3. MAIN WRAPPER CONTAINER
// ==========================================
export default function App() {
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'id' : 'en'));

  return (
    <LangSystemContext.Provider value={{ lang, toggleLang }}>
      <LanguageProvider>
        <DatabaseProvider>
          <ScrollActiveProvider>
            <AppContent />
          </ScrollActiveProvider>
        </DatabaseProvider>
      </LanguageProvider>
    </LangSystemContext.Provider>
  );
}

// ==========================================
// 4. MAIN INTERACTIVE CONTENT DISPLAY
// ==========================================
function AppContent() {
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const isScrolled = useScrollActive();
  const { t } = useLanguage();

  useEffect(() => {
    const isDoneSum = sessionStorage.getItem('nesinezz_db_intro_done');
    if (isDoneSum === 'true') {
      setIntroCompleted(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('nesinezz_db_intro_done', 'true');
    setIntroCompleted(true);
  };

  const handleResetSession = () => {
    sessionStorage.removeItem('nesinezz_db_intro_done');
    setIntroCompleted(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0b1528_0%,#040712_65%,#010206_100%)] text-slate-150 font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="scanlines absolute inset-0 opacity-15"></div>
        <CyberParticles />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {!introCompleted ? (
          <IntroScreen key="intro" onComplete={handleIntroComplete} />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full relative z-10 max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 space-y-6 flex flex-col justify-start min-h-screen"
          >
            <Header />

            <div className={`sticky top-3 z-40 backdrop-blur-xl w-full border neon-border-cyan rounded-lg p-2.5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-500 ${
              isScrolled ? 'bg-slate-950/70 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-900/40'
            }`}>
              <div className="corner-gold-tl"></div>
              <div className="corner-gold-tr"></div>
              <div className="corner-gold-bl"></div>
              <div className="corner-gold-br"></div>
              <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

              <div className="flex items-center gap-2 px-2 text-xs font-mono text-cyan-400">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span className="uppercase text-[10px] tracking-widest font-semibold">
                  {t('selectNode')}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center">
                {(
                  [
                    { id: 'home', labelKey: 'homeDeck', icon: <Home className="w-4 h-4" /> },
                    { id: 'friends', labelKey: 'friendlist', icon: <Users className="w-4 h-4" /> },
                    { id: 'connections', labelKey: 'connections', icon: <Share2 className="w-4 h-4" /> },
                    { id: 'profile', labelKey: 'myProfile', icon: <UserCircle className="w-4 h-4" /> },
                  ] as const
                ).map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      whileHover={{ 
                        scale: 1.03, 
                        y: -1,
                        boxShadow: isActive ? '0 0 15px rgba(6,182,212,0.45)' : '0 0 10px rgba(6,182,212,0.25)',
                        borderColor: 'rgba(34,211,238,0.8)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className={`flex items-center gap-2 py-1.5 px-3 md:px-4 rounded text-[10.5px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/15 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                          : `${isScrolled ? 'bg-slate-950' : 'bg-slate-950/60'} border border-cyan-800/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/35`
                      }`}
                    >
                      {tab.icon}
                      <span>{t(tab.labelKey)}</span>
                    </motion.button>
                  );
                })}
              </div>

              <div>
                <button
                  onClick={handleResetSession}
                  className="px-2.5 py-1 text-[8.5px] font-mono text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/50 rounded uppercase tracking-wider transition-colors cursor-pointer"
                  title={t('lockDesc')}
                >
                  {t('lockTerminal')}
                </button>
              </div>
            </div>

            <main className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -25, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 25, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activeTab === 'home' && <HomeTab />}
                  {activeTab === 'friends' && <FriendlistTab />}
                  {activeTab === 'connections' && <ConnectionTab />}
                  {activeTab === 'profile' && <ProfileTab />}
                </motion.div>
              </AnimatePresence>
            </main>

            <footer className="w-full text-center py-5 border-t border-cyan-800/15 text-[9px] text-slate-500 font-mono space-y-1 mt-6">
              <p>
                NESINEZZ CONNECTION SYSTEM MATRIX v4.4.1 //{' '}
                <button 
                  onClick={() => setIsAdminOpen(true)}
                  className="hover:text-cyan-400 hover:underline cursor-pointer font-bold inline-flex items-center gap-1 transition-colors"
                >
                  [🔑 SYS_OP_ACCESS]
                </button>
              </p>
              <p className="text-slate-600">ALL RIGHTS SECURED. PRESERVED OFFLINE STABILITY SESSIONS.</p>
            </footer>

            {/* INTEGRASI MODAL ALERT LOGIN DENGAN PASSWORD SHADOW FIREBASE */}
            <AnimatePresence>
              {isAdminOpen && (
                <AdminGatewayModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
