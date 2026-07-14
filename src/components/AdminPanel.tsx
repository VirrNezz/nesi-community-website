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
  Flame,
  Globe,
  Monitor,
  LayoutGrid,
  Upload,
  Plus,
  Play,
  Music,
  Megaphone,
  AlertTriangle
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
    updateAvatar, 
    resetDatabase, 
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
    deleteContributor
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

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    // SECURE PASSCODE UPDATE: Changed exactly to Nezz_ajah
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
      
      // parse socials
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

    // construct socials
    const socialsList = [];
    if (profIg) socialsList.push({ platform: 'instagram', url: profIg, label: 'Instagram' });
    if (profDiscord) socialsList.push({ platform: 'discord', url: 'https://discord.com', label: profDiscord });
    if (profSteam) socialsList.push({ platform: 'steam', url: profSteam, label: 'Steam' });
    if (profX) socialsList.push({ platform: 'x', url: profX, label: 'Twitter' });

    // parse comma-separated fields
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

  // Profile JPEG Avatar file conversions
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert("Please upload a valid image file (JPEG/PNG/JPG).");
      return;
    }

    setUploadProgress('COMPILING AVATAR TO CLOUD...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setInputUrl(data.url);
        setUploadProgress('Avatar uploaded stably!');
      } else {
        alert("Upload error: " + (data.error || 'Unknown response'));
        setUploadProgress('Upload failed.');
      }
    } catch (err: any) {
      console.error("Avatar cloud upload failed:", err);
      alert("Cloud upload failed: " + (err.message || err));
      setUploadProgress('Upload failed.');
    }
    setTimeout(() => setUploadProgress(''), 3000);
  };

  const handleApplyPreset = (url: string) => {
    setInputUrl(url);
  };

  // Custom Track Image Cover upload handler
  const handleTrackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert("Please select a valid image file.");
      return;
    }

    setUploadProgress('COMPILING IMAGE COVER...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewTrackImageUrl(data.url);
        setUploadProgress('Cover image uploaded stably!');
      } else {
        alert("Upload error: " + (data.error || 'Unknown response'));
        setUploadProgress('Upload failed.');
      }
    } catch (err: any) {
      console.error("Cover upload failed:", err);
      alert("Cloud upload failed: " + (err.message || err));
      setUploadProgress('Upload failed.');
    }
    setTimeout(() => setUploadProgress(''), 3000);
  };

  // Custom MP3 addition system
  const handleMp3Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('audio.*')) {
      alert("Please select a valid MP3 file.");
      return;
    }

    setUploadProgress('COMPILING MP3 TO STORAGE...');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'music');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        setNewTrackMusicUrl(data.url);
        setNewTrackUrl(data.url);
        setNewTrackName(file.name.replace(/\.[^/.]+$/, "")); // remove file extensions
        setNewTrackDesc('Custom Uploaded MP3 Node');
        setUploadProgress('MP3 file uploaded stably!');
      } else {
        alert("Upload error: " + (data.error || 'Unknown response'));
        setUploadProgress('Upload failed.');
      }
    } catch (err: any) {
      console.error("Audio upload failed:", err);
      alert("Cloud upload failed: " + (err.message || err));
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

    // Reset track creation form
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

  // Announcement submit systems
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

    // Reset fields
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

  // Combine entities for edit view list
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
        {/* Glowing accents */}
        <div className="corner-gold-tl"></div>
        <div className="corner-gold-tr"></div>
        <div className="corner-gold-bl"></div>
        <div className="corner-gold-br"></div>
        
        {/* Header bar */}
        <div className="bg-slate-900 border-b border-cyan-900/40 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-amber-300 bg-clip-text text-transparent uppercase tracking-wider">
                NesiNezz Overlord Database & File Master
              </h1>
              <span className="text-[9px] text-slate-500 uppercase">OFFLINE & VERCEL REAL-TIME MULTIPLEX SYNC ENGINE</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 border border-slate-800 hover:border-red-500/50 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Form */
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 max-w-md mx-auto min-h-[350px]">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl border border-cyan-500/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
              <div className="absolute inset-0 border border-cyan-500/10 rounded-2xl animate-ping opacity-25"></div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-slate-100 text-sm font-bold uppercase tracking-wider">SECURE AUTHORIZATION CONTROL</h2>
              <p className="text-[10px] text-slate-500 px-4 leading-relaxed uppercase">
                Write operations to local storage and Vercel structures require the bypass security code.
              </p>
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

              {authError && (
                <p className="text-[10px] text-red-500 text-center uppercase tracking-wider animate-shake">
                  ❌ ENCRYPT_KEY_ERROR // ACCESS BLOCKED
                </p>
              )}

              <button 
                type="submit"
                className="w-full bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-400/50 hover:border-cyan-400 rounded py-2 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer"
              >
                COMPILE HANDSHAKE_
              </button>
            </form>
          </div>
        ) : (
          /* Main Authenticated Panel */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Database status band */}
            <div className="bg-slate-950 border-b border-cyan-900/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[10px] shrink-0">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Server className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM HOST: {' '}
                  <span className="text-slate-250 font-bold uppercase">{dbType}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Activity className="w-3.5 h-3.5 text-[#dfb133]" /> LATENCY: {' '}
                  <span className="text-[#dfb133] font-bold">{dbMetrics.latency}ms</span>
                </span>
              </div>
              
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-500">READS: <span className="text-cyan-400 font-bold">{dbMetrics.reads}</span></span>
                <span className="text-slate-500">WRITES: <span className="text-pink-400 font-bold">{dbMetrics.writes}</span></span>
                <span className="text-cyan-400 font-bold bg-cyan-900/10 px-2 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                  {dbStatus}
                </span>
              </div>
            </div>

            {/* Selector tabs & filters */}
            <div className="bg-slate-900/60 p-4 border-b border-cyan-900/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'users'
                      ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950 border-cyan-850/10 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  AVATAR CONTROL [{allEntities.length}]
                </button>

                <button
                  onClick={() => setActiveTab('music')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'music'
                      ? 'bg-pink-500/15 border-pink-400/80 text-pink-300 shadow-[0_0_8px_rgba(244,114,182,0.3)]'
                      : 'bg-slate-950 border-cyan-850/10 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Music className="w-3.5 h-3.5" />
                  MUSIC MANAGER [{tracks.length}]
                </button>

                <button
                  onClick={() => setActiveTab('updates')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'updates'
                      ? 'bg-[#dfb133]/15 border-[#dfb133] text-amber-300 shadow-[0_0_8px_rgba(223,177,51,0.3)]'
                      : 'bg-slate-950 border-cyan-850/10 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  ANNOUNCEMENTS [{announcements.length}]
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'database'
                      ? 'bg-purple-500/15 border-purple-400/80 text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.35)]'
                      : 'bg-slate-950 border-cyan-850/10 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  VERCEL ENV SEEDING
                </button>
              </div>

              {activeTab === 'users' && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="FILTER BY NAME..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-slate-950 border border-cyan-805/25 rounded px-8 py-1.5 text-xs text-cyan-300 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 w-full sm:w-60"
                  />
                </div>
              )}
            </div>

            {/* Scrollable Content wrapper */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                           {/* TAB 1: Avatars & Profiles Control Hub */}
              {activeTab === 'users' && (
                <div className="space-y-5">
                  <div className="bg-slate-900/40 border border-cyan-950 p-4 rounded-md relative overflow-hidden flex flex-col md:flex-row shadow-inner justify-between items-start md:items-center gap-3">
                    <p className="text-[10.5px] text-slate-400 leading-relaxed uppercase max-w-xl">
                      ⚡ <span className="text-cyan-400 font-bold">REAL-TIME PROFILE MANAGER</span>: Oversee, edit, construct, or delete connection modules in real-time. Changes instantly compile and commit to persistent store matrices.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const ownerNode = contributors.find(c => c.id === 'c1');
                          if (ownerNode) {
                            handleEditClick({ ...ownerNode, entityType: 'contributor' });
                          } else {
                            alert("Owner profile not found in database registry.");
                          }
                        }}
                        className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border-2 border-amber-500/50 hover:border-amber-400 rounded-md text-[10.5px] uppercase font-bold tracking-wider cursor-pointer text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)] transition-all font-mono"
                      >
                        👤 EDIT OWNER DECK CARD_
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (isAddingProfile) {
                            resetProfileForm();
                          } else {
                            resetProfileForm();
                            setIsAddingProfile(true);
                          }
                        }}
                        className="px-3.5 py-2 bg-cyan-950 hover:bg-cyan-900 border-2 border-cyan-500/60 hover:border-cyan-400 rounded-md text-[10.5px] uppercase font-bold tracking-wider cursor-pointer text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)] shrink-0 transition-all font-mono"
                      >
                        {isAddingProfile ? "CANCEL CREATION_ [X]" : "[+] REGISTER NEW PROFILE_"}
                      </button>
                    </div>
                  </div>

                  {/* PROFILE CREATOR DECK */}
                  <AnimatePresence>
                    {isAddingProfile && (
                      <motion.form 
                        initial={{ opacity: 0, y: -15, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -15, height: 0 }}
                        onSubmit={handleSaveProfile} 
                        className="bg-slate-950 border-2 border-cyan-400 p-4 md:p-5 rounded-lg space-y-4 text-[10px] text-slate-300 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)] shrink-0"
                      >
                        <div className="text-xs font-bold text-cyan-300 uppercase tracking-widest border-b border-cyan-950 pb-2 flex items-center justify-between">
                          <span>🌐 DB SYSTEM INGRESS / CREATE PROFILE NODE</span>
                          <span className="text-[9px] text-[#dfb133]">SECURE PIPELINE // REAL-TIME SYNC</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-cyan-455 font-bold uppercase block tracking-wider mb-1">PROFILE CATEGORY TYPE:</label>
                            <select 
                              value={newProfileType}
                              onChange={(e) => setNewProfileType(e.target.value as any)}
                              className="w-full bg-slate-900 border border-cyan-800/40 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-bold uppercase text-xs text-cyan-300 cursor-pointer"
                            >
                              <option value="friend">FRIEND (KONEKSI PORTAL)</option>
                              <option value="contributor">CONTRIBUTOR (SYSTEM OPERATOR)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-cyan-455 font-bold uppercase block tracking-wider mb-1">FULL UNIQUE NAME:</label>
                            <input 
                              type="text" 
                              required
                              value={profName}
                              onChange={(e) => setProfName(e.target.value)}
                              placeholder="e.g. Chloe Valentine"
                              className="w-full bg-slate-900 border border-cyan-800/40 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 text-slate-100 placeholder:text-slate-700 text-xs font-sans font-bold"
                            />
                          </div>
                        </div>

                        {newProfileType === 'friend' ? (
                          /* Friend Fields */
                          <div className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Species الاسم (ID):</label>
                                <input 
                                  type="text"
                                  value={profSpecies}
                                  onChange={(e) => setProfSpecies(e.target.value)}
                                  placeholder="e.g. Kucing Hitam"
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans"
                                />
                              </div>
                              <div>
                                <label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Species Name (EN):</label>
                                <input 
                                  type="text"
                                  value={profSpeciesEn}
                                  onChange={(e) => setProfSpeciesEn(e.target.value)}
                                  placeholder="e.g. Black Cat"
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans"
                                />
                              </div>
                              <div>
                                <label className="text-[#dfb133] uppercase block tracking-wider font-bold mb-1">Connection Level / Border:</label>
                                <select 
                                  value={profType}
                                  onChange={(e) => setProfType(e.target.value as any)}
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans uppercase font-bold text-yellow-300 cursor-pointer"
                                >
                                  <option value="normal">Normal (Cyan Border)</option>
                                  <option value="sahabat">Sahabat / Best Friend (Gold Border)</option>
                                  <option value="pacar">Relationship (Secret Purple-Pink Border)</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Characteristics (Comma Separated ID):</label>
                                <input 
                                  type="text"
                                  value={profChars}
                                  onChange={(e) => setProfChars(e.target.value)}
                                  placeholder="e.g. Setia, Pemalu, Manja"
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans"
                                />
                              </div>
                              <div>
                                <label className="text-cyan-450 uppercase block tracking-wider font-bold mb-1">Characteristics (Comma Separated EN):</label>
                                <input 
                                  type="text"
                                  value={profCharsEn}
                                  onChange={(e) => setProfCharsEn(e.target.value)}
                                  placeholder="e.g. Loyal, Shy, Affectionate"
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-cyan-455 uppercase block tracking-wider font-bold mb-1">Biography (ID):</label>
                                <textarea 
                                  rows={2}
                                  value={profBio}
                                  onChange={(e) => setProfBio(e.target.value)}
                                  placeholder="Tulis biografi singkat tentang sahabat ini dalam Bahasa Indonesia..."
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 focus:outline-none focus:border-cyan-400 font-sans h-16 leading-relaxed"
                                />
                              </div>
                              <div>
                                <label className="text-cyan-455 uppercase block tracking-wider font-bold mb-1">Biography (EN):</label>
                                <textarea 
                                  rows={2}
                                  value={profBioEn}
                                  onChange={(e) => setProfBioEn(e.target.value)}
                                  placeholder="Write connection bio translated in English..."
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 focus:outline-none focus:border-cyan-400 font-sans h-16 leading-relaxed"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/50 p-3 rounded border border-cyan-900/20 font-mono">
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Instagram URL:</label>
                                <input 
                                  type="text"
                                  value={profIg}
                                  onChange={(e) => setProfIg(e.target.value)}
                                  placeholder="https://instagram.com/..."
                                  className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500 text-[9px] text-cyan-300"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Discord Tag:</label>
                                <input 
                                  type="text"
                                  value={profDiscord}
                                  onChange={(e) => setProfDiscord(e.target.value)}
                                  placeholder="e.g. discord_nick"
                                  className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500 text-[9px] text-cyan-300"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-bold block mb-1">Steam Profile URL:</label>
                                <input 
                                  type="text"
                                  value={profSteam}
                                  onChange={(e) => setProfSteam(e.target.value)}
                                  placeholder="https://steamcommunity.com/..."
                                  className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500 text-[9px] text-cyan-300"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] text-slate-500 uppercase font-bold block mb-1">X/Twitter URL:</label>
                                <input 
                                  type="text"
                                  value={profX}
                                  onChange={(e) => setProfX(e.target.value)}
                                  placeholder="https://x.com/..."
                                  className="w-full bg-slate-950 border border-cyan-950 rounded px-2 py-1.5 focus:outline-none focus:border-cyan-500 text-[9px] text-cyan-300"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Contributor Fields */
                          <div className="space-y-4 pt-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-red-400 uppercase block tracking-wider font-bold mb-1">Roles (Comma Separated ID):</label>
                                <input 
                                  type="text"
                                  value={profRole}
                                  onChange={(e) => setProfRole(e.target.value)}
                                  placeholder="e.g. Pemilik, Penulis Kode"
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans text-red-300"
                                />
                              </div>
                              <div>
                                <label className="text-red-400 uppercase block tracking-wider font-bold mb-1">Roles (Comma Separated EN):</label>
                                <input 
                                  type="text"
                                  value={profRoleEn}
                                  onChange={(e) => setProfRoleEn(e.target.value)}
                                  placeholder="e.g. Owner, Fullstack Architect"
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 font-sans text-red-300"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-red-400 uppercase block tracking-wider font-bold mb-1">System Specs / Contributions (ID):</label>
                                <textarea 
                                  rows={2}
                                  value={profSpecs}
                                  onChange={(e) => setProfSpecs(e.target.value)}
                                  placeholder="e.g. API Gateway, Database Postgres, Antarmuka Audio..."
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 focus:outline-none focus:border-cyan-400 font-sans h-16 leading-relaxed"
                                />
                              </div>
                              <div>
                                <label className="text-red-400 uppercase block tracking-wider font-bold mb-1">System Specs / Contributions (EN):</label>
                                <textarea 
                                  rows={2}
                                  value={profSpecsEn}
                                  onChange={(e) => setProfSpecsEn(e.target.value)}
                                  placeholder="e.g. Main server endpoints, PostgreSQL structures, client synth loops..."
                                  className="w-full bg-slate-900 border border-cyan-800/30 rounded p-2.5 focus:outline-none focus:border-cyan-400 font-sans h-16 leading-relaxed"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-red-450 uppercase block tracking-wider font-bold mb-1">Identities Seed (Avatar Generation Code):</label>
                              <input 
                                type="text"
                                value={profSeed}
                                onChange={(e) => setProfSeed(e.target.value)}
                                placeholder="e.g. code_nezz_matrix"
                                className="w-full bg-slate-900 border border-cyan-800/30 rounded px-2.5 py-2 focus:outline-none focus:border-cyan-400 text-red-300 text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {/* Image asset uploader module */}
                        <div className="border-t border-cyan-900/30 pt-3.5 space-y-3">
                          <span className="text-cyan-400 font-bold uppercase block text-xs tracking-wider">💾 PROFILE PICTURE & AVATAR DECK:</span>
                          <div className="bg-slate-900 p-3 rounded border border-cyan-950 space-y-2">
                            <label className="text-cyan-400 font-bold uppercase tracking-wider block text-[9px]">
                              📁 CHOOSE BINARY IMAGES (JPEG/JPG/PNG/WEBP) RAW FILE STREAM:
                            </label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="file" 
                                ref={imgFileInputRef}
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => imgFileInputRef.current?.click()}
                                className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 rounded uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-[9px] font-bold"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                CHOOSE AVATAR FILE_
                              </button>
                              <span className="text-[8.5px] text-slate-500 truncate block">
                                {uploadProgress ? uploadProgress : "Recommended: square ratio"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/40">
                          <button
                            type="button"
                            onClick={resetProfileForm}
                            className="px-3.5 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 rounded uppercase font-bold tracking-wider cursor-pointer"
                          >
                            RESET_
                          </button>
                          <button
                            type="submit"
                            className="px-4.5 py-2 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-400 hover:border-cyan-300 rounded uppercase font-bold tracking-widest cursor-pointer shadow-lg"
                          >
                            COMPILE & SYNC PROFILE NODE_
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* ACTIVE PROFILES LISTINGS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allEntities.map((item) => {
                      const isEditing = editingId === item.id;
                      const displayRole = Array.isArray(item.role) ? item.role[0] : 'Contributor';
                      const hasAvatar = !!item.avatarUrl;
                      
                      return (
                        <div 
                          key={item.id}
                          className={`border rounded-lg p-3.5 flex flex-col justify-between transition-all duration-300 overflow-hidden relative ${
                            isEditing 
                              ? 'border-[#dfb133] bg-slate-950 shadow-[0_0_20px_rgba(223,177,51,0.15)] ring-1 ring-[#dfb133]/20' 
                              : 'border-cyan-500/10 bg-slate-900/30 hover:border-cyan-400/20 hover:bg-slate-900/40'
                          }`}
                        >
                          <div className="flex gap-3 items-start">
                            {/* Avatar render */}
                            <div className={`w-12 h-12 bg-slate-950 rounded-xl overflow-hidden select-none relative shrink-0 border-2 ${
                              item.entityType === 'friend' && (item as any).type === 'sahabat'
                                ? 'border-yellow-500'
                                : item.entityType === 'friend' && (item as any).type === 'pacar'
                                ? 'border-pink-500'
                                : 'border-cyan-550/30'
                            }`}>
                              {hasAvatar ? (
                                <img 
                                  src={item.avatarUrl} 
                                  alt={item.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : null}
                              <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-cyan-400 uppercase bg-slate-950/80">
                                {!hasAvatar ? item.name.slice(0, 2) : ''}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 font-mono">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h3 className="font-bold text-xs text-slate-100 truncate uppercase mt-0.5">{item.name}</h3>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                  item.entityType === 'contributor' 
                                    ? 'bg-red-950/40 text-red-400 border border-red-500/20' 
                                    : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/20'
                                }`}>
                                  {item.entityType}
                                </span>
                                {item.entityType === 'friend' && (
                                  <span className={`text-[8px] px-1 py-0.5 rounded font-bold uppercase tracking-wider ${
                                    (item as any).type === 'sahabat'
                                      ? 'bg-yellow-950/40 text-yellow-500 border border-yellow-500/35'
                                      : (item as any).type === 'pacar'
                                      ? 'bg-pink-955/40 text-pink-400 border border-pink-500/35 animate-pulse'
                                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                                  }`}>
                                    {(item as any).type}
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-slate-500 uppercase truncate leading-relaxed mt-0.5">
                                CLASS / SEC_ID: <span className="text-slate-350">{displayRole}</span> / {item.id}
                              </p>
                            </div>
                          </div>

                          {/* Full Interactive Inline CRUD Editor */}
                          <AnimatePresence initial={false}>
                            {isEditing ? (
                              <motion.form 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                onSubmit={handleSaveProfile}
                                className="mt-3.5 pt-3.5 border-t border-yellow-500/20 space-y-3.5 overflow-hidden text-[10px] text-slate-300"
                              >
                                <div className="space-y-1">
                                  <label className="text-yellow-400 font-bold uppercase block tracking-wider">REWRITE FULL NAME:</label>
                                  <input 
                                    type="text" 
                                    required
                                    value={profName}
                                    onChange={(e) => setProfName(e.target.value)}
                                    className="w-full bg-slate-950 border border-yellow-500/30 rounded px-2.5 py-1.5 focus:outline-none focus:border-yellow-400 text-slate-100 placeholder:text-slate-800 font-sans font-bold"
                                  />
                                </div>

                                {item.entityType === 'friend' ? (
                                  /* Friend Editor Fields */
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div>
                                        <label className="text-cyan-400 block tracking-wider font-bold mb-0.5">SPECIES (ID):</label>
                                        <input 
                                          type="text"
                                          value={profSpecies}
                                          onChange={(e) => setProfSpecies(e.target.value)}
                                          className="w-full bg-slate-950 border border-cyan-900/30 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-sans"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-cyan-400 block tracking-wider font-bold mb-0.5">SPECIES (EN):</label>
                                        <input 
                                          type="text"
                                          value={profSpeciesEn}
                                          onChange={(e) => setProfSpeciesEn(e.target.value)}
                                          className="w-full bg-slate-950 border border-cyan-900/30 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-sans"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-[#dfb133] block tracking-wider font-bold mb-0.5 font-mono">CONNECTION TYPE:</label>
                                      <select 
                                        value={profType}
                                        onChange={(e) => setProfType(e.target.value as any)}
                                        className="w-full bg-slate-950 border border-cyan-900/30 rounded px-2 py-1 focus:outline-none focus:border-[#dfb133] font-sans font-bold text-yellow-300"
                                      >
                                        <option value="normal">Normal (Cyan Border)</option>
                                        <option value="sahabat">Sahabat / Best Friend (Gold Border)</option>
                                        <option value="pacar">Relationship (Secret Purple-Pink Border)</option>
                                      </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div>
                                        <label className="text-cyan-400 block tracking-wider font-bold mb-0.5">CHARACTERISTICS (ID):</label>
                                        <input 
                                          type="text"
                                          value={profChars}
                                          onChange={(e) => setProfChars(e.target.value)}
                                          placeholder="Loyal, Kucing, Ceria"
                                          className="w-full bg-slate-950 border border-cyan-900/30 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-sans"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-cyan-400 block tracking-wider font-bold mb-0.5">CHARACTERISTICS (EN):</label>
                                        <input 
                                          type="text"
                                          value={profCharsEn}
                                          onChange={(e) => setProfCharsEn(e.target.value)}
                                          placeholder="Loyal, Cat, Cheerful"
                                          className="w-full bg-slate-950 border border-cyan-900/30 rounded px-2 py-1 focus:outline-none focus:border-cyan-400 font-sans"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div>
                                        <label className="text-cyan-400 block tracking-wider font-bold mb-0.5">BIO (ID):</label>
                                        <textarea 
                                          rows={2}
                                          value={profBio}
                                          onChange={(e) => setProfBio(e.target.value)}
                                          className="w-full bg-slate-950 border border-cyan-900/30 rounded p-1.5 focus:outline-none focus:border-cyan-400 font-sans h-12 text-[9px]"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-cyan-400 block tracking-wider font-bold mb-0.5">BIO (EN):</label>
                                        <textarea 
                                          rows={2}
                                          value={profBioEn}
                                          onChange={(e) => setProfBioEn(e.target.value)}
                                          className="w-full bg-slate-950 border border-cyan-900/30 rounded p-1.5 focus:outline-none focus:border-cyan-400 font-sans h-12 text-[9px]"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2 rounded border border-cyan-900/20 font-mono text-[8px]">
                                      <div>
                                        <label className="text-slate-500 font-bold block mb-0.5">INSTAGRAM:</label>
                                        <input 
                                          type="text"
                                          value={profIg}
                                          onChange={(e) => setProfIg(e.target.value)}
                                          className="w-full bg-slate-900 border border-cyan-950 rounded px-1.5 py-0.5 text-cyan-300"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-slate-500 font-bold block mb-0.5">DISCORD TAG:</label>
                                        <input 
                                          type="text"
                                          value={profDiscord}
                                          onChange={(e) => setProfDiscord(e.target.value)}
                                          className="w-full bg-slate-900 border border-cyan-950 rounded px-1.5 py-0.5 text-cyan-300"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-slate-500 font-bold block mb-0.5">STEAM URL:</label>
                                        <input 
                                          type="text"
                                          value={profSteam}
                                          onChange={(e) => setProfSteam(e.target.value)}
                                          className="w-full bg-slate-900 border border-cyan-950 rounded px-1.5 py-0.5 text-cyan-300"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-slate-500 font-bold block mb-0.5">X/TWITTER:</label>
                                        <input 
                                          type="text"
                                          value={profX}
                                          onChange={(e) => setProfX(e.target.value)}
                                          className="w-full bg-slate-900 border border-cyan-950 rounded px-1.5 py-0.5 text-cyan-300"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* Contributor Editor Fields */
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div>
                                        <label className="text-red-400 block tracking-wider font-bold mb-0.5">ROLES (ID):</label>
                                        <input 
                                          type="text"
                                          value={profRole}
                                          onChange={(e) => setProfRole(e.target.value)}
                                          className="w-full bg-slate-950 border border-red-900/30 rounded px-2 py-1 focus:outline-none focus:border-red-400 font-sans text-red-300"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-red-400 block tracking-wider font-bold mb-0.5">ROLES (EN):</label>
                                        <input 
                                          type="text"
                                          value={profRoleEn}
                                          onChange={(e) => setProfRoleEn(e.target.value)}
                                          className="w-full bg-slate-950 border border-red-900/30 rounded px-2 py-1 focus:outline-none focus:border-red-400 font-sans text-red-300"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                      <div>
                                        <label className="text-red-400 block tracking-wider font-bold mb-0.5">SPECS (ID):</label>
                                        <textarea 
                                          rows={2}
                                          value={profSpecs}
                                          onChange={(e) => setProfSpecs(e.target.value)}
                                          className="w-full bg-slate-950 border border-red-900/30 rounded p-1.5 focus:outline-none focus:border-red-500 font-sans h-12 text-[9px] text-red-300"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-red-400 block tracking-wider font-bold mb-0.5">SPECS (EN):</label>
                                        <textarea 
                                          rows={2}
                                          value={profSpecsEn}
                                          onChange={(e) => setProfSpecsEn(e.target.value)}
                                          className="w-full bg-slate-950 border border-red-900/30 rounded p-1.5 focus:outline-none focus:border-red-500 font-sans h-12 text-[9px] text-red-300"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="text-red-450 block tracking-wider font-bold mb-0.5">AVATAR IDENTITY SEED:</label>
                                      <input 
                                        type="text"
                                        value={profSeed}
                                        onChange={(e) => setProfSeed(e.target.value)}
                                        className="w-full bg-slate-950 border border-red-900/30 rounded px-2 py-1 focus:outline-none focus:border-red-400 text-red-300"
                                      />
                                    </div>

                                    {item.id === 'c1' && (
                                      <div className="border border-red-500/20 p-2 rounded bg-slate-950/60 space-y-2 mt-2 text-[8px]">
                                        <span className="text-[#dfb133] block tracking-widest font-mono uppercase font-bold border-b border-red-500/10 pb-1">
                                          👤 PRIMARY DECK OWNER ADDITIONAL PARAMETERS:
                                        </span>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">HANDLE:</label>
                                            <input 
                                              type="text"
                                              value={profHandle}
                                              onChange={(e) => setProfHandle(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-mono text-[9px]"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">REGISTRATION TOKEN:</label>
                                            <input 
                                              type="text"
                                              value={profRegistration}
                                              onChange={(e) => setProfRegistration(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-mono text-[9px]"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">EMAIL ADDR:</label>
                                            <input 
                                              type="text"
                                              value={profEmail}
                                              onChange={(e) => setProfEmail(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-mono text-[9px]"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">SECURE TELEPHONY:</label>
                                            <input 
                                              type="text"
                                              value={profPhone}
                                              onChange={(e) => setProfPhone(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-mono text-[9px]"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">LOCATION (ID):</label>
                                            <input 
                                              type="text"
                                              value={profLocation}
                                              onChange={(e) => setProfLocation(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-sans text-[9px]"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">LOCATION (EN):</label>
                                            <input 
                                              type="text"
                                              value={profLocationEn}
                                              onChange={(e) => setProfLocationEn(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-sans text-[9px]"
                                            />
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">BIOGRAPHY (ID):</label>
                                            <textarea 
                                              rows={2}
                                              value={profBio}
                                              onChange={(e) => setProfBio(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-sans h-10 text-[9px]"
                                            />
                                          </div>
                                          <div>
                                            <label className="text-red-400 font-bold block mb-0.5">BIOGRAPHY (EN):</label>
                                            <textarea 
                                              rows={2}
                                              value={profBioEn}
                                              onChange={(e) => setProfBioEn(e.target.value)}
                                              className="w-full bg-slate-900 border border-red-950 rounded px-1.5 py-0.5 text-cyan-300 font-sans h-10 text-[9px]"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Image files selector within loop editing */}
                                <div className="space-y-1.5 bg-slate-900 border border-yellow-500/20 p-2.5 rounded">
                                  <label className="text-yellow-400 font-bold uppercase block tracking-wider text-[8px]">
                                    📁 PROFILE PHOTO BUFFER ENCODING:
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="file" 
                                      ref={imgFileInputRef}
                                      accept="image/*"
                                      onChange={handleAvatarFileChange}
                                      className="hidden"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => imgFileInputRef.current?.click()}
                                      className="px-2 py-1 bg-yellow-950 border border-yellow-500/30 hover:border-yellow-400 text-yellow-300 rounded text-[8.5px] uppercase tracking-wider flex items-center gap-1 cursor-pointer font-bold"
                                    >
                                      <Upload className="w-3 h-3" />
                                      LOAD JPG BYTE_
                                    </button>
                                    <span className="text-[8px] text-slate-550 font-mono truncate">
                                      {uploadProgress ? uploadProgress : "Loads local photo"}
                                    </span>
                                  </div>
                                </div>

                                {/* Presets options */}
                                <div className="space-y-1">
                                  <span className="text-slate-500 block uppercase tracking-wider text-[7.5px] font-bold">⚡ INLINE PRESET TOGGLES:</span>
                                  <div className="grid grid-cols-2 gap-1">
                                    {AVATAR_PRESETS.map((preset, index) => (
                                      <button
                                        key={index}
                                        type="button"
                                        onClick={() => setInputUrl(preset.url)}
                                        className="text-left text-[7.5px] bg-slate-950 hover:bg-slate-900 text-slate-450 hover:text-cyan-300 border border-slate-900 p-1 rounded truncate cursor-pointer transition-colors"
                                      >
                                        📷 {preset.name.split(' (')[0]}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Controls: Save, Cancel, and red Delete Button */}
                                <div className="flex items-center justify-between pt-2 border-t border-yellow-500/25">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProfile(item.entityType, item.id, item.name)}
                                    className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-950 border border-red-500/60 hover:border-red-500 text-red-400 hover:text-slate-100 rounded text-[9px] uppercase tracking-wider font-bold cursor-pointer transition-all flex items-center gap-1.5"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    DELETE NODE całkowicie_
                                  </button>

                                  <div className="flex gap-2.5">
                                    <button
                                      type="button"
                                      onClick={resetProfileForm}
                                      className="px-2.5 py-1.5 bg-slate-1000 border border-slate-800 text-slate-500 hover:text-slate-300 rounded uppercase tracking-wider cursor-pointer font-bold text-[9px]"
                                    >
                                      CANCEL
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-3.5 py-1.5 bg-yellow-500/15 hover:bg-yellow-500/35 border border-[#dfb133] text-[#dfb133] rounded uppercase tracking-widest font-bold cursor-pointer text-[9.5px] shadow-sm animate-pulse"
                                    >
                                      SAVE TO SYSTEM_
                                    </button>
                                  </div>
                                </div>
                              </motion.form>
                            ) : (
                              <div className="mt-3.5 py-2 border-t border-cyan-900/10 flex items-center justify-between text-[10px]">
                                <span className="text-slate-600 truncate max-w-[170px] text-[8.5px] font-mono">
                                  {item.avatarUrl ? (item.avatarUrl.startsWith('data:') ? 'BASE64 BINARY BUFFER (JPG)' : item.avatarUrl) : 'NO CUSTOM AVATAR (INITIALS)'}
                                </span>
                                
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(item)}
                                  className="px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/20 hover:border-cyan-400/50 text-cyan-200 rounded text-[9.5px] uppercase tracking-wider transition-all cursor-pointer font-bold font-mono"
                                >
                                  MANAGE PROFILE_
                                </button>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Music Manager */}
              {activeTab === 'music' && (
                <div className="space-y-6">
                  {/* Music Adder form */}
                  <form onSubmit={handleRegisterMusic} className="bg-slate-900/40 p-5 rounded-lg border border-pink-500/25 relative overflow-hidden space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-pink-900/20">
                      <Plus className="w-4.5 h-4.5 text-pink-400" />
                      <h3 className="text-xs font-bold text-pink-300 uppercase tracking-widest">
                        IMPORT CUSTOM MEDIA TRACKS TO PERSISTENT VERCEL KV
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px]">
                      <div className="space-y-1.5">
                        <label className="text-slate-450 uppercase tracking-wider block font-bold">Track Name / Title:</label>
                        <input 
                          type="text"
                          required
                          value={newTrackName}
                          onChange={(e) => setNewTrackName(e.target.value)}
                          placeholder="e.g. Lost Kitty Phonk Mix"
                          className="bg-slate-950 border border-pink-900/40 rounded px-2.5 py-2 w-full text-pink-300 focus:outline-none focus:border-pink-400 placeholder:text-slate-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-450 uppercase tracking-wider block font-bold">Artist / Description:</label>
                        <input 
                          type="text"
                          value={newTrackDesc}
                          onChange={(e) => setNewTrackDesc(e.target.value)}
                          placeholder="e.g. Lofi Synth Beat"
                          className="bg-slate-950 border border-pink-900/40 rounded px-2.5 py-2 w-full text-pink-300 focus:outline-none focus:border-pink-400 placeholder:text-slate-700"
                        />
                      </div>
                    </div>

                    {/* MUSIC SOURCE & COVER IMAGE COMPOSITOR */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] bg-slate-950 p-4 rounded-lg border border-pink-500/10">
                      <div className="space-y-2">
                        <span className="text-pink-400 font-bold uppercase tracking-wider text-[9px] block">
                          📁 SELECT MUSIC AUDIO (TYPE="FILE"):
                        </span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="file"
                            ref={mp3FileInputRef}
                            accept="audio/*"
                            onChange={handleMp3Upload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => mp3FileInputRef.current?.click()}
                            className="w-full px-3 py-2 bg-pink-950 hover:bg-pink-900 border border-pink-500/30 hover:border-pink-400 text-pink-300 rounded uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer font-bold text-[9px]"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            UPLOAD MP3 FILE_
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-pink-400 font-bold uppercase tracking-wider text-[9px] block">
                          🖼️ SELECT COVER IMAGE (TYPE="FILE"):
                        </span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="file"
                            ref={trackImageFileInputRef}
                            accept="image/*"
                            onChange={handleTrackImageUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => trackImageFileInputRef.current?.click()}
                            className="w-full px-3 py-2 bg-pink-950 hover:bg-pink-900 border border-pink-500/30 hover:border-pink-400 text-pink-300 rounded uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer font-bold text-[9px]"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            UPLOAD COVER IMAGE_
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center flex-wrap gap-2 pt-2 text-[10px]">
                      <span className="text-[#dfb133] font-bold animate-pulse text-[9px] uppercase">
                        {uploadProgress ? `⚡ BUFFER_LOG: ${uploadProgress}` : "SYNC BUFFER READY"}
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-pink-950 hover:bg-pink-900 border border-pink-400 hover:border-pink-300 text-pink-300 rounded uppercase font-bold tracking-widest cursor-pointer text-xs shadow-md"
                      >
                        COMPILE & SAVE MUSIC KEY_
                      </button>
                    </div>
                  </form>

                  {/* Active Tracks table */}
                  <div className="space-y-2 text-[10px]">
                    <h3 className="font-bold text-slate-300 uppercase tracking-wider pl-1 font-mono text-[9px]">
                      ACTIVE DATABASE STREAM PLAYLIST (VERCEL KV PERSISTENT):
                    </h3>
                    
                    <div className="border border-pink-500/10 rounded-lg overflow-hidden bg-slate-950">
                      <div className="grid grid-cols-12 bg-slate-900/80 p-2 text-[8.5px] font-bold text-slate-400 border-b border-pink-500/10 uppercase tracking-widest font-mono">
                        <div className="col-span-1 text-center">ID</div>
                        <div className="col-span-1 pl-1 text-left">COVER</div>
                        <div className="col-span-4 pl-2">SONG TITLE</div>
                        <div className="col-span-4">STREAM REFERENCE / SOURCE</div>
                        <div className="col-span-2 text-right pr-2">DELETE</div>
                      </div>

                      <div className="divide-y divide-pink-950/20 max-h-[300px] overflow-y-auto">
                        {tracks.map((track, tIdx) => (
                          <div 
                            key={track.id}
                            className="grid grid-cols-12 p-3 text-[10px] items-center hover:bg-slate-900/30 transition-colors font-mono text-slate-350"
                          >
                            <div className="col-span-1 text-center text-pink-400/60 font-bold">{tIdx + 1}</div>
                            <div className="col-span-1 pl-1">
                              <div className="w-8 h-8 rounded bg-slate-900 border border-pink-500/10 overflow-hidden flex items-center justify-center text-[7px] text-pink-300 font-mono">
                                {track.image_url ? (
                                  <img src={track.image_url} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  "NO IMA_"
                                )}
                              </div>
                            </div>
                            <div className="col-span-4 pl-2 truncate font-bold text-slate-200">
                              🎵 {track.name}
                            </div>
                            <div className="col-span-4 text-[9px] text-slate-400 truncate">
                              {track.youtubeId ? `YT VIDEO: ${track.youtubeId}` : `MUSIC_URL: ${track.music_url || track.url || 'None'}`}
                            </div>
                            <div className="col-span-2 text-right pr-2">
                              {/* Keep default songs from being completely erased in this UI if desired, but user said admin has exclusive delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove track "${track.name}" from the persistent database stream?`)) {
                                    deleteTrack(track.id);
                                  }
                                }}
                                className="p-1 px-2 border border-slate-900 hover:border-red-500/40 text-slate-500 hover:text-red-400 bg-slate-950 rounded transition-all cursor-pointer text-[9px]"
                              >
                                DELETE
                              </button>
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
                  {/* Announcement creator */}
                  <form onSubmit={handlePublishAnnouncement} className="bg-slate-900/40 p-5 rounded-lg border border-[#dfb133]/25 relative overflow-hidden space-y-4 font-mono text-[10px]">
                    <div className="flex items-center gap-2 pb-2 border-b border-amber-900/20">
                      <Megaphone className="w-4.5 h-4.5 text-amber-400" />
                      <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                        PUBLISH NEW ANNOUNCEMENT (PORTAL UPDATE)
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-8 space-y-1.5">
                        <label className="text-slate-450 uppercase block font-bold">LOG TITLE:</label>
                        <input 
                          type="text"
                          required
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="e.g. PORTAL UPGRADED TO CORE PROTOCOL v4.5"
                          className="bg-slate-950 border border-amber-900/40 rounded px-2.5 py-2 w-full text-amber-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-700 font-bold uppercase"
                        />
                      </div>

                      <div className="md:col-span-4 space-y-1.5">
                        <label className="text-slate-450 uppercase block font-bold">TAG PROFILE / SEVERITY:</label>
                        <select
                          value={annCategory}
                          onChange={(e) => setAnnCategory(e.target.value as any)}
                          className="bg-slate-950 border border-amber-900/40 rounded px-2.5 py-2 w-full text-amber-200 focus:outline-none focus:border-amber-400 cursor-pointer font-bold"
                        >
                          <option value="UPDATE">UPDATE / FEATURE</option>
                          <option value="SECURITY">SECURITY / LOGS</option>
                          <option value="MAINTENANCE">MAINTENANCE</option>
                          <option value="GENERAL">GENERAL INFO</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-450 uppercase block font-bold">DETAILED LOG CONTENT (TEXT):</label>
                      <textarea
                        required
                        rows={3}
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        placeholder="Define latest patch developments, furry profile bindings, or system status upgrades here..."
                        className="bg-slate-950 border border-amber-900/40 rounded p-2.5 w-full text-slate-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-700 text-[11px] font-sans h-24 whitespace-pre-wrap leading-relaxed"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/80 hover:border-amber-400 text-amber-300 rounded uppercase font-bold tracking-widest cursor-pointer text-[10.5px] shadow-md"
                      >
                        PUBLISH UPDATE NODE_
                      </button>
                    </div>
                  </form>

                  {/* Existing Announcements panel */}
                  <div className="space-y-2 text-[10px]">
                    <h3 className="font-bold text-slate-300 uppercase tracking-wider pl-1">
                      EXISTING LOG CHANNELS (SHOWN IN HOME TAB):
                    </h3>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {announcements.map((ann) => (
                        <div 
                          key={ann.id}
                          className="bg-slate-950 border border-cyan-500/10 p-3 rounded flex items-start justify-between gap-4 font-mono hover:border-amber-500/25 transition-all text-[9.5px]"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[#dfb133] font-bold">[{ann.category}]</span>
                              <span className="text-slate-200 font-bold truncate uppercase">{ann.title}</span>
                              <span className="text-slate-600 text-[8px] font-medium font-sans">{ann.timestamp}</span>
                            </div>
                            <p className="text-slate-400 text-[8.5px] max-w-xl line-clamp-2 leading-relaxed mt-0.5 font-sans">
                              {ann.content}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Delete this bulletin update? This will vanish instantly from the home portal.")) {
                                deleteAnnouncement(ann.id);
                              }
                            }}
                            className="p-1 px-2 border border-slate-900 hover:border-red-500/30 text-slate-500 hover:text-red-400 bg-slate-950/80 rounded transition-all cursor-pointer font-bold"
                          >
                            DELETE
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Database Setting */}
              {activeTab === 'database' && (
                <div className="border border-purple-500/20 bg-slate-950/45 p-5 md:p-6 rounded-lg space-y-6 relative overflow-hidden">
                  <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>
                  
                  <div className="flex gap-3 items-center">
                    <Database className="w-6 h-6 text-purple-400 animate-pulse" />
                    <div>
                      <h2 className="text-sm font-bold text-purple-300 uppercase tracking-wider">Vercel Environment variables seeder</h2>
                      <p className="text-[10px] text-slate-400 leading-relaxed uppercase">
                        This model is fully automated to bind to the Vercel KV and serverless postgres storage modules dynamically. All state shifts load into persistent shadow matrices stably.
                      </p>
                    </div>
                  </div>

                  {/* Environment variables settings */}
                  <form onSubmit={handleSaveDbConfig} className="space-y-4 pt-3 border-t border-cyan-900/10">
                    <div className="space-y-1.5 text-[10px]">
                      <label className="text-slate-450 block uppercase tracking-wider font-bold">DATABASE CONNECT URL (Vercel-Managed ENV):</label>
                      <input 
                        type="text" 
                        value={tempVercelUrl}
                        onChange={(e) => setTempVercelUrl(e.target.value)}
                        placeholder="https://kv.vercel-storage.com/... OR postgresql://..."
                        className="bg-slate-950 border border-cyan-803/40 rounded px-3 py-2 text-xs font-sans text-cyan-300 focus:outline-none focus:border-purple-400 w-full"
                      />
                      <span className="text-[8px] text-slate-500 block uppercase">
                        Inputting postgres protocol routes shifts server handlers into Postgres Relational tunnels automatically.
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        type="submit"
                        className="bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-400/50 hover:border-purple-400 px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        CHANGE DATABASE BINDING_
                      </button>

                      <button
                        type="button"
                        onClick={handleForceSync}
                        className="bg-slate-900 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncAnimation ? 'animate-spin' : ''}`} />
                        TEST CONNECTION HANDSHAKE
                      </button>
                    </div>
                  </form>

                  {/* Diagnostic details */}
                  <div className="pt-5 border-t border-cyan-900/20 space-y-3 text-[10.5px]">
                    <h3 className="font-bold text-xs text-yellow-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-yellow-500 animate-pulse" />
                      SECURE VIRTUAL DIRECTORY DIAGNOSTICS:
                    </h3>
                    
                    <div className="bg-slate-950/85 p-4 rounded border border-cyan-500/10 space-y-2 text-slate-405 leading-relaxed text-[10px]">
                      <div className="grid grid-cols-2 gap-2 pb-2 border-b border-cyan-900/20 text-[9px] uppercase text-slate-400">
                        <div>DATABASE SCHEMAS STATUS: <span className="text-emerald-400 font-bold">100% HEALTHY</span></div>
                        <div>ACTIVE DB CLUSTERS: <span className="text-cyan-300 font-bold">Vercel-East // Tokyo Node</span></div>
                        <div>REDUNDANT SHADOW COPY: <span className="text-purple-300 font-bold font-mono">STANDBY / LOCAL_GRID</span></div>
                        <div>ENCRYPTION LAYER: <span className="text-slate-300 font-bold">SHA-512 TUNNELING</span></div>
                      </div>
                      
                      <div className="text-[9.5px]">
                        <span className="text-yellow-400 font-bold">SYSTEM_LOG &gt;</span> Connection established with host: <span className="text-slate-200 font-mono">{dbMetrics.host}</span><br />
                        <span className="text-yellow-400 font-bold">SYSTEM_LOG &gt;</span> Loaded {friends.length} friend profiles, {contributors.length} system operator indices, and {tracks.length} music tracks.<br />
                        <span className="text-yellow-400 font-bold">SYSTEM_LOG &gt;</span> Status holds persistent local mappings. Full cloud synchronization completed.
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Reset current database state and restore defaults? All custom audio paths, uploaded avatars, and notifications will be deleted.")) {
                            resetDatabase();
                            setTempVercelUrl('https://kv.vercel-storage.com/redis-node-nesinezz');
                          }
                        }}
                        className="px-3 py-1 bg-red-950/30 border border-red-500/25 hover:border-red-500 text-red-450 hover:bg-red-950/60 rounded uppercase tracking-wider transition-colors text-[10px] font-bold cursor-pointer"
                      >
                        RESET DATABASE MATRIX (CLEAR ALL CUSTOM ENTRIES)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Admin Footer */}
            <div className="bg-slate-900 border-t border-cyan-900/10 p-3 text-center text-[9px] text-slate-500 shrink-0">
              SECURE DECRYPT CONTROL DESK // SESSION ACCESSIBLE AS ACTIVE OVERLORD NODE SYSTEM
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
