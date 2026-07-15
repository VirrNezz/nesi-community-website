import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDatabase } from '../DatabaseContext';
import { useLanguage } from '../LanguageContext';
import { 
  Database, 
  Terminal, 
  Server, 
  Activity, 
  Settings, 
  RefreshCw, 
  Search, 
  Check, 
  Trash2, 
  X, 
  Lock, 
  Key,
  LayoutGrid,
  Upload,
  Plus,
  Music,
  Megaphone
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = [
  { name: 'NesiNezz Cyber (Default)', url: 'https://d.uguu.se/cgahxrjH.jpg' },
  { name: 'NesiNezz Alternate', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&q=80' },
  { name: 'Furry Wolf Blue', url: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=150&q=80' },
  { name: 'Neon Dragon', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&q=80' },
  { name: 'Cyberpunk Goggles', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150&q=80' },
  { name: 'Aesthetic Synthwave', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&q=80' }
];

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { 
    friends, 
    contributors, 
    tracks,
    announcements,
    dbType, 
    dbStatus, 
    dbMetrics, 
    triggerSync,
    configDatabase,
    vercelEnvUrl,
    addTrack,
    deleteTrack,
    addAnnouncement,
    deleteAnnouncement,
    addFriend,
    updateFriend,
    deleteFriend,
    addContributor,
    updateContributor,
    deleteContributor,
    resetDatabase
  } = useDatabase();
  
  const { language, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  
  // Tabs and general search
  const [activeTab, setActiveTab] = useState<'users' | 'music' | 'updates' | 'database'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncAnimation, setSyncAnimation] = useState(false);

  // Avatar states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const imgFileInputRef = useRef<HTMLInputElement | null>(null);

  // Profile CRUD states
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileType, setNewProfileType] = useState<'friend' | 'contributor'>('friend');
  
  // Form fields
  const [profName, setProfName] = useState('');
  const [profSpecies, setProfSpecies] = useState('');
  const [profSpeciesEn, setProfSpeciesEn] = useState('');
  const [profType, setProfType] = useState<'normal' | 'sahabat' | 'pacar'>('normal');
  const [profBio, setProfBio] = useState('');
  const [profBioEn, setProfBioEn] = useState('');
  const [profChars, setProfChars] = useState('');
  const [profCharsEn, setProfCharsEn] = useState('');
  
  // Social links
  const [profIg, setProfIg] = useState('');
  const [profDiscord, setProfDiscord] = useState('');
  const [profSteam, setProfSteam] = useState('');
  const [profX, setProfX] = useState('');

  // Contributor fields
  const [profRole, setProfRole] = useState('');
  const [profRoleEn, setProfRoleEn] = useState('');
  const [profSpecs, setProfSpecs] = useState('');
  const [profSpecsEn, setProfSpecsEn] = useState('');
  const [profSeed, setProfSeed] = useState('nezz-seed');

  // Owner dynamic profile elements
  const [profHandle, setProfHandle] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profLocation, setProfLocation] = useState('');
  const [profLocationEn, setProfLocationEn] = useState('');
  const [profRegistration, setProfRegistration] = useState('');

  // Music creation states
  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackDesc, setNewTrackDesc] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [newTrackYtId, setNewTrackYtId] = useState('');
  const [newTrackImageUrl, setNewTrackImageUrl] = useState('');
  const [newTrackMusicUrl, setNewTrackMusicUrl] = useState('');
  const mp3FileInputRef = useRef<HTMLInputElement | null>(null);
  const trackImageFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');

  // Announcement creation states
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<'UPDATE' | 'SECURITY' | 'MAINTENANCE' | 'GENERAL'>('UPDATE');

  // Database settings
  const [tempVercelUrl, setTempVercelUrl] = useState(vercelEnvUrl);

  // CLOUDINARY AUTOMATED UPLOAD CORE ENGINE
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
formData.append('upload_preset', 'nesi-presets');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/ocqdvpts/auto/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      return null;
    } catch (err) {
      console.error("Cloudinary upload connection failed:", err);
      return null;
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'Nezz_ajah') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasscode('');
    }
  };

  const resetProfileForm = () => {
    setEditingId(null);
    setIsAddingProfile(false);
    setProfName('');
    setInputUrl('');
    setProfSpecies('');
    setProfSpeciesEn('');
    setProfType('normal');
    setProfBio('');
    setProfBioEn('');
    setProfChars('');
    setProfCharsEn('');
    setProfIg('');
    setProfDiscord('');
    setProfSteam('');
    setProfX('');
    setProfRole('');
    setProfRoleEn('');
    setProfSpecs('');
    setProfSpecsEn('');
    setProfSeed('seed_' + Math.floor(Math.random() * 999));
    setProfHandle('');
    setProfEmail('');
    setProfPhone('');
    setProfLocation('');
    setProfLocationEn('');
    setProfRegistration('');
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setIsAddingProfile(false);
    setProfName(item.name || '');
    setInputUrl(item.avatarUrl || '');
    
    if (item.entityType === 'friend') {
      setNewProfileType('friend');
      setProfSpecies(item.species || '');
      setProfSpeciesEn(item.species_en || '');
      setProfType(item.type || 'normal');
      setProfBio(item.bio || '');
      setProfBioEn(item.bio_en || '');
      setProfChars(item.characteristics ? item.characteristics.join(', ') : '');
      setProfCharsEn(item.characteristics_en ? item.characteristics_en.join(', ') : '');
      
      const ig = item.socials?.find((s: any) => s.platform === 'instagram')?.url || '';
      const dc = item.socials?.find((s: any) => s.platform === 'discord')?.label || '';
      const st = item.socials?.find((s: any) => s.platform === 'steam')?.url || '';
      const tw = item.socials?.find((s: any) => s.platform === 'x' || s.platform === 'twitter')?.url || '';
      
      setProfIg(ig);
      setProfDiscord(dc);
      setProfSteam(st);
      setProfX(tw);
      setProfHandle('');
      setProfEmail('');
      setProfPhone('');
      setProfLocation('');
      setProfLocationEn('');
      setProfRegistration('');
    } else {
      setNewProfileType('contributor');
      setProfRole(item.role ? item.role.join(', ') : '');
      setProfRoleEn(item.role_en ? item.role_en.join(', ') : '');
      setProfSpecs(item.specs || '');
      setProfSpecsEn(item.specs_en || '');
      setProfSeed(item.avatarSeed || '');
      setProfHandle(item.handle || '');
      setProfEmail(item.email || '');
      setProfPhone(item.phone || '');
      setProfLocation(item.location || '');
      setProfLocationEn(item.location_en || '');
      setProfRegistration(item.registration || '');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName) {
      alert("Name is required.");
      return;
    }

    const socialsList = [];
    if (profIg) socialsList.push({ platform: 'instagram', url: profIg, label: 'Instagram' });
    if (profDiscord) socialsList.push({ platform: 'discord', url: 'https://discord.com', label: profDiscord });
    if (profSteam) socialsList.push({ platform: 'steam', url: profSteam, label: 'Steam' });
    if (profX) socialsList.push({ platform: 'x', url: profX, label: 'Twitter' });

    const characteristicsArr = profChars ? profChars.split(',').map(s => s.trim()).filter(Boolean) : [];
    const characteristicsEnArr = profCharsEn ? profCharsEn.split(',').map(s => s.trim()).filter(Boolean) : [];
    const roleArr = profRole ? profRole.split(',').map(s => s.trim()).filter(Boolean) : [];
    const roleEnArr = profRoleEn ? profRoleEn.split(',').map(s => s.trim()).filter(Boolean) : [];

    const finalAvatarUrl = inputUrl || '';

    if (newProfileType === 'friend') {
      const friendData = {
        name: profName,
        species: profSpecies || 'Human / Cyber Connection',
        species_en: profSpeciesEn || undefined,
        avatarUrl: finalAvatarUrl,
        type: profType,
        bio: profBio || 'NesiNezz portal node.',
        bio_en: profBioEn || undefined,
        characteristics: characteristicsArr.length > 0 ? characteristicsArr : ['Friendly', 'Connected'],
        characteristics_en: characteristicsEnArr.length > 0 ? characteristicsEnArr : undefined,
        socials: socialsList
      };

      if (editingId) {
        updateFriend(editingId, friendData);
      } else {
        addFriend(friendData);
      }
    } else {
      const contributorData = {
        name: profName,
        role: roleArr.length > 0 ? roleArr : ['Contributor'],
        role_en: roleEnArr.length > 0 ? roleEnArr : undefined,
        specs: profSpecs || 'Operator Core',
        specs_en: profSpecsEn || undefined,
        avatarSeed: profSeed || 'cyber-seed',
        avatarUrl: finalAvatarUrl,
        handle: profHandle || undefined,
        bio: profBio || undefined,
        bio_en: profBioEn || undefined,
        email: profEmail || undefined,
        phone: profPhone || undefined,
        location: profLocation || undefined,
        location_en: profLocationEn || undefined,
        registration: profRegistration || undefined
      };

      if (editingId) {
        updateContributor(editingId, contributorData);
      } else {
        addContributor(contributorData);
      }
    }

    resetProfileForm();
  };

  const handleDeleteProfile = (type: 'friend' | 'contributor', id: string, name: string) => {
    if (confirm(`Are you sure you want to delete profile "${name}"? This action cannot be undone.`)) {
      if (type === 'friend') {
        deleteFriend(id);
      } else {
        deleteContributor(id);
      }
      resetProfileForm();
    }
  };

  // Real-time Cloudinary Automated Profile Avatar Upload
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('COMPILING AVATAR TO CLOUD...');
    const secureUrl = await uploadToCloudinary(file);
    
    if (secureUrl) {
      setInputUrl(secureUrl);
      setUploadProgress('Avatar uploaded stably!');
    } else {
      alert("Cloudinary Upload Error. Check internet connection.");
      setUploadProgress('Upload failed.');
    }
    setTimeout(() => setUploadProgress(''), 3000);
  };

  // Real-time Cloudinary Automated Custom Track Image Cover Upload
  const handleTrackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('COMPILING IMAGE COVER...');
    const secureUrl = await uploadToCloudinary(file);

    if (secureUrl) {
      setNewTrackImageUrl(secureUrl);
      setUploadProgress('Cover image uploaded stably!');
    } else {
      alert("Cloudinary Upload Error.");
      setUploadProgress('Upload failed.');
    }
    setTimeout(() => setUploadProgress(''), 3000);
  };

  // Real-time Cloudinary Automated Custom MP3 Upload
  const handleMp3Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress('COMPILING MP3 TO STORAGE...');
    const secureUrl = await uploadToCloudinary(file);

    if (secureUrl) {
      setNewTrackMusicUrl(secureUrl);
      setNewTrackUrl(secureUrl);
      setNewTrackName(file.name.replace(/\.[^/.]+$/, ""));
      setNewTrackDesc('Custom Cloud MP3 Node');
      setUploadProgress('MP3 file uploaded stably!');
    } else {
      alert("Cloudinary Audio Upload Error.");
      setUploadProgress('Upload failed.');
    }
    setTimeout(() => setUploadProgress(''), 3000);
  };

  const handleRegisterMusic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackName || (!newTrackUrl && !newTrackMusicUrl && !newTrackYtId)) {
      alert("Please specify a Track Name and either a Music Source or YouTube Video ID.");
      return;
    }

    addTrack({
      name: newTrackName,
      url: newTrackMusicUrl || newTrackUrl,
      desc: newTrackDesc || 'Admin Audio Stream',
      youtubeId: newTrackYtId || undefined,
      localFile: !!(newTrackMusicUrl || newTrackUrl),
      image_url: newTrackImageUrl || undefined,
      music_url: newTrackMusicUrl || newTrackUrl || undefined
    });

    setNewTrackName('');
    setNewTrackDesc('');
    setNewTrackUrl('');
    setNewTrackMusicUrl('');
    setNewTrackImageUrl('');
    setNewTrackYtId('');
    if (mp3FileInputRef.current) mp3FileInputRef.current.value = '';
    if (trackImageFileInputRef.current) trackImageFileInputRef.current.value = '';
    
    setUploadProgress('TRACK SUCCESSFULLY SYNCED TO THE STREAM!');
    setTimeout(() => setUploadProgress(''), 4000);
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) {
      alert("Please input title and announcement content.");
      return;
    }

    addAnnouncement({
      title: annTitle,
      content: annContent,
      category: annCategory
    });

    setAnnTitle('');
    setAnnContent('');
    setAnnCategory('UPDATE');
  };

  const handleForceSync = () => {
    setSyncAnimation(true);
    triggerSync();
    setTimeout(() => {
      setSyncAnimation(false);
    }, 1000);
  };

  const handleSaveDbConfig = (e: React.FormEvent) => {
    e.preventDefault();
    configDatabase(tempVercelUrl);
  };

  const allEntities = [
    ...contributors.map(c => ({ ...c, entityType: 'contributor' as const })),
    ...friends.map(f => ({ ...f, entityType: 'friend' as const, role: ['Friend'] }))
  ].filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl max-h-[92vh] bg-slate-950 border-2 border-cyan-400 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] relative flex flex-col font-mono"
      >
        <div className="bg-slate-900 border-b border-cyan-900/40 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
                NesiNezz Overlord Database & Cloud Matrix Master
              </h1>
              <span className="text-[9px] text-slate-500 uppercase">CLOUDINARY REAL-TIME HYBRID SYNC ENGINE</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-md mx-auto min-h-[350px]">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-cyan-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-slate-100 text-sm font-bold uppercase tracking-wider">SECURE AUTHORIZATION CONTROL</h2>
              <p className="text-[10px] text-slate-500 px-4 leading-relaxed uppercase">Write operations require the security key.</p>
            </div>
            <form onSubmit={handleAuthenticate} className="w-full space-y-3">
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-4.5 h-4.5 text-cyan-500/60" />
                <input 
                  type="password"
                  placeholder="INPUT SECURITY ACCESS KEY"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-cyan-800/40 rounded px-10 py-2.5 text-xs text-center text-cyan-300 placeholder:text-slate-700 focus:outline-none focus:border-cyan-400 font-mono tracking-widest uppercase shadow-inner"
                  autoFocus
                />
              </div>
              {authError && <p className="text-[10px] text-red-500 text-center uppercase tracking-wider animate-shake">❌ ACCESS BLOCKED</p>}
              <button type="submit" className="w-full bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-400/50 hover:border-cyan-400 rounded py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer">COMPILE HANDSHAKE_</button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-slate-950 border-b border-cyan-900/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[10px] shrink-0">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-400"><Server className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM HOST: <span className="text-slate-250 font-bold uppercase">{dbType}</span></span>
                <span className="flex items-center gap-1.5 text-slate-400"><Activity className="w-3.5 h-3.5 text-[#dfb133]" /> LATENCY: <span className="text-[#dfb133] font-bold">{dbMetrics.latency}ms</span></span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-500">READS: <span className="text-cyan-400 font-bold">{dbMetrics.reads}</span></span>
                <span className="text-slate-500">WRITES: <span className="text-pink-400 font-bold">{dbMetrics.writes}</span></span>
                <span className="text-cyan-400 font-bold bg-cyan-900/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>{dbStatus}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 border-b border-cyan-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setActiveTab('users')} className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'users' ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'bg-slate-950 border-cyan-850/10 text-slate-400'}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />AVATAR CONTROL [{allEntities.length}]
                </button>
                <button onClick={() => setActiveTab('music')} className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'music' ? 'bg-pink-500/15 border-pink-400/80 text-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.3)]' : 'bg-slate-950 border-cyan-850/10 text-slate-400'}`}>
                  <Music className="w-3.5 h-3.5" />MUSIC MANAGER [{tracks.length}]
                </button>
                <button onClick={() => setActiveTab('updates')} className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'updates' ? 'bg-[#dfb133]/15 border-[#dfb133] text-amber-300 shadow-[0_0_8px_rgba(223,177,51,0.3)]' : 'bg-slate-950 border-cyan-850/10 text-slate-400'}`}>
                  <Megaphone className="w-3.5 h-3.5" />ANNOUNCEMENTS [{announcements.length}]
                </button>
                <button onClick={() => setActiveTab('database')} className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'database' ? 'bg-purple-500/15 border-purple-400/80 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.35)]' : 'bg-slate-950 border-cyan-850/10 text-slate-400'}`}>
                  <Settings className="w-3.5 h-3.5" />VERCEL ENV SEEDING
                </button>
              </div>
              {activeTab === 'users' && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="FILTER BY NAME..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-950 border border-cyan-805/25 rounded px-8 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 w-full sm:w-60" />
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {activeTab === 'users' && (
                <div className="space-y-5">
                  <div className="bg-slate-900/40 border border-cyan-950 p-4 rounded-md flex flex-col md:flex-row shadow-inner justify-between items-start md:items-center gap-3">
                    <p className="text-[10.5px] text-slate-400 leading-relaxed uppercase max-w-xl">⚡ <span className="text-cyan-400 font-bold">CLOUDINARY OPERATIONAL READY</span>: Semua upload media foto avatar dienkripsi langsung ke server cloud secara realtime dan terima jadi.</p>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button type="button" onClick={() => { const ownerNode = contributors.find(c => c.id === 'c1'); if (ownerNode) handleEditClick({ ...ownerNode, entityType: 'contributor' }); else alert("Owner profile not found."); }} className="px-3.5 py-2 bg-slate-950 border-2 border-amber-500/50 text-amber-300 text-[10.5px] uppercase font-bold tracking-wider cursor-pointer">👤 EDIT OWNER DECK CARD_</button>
                      <button type="button" onClick={() => { if (isAddingProfile) resetProfileForm(); else { resetProfileForm(); setIsAddingProfile(true); } }} className="px-3.5 py-2 bg-cyan-950 border-2 border-cyan-500/60 text-cyan-300 text-[10.5px] uppercase font-bold tracking-wider cursor-pointer">{isAddingProfile ? "CANCEL CREATION_ [X]" : "[+] REGISTER NEW PROFILE_"}</button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isAddingProfile && (
                      <motion.form initial={{ opacity: 0, y: -15, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -15, height: 0 }} onSubmit={handleSaveProfile} className="bg-slate-950 border-2 border-cyan-400 p-4 md:p-5 rounded-lg space-y-4 text-[10px] text-slate-300 overflow-hidden shadow-lg">
                        <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest border-b border-cyan-950 pb-2 flex items-center justify-between">
                          <span>🌐 DB SYSTEM INGRESS / CREATE PROFILE NODE</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-cyan-455 font-bold uppercase block tracking-wider mb-1">PROFILE CATEGORY TYPE:</label>
                            <select value={newProfileType} onChange={(e) => setNewProfileType(e.target.value as any)} className="w-full bg-slate-900 border border-cyan-800/40 rounded px-2.5 py-2 font-bold text-xs text-cyan-300 cursor-pointer"><option value="friend">FRIEND (KONEKSI PORTAL)</option><option value="contributor">CONTRIBUTOR (SYSTEM OPERATOR)</option></select>
                          </div>
                          <div>
                            <label className="text-cyan-455 font-bold uppercase block tracking-wider mb-1">FULL UNIQUE NAME:</label>
                            <input type="text" required value={profName} onChange={(e) => setProfName(e.target.value)} placeholder="e.g. Chloe Valentine" className="w-full bg-slate-900 border border-cyan-800/40 rounded px-2.5 py-2 text-slate-100 text-xs font-sans font-bold" />
                          </div>
                        </div>

                        {newProfileType === 'friend' ? (
                          <div className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Species (ID):</label>
                                <input type="text" value={profSpecies} onChange={(e) => setProfSpecies(e.target.value)} placeholder="e.g. Kucing Hitam" className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 font-sans" />
                              </div>
                              <div>
                                <label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Species Name (EN):</label>
                                <input type="text" value={profSpeciesEn} onChange={(e) => setProfSpeciesEn(e.target.value)} placeholder="e.g. Black Cat" className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 font-sans" />
                              </div>
                              <div>
                                <label className="text-[#dfb133] uppercase block tracking-wider font-bold mb-1">Connection Level / Border:</label>
                                <select value={profType} onChange={(e) => setProfType(e.target.value as any)} className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 text-yellow-300 cursor-pointer"><option value="normal">Normal (Cyan Border)</option><option value="sahabat">Sahabat / Best Friend (Gold Border)</option><option value="pacar">Relationship (Secret Purple Border)</option></select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Characteristics (ID):</label><input type="text" value={profChars} onChange={(e) => setProfChars(e.target.value)} placeholder="Setia, Pemalu" className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 font-sans" /></div>
                              <div><label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Characteristics (EN):</label><input type="text" value={profCharsEn} onChange={(e) => setProfCharsEn(e.target.value)} placeholder="Loyal, Shy" className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 font-sans" /></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><label className="text-cyan-455 uppercase block tracking-wider font-bold mb-1">Biography (ID):</label><textarea rows={2} value={profBio} onChange={(e) => setProfBio(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 font-sans h-16" /></div>
                              <div><label className="text-cyan-455 uppercase block tracking-wider font-bold mb-1">Biography (EN):</label><textarea rows={2} value={profBioEn} onChange={(e) => setProfBioEn(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 font-sans h-16" /></div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-3 rounded border border-cyan-900/20 text-[9px] text-cyan-300">
                              <div><label className="text-[8px] text-slate-500 font-bold block mb-1">Instagram URL:</label><input type="text" value={profIg} onChange={(e) => setProfIg(e.target.value)} className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5" /></div>
                              <div><label className="text-[8px] text-slate-500 font-bold block mb-1">Discord Tag:</label><input type="text" value={profDiscord} onChange={(e) => setProfDiscord(e.target.value)} className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5" /></div>
                              <div><label className="text-[8px] text-slate-500 font-bold block mb-1">Steam URL:</label><input type="text" value={profSteam} onChange={(e) => setProfSteam(e.target.value)} className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5" /></div>
                              <div><label className="text-[8px] text-slate-500 font-bold block mb-1">X/Twitter URL:</label><input type="text" value={profX} onChange={(e) => setProfX(e.target.value)} className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5" /></div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><label className="text-red-400 uppercase block tracking-wider font-bold mb-1">Roles (ID):</label><input type="text" value={profRole} onChange={(e) => setProfRole(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 text-red-300" /></div>
                              <div><label className="text-red-400 uppercase block tracking-wider font-bold mb-1">Roles (EN):</label><input type="text" value={profRoleEn} onChange={(e) => setProfRoleEn(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 text-red-300" /></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><label className="text-red-400 uppercase block tracking-wider font-bold mb-1">System Specs (ID):</label><textarea rows={2} value={profSpecs} onChange={(e) => setProfSpecs(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 h-16" /></div>
                              <div><label className="text-red-400 uppercase block tracking-wider font-bold mb-1">System Specs (EN):</label><textarea rows={2} value={profSpecsEn} onChange={(e) => setProfSpecsEn(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 h-16" /></div>
                            </div>
                            <div><label className="text-red-450 block font-bold mb-1">Identities Seed:</label><input type="text" value={profSeed} onChange={(e) => setProfSeed(e.target.value)} className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 text-red-300 text-xs" /></div>
                          </div>
                        )}

                        <div className="border-t border-cyan-900/30 pt-3.5 space-y-3">
                          <span className="text-cyan-400 font-bold uppercase block text-xs tracking-wider">💾 PROFILE PICTURE & AVATAR DECK:</span>
                          <div className="bg-slate-900 p-3 rounded border border-cyan-950 space-y-2">
                            <label className="text-cyan-400 font-bold block text-[9px]">📁 AUTOMATED CLOUDINARY FILE UPLOADER STREAM:</label>
                            <div className="flex items-center gap-2">
                              <input type="file" ref={imgFileInputRef} accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                              <button type="button" onClick={() => imgFileInputRef.current?.click()} className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/30 text-cyan-300 rounded text-[9px] font-bold"><Upload className="w-3.5 h-3.5" />CHOOSE AVATAR FILE_</button>
                              <span className="text-[8.5px] text-[#dfb133] truncate block">{uploadProgress ? uploadProgress : "Upload local image directly to Cloudinary"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/40">
                          <button type="button" onClick={resetProfileForm} className="px-3.5 py-2 bg-slate-900 border text-slate-400 rounded">RESET_</button>
                          <button type="submit" className="px-4.5 py-2 bg-cyan-950 text-cyan-300 border border-cyan-400 rounded font-bold tracking-widest shadow-lg">COMPILE & SYNC PROFILE NODE_</button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allEntities.map((item) => {
                      const intentEditing = editingId === item.id;
                      const displayRole = Array.isArray(item.role) ? item.role[0] : 'Contributor';
                      const hasAvatar = !!item.avatarUrl;
                      
                      return (
                        <div key={item.id} className={`border rounded-lg p-3.5 flex flex-col justify-between transition-all duration-300 relative ${intentEditing ? 'border-[#dfb133] bg-slate-950 shadow-lg' : 'border-cyan-500/10 bg-slate-900/30'}`}>
                          <div className="flex gap-3 items-start">
                            <div className={`w-12 h-12 bg-slate-950 rounded-xl overflow-hidden relative shrink-0 border-2 ${item.entityType === 'friend' && (item as any).type === 'sahabat' ? 'border-yellow-500' : item.entityType === 'friend' && (item as any).type === 'pacar' ? 'border-pink-500' : 'border-cyan-550/30'}`}>
                              {hasAvatar ? <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : null}
                            </div>
                            <div className="flex-1 min-w-0 font-mono">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-bold text-xs text-slate-100 truncate uppercase mt-0.5">{item.name}</h3>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.entityType === 'contributor' ? 'bg-red-950/40 text-red-400' : 'bg-cyan-950/40 text-cyan-300'}`}>{item.entityType}</span>
                              </div>
                              <p className="text-[9px] text-slate-500 uppercase truncate mt-0.5">CLASS / SEC_ID: <span className="text-slate-350">{displayRole}</span> / {item.id}</p>
                            </div>
                          </div>

                          <AnimatePresence>
                            {intentEditing && (
                              <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} onSubmit={handleSaveProfile} className="mt-3.5 pt-3.5 border-t border-yellow-500/20 space-y-3.5 text-[10px]">
                                <div>
                                  <label className="text-yellow-400 font-bold block">REWRITE FULL NAME:</label>
                                  <input type="text" required value={profName} onChange={(e) => setProfName(e.target.value)} className="w-full bg-slate-950 border border-yellow-500/30 rounded px-2.5 py-1.5 text-slate-100 font-bold" />
                                </div>

                                {item.entityType === 'friend' ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div><label className="text-cyan-400 font-bold">SPECIES (ID):</label><input type="text" value={profSpecies} onChange={(e) => setProfSpecies(e.target.value)} className="w-full bg-slate-950 border rounded px-2 py-1" /></div>
                                      <div><label className="text-cyan-400 font-bold">SPECIES (EN):</label><input type="text" value={profSpeciesEn} onChange={(e) => setProfSpeciesEn(e.target.value)} className="w-full bg-slate-950 border rounded px-2 py-1" /></div>
                                    </div>
                                    <div>
                                      <label className="text-[#dfb133] font-bold">CONNECTION TYPE:</label>
                                      <select value={profType} onChange={(e) => setProfType(e.target.value as any)} className="w-full bg-slate-950 border text-yellow-300"><option value="normal">Normal</option><option value="sahabat">Sahabat</option><option value="pacar">Relationship</option></select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div><label className="text-cyan-400 font-bold">BIO (ID):</label><textarea value={profBio} onChange={(e) => setProfBio(e.target.value)} className="w-full bg-slate-950 border h-12" /></div>
                                      <div><label className="text-cyan-400 font-bold">BIO (EN):</label><textarea value={profBioEn} onChange={(e) => setProfBioEn(e.target.value)} className="w-full bg-slate-950 border h-12" /></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 text-[8px] text-cyan-300">
                                      <input type="text" placeholder="IG URL" value={profIg} onChange={(e) => setProfIg(e.target.value)} className="bg-slate-900 rounded" />
                                      <input type="text" placeholder="Discord Tag" value={profDiscord} onChange={(e) => setProfDiscord(e.target.value)} className="bg-slate-900 rounded" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div><label className="text-red-400 font-bold">ROLES (ID):</label><input type="text" value={profRole} onChange={(e) => setProfRole(e.target.value)} className="w-full bg-slate-950 border text-red-300" /></div>
                                      <div><label className="text-red-400 font-bold">ROLES (EN):</label><input type="text" value={profRoleEn} onChange={(e) => setProfRoleEn(e.target.value)} className="w-full bg-slate-950 border text-red-300" /></div>
                                    </div>
                                    {item.id === 'c1' && (
                                      <div className="border border-red-500/20 p-2 rounded bg-slate-950/60 space-y-2 text-[8px]">
                                        <div className="grid grid-cols-2 gap-2">
                                          <input type="text" placeholder="Handle" value={profHandle} onChange={(e) => setProfHandle(e.target.value)} className="bg-slate-900 text-cyan-300" />
                                          <input type="text" placeholder="Token" value={profRegistration} onChange={(e) => setProfRegistration(e.target.value)} className="bg-slate-900 text-cyan-300" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <input type="text" placeholder="Email" value={profEmail} onChange={(e) => setProfEmail(e.target.value)} className="bg-slate-900 text-cyan-300" />
                                          <input type="text" placeholder="Phone" value={profPhone} onChange={(e) => setProfPhone(e.target.value)} className="bg-slate-900 text-cyan-300" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="bg-slate-900 border border-yellow-500/20 p-2 rounded flex items-center gap-2">
                                  <input type="file" ref={imgFileInputRef} accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                                  <button type="button" onClick={() => imgFileInputRef.current?.click()} className="px-2 py-1 bg-yellow-950 border border-yellow-500/30 text-yellow-300 text-[8.5px] font-bold uppercase"><Upload className="w-3 h-3" />LOAD DIRECT CLOUD JPG_</button>
                                  <span className="text-[8px] text-slate-450 font-mono truncate">{uploadProgress ? uploadProgress : "Upload file stream"}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <button type="button" onClick={() => handleDeleteProfile(item.entityType, item.id, item.name)} className="px-2 py-1 bg-red-950/20 border border-red-500 text-red-400 rounded text-[9px] font-bold">DELETE NODE_</button>
                                  <div className="flex gap-2">
                                    <button type="button" onClick={resetProfileForm} className="px-2 bg-slate-900 text-slate-500 rounded text-[9px]">CANCEL</button>
                                    <button type="submit" className="px-3 py-1 bg-yellow-500/15 border border-[#dfb133] text-[#dfb133] rounded font-bold uppercase">SAVE TO SYSTEM_</button>
                                  </div>
                                </div>
                              </motion.form>
                            )}
                          </AnimatePresence>

                          {!intentEditing && (
                            <div className="mt-3.5 py-2 border-t border-cyan-900/10 flex items-center justify-between text-[10px]">
                              <span className="text-slate-600 truncate max-w-[170px] text-[8.5px] font-mono">{item.avatarUrl || 'NO CUSTOM AVATAR'}</span>
                              <button type="button" onClick={() => handleEditClick(item)} className="px-3 py-1 bg-cyan-950/60 border border-cyan-500/20 text-cyan-200 rounded text-[9.5px] font-bold font-mono">MANAGE PROFILE_</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Music Manager */}
              {activeTab === 'music' && (
                <div className="space-y-6">
                  <form onSubmit={handleRegisterMusic} className="bg-slate-900/40 p-5 rounded-lg border border-pink-500/25 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-pink-900/20">
                      <Plus className="w-4.5 h-4.5 text-pink-400" />
                      <h3 className="text-xs font-bold text-pink-300 uppercase tracking-widest">IMPORT CUSTOM MEDIA TRACKS TO PERSISTENT FIREBASE</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                      <input type="text" required value={newTrackName} onChange={(e) => setNewTrackName(e.target.value)} placeholder="Track Name / Title" className="bg-slate-950 border border-pink-900/40 rounded px-2.5 py-2 w-full text-pink-300" />
                      <input type="text" value={newTrackDesc} onChange={(e) => setNewTrackDesc(e.target.value)} placeholder="Artist / Description" className="bg-slate-950 border border-pink-900/40 rounded px-2.5 py-2 w-full text-pink-300" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] bg-slate-950 p-4 rounded-lg border border-pink-500/10">
                      <div className="space-y-2">
                        <span className="text-pink-400 font-bold uppercase text-[9px] block">📁 UPLOAD MP3 FILE AUDIO:</span>
                        <input type="file" ref={mp3FileInputRef} accept="audio/*" onChange={handleMp3Upload} className="hidden" />
                        <button type="button" onClick={() => mp3FileInputRef.current?.click()} className="w-full px-3 py-2 bg-pink-950 border border-pink-500/30 text-pink-300 rounded font-bold text-[9px] uppercase"><Upload className="w-3.5 h-3.5" />SELECT FILE MP3_</button>
                      </div>

                      <div className="space-y-2">
                        <span className="text-pink-400 font-bold uppercase text-[9px] block">🖼️ UPLOAD COVER IMAGE FILE:</span>
                        <input type="file" ref={trackImageFileInputRef} accept="image/*" onChange={handleTrackImageUpload} className="hidden" />
                        <button type="button" onClick={() => trackImageFileInputRef.current?.click()} className="w-full px-3 py-2 bg-pink-950 border border-pink-500/30 text-pink-300 rounded font-bold text-[9px] uppercase"><Upload className="w-3.5 h-3.5" />SELECT COVER IMAGE_</button>
                      </div>

                      <div className="space-y-2">
                        <span className="text-pink-400 font-bold uppercase text-[9px] block">🔗 ALTERNATIF: YOUTUBE VIDEO ID:</span>
                        <input type="text" value={newTrackYtId} onChange={(e) => setNewTrackYtId(e.target.value)} placeholder="e.g. dQw4w9WgXcQ" className="w-full bg-slate-900 border border-pink-900/30 rounded px-2.5 py-1.5 text-pink-300 font-mono" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center flex-wrap gap-2 pt-2 text-[10px]">
                      <span className="text-[#dfb133] font-bold animate-pulse text-[9px] uppercase">{uploadProgress ? `⚡ CLOUD_LOG: ${uploadProgress}` : "SYNC BUFFER READY"}</span>
                      <button type="submit" className="px-4 py-2 bg-pink-950 border border-pink-400 text-pink-300 rounded uppercase font-bold text-xs">COMPILE & SAVE MUSIC KEY_</button>
                    </div>
                  </form>

                  <div className="space-y-2 text-[10px]">
                    <h3 className="font-bold text-slate-300 uppercase tracking-wider pl-1">ACTIVE DATABASE PLAYLIST STREAM:</h3>
                    <div className="border border-pink-500/10 rounded-lg overflow-hidden bg-slate-950">
                      <div className="grid grid-cols-12 bg-slate-900/80 p-2 text-[8.5px] font-bold text-slate-400 border-b uppercase tracking-widest">
                        <div className="col-span-1 text-center">ID</div>
                        <div className="col-span-1">COVER</div>
                        <div className="col-span-4 pl-2">SONG TITLE</div>
                        <div className="col-span-4">STREAM REFERENCE REFERENCE URL</div>
                        <div className="col-span-2 text-right pr-2">DELETE</div>
                      </div>

                      <div className="divide-y divide-pink-950/20 max-h-[300px] overflow-y-auto">
                        {tracks.map((track, tIdx) => (
                          <div key={track.id} className="grid grid-cols-12 p-3 text-[10px] items-center hover:bg-slate-900/30 text-slate-350">
                            <div className="col-span-1 text-center text-pink-400/60 font-bold">{tIdx + 1}</div>
                            <div className="col-span-1">
                              <div className="w-8 h-8 rounded bg-slate-900 border overflow-hidden flex items-center justify-center text-[7px]">
                                {track.image_url ? <img src={track.image_url} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : "NO IMA_"}
                              </div>
                            </div>
                            <div className="col-span-4 pl-2 truncate font-bold text-slate-200">🎵 {track.name}</div>
                            <div className="col-span-4 text-[9px] text-slate-400 truncate">{track.youtubeId ? `YT VIDEO: ${track.youtubeId}` : `CLOUD_URL: ${track.music_url || track.url}`}</div>
                            <div className="col-span-2 text-right pr-2">
                              <button type="button" onClick={() => { if (confirm(`Remove track "${track.name}"?`)) deleteTrack(track.id); }} className="p-1 px-2 border border-slate-900 text-slate-500 hover:text-red-400 bg-slate-950 rounded text-[9px]">DELETE</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Announcements */}
              {activeTab === 'updates' && (
                <div className="space-y-6">
                  <form onSubmit={handlePublishAnnouncement} className="bg-slate-900/40 p-5 rounded-lg border border-[#dfb133]/25 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-amber-900/20">
                      <Megaphone className="w-4.5 h-4.5 text-amber-400" />
                      <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest">PUBLISH NEW ANNOUNCEMENT (PORTAL UPDATE)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <input type="text" required value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} placeholder="LOG TITLE" className="md:col-span-8 bg-slate-950 border rounded px-2.5 py-2 text-amber-200 font-bold uppercase" />
                      <select value={annCategory} onChange={(e) => setAnnCategory(e.target.value as any)} className="md:col-span-4 bg-slate-950 border rounded px-2.5 py-2 text-amber-200 font-bold"><option value="UPDATE">UPDATE / FEATURE</option><option value="SECURITY">SECURITY / LOGS</option><option value="MAINTENANCE">MAINTENANCE</option><option value="GENERAL">GENERAL INFO</option></select>
                    </div>
                    <textarea required rows={3} value={annContent} onChange={(e) => setAnnContent(e.target.value)} placeholder="Define patch details..." className="bg-slate-950 border rounded p-2.5 w-full text-slate-200 text-[11px] h-24" />
                    <div className="flex justify-end"><button type="submit" className="px-4 py-2 bg-amber-950/80 border border-amber-500 text-amber-300 rounded font-bold uppercase text-[10.5px]">PUBLISH UPDATE NODE_</button></div>
                  </form>

                  <div className="space-y-2 text-[10px]">
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="bg-slate-950 border border-cyan-500/10 p-3 rounded flex items-start justify-between gap-4 text-[9.5px]">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap"><span className="text-[#dfb133] font-bold">[{ann.category}]</span><span className="text-slate-200 font-bold truncate uppercase">{ann.title}</span></div>
                            <p className="text-slate-400 text-[8.5px] max-w-xl leading-relaxed mt-0.5">{ann.content}</p>
                          </div>
                          <button type="button" onClick={() => { if (confirm("Delete?")) deleteAnnouncement(ann.id); }} className="p-1 px-2 border border-slate-900 text-slate-500 hover:text-red-400 bg-slate-950/80 rounded font-bold">DELETE</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Database Setting */}
              {activeTab === 'database' && (
                <div className="border border-purple-500/20 bg-slate-950/45 p-5 md:p-6 rounded-lg space-y-6">
                  <div className="flex gap-3 items-center">
                    <Database className="w-6 h-6 text-purple-400 animate-pulse" />
                    <div>
                      <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">Vercel & Firestore Shadow Engine</h2>
                    </div>
                  </div>
                  <form onSubmit={handleSaveDbConfig} className="space-y-4 pt-3 border-t border-cyan-900/10">
                    <input type="text" value={tempVercelUrl} onChange={(e) => setTempVercelUrl(e.target.value)} className="bg-slate-950 border border-cyan-803/40 rounded px-3 py-2 text-xs text-cyan-300 w-full" />
                    <div className="flex items-center gap-3">
                      <button type="submit" className="bg-purple-950/80 text-purple-300 border border-purple-400 px-4 py-1.5 rounded text-xs font-bold uppercase">CHANGE DATABASE BINDING_</button>
                      <button type="button" onClick={handleForceSync} className="bg-slate-900 text-slate-300 border hover:text-cyan-400 px-3 py-1.5 rounded text-xs uppercase flex items-center gap-1.5 cursor-pointer"><RefreshCw className={`w-3.5 h-3.5 ${syncAnimation ? 'animate-spin' : ''}`} />TEST CONNECTION HANDSHAKE</button>
                    </div>
                  </form>
                  <div className="flex justify-end pt-2">
                    <button type="button" onClick={() => { if (confirm("Reset current database state?")) { resetDatabase(); setTempVercelUrl('https://kv.vercel-storage.com/redis-node-nesinezz'); } }} className="px-3 py-1 bg-red-950/30 border border-red-500 text-red-450 rounded uppercase text-[10px] font-bold cursor-pointer">RESET DATABASE MATRIX (CLEAR ALL CUSTOM ENTRIES)</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-900 border-t border-cyan-900/10 p-3 text-center text-[9px] text-slate-500 shrink-0">
              SECURE DECRYPT CONTROL DESK // ACTIVE SYSTEM NODE
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
