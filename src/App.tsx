import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Share2, UserCircle, Terminal, HelpCircle, ShieldAlert } from 'lucide-react';
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

type TabId = 'home' | 'friends' | 'connections' | 'profile';

export default function App() {
  return (
    <LanguageProvider>
      <DatabaseProvider>
        <ScrollActiveProvider>
          <AppContent />
        </ScrollActiveProvider>
      </DatabaseProvider>
    </LanguageProvider>
  );
}

function AppContent() {
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const isScrolled = useScrollActive();
  const { t } = useLanguage();

  // Load intro state from sessionStorage as requested
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
      
      {/* Immersive Background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        <div className="scanlines absolute inset-0 opacity-15"></div>
        {/* Cyber glowing matrix particles system */}
        <CyberParticles />
        {/* Neon Ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <AnimatePresence mode="wait">
        {!introCompleted ? (
          /* Introduction Screen: Database Security access loop */
          <IntroScreen key="intro" onComplete={handleIntroComplete} />
        ) : (
          /* Main Interactive Site Panel */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full relative z-10 max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 space-y-6 flex flex-col justify-start min-h-screen"
          >
            {/* Top Interactive Banner with Clock & Music Player */}
            <Header />

            {/* Desktop and Mobile Responsive Nav Deck */}
            <div className={`sticky top-3 z-40 backdrop-blur-xl w-full border neon-border-cyan rounded-lg p-2.5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 transition-all duration-500 ${
              isScrolled ? 'bg-slate-950/70 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-900/40'
            }`}>
              <div className="corner-gold-tl"></div>
              <div className="corner-gold-tr"></div>
              <div className="corner-gold-bl"></div>
              <div className="corner-gold-br"></div>

              {/* Dot matrix grid texture */}
              <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

              {/* Status flag */}
              <div className="flex items-center gap-2 px-2 text-xs font-mono text-cyan-400">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span className="uppercase text-[10px] tracking-widest font-semibold">
                  {t('selectNode')}
                </span>
              </div>

              {/* Tab Selector Links */}
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
                        boxShadow: isActive 
                          ? '0 0 15px rgba(6,182,212,0.45)' 
                          : '0 0 10px rgba(6,182,212,0.25)',
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

              {/* Reset Session Option to return to intro screen */}
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

            {/* Inner Content Tabs with smooth animations */}
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

            {/* Terminal Digital Watermark Margin Footer */}
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

            <AnimatePresence>
              {isAdminOpen && (
                <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
