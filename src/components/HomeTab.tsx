import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Code2, Terminal, User, FolderGit2, ChevronDown, Layers, TerminalSquare, Info } from 'lucide-react';
import { aboutWebHtml, aboutWebHtmlEn, softwareList, techStack, faqs } from '../data';
import { useScrollActive } from '../ScrollContext';
import { useLanguage } from '../LanguageContext';
import { useDatabase } from '../DatabaseContext';

function ContributorAvatar({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={() => setFailed(true)}
      />
    );
  }
  return <span className="capitalize">{name.slice(0, 2)}</span>;
}

export default function HomeTab() {
  const { contributors, announcements } = useDatabase();
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const isScrolled = useScrollActive();
  const { language, t } = useLanguage();

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Introduction text fades from bottom to top in clean setup */}
      <motion.div
        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Tentang Website - Glass panel */}
        <div className={`lg:col-span-2 border neon-border-cyan rounded-lg p-5 md:p-6 relative overflow-hidden transition-all duration-500 ${
          isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
        }`}>
          <div className="corner-gold-tl"></div>
          <div className="corner-gold-tr"></div>
          <div className="corner-gold-bl"></div>
          <div className="corner-gold-br"></div>
          
          {/* Tech Laser Sweeper Animation */}
          <div className="laser-scanner"></div>
          {/* Dot matrix grid texture */}
          <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>
          
          <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-4">
            <Info className="w-4.5 h-4.5 text-cyan-400/90" />
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent">
              {t('aboutWebTitle')}
            </h2>
          </div>

          <div 
            className="prose prose-invert"
            dangerouslySetInnerHTML={{ __html: language === 'en' ? aboutWebHtmlEn : aboutWebHtml }}
          />

          {/* Grid system statistics overlay */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-cyan-900/20 text-center font-mono">
            <div className={`p-2.5 rounded-lg border border-cyan-500/15 bg-gradient-to-b from-slate-950/50 to-slate-950/85 hover:border-cyan-400/35 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-slate-950/75 backdrop-blur-sm' : 'bg-slate-950/40'}`}>
              <div className="text-[10px] text-slate-500 uppercase">{t('securityTier')}</div>
              <div className="text-cyan-400 font-bold text-xs mt-0.5">SHA-512 SECURE</div>
            </div>
            <div className={`p-2.5 rounded-lg border border-cyan-500/15 bg-gradient-to-b from-slate-950/50 to-slate-950/85 hover:border-cyan-400/35 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-slate-950/75 backdrop-blur-sm' : 'bg-slate-950/40'}`}>
              <div className="text-[10px] text-slate-500 uppercase">{t('responsive')}</div>
              <div className="text-cyan-400 font-bold text-xs mt-0.5">AUTO_SCALED</div>
            </div>
            <div className={`p-2.5 rounded-lg border border-cyan-500/15 bg-gradient-to-b from-slate-950/50 to-slate-950/85 hover:border-amber-400/35 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-slate-950/75 backdrop-blur-sm' : 'bg-slate-950/40'}`}>
              <div className="text-[10px] text-slate-500 uppercase">{t('reactive')}</div>
              <div className="text-[#dfb133] font-bold text-xs mt-0.5">100% ONLINE</div>
            </div>
            <div className={`p-2.5 rounded-lg border border-cyan-500/15 bg-gradient-to-b from-slate-950/50 to-slate-950/85 hover:border-cyan-400/35 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-slate-950/75 backdrop-blur-sm' : 'bg-slate-950/40'}`}>
              <div className="text-[10px] text-slate-500 uppercase">{t('themeColor')}</div>
              <div className="text-cyan-400 font-bold text-xs mt-0.5">CYAN & GOLD</div>
            </div>
          </div>
        </div>

        {/* Dynamic Tech Stack Info panel */}
        <div className={`border neon-border-cyan rounded-lg p-5 md:p-6 relative overflow-hidden transition-all duration-500 ${
          isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
        }`}>
          <div className="corner-gold-tl"></div>
          <div className="corner-gold-tr"></div>
          <div className="corner-gold-bl"></div>
          <div className="corner-gold-br"></div>
          
          {/* Tech Laser Sweeper Animation */}
          <div className="laser-scanner"></div>
          {/* Dot matrix grid texture */}
          <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

          <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-4">
            <Layers className="w-4.5 h-4.5 text-cyan-400/90" />
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent">
              {t('softwareStackTitle')}
            </h2>
          </div>

          <div className="space-y-4 font-mono">
            {techStack.map((stack) => (
              <div key={stack.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{stack.name}</span>
                  <span className="text-cyan-400 text-[10px] font-bold">{stack.proficiencyLevel}%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-500/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stack.proficiencyLevel}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${stack.color} rounded-full`}
                  />
                </div>
                <div className="text-[8px] text-slate-500 uppercase tracking-tight">
                  CLASSIFICATION: {language === 'en' ? stack.category_en || stack.category : stack.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contributor Section */}
      <motion.div
        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`border neon-border-cyan rounded-lg p-5 md:p-6 relative transition-all duration-500 ${
          isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
        }`}
      >
        <div className="corner-gold-tl"></div>
        <div className="corner-gold-tr"></div>
        <div className="corner-gold-bl"></div>
        <div className="corner-gold-br"></div>

        <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-5">
          <User className="w-4.5 h-4.5 text-cyan-400/90" />
          <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent">
            {t('contributorsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contributors.map((contrib) => (
            <div 
              key={contrib.id} 
              className={`border border-cyan-500/15 hover:border-cyan-400/40 p-4 rounded-lg flex gap-3 items-start relative overflow-hidden group transition-all duration-500 ${
                isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-cyan-500/30' : 'bg-slate-950/50'
              }`}
            >
              {/* Contributor avatar container */}
              <div className="relative shrink-0 mt-1">
                <div className="w-12 h-12 bg-slate-900 rounded-full border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-400 relative z-0 overflow-hidden select-none shadow-[0_0_8px_rgba(6,182,212,0.15)]">
                  <ContributorAvatar url={contrib.avatarUrl} name={contrib.name} />
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <span className="text-slate-200 font-bold font-display text-sm block tracking-wide group-hover:text-cyan-300 transition-colors">
                  {contrib.name}
                </span>
                
                {/* Role badges */}
                <div className="flex flex-wrap gap-1">
                  {contrib.role.map((r, i) => (
                    <span 
                      key={i} 
                      className="text-[8px] bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-mono px-1 py-0.5 rounded tracking-wide uppercase"
                    >
                      {language === 'en' ? contrib.role_en?.[i] || r : r}
                    </span>
                  ))}
                </div>

                <div className="text-[9px] text-slate-500 font-mono truncate mt-1">
                  {language === 'en' ? contrib.specs_en || contrib.specs : contrib.specs}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Software & FAQ split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Software modules */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`border neon-border-cyan rounded-lg p-5 md:p-6 flex flex-col relative overflow-hidden transition-all duration-500 ${
            isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
          }`}
        >
          <div className="corner-gold-tl"></div>
          <div className="corner-gold-tr"></div>
          <div className="corner-gold-bl"></div>
          <div className="corner-gold-br"></div>
          
          {/* Tech Laser Sweeper Animation */}
          <div className="laser-scanner"></div>
          {/* Dot matrix grid texture */}
          <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

          <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-4">
            <FolderGit2 className="w-4.5 h-4.5 text-cyan-400/90" />
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent">
              {t('portalSoftwareTitle')}
            </h2>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {softwareList.map((soft) => (
              <div 
                key={soft.id} 
                className="bg-slate-950 border border-cyan-500/10 p-3 rounded-lg hover:border-cyan-500/30 transition-all font-mono"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{soft.name}</h3>
                    <span className="text-[9px] text-slate-500 block uppercase">
                      {language === 'en' ? soft.type_en || soft.type : soft.type}
                    </span>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-[8px] bg-slate-900 text-cyan-300 border border-cyan-500/30 px-1 py-0.5 rounded">
                      {soft.version}
                    </span>
                    <span className="text-[9px] ml-1.5 font-bold text-emerald-400 animate-pulse">
                      ● {soft.status}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal mt-2">
                  {language === 'en' ? soft.description_en || soft.description : soft.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interactive FAQ accordion */}
        <motion.div
          initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`border neon-border-cyan rounded-lg p-5 md:p-6 flex flex-col relative overflow-hidden transition-all duration-500 ${
            isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
          }`}
        >
          <div className="corner-gold-tl"></div>
          <div className="corner-gold-tr"></div>
          <div className="corner-gold-bl"></div>
          <div className="corner-gold-br"></div>
          
          {/* Tech Laser Sweeper Animation */}
          <div className="laser-scanner"></div>
          {/* Dot matrix grid texture */}
          <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

          <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-4">
            <HelpCircle className="w-4.5 h-4.5 text-cyan-400/90" />
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent">
              {t('portalFAQTitle')}
            </h2>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-slate-950 border border-cyan-500/10 rounded-md overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left py-3 px-4 flex items-center justify-between gap-3 text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span className="text-xs font-semibold font-sans leading-snug tracking-wide">
                      {language === 'en' ? faq.question_en || faq.question : faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-cyan-400 shrink-0"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        <div className="px-4 pb-4.5 border-t border-cyan-900/30 pt-3 text-[10.5px] text-slate-400 font-mono leading-relaxed bg-cyan-950/10">
                          {language === 'en' ? faq.answer_en || faq.answer : faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Dynamic Admin Updates Feed Section - Ganti di bawah NesiNezz's portal */}
      <motion.div
        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={`border neon-border-cyan rounded-lg p-5 md:p-6 relative overflow-hidden transition-all duration-500 mt-6 ${
          isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.2)] border-cyan-400' : 'bg-slate-900/40'
        }`}
      >
        <div className="corner-gold-tl"></div>
        <div className="corner-gold-tr"></div>
        <div className="corner-gold-bl"></div>
        <div className="corner-gold-br"></div>
        
        <div className="laser-scanner"></div>
        <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-cyan-800/20 pb-3 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <TerminalSquare className="w-4.5 h-4.5 text-[#dfb133] animate-pulse" />
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent text-left">
              {language === 'en' ? "ADMIN'S RECENT MATRIX UPDATES" : 'UPDATE TERBARU DARI ADMIN'}
            </h2>
          </div>
          <span className="text-[9px] bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 font-mono px-2 py-0.5 rounded tracking-widest animate-pulse">
            LIVE_SYNC // ON
          </span>
        </div>

        <div className="space-y-3.5">
          {announcements.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs font-mono uppercase tracking-wider">
              {language === 'en' ? 'NO NEWS LOGGED IN MATRIX BUFFER' : 'BELUM ADA UPDATE DI BUFFER MATRIX'}
            </div>
          ) : (
            announcements.map((ann) => (
              <div 
                key={ann.id}
                className="bg-slate-950/80 border border-cyan-500/10 p-4 rounded-lg hover:border-cyan-400/40 hover:bg-slate-950 transition-all font-mono text-left relative overflow-hidden group"
              >
                {/* Visual accent left side bar */}
                <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                  ann.category === 'SECURITY' ? 'bg-red-500' : ann.category === 'MAINTENANCE' ? 'bg-[#dfb133]' : ann.category === 'UPDATE' ? 'bg-cyan-400' : 'bg-indigo-500'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-cyan-900/10 mb-2 pl-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded tracking-widest ${
                      ann.category === 'SECURITY' ? 'bg-red-950/50 text-red-400 border border-red-500/25' : ann.category === 'MAINTENANCE' ? 'bg-amber-950/50 text-[#dfb133] border border-[#dfb133]/25' : ann.category === 'UPDATE' ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-400/25' : 'bg-indigo-950/50 text-indigo-400 border border-indigo-500/25'
                    }`}>
                      {ann.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase group-hover:text-cyan-300 transition-colors">
                      {ann.title}
                    </h3>
                  </div>
                  <span className="text-[9px] text-slate-500 pl-2 shrink-0 font-mono">
                    {ann.timestamp}
                  </span>
                </div>

                <p className="text-[10px] sm:text-[10.5px] text-slate-400 leading-relaxed font-sans pl-2">
                  {ann.content}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
