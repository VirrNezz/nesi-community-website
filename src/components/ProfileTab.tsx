import React from 'react';
import { motion } from 'motion/react';
import { Github, Mail, Phone, MapPin, Calendar, Shield, Fingerprint, Terminal, Award, Activity, Heart } from 'lucide-react';
import { useScrollActive } from '../ScrollContext';
import { useDatabase } from '../DatabaseContext';
import { useLanguage } from '../LanguageContext';
import ProfileSettings from './ProfileSettings';

export default function ProfileTab() {
  const isScrolled = useScrollActive();
  const { contributors } = useDatabase();
  const { language } = useLanguage();
  const [imgFailed, setImgFailed] = React.useState(false);

  // Retrieve primary owner profile dynamically from the contributors store
  const owner = contributors.find(c => c.id === 'c1');
  const nesiNezzAvatar = owner?.avatarUrl || '';
  const nesiNezzName = owner?.name || 'NesiNezz';
  const nesiNezzHandle = owner?.handle || '@NesNezz_Overlord';
  const nesiNezzBio = owner?.bio || "Saya adalah programmer fullstack otodidak dan penjelajah keamanan gray hat. Sangat tertarik dengan synthwave, fursuiting, terminal konsol kontras tinggi, dan estetika furry.";
  const nesiNezzBioEn = owner?.bio_en || "I'm a self-taught fullstack programmer and gray hat security explorer. Fascinated by synthwave, fursuiting, high-contrast console terminals, and furry aesthetics.";
  const nesiNezzEmail = owner?.email || 'Nesxxxxx@gmail.com';
  const nesiNezzPhone = owner?.phone || '+62xxxxxxxxx';
  const nesiNezzLocation = owner?.location || 'Java Grid Node, Jakarta // Indonesia';
  const nesiNezzLocationEn = owner?.location_en || 'Java Grid Node, Jakarta // Indonesia';
  const nesiNezzRegistration = owner?.registration || 'SYSTEM_ACCESS_EST_2018';

  const activeBio = language === 'en' ? nesiNezzBioEn : nesiNezzBio;
  const activeLocation = language === 'en' ? nesiNezzLocationEn : nesiNezzLocation;

  // React to change in avatar url to reset error state
  React.useEffect(() => {
    setImgFailed(false);
  }, [nesiNezzAvatar]);

  // Roles to display in table
  const roles = [
    { role: 'Owner', clearance: 'LEVEL_9_OVERLORD', desc: 'Sovereign operator of this system node.', color: 'text-red-400' },
    { role: 'Programmer', clearance: 'STABLE_CORE_DEV', desc: 'Crafts real-time responsive reactive logic.', color: 'text-cyan-400' },
    { role: 'Editor', clearance: 'GRAPHIC_SYNC_AESTHETIC', desc: 'Adjusts design matrices & video telemetry.', color: 'text-pink-400' },
    { role: 'Fursuiters', clearance: 'ANIMAL_MASCOT_PHY', desc: 'Integrates cybernetic animal furry personas.', color: 'text-emerald-400' },
    { role: 'Administrator', clearance: 'NODE_AUTH_OVERSEER', desc: 'Maintains firewall rules & DB integrity.', color: 'text-yellow-400' },
    { role: 'Web Development', clearance: 'FULL_STACK_INTEGRATED', desc: 'Compiles responsive browser solutions.', color: 'text-purple-400' },
    { role: 'Gray Hat', clearance: 'CYBER_INTEG_PENTEST', desc: 'Scans network ports for security exploits.', color: 'text-[#dfb133]' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="flex flex-col gap-6 lg:col-span-1 w-full">
        {/* GitHub-Style Profile Mockup Sidebar */}
        <motion.div
        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`border neon-border-cyan rounded-lg p-5 md:p-6 relative overflow-hidden text-center flex flex-col items-center transition-all duration-500 ${
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
 
        {/* GitHub Header status indicator */}
        <div className="w-full flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase pb-3 border-b border-cyan-800/20 mb-5">
          <span>HOST: LOCALHOST</span>
          <span className="text-emerald-400 font-bold animate-pulse">● SEC_SESSION_STABLE</span>
        </div>
 
        {/* Profile avatar */}
        <div className="relative mb-5 scale-105">
          {/* GitHub Standard Gray Avatar circle */}
          <div className="w-24 h-24 bg-slate-900 rounded-2xl border-2 border-cyan-400/50 flex items-center justify-center relative overflow-hidden select-none z-10 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            {/* Custom glowing profile picture of NesiNezz with layout alignment */}
            {nesiNezzAvatar && !imgFailed ? (
              <img 
                src={nesiNezzAvatar} 
                alt={`${nesiNezzName} Avatar`} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-500"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-900/60 to-slate-950 flex flex-col items-center justify-center text-cyan-400 font-bold font-mono relative">
                <span className="text-2xl tracking-wider text-cyan-300">{nesiNezzName.slice(0, 2).toUpperCase()}</span>
                <span className="text-[7.5px] uppercase text-cyan-500/80 tracking-widest mt-0.5">DEV_SYS</span>
              </div>
            )}
            {/* Glowing neon halo behind head */}
            <div className="absolute inset-0 border border-white/20 rounded-2xl"></div>
          </div>
        </div>
 
        {/* Profile Info */}
        <div className="space-y-1.5 w-full">
          <h2 className="text-base font-bold font-display uppercase text-slate-100 tracking-wide flex items-center justify-center gap-1.5">
            {nesiNezzName} <span className="text-[9px] bg-cyan-950 font-mono text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-400/35">USER_RAND</span>
          </h2>
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            {nesiNezzHandle}
          </p>
          <div className="text-[10px] text-slate-450 font-mono bg-slate-950/80 p-2.5 rounded-md border border-cyan-500/15 text-left mt-3 leading-relaxed">
            {activeBio}
          </div>
        </div>
 
        {/* Profile Table / GitHub details layout */}
        <div className="w-full mt-5 space-y-2.5 pt-4 border-t border-cyan-800/20 text-left font-mono text-[10.5px]">
          {/* Email row as specified */}
          <div className={`flex items-center gap-2.5 py-1.5 px-3 rounded border border-cyan-800/10 transition-all duration-500 ${isScrolled ? 'bg-slate-950' : 'bg-slate-950/60'}`}>
            <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[8px] text-slate-550 uppercase block">EMAIL CORRESPONDENCE:</span>
              <span className="text-slate-200 select-all truncate block">{nesiNezzEmail}</span>
            </div>
          </div>
 
          {/* Phone row as specified */}
          <div className={`flex items-center gap-2.5 py-1.5 px-3 rounded border border-cyan-800/10 transition-all duration-500 ${isScrolled ? 'bg-slate-950' : 'bg-slate-950/60'}`}>
            <Phone className="w-4 h-4 text-[#dfb133] shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[8px] text-slate-555 uppercase block">SECURE TELEPHONY GATE:</span>
              <span className="text-slate-200 select-all truncate block">{nesiNezzPhone}</span>
            </div>
          </div>
 
          {/* Location row */}
          <div className={`flex items-center gap-2.5 py-1.5 px-3 rounded border border-cyan-800/10 transition-all duration-500 ${isScrolled ? 'bg-slate-950' : 'bg-slate-950/60'}`}>
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[8px] text-slate-550 uppercase block">OPERATIONAL SECTOR:</span>
              <span className="text-slate-200 block">{activeLocation}</span>
            </div>
          </div>
 
          {/* Calendar row */}
          <div className={`flex items-center gap-2.5 py-1.5 px-3 rounded border border-cyan-800/10 transition-all duration-500 ${isScrolled ? 'bg-slate-950' : 'bg-slate-950/60'}`}>
            <Calendar className="w-4 h-4 text-pink-400 shrink-0" />
            <div>
              <span className="text-[8px] text-slate-550 uppercase block">REGISTRATION STAPLE:</span>
              <span className="text-slate-200 block">{nesiNezzRegistration}</span>
            </div>
          </div>
        </div>
      </motion.div>

        {/* Real-time Custom Profile Settings custom component */}
        <ProfileSettings />
      </div>

      {/* Main Roles Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 35, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`lg:col-span-2 border neon-border-cyan rounded-lg p-5 md:p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-500 ${
          isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/40'
        }`}
      >
        {/* Golden glow corners */}
        <div className="corner-gold-tl"></div>
        <div className="corner-gold-tr"></div>
        <div className="corner-gold-bl"></div>
        <div className="corner-gold-br"></div>
        
        {/* Tech Laser Sweeper Animation */}
        <div className="laser-scanner"></div>
        {/* Dot matrix grid texture */}
        <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-3 mb-5">
            <Fingerprint className="w-4.5 h-4.5 text-cyan-400" />
            <h2 className="text-xs font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-amber-200 via-[#dfb133] to-amber-100 bg-clip-text text-transparent">
              USER CLASSIFICATION MATRIX ROLES
            </h2>
          </div>

          {/* Table Container - styled to fit columns according to word lengths */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-cyan-800/30 text-cyan-400 text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Role Node Name</th>
                  <th className="py-2.5 px-3">Security clearance Code</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Primary Mandate Description</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((item, index) => (
                  <tr 
                    key={index}
                    // Table rows styled with white opacity at exactly 40% as requested
                    className="border-b border-white/20 hover:bg-white/10 transition-colors bg-white/[0.04]"
                  >
                    <td className={`py-3 px-3 font-bold truncate ${item.color}`}>
                      {item.role}
                    </td>
                    <td className="py-3 px-3 text-[10px] text-slate-300">
                      <span className="bg-slate-950 font-bold px-2 py-1 rounded border border-white/10 opacity-75">
                        {item.clearance}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[10px] text-slate-400 hidden sm:table-cell max-w-xs truncate leading-snug">
                      {item.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extra digital readout footer */}
        <div className="bg-slate-950/80 p-4 border border-cyan-500/10 rounded-md mt-6 space-y-2 font-mono">
          <div className="flex items-center justify-between text-[10px] text-slate-405 uppercase">
            <span className="flex items-center gap-1 text-cyan-400"><Activity className="w-3.5 h-3.5" /> SECURITY STATS CHECK:</span>
            <span className="text-[#dfb133] font-bold">AUTHORIZED (OK)</span>
          </div>
          <div className="text-[9px] text-slate-500 leading-relaxed uppercase">
            MAPPED SECTORS ARE STATICALLY RECONSTRUCTED AT RUNTIME. NO WRITES / LEAKS DETECTED. ALL PERTINENT HANDSHAKES RESOLVED TO SECURE IP BLOCKPORTS.
          </div>
        </div>

      </motion.div>
    </div>
  );
}
