import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ShieldAlert, ShieldCheck, Database, Lock, Unlock, Cpu } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
  key?: React.Key;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const logs = [
    'CONNECTING TO SECURE NESINEZZ DB GATEWAY [IP: 10.13.37.104]...',
    'INITIALIZING SHIELD-DECRYPTION ENGINES (RSA-4096)...',
    'FLOODING INSTANCE DATA BLOCKS // BYPASSING BUFFER STORAGE...',
    'MEMORIES STACK: [LOADED 4096 CORES OF FURRY_NET_MATRIX]...',
    'INTEGRATION STABLE: owner, programmer, administrator modules acquired.',
    'TUNNEL ESTABLISHED: Cyan fluorescent, aurum corners initialized.',
    'READY FOR INTERACTIVE DECRYPTION.'
  ];

  useEffect(() => {
    // Progress increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increments to feel authentic
        const next = prev + Math.floor(Math.random() * 8) + 3;
        return next > 100 ? 100 : next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Log index cascade based on progress
    if (progress === 0) setLogIndex(0);
    else if (progress < 20) setLogIndex(1);
    else if (progress < 45) setLogIndex(2);
    else if (progress < 70) setLogIndex(3);
    else if (progress < 85) setLogIndex(4);
    else if (progress < 98) setLogIndex(5);
    else setLogIndex(6);
  }, [progress]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // Slight delay for animation before launching
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center overflow-hidden font-mono text-xs select-none">
      {/* Flooding background with matrix code lines & images */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 cyber-grid"></div>
        <div className="scanlines absolute inset-0"></div>
        
    {/* Flooding dynamic cyber logs */}
        <div className="absolute inset-0 flex flex-wrap gap-4 p-4 text-[9px] text-[#06b6d4] leading-normal overflow-hidden select-none">
          {Array.from({ length: typeof window !== 'undefined' && window.innerWidth < 768 ? 15 : 45 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: [0.1, 0.4, 0.1], 
                y: [0, Math.random() * 150, Math.random() * 300],
                x: [0, (Math.random() - 0.5) * 30]
              }}
              transition={{ 
                duration: 8 + Math.random() * 12, 
                repeat: Infinity,
                ease: 'linear'
              }}
              className="w-24 break-all whitespace-pre-wrap shrink-0"
            >
              {`0x${(i * 12345).toString(16).toUpperCase()}//NESINEZZ_${Math.floor(Math.random() * 9999)}`}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cyber Panel frame */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.05, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[90%] max-w-xl p-6 md:p-8 rounded-xl bg-slate-900/90 border neon-border-cyan relative z-10 mx-auto"
      >
        {/* Golden corner shines as requested */}
        <div className="corner-gold-tl"></div>
        <div className="corner-gold-tr"></div>
        <div className="corner-gold-bl"></div>
        <div className="corner-gold-br"></div>

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-cyan-800/50 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-xs">DB_ACCESS_GATE: SECURE</span>
          </div>
          <div className="text-[10px] text-cyan-600">SYS_AUTH.DLL</div>
        </div>

        {/* Content detail */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-lg border border-cyan-500/20">
            <div className="p-3 bg-cyan-950/50 rounded border border-cyan-500/30 text-cyan-400">
              {progress < 100 ? (
                <Cpu className="w-8 h-8 animate-spin" />
              ) : (
                <Database className="w-8 h-8 text-yellow-400 animate-pulse" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-200 tracking-wide">SYSTEM ACCESS IN PROGRESS</h4>
              <p className="text-[10px] text-cyan-500 font-mono mt-1">STATUS: {progress < 100 ? 'FLOODING_MEM_STATIONS...' : 'CORE_ENGINES_READY_100%'}</p>
            </div>
          </div>

          {/* Flooding database and memory logs */}
          <div className="bg-slate-950 border border-cyan-800/30 rounded-lg p-4 h-32 overflow-hidden flex flex-col justify-end text-[10px] text-emerald-400 gap-1.5 font-mono">
            <AnimatePresence mode="popLayout">
              {logs.slice(0, logIndex + 1).map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2.5"
                >
                  <span className="text-cyan-600 font-bold">~</span>
                  <span className="break-all">{log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Custom progress loading bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-cyan-500">
              <span className="flex items-center gap-1">
                <Terminal className="w-3 h-3 animate-pulse" /> Decoded Packet Buffers:
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-slate-950 border border-cyan-500/30 p-0.5 rounded-sm overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                style={{ width: `${progress}%` }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Security Unlock Button */}
          <div className="pt-3 flex justify-center">
            {progress < 100 ? (
              <div className="flex items-center gap-2 bg-slate-950/70 py-2.5 px-6 rounded-lg border border-red-500/20 text-red-400 animate-pulse text-[11px] tracking-widest uppercase">
                <ShieldAlert className="w-4 h-4" /> SECURING TERMINAL INTEGRITY...
              </div>
            ) : (
              <motion.button
                initial={{ scale: 0.95 }}
                animate={{ scale: [1, 1.05, 1], rotate: [0, 0.5, -0.5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUnlock}
                className="relative py-3 px-8 text-slate-950 bg-gradient-to-r from-amber-300 via-[#dfb133] to-amber-400 font-bold rounded-md cursor-pointer text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(223,177,51,0.5)] flex items-center gap-2"
              >
                {isUnlocked ? (
                  <>
                    <Unlock className="w-4 h-4 animate-bounce" /> ACCESS GRANTED
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> AUTHORIZE CONNECTION
                  </>
                )}
                {/* gold particle shine */}
                <span className="absolute -inset-0.5 border border-white/40 rounded-md animate-ping pointer-events-none opacity-20"></span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Security watermark */}
        <div className="flex items-center justify-between text-[8px] text-slate-500 uppercase mt-5 border-t border-cyan-800/20 pt-3 font-mono">
          <span>ALGORITHM: SHA-512_KRYPTON</span>
          <span>SYSTEM_STATE: ENCRYPTED_STABLE [SEC_T-99]</span>
        </div>
      </motion.div>
    </div>
  );
}
