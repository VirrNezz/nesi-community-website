import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, MessageSquare, Instagram, Send, Twitter, Globe, Terminal, Activity, Wifi, ShieldAlert, CheckCircle } from 'lucide-react';
import { connections } from '../data';
import { Connection } from '../types';
import { useScrollActive } from '../ScrollContext';
import { useLanguage } from '../LanguageContext';

export default function ConnectionTab() {
  const [isConnecting, setIsConnecting] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [handshakeLog, setHandshakeLog] = useState('sys_handshake initialized.');
  const isScrolled = useScrollActive();
  const { language, t } = useLanguage();

  // Simulated handshake logs
  const handshakeMessages = [
    'PINGING ENCRYPTED API GATEWAYS...',
    'ESTABLISHING REMOTE SSH BACKBONES...',
    'RESOLVING DOMAIN ROUTE MAPS...',
    'PERFORMIN SECURITY SHA-256 REPOS CHECKS...',
    'TUNNELING DIRECT LINKS... SYSTEM_STABLE!'
  ];

  useEffect(() => {
    // 5.5 seconds total loading
    const totalDuration = 5500;
    const intervalTime = 110;
    const increment = 100 / (totalDuration / intervalTime);

    const loader = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(loader);
          setIsConnecting(false);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Swap logs based on progress
    const logTimer = setInterval(() => {
      setHandshakeLog((curr) => {
        const index = Math.min(
          Math.floor((loadingProgress / 100) * handshakeMessages.length),
          handshakeMessages.length - 1
        );
        return handshakeMessages[index] || 'sys_connections active';
      });
    }, 900);

    return () => {
      clearInterval(loader);
      clearInterval(logTimer);
    };
  }, [loadingProgress]);

  // Dynamic icon helper
  const getIcon = (name: string) => {
    switch (name) {
      case 'Github':
        return <Github className="w-5 h-5 text-slate-100" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      case 'Instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'Send':
        return <Send className="w-5 h-5 text-sky-400" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      default:
        return <Globe className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {isConnecting ? (
          /* Connecting loading screen phase: 5-7 seconds */
          <motion.div
            key="connecting_phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`border neon-border-cyan rounded-lg p-8 text-center relative overflow-hidden max-w-xl mx-auto flex flex-col items-center justify-center min-h-[340px] transition-all duration-500 ${
              isScrolled ? 'bg-slate-950/70 backdrop-blur-xl border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-900/40'
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

            {/* Terminal styling */}
            <div className="p-3 bg-cyan-950/20 rounded-full border border-cyan-500/30 text-cyan-400 animate-bounce mb-4">
              <Activity className="w-8 h-8" />
            </div>

            <h3 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent animate-pulse">
              {t('connectingSocialMedia')}
            </h3>
            
            <p className="text-[10px] text-cyan-400 font-mono mt-1.5 uppercase tracking-wider">
              {t('establishingTunnel')}
            </p>

            {/* Handshake logger output */}
            <div className="bg-slate-950 px-4 py-2.5 rounded border border-cyan-800/20 font-mono text-[9px] text-emerald-400 mt-5 w-full text-left flex items-center gap-2">
              <span className="text-cyan-500 font-bold">&gt;&gt;</span>
              <span>{handshakeLog}</span>
            </div>

            {/* Connecting progress bar */}
            <div className="w-full mt-6 space-y-1">
              <div className="flex justify-between font-mono text-[9px] text-cyan-500">
                <span>{t('tunnelingHandshakes')}</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-sm border border-cyan-500/20 p-0.5 overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all ease-linear"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Watermark */}
            <div className="text-[8px] text-slate-500 font-mono mt-6 uppercase">
              latency-controlled system v4.0.0 // bypass filters with proxy
            </div>
          </motion.div>
        ) : (
          /* Cards appear from the side (slide-in) on connection stabilization */
          <motion.div
            key="cards_phase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Status indicator banner */}
            <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-lg p-3 text-emerald-400 flex items-center gap-2.5 relative overflow-hidden">
              <div className="corner-gold-tl"></div>
              <div className="corner-gold-tr"></div>
              <div className="corner-gold-bl"></div>
              <div className="corner-gold-br"></div>
              {/* Dot matrix grid texture */}
              <div className="absolute inset-0 cyber-dots opacity-[0.15] pointer-events-none"></div>
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 animate-pulse" />
              <div className="text-xs font-mono">
                <span className="font-bold">STATUS ACTIVE:</span> {t('statusActiveSocial')}
              </div>
            </div>

            {/* Social Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((conn, idx) => (
                <motion.div
                  key={conn.id}
                  initial={{ opacity: 0, y: 35, filter: 'blur(3px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ 
                    duration: 0.6, 
                    delay: idx * 0.1, 
                    type: 'spring', 
                    stiffness: 100 
                  }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`border neon-border-cyan rounded-lg p-5 relative flex flex-col justify-between overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-500 ${
                    isScrolled ? 'bg-slate-950/70 backdrop-blur-xl border-cyan-400 border-t-[1.5px]' : 'bg-slate-900/40'
                  }`}
                  style={{ 
                    borderTopColor: conn.color,
                    boxShadow: `0 0 10px ${conn.color}20`
                  }}
                >
                  <div className="corner-gold-tl"></div>
                  <div className="corner-gold-tr"></div>
                  <div className="corner-gold-bl"></div>
                  <div className="corner-gold-br"></div>

                  {/* Dot matrix grid texture */}
                  <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

                  {/* Icon & Connection Title */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="p-1.5 rounded border flex items-center justify-center"
                          style={{ borderColor: `${conn.color}60`, backgroundColor: `${conn.color}15` }}
                        >
                          {getIcon(conn.iconName)}
                        </div>
                        <h4 className="text-xs font-bold font-display uppercase tracking-widest text-slate-100">
                          {conn.platform}
                        </h4>
                      </div>
                      
                      {/* Sync Status Badge */}
                      <span className="text-[8px] bg-slate-950 font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                        {conn.status}
                      </span>
                    </div>

                    {/* Specific handle */}
                    <div className="bg-slate-950/80 p-3 rounded border border-cyan-800/25 font-mono">
                      <div className="text-[9px] text-slate-500 uppercase tracking-tight">{t('handleID')}</div>
                      <div className="text-cyan-300 font-bold text-xs truncate select-all">{conn.handle}</div>
                    </div>
                  </div>

                  {/* Connection Trigger */}
                  <div className="mt-5 border-t border-cyan-905/30 pt-4">
                    <a
                      href={conn.url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-4 rounded text-center block font-mono text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer bg-slate-950 hover:bg-opacity-80 shadow-[0_2px_8px_rgba(6,182,212,0.15)]"
                      style={{ 
                        border: `1px solid ${conn.color}`, 
                        color: conn.color 
                      }}
                    >
                      {t('establishHandshake')}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
