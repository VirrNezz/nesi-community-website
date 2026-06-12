import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, Users, ExternalLink, ShieldCheck, Mail, Phone, Globe, Terminal } from 'lucide-react';
import { Friend } from '../types';
import { useScrollActive } from '../ScrollContext';
import { useLanguage } from '../LanguageContext';
import { useDatabase } from '../DatabaseContext';

export default function FriendlistTab() {
  const { friends } = useDatabase();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'normal' | 'sahabat' | 'pacar'>('all');
  const isScrolled = useScrollActive();
  const { language, t } = useLanguage();

  // Filtered list
  const filteredFriends = friends.filter((f) => {
    if (activeCategory === 'all') return true;
    return f.type === activeCategory;
  });

  const getBorderClass = (type: 'normal' | 'sahabat' | 'pacar', isActive: boolean) => {
    if (type === 'sahabat') {
      return isActive ? 'neon-border-gold-active' : 'neon-border-gold';
    }
    if (type === 'pacar') {
      return isActive ? 'neon-border-purple-pink-active' : 'neon-border-purple-pink';
    }
    return isActive ? 'neon-border-cyan-active' : 'neon-border-cyan';
  };

  const getHeaderBadge = (type: 'normal' | 'sahabat' | 'pacar') => {
    switch (type) {
      case 'sahabat':
        return (
          <span className="flex items-center gap-1 text-[9px] bg-amber-950/40 text-[#dfb133] border border-[#dfb133]/30 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
            <Sparkles className="w-3 h-3 text-[#dfb133]" /> {t('sahabatBadge')}
          </span>
        );
      case 'pacar':
        return (
          <span className="flex items-center gap-1 text-[9px] bg-pink-950/80 text-pink-300 border border-pink-500/50 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider animate-pulse">
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> {t('pacarBadge')}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[9px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 px-1.5 py-0.5 rounded font-mono tracking-wider">
            <Users className="w-3 h-3 text-cyan-400" /> {t('normalBadge')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Toggles in Cyber Deck Style */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border neon-border-cyan relative overflow-hidden transition-all duration-500 ${
        isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
      }`}>
        <div className="corner-gold-tl"></div>
        <div className="corner-gold-tr"></div>
        <div className="corner-gold-bl"></div>
        <div className="corner-gold-br"></div>

        {/* Dot matrix grid texture */}
        <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            {t('filterFriends')}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'normal', 'sahabat', 'pacar'].map((cat) => (
            <motion.button
              key={cat}
              onClick={() => {
                setActiveCategory(cat as any);
                setSelectedFriendId(null); // collapse items
              }}
              whileHover={{ 
                scale: 1.04, 
                boxShadow: activeCategory === cat
                  ? '0 0 10px rgba(6,182,212,0.5)' 
                  : '0 0 8px rgba(6,182,212,0.2)',
                borderColor: 'rgba(34,211,238,0.7)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`px-3 py-1 text-[10px] uppercase font-mono tracking-widest rounded-md border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-950 border-cyan-800/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30'
              }`}
            >
              {cat === 'all' ? 'show_all' : (cat === 'normal' ? t('normalFriend') : (cat === 'sahabat' ? t('sahabatFriend') : t('pacarFriend')))}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filteredFriends.map((friend) => {
          const isExpanded = selectedFriendId === friend.id;
          const bgOpacity = friend.type === 'sahabat' 
            ? (isScrolled ? 'bg-[#dfb133]/10 shadow-[inset_0_0_12px_rgba(223,177,51,0.12)]' : 'bg-[#dfb133]/5 shadow-[inset_0_0_12px_rgba(223,177,51,0.05)]')
            : friend.type === 'pacar' 
              ? (isScrolled ? 'bg-purple-950/20 shadow-[inset_0_0_12px_rgba(192,132,252,0.12)]' : 'bg-purple-950/8 shadow-[inset_0_0_12px_rgba(192,132,252,0.04)]')
              : (isScrolled ? 'bg-slate-900 shadow-[inset_0_0_12px_rgba(6,182,212,0.06)]' : 'bg-slate-900/50');

          const getHoverShadow = (type: 'normal' | 'sahabat' | 'pacar') => {
            if (type === 'sahabat') return '0 0 20px rgba(223,177,51,0.15)';
            if (type === 'pacar') return '0 0 20px rgba(244,114,182,0.15)';
            return '0 0 20px rgba(6,182,212,0.15)';
          };

          return (
            <motion.div
              key={friend.id}
              layout="position"
              initial={{ opacity: 0, y: 30, filter: 'blur(3px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-20px' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(3px)' }}
              whileHover={{ 
                y: -3, 
                boxShadow: getHoverShadow(friend.type),
                borderColor: friend.type === 'sahabat' ? 'rgba(251,191,36,0.8)' : friend.type === 'pacar' ? 'rgba(244,114,182,0.8)' : 'rgba(34,211,238,0.8)'
              }}
              transition={{ 
                layout: { type: 'spring', stiffness: 300, damping: 25 },
                y: { type: 'spring', stiffness: 400, damping: 20 },
                boxShadow: { duration: 0.2 },
                borderColor: { duration: 0.2 }
              }}
              className={`rounded-lg p-5 md:p-6 transition-all duration-300 relative border overflow-hidden ${getBorderClass(
                friend.type,
                isExpanded
              )} ${bgOpacity}`}
            >
              {/* Gold Shiny Corners */}
              <div className="corner-gold-tl"></div>
              <div className="corner-gold-tr"></div>
              <div className="corner-gold-bl"></div>
              <div className="corner-gold-br"></div>

              {/* Digital dot background overlay */}
              <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>
              {/* Holographic scanner for enlarged friend files */}
              {isExpanded && <div className="laser-scanner opacity-70"></div>}

              {/* Close Button "x" located inside card top corner as requested */}
              {isExpanded && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFriendId(null);
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950 border border-red-500/30 text-slate-400 hover:text-red-400 hover:border-red-500 transition-all z-20 cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Header Info */}
              <div 
                className="flex gap-4 items-start cursor-pointer"
                onClick={() => setSelectedFriendId(isExpanded ? null : friend.id)}
              >
                {/* Custom Portrait Drawing container */}
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 bg-slate-950 ring-2 ring-indigo-950 flex items-center justify-center font-bold font-mono text-xs rounded-full border ${
                    friend.type === 'sahabat' ? 'border-[#dfb133] text-[#dfb133] shadow-[0_0_8px_rgba(223,177,51,0.4)]' : friend.type === 'pacar' ? 'border-pink-500 text-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.4)]' : 'border-cyan-500 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  } relative overflow-hidden select-none`}>
                    {friend.avatarUrl ? (
                      <img 
                        src={friend.avatarUrl} 
                        alt={friend.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="uppercase text-lg">{friend.name.slice(0, 2)}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40"></div>
                  </div>
                </div>

                {/* Name & Species */}
                <div className="flex-1 min-w-0 pr-6">
                  {getHeaderBadge(friend.type)}
                  <h3 className={`text-base font-bold font-display mt-1.5 uppercase tracking-wide flex items-center gap-1.5 ${
                    friend.type === 'sahabat' ? 'text-[#dfb133]' : friend.type === 'pacar' ? 'text-pink-300' : 'text-slate-100'
                  }`}>
                    {friend.name}
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-mono tracking-tight mt-0.5">
                    SPECIES: <span className="text-slate-300">{language === 'en' ? friend.species_en || friend.species : friend.species}</span>
                  </p>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3 border-t border-cyan-800/20 pt-3">
                {language === 'en' ? friend.bio_en || friend.bio : friend.bio}
              </p>

              {/* Expandable attributes with structural delay fade-in as requested */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      ease: 'easeInOut',
                    }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-cyan-500/25 space-y-4">
                      {/* Characteristics list with staggered transparent-to-visible fade */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15, duration: 0.35, ease: 'easeOut' }}
                        className="space-y-2"
                      >
                        <h4 className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-bold">
                          {t('characteristicsTitle')}
                        </h4>
                        <ul className="text-xs font-mono text-slate-350 space-y-1.5 bg-slate-950/80 p-3 rounded border border-cyan-500/10">
                          {(language === 'en' ? friend.characteristics_en || friend.characteristics : friend.characteristics).map((ciri, index) => (
                            <li key={index} className="flex gap-2.5 items-start">
                              <span className={`font-bold mt-0.5 ${
                                friend.type === 'sahabat' ? 'text-yellow-400' : friend.type === 'pacar' ? 'text-pink-400' : 'text-cyan-400'
                              }`}>-</span>
                              <span>{ciri}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>

                      {/* Social Connection Badges hyperlinks mapped inside tab */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.35, ease: 'easeOut' }}
                        className="space-y-2"
                      >
                        <h4 className="text-[10px] font-mono tracking-wider text-[#dfb133] uppercase font-bold">
                          {t('secureMediaLinks')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {friend.socials.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded border uppercase tracking-wider transition-all cursor-pointer ${
                                friend.type === 'sahabat'
                                  ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/25 hover:border-yellow-400'
                                  : friend.type === 'pacar'
                                  ? 'bg-pink-500/10 border-pink-400/30 text-pink-300 hover:bg-pink-500/25 hover:border-pink-400'
                                  : 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400'
                              }`}
                            >
                              <span>{link.platform}</span>
                              <span className="text-[8px] opacity-75">({link.label})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click-to-Expand Indicator helper */}
              {!isExpanded && (
                <div className="mt-3 flex justify-end">
                  <motion.button
                    onClick={() => setSelectedFriendId(friend.id)}
                    whileHover={{ scale: 1.05, y: -0.5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      friend.type === 'sahabat'
                        ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 border border-yellow-400/20 shadow-[0_0_6px_rgba(251,191,36,0.15)]'
                        : friend.type === 'pacar'
                        ? 'bg-pink-400/10 text-pink-400 hover:bg-pink-400/20 border border-pink-400/20 shadow-[0_0_6px_rgba(244,114,182,0.15)]'
                        : 'bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 border border-cyan-400/20'
                    }`}
                  >
                    {t('bukaInfo')}
                  </motion.button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
