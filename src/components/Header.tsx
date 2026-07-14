import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Clock, Music, Terminal, Shield, SkipBack, SkipForward, ChevronDown, Upload, Search, Link, Plus, Youtube, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollActive } from '../ScrollContext';
import { useLanguage } from '../LanguageContext';
import { useDatabase } from '../DatabaseContext';
import { useProfile } from '../ProfileContext';

const DEFAULT_PLAYLIST = [
  { id: 1, name: "Montagem Alquimia", url: "/Montagem Alquimia.mp3", youtubeId: "CQZ-XIgyEUg", desc: "Brazilian Phonk (YT Audio)", youtubeUrl: "https://youtu.be/CQZ-XIgyEUg?si=cQnL2XOpnIWYuw2Y", localFile: true },
  { id: 2, name: "Lost Kitten - Metric", url: "/Lost kitten - METRIC.mp3", youtubeId: "3Xw-9OE1j-Y", desc: "Alternative Indie Pop (YT Audio)", youtubeUrl: "https://youtu.be/3Xw-9OE1j-Y?si=xTA8U2ls613mt_jF", localFile: true },
  { id: 3, name: "MONTAGEM TENTA", url: "/MONTAGEM TENTA.mp3", youtubeId: "TTP3ZHMJQNQ", desc: "Spooky Funk (YT Audio)", youtubeUrl: "https://youtu.be/TTP3ZHMJQNQ?si=rncTAGIYmNRvD8qY", localFile: true },
  { id: 4, name: "Neon Horizon", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", desc: "Retro Synthwave Mix" },
  { id: 5, name: "Vapor Highway", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", desc: "80s Digital Vibe" },
  { id: 6, name: "Matrix Dreamer", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", desc: "Late Night Code Chiptune" },
  { id: 7, name: "Cyber Sunset", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", desc: "Chill Vaporwave Drive" },
  { id: 8, name: "Furry Haven Chill", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", desc: "Lofi Beats & Coffee" },
  { id: 9, name: "Retro Code Midnight", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", desc: "Deep Ambient Synth" }
];

// Rich searchable cyber tracks library for instant playlist injection!
const ALL_LIBRARY_SONGS = [
  { name: "Montagem Alquimia", youtubeId: "CQZ-XIgyEUg", desc: "Brazilian Phonk (YT Audio)", tags: "phonk brazilian alquimia nesi fur" },
  { name: "Lost Kitten - Metric", youtubeId: "3Xw-9OE1j-Y", desc: "Alternative Indie Pop", tags: "indie pop kitten metric lost cat meow" },
  { name: "MONTAGEM TENTA", youtubeId: "TTP3ZHMJQNQ", desc: "Spooky Cyber Phonk", tags: "phonk spooky tenta montagem dance bass" },
  { name: "Metamorphosis - INTERWORLD", youtubeId: "S2D_zZIn9oM", desc: "Ultimate Phonk Anthem", tags: "phonk metamorphosis interworld anthem drift hard" },
  { name: "Gigachad Theme Phonk", youtubeId: "JF6gTPrH-0g", desc: "Phonk Metal Gym mix", tags: "gigachad phonk theme gym metal meme chad" },
  { name: "Spit In My Face - ThxSoMch", youtubeId: "A7Vf7_36s-k", desc: "Indie Rock Phonk Mix", tags: "spit in my face thxsomch rock indie alternative goth" },
  { name: "Lofi Cyberpunk 24/7 Gaming Drive", youtubeId: "mDpaS8vYjWc", desc: "Sleek Neon Synth Study Mix", tags: "lofi cyberpunk gaming drive chill stream study study sleep code relax" },
  { name: "Synthwave Cyberpunk Retro Drive", youtubeId: "vT3z6-a_u30", desc: "Chill Outrun Retro Mix", tags: "synthwave cyberpunk retro drive chill outrun nostalgic neon" },
  { name: "Cyberpunk Samurai Chill Lofi", youtubeId: "4xDx9G5uJms", desc: "Low-fidelity Retro Beats", tags: "cyberpunk samurai chill lofi beats sleep code study night" },
  { name: "Lofi Hip Hop Radio Beats", youtubeId: "5qap5aO4i9A", desc: "Chilled Cows to Study/Relax", tags: "lofi hip hop radio study beats relax sleep study cow" },
  { name: "Fly Me To The Moon Lofi", youtubeId: "tNef_8_Y9p0", desc: "Chill Jazz Moon Cover", tags: "fly me to the moon lofi cover chill jazz space moon" },
  { name: "Brazilian Phonk Extreme Workout", youtubeId: "GZ3e8R7Lh80", desc: "Bass Boosted Phonk Mix", tags: "phonk brazilian workout gym bass boosted gym" },
  { name: "Understone Cyber Chill", youtubeId: "9K9878x2VlM", desc: "Cyber Ambient Synth Drive", tags: "sunset cyber ambient chill synth space coder understone" },
  { name: "Rave DX Phonk", youtubeId: "fT8v4XonC7E", desc: "Ultraviolet Cyber Phonk", tags: "phonk rave dx ultraviolet dance club" },
  { name: "Never Gonna Give You Up (Rickroll)", youtubeId: "dQw4w9WgXcQ", desc: "Classic Internet Troll Hit", tags: "rickroll Rick Astley never gonna give you up troll meme retro" }
];

function extractYoutubeId(urlStr: string): string | null {
  const trimmed = urlStr.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
}

export default function Header() {
  const isScrolled = useScrollActive();
  const { language, setLanguage, t } = useLanguage();
  const { tracks: dbTracks } = useDatabase();
  const { profilePic } = useProfile();
  const [timeStr, setTimeStr] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState<any[]>(dbTracks);

  useEffect(() => {
    if (dbTracks && dbTracks.length > 0) {
      // Retain already added search/temp tracks in the list during the session
      setTracks(prev => {
        const merged = [...dbTracks];
        prev.forEach(p => {
          if (!merged.some(m => m.id === p.id || (m.youtubeId && m.youtubeId === p.youtubeId))) {
            merged.push(p);
          }
        });
        return merged;
      });
    }
  }, [dbTracks]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioSource, setAudioSource] = useState('Neon Horizon (Retro Synthwave Mix)');
  const [synthMode, setSynthMode] = useState(false); // procedural fallback
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePlayerTab, setActivePlayerTab] = useState<'playlist' | 'youtube'>('playlist');
  const [ytInput, setYtInput] = useState('');
  const [ytSearchStatus, setYtSearchStatus] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ytPlayerRef = useRef<HTMLIFrameElement | null>(null);

  const fallbackTrack = { id: 0, name: "SYSTEM HENING_", desc: "Open Admin Panel to import music files", url: "" };
  const currentTrack = (tracks && tracks.length > 0) ? (tracks[currentTrackIndex] || tracks[0]) : fallbackTrack;
  const isYouTubeTrack = !!currentTrack?.youtubeId && !currentTrack?.resolvedUrl;

  const handleYoutubeSubmit = (presetId?: string) => {
    const targetInput = presetId || ytInput.trim();
    if (!targetInput) return;

    const extractedId = extractYoutubeId(targetInput);

    if (extractedId) {
      // It's a YouTube URL or direct Video ID!
      const matchedPreset = ALL_LIBRARY_SONGS.find(s => s.youtubeId === extractedId);
      const trackName = matchedPreset ? matchedPreset.name : `YT Stream: ${extractedId}`;
      const trackDesc = matchedPreset ? matchedPreset.desc : "Custom YouTube Link";

      const newTrack = {
        id: Date.now(),
        name: trackName,
        url: '',
        resolvedUrl: '',
        youtubeId: extractedId,
        desc: trackDesc,
        youtubeUrl: `https://youtu.be/${extractedId}`
      };

      setTracks(prev => {
        const exists = prev.findIndex(t => t.youtubeId === extractedId);
        if (exists !== -1) {
          setCurrentTrackIndex(exists);
          return prev;
        }
        const updated = [...prev, newTrack];
        setCurrentTrackIndex(updated.length - 1);
        return updated;
      });

      setSynthMode(false);
      setIsPlaying(true);
      setYtInput('');
      setYtSearchStatus('SUKSES: Streaming dimulai!');
      setTimeout(() => setYtSearchStatus(''), 4000);
    } else {
      // Search term
      const query = targetInput.toLowerCase();
      const matches = ALL_LIBRARY_SONGS.filter(song => 
        song.name.toLowerCase().includes(query) || 
        song.desc.toLowerCase().includes(query) || 
        song.tags.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        const selected = matches[0];
        const newTrack = {
          id: Date.now(),
          name: selected.name,
          url: '',
          resolvedUrl: '',
          youtubeId: selected.youtubeId,
          desc: selected.desc,
          youtubeUrl: `https://youtu.be/${selected.youtubeId}`
        };

        setTracks(prev => {
          const exists = prev.findIndex(t => t.youtubeId === selected.youtubeId);
          if (exists !== -1) {
            setCurrentTrackIndex(exists);
            return prev;
          }
          const updated = [...prev, newTrack];
          setCurrentTrackIndex(updated.length - 1);
          return updated;
        });

        setSynthMode(false);
        setIsPlaying(true);
        setYtInput('');
        setYtSearchStatus(`DITEMUKAN: Memutar "${selected.name}"`);
        setTimeout(() => setYtSearchStatus(''), 4000);
      } else {
        setYtSearchStatus('INFO: Ketik kata kunci ngetren (misal: "phonk", "lofi")!');
        setTimeout(() => setYtSearchStatus(''), 6000);
      }
    }
  };

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeStr(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // Web Audio Synth procedural looping for bulletproof audio play
  const startProceduralSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play soft cyber chords (ambient pentatonic progression)
      // C3 (130.81), Eb3 (155.56), G3 (196.00), Bb3 (233.08), C4 (261.63)
      const baseNotes = [130.81, 155.56, 196.00, 233.08, 261.63, 311.13, 392.00];

      const playSynthNote = () => {
        if (!isPlaying || isMuted || synthMode === false) return;
        
        ctx.resume();
        const now = ctx.currentTime;
        
        // Root osc
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const mainGain = ctx.createGain();

        // random note from pentatonic scale
        const noteFreq = baseNotes[Math.floor(Math.random() * baseNotes.length)];
        osc.frequency.setValueAtTime(noteFreq, now);
        
        // triangle sounds lofi and pleasant
        osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
        
        // filter envelope for retro cyber charm
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.8);

        // gain envelope
        mainGain.gain.setValueAtTime(0, now);
        mainGain.gain.linearRampToValueAtTime(volume * 0.15, now + 0.3); // quiet background noise
        mainGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.6);

        // Echo delay effect
        if (Math.random() > 0.4) {
          setTimeout(() => {
            if (!isPlaying || isMuted) return;
            const echoGain = ctx.createGain();
            const echoOsc = ctx.createOscillator();
            echoOsc.frequency.setValueAtTime(noteFreq * 2, ctx.currentTime);
            echoOsc.type = 'sine';
            
            echoGain.gain.setValueAtTime(0, ctx.currentTime);
            echoGain.gain.linearRampToValueAtTime(volume * 0.05, ctx.currentTime + 0.1);
            echoGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

            echoOsc.connect(echoGain);
            echoGain.connect(ctx.destination);
            echoOsc.start();
            echoOsc.stop(ctx.currentTime + 1.5);
          }, 450);
        }
      };

      // loop notes every 1.5s
      playSynthNote();
      synthIntervalRef.current = setInterval(playSynthNote, 1600);
    } catch (e) {
      console.warn('Synth context failed:', e);
    }
  };

  const stopProceduralSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Handle Playback State & Tracks
  useEffect(() => {
    if (isPlaying) {
      if (synthMode) {
        startProceduralSynth();
      } else if (audioRef.current && !isYouTubeTrack) {
        audioRef.current.play().catch((err) => {
          console.log('Main stream loading hindered, activating procedurally generated synth instead...');
          setSynthMode(true);
          setAudioSource('Retro Cyber synth procedural engine (Live)');
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopProceduralSynth();
    }

    return () => stopProceduralSynth();
  }, [isPlaying, synthMode, isYouTubeTrack]);

  // Track selection dynamic change
  useEffect(() => {
    if (audioRef.current) {
      if (isYouTubeTrack) {
        audioRef.current.pause();
      } else {
        audioRef.current.load();
        if (isPlaying && !synthMode) {
          audioRef.current.play().catch(() => {
            setSynthMode(true);
            setAudioSource('Retro Cyber synth procedural engine (Live)');
          });
        }
      }
    }
    const track = (tracks && tracks.length > 0) ? (tracks[currentTrackIndex] || tracks[0]) : fallbackTrack;
    setAudioSource(track ? `${track.name} (${track.desc})` : 'System Ready');
  }, [currentTrackIndex, isYouTubeTrack, tracks]);

  // Handle setting procedural synth mode directly
  useEffect(() => {
    if (synthMode && isPlaying) {
      stopProceduralSynth();
      startProceduralSynth();
    }
  }, [synthMode, volume, isMuted, isPlaying]);

  // Adjust volume of HTML element and YouTube video
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    
    // Update YouTube volume if iframe is loaded
    if (isYouTubeTrack && isPlaying && ytPlayerRef.current) {
      try {
        const iframe = ytPlayerRef.current;
        const targetVol = isMuted ? 0 : Math.round(volume * 100);
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [targetVol] }),
          '*'
        );
      } catch (e) {
        console.warn('Failed to update YT volume via postMessage:', e);
      }
    }
  }, [volume, isMuted, isYouTubeTrack, isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleNextTrack = () => {
    setSynthMode(false);
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setSynthMode(false);
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const selectTrack = (index: number) => {
    setSynthMode(false);
    setCurrentTrackIndex(index);
    setShowDropdown(false);
  };

  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Create local object URL
    const fileUrl = URL.createObjectURL(file);
    const fileName = file.name;
    const lowerName = fileName.toLowerCase();
    
    let matchedIndex = -1;
    if (lowerName.includes('alquimia')) {
      matchedIndex = 0;
    } else if (lowerName.includes('lost kitten') || lowerName.includes('metric')) {
      matchedIndex = 1;
    } else if (lowerName.includes('tenta')) {
      matchedIndex = 2;
    }
    
    if (matchedIndex !== -1) {
      setTracks(prev => {
        const updated = [...prev];
        updated[matchedIndex] = {
          ...updated[matchedIndex],
          name: `${updated[matchedIndex].name} (Loaded)`,
          resolvedUrl: fileUrl,
          localFile: false,
          desc: "Local Audio File"
        };
        return updated;
      });
      setSynthMode(false);
      setCurrentTrackIndex(matchedIndex);
      setIsPlaying(true);
    } else {
      const newTrack = {
        id: Date.now(),
        name: fileName.replace(/\.[^/.]+$/, ""),
        url: fileUrl,
        resolvedUrl: fileUrl,
        youtubeId: '',
        desc: "Custom Uploaded MP3",
        youtubeUrl: ''
      };
      
      setTracks(prev => {
        const updated = [...prev, newTrack];
        setCurrentTrackIndex(updated.length - 1);
        return updated;
      });
      setSynthMode(false);
      setIsPlaying(true);
    }
    
    setShowDropdown(false);
  };

  const forceProcedural = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setSynthMode(true);
      setAudioSource('Retro Cyber synth procedural engine (Live)');
      setIsPlaying(true);
    }, 100);
  };

  return (
    <div className={`w-full border neon-border-cyan rounded-lg p-4 flex flex-col lg:flex-row items-center justify-between gap-4 relative overflow-hidden transition-all duration-500 ${
      isScrolled ? 'bg-slate-950/70 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border-cyan-400' : 'bg-slate-900/60'
    }`}>
      {/* Golden corners */}
      <div className="corner-gold-tl"></div>
      <div className="corner-gold-tr"></div>
      <div className="corner-gold-bl"></div>
      <div className="corner-gold-br"></div>

      {/* Dot matrix grid texture */}
      <div className="absolute inset-0 cyber-dots opacity-[0.25] pointer-events-none"></div>

      {/* Embedded HTML audio tag with ultra cool copyright-free synthwave stream */}
      <audio
        ref={audioRef}
        src={isYouTubeTrack ? undefined : (currentTrack?.resolvedUrl || currentTrack?.music_url || currentTrack?.url || undefined)}
        loop
        onPlay={() => {
          setSynthMode(false);
          const track = (tracks && tracks.length > 0) ? (tracks[currentTrackIndex] || tracks[0]) : fallbackTrack;
          setAudioSource(track ? `${track.name} (${track.desc})` : 'System Ready');
        }}
        onError={() => {
          // If soundhelix is offline or blocked, use procedural fallback smoothly
          if (!synthMode && isPlaying && !isYouTubeTrack) {
            setSynthMode(true);
            setAudioSource('Retro Cyber synth procedural engine (Live)');
          }
        }}
      />

      {/* Brand Label */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        <div className="p-2 py-2.5 bg-cyan-950/40 border border-cyan-400/35 text-cyan-400 rounded-md">
          <Terminal className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-bold font-display tracking-widest text-slate-100 uppercase flex items-center gap-2">
            NesiNezz's Portal
            <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-400/30 px-1 py-0.5 rounded font-mono font-medium animate-pulse">
              {t('sysStable')}
            </span>
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase flex items-center gap-1 mt-0.5">
            <Shield className="w-3 h-3 text-cyan-500" /> {t('connectingWorlds')}
          </p>
        </div>
      </div>

      {/* Cyber Music Player control center */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-slate-950 border border-cyan-500/20 rounded-md w-full lg:w-auto max-w-lg relative">
        
        {/* Holographic Miniature CRT Monitor for YouTube Video / Sound Waves */}
        <div className="relative w-14 h-10 bg-slate-900 border border-cyan-500/30 rounded overflow-hidden flex items-center justify-center shrink-0 shadow-[inset_0_0_6px_rgba(6,182,212,0.4)]">
          <div className="absolute inset-0 scanlines opacity-15 pointer-events-none z-10" />
          {isYouTubeTrack && isPlaying ? (
            /* Miniature YouTube container to legally play audio and prevent browser autoplay lockout */
            <iframe
              ref={ytPlayerRef}
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?enablejsapi=1&autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentTrack.youtubeId}&controls=0&showinfo=0&rel=0`}
              allow="autoplay"
              className="w-full h-full scale-[1.3] transform pointer-events-none select-none"
              title="YT Stream Video"
            />
          ) : currentTrack?.image_url ? (
            /* Dynamic Artwork Image uploaded by admin */
            <img 
              src={currentTrack.image_url} 
              alt="Cover Art" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
            />
          ) : (
            /* Retro green grid synth indicator if not a YouTube stream */
            <div className="flex flex-col items-center justify-center text-center w-full h-full font-mono select-none">
              {isPlaying ? (
                synthMode ? (
                  /* Amber procedural waves */
                  <div className="flex items-end justify-center gap-0.5 h-3 w-full px-1">
                    <span className="w-0.5 bg-[#dfb133] animate-[pulse_0.4s_infinite_alternate] h-1.5 shadow-[0_0_3px_#dfb133]"></span>
                    <span className="w-0.5 bg-[#dfb133] animate-[pulse_0.2s_infinite_alternate] h-3 shadow-[0_0_3px_#dfb133]"></span>
                    <span className="w-0.5 bg-[#dfb133] animate-[pulse_0.5s_infinite_alternate] h-2 shadow-[0_0_3px_#dfb133]"></span>
                  </div>
                ) : (
                  /* Cyan local audio waves */
                  <div className="flex items-end justify-center gap-0.5 h-3 w-full px-1">
                    <span className="w-0.5 bg-cyan-400 animate-[pulse_0.3s_infinite_alternate] h-2.5 shadow-[0_0_3px_#06b6d4]"></span>
                    <span className="w-0.5 bg-cyan-400 animate-[pulse_0.5s_infinite_alternate] h-1 shadow-[0_0_3px_#06b6d4]"></span>
                    <span className="w-0.5 bg-cyan-400 animate-[pulse_0.4s_infinite_alternate] h-3 shadow-[0_0_3px_#06b6d4]"></span>
                  </div>
                )
              ) : (
                <div className="text-[5.5px] text-slate-500 uppercase tracking-widest leading-none font-bold">STDBY</div>
              )}
              <span className="text-[4.5px] text-slate-400 font-mono scale-90 whitespace-nowrap mt-1 uppercase tracking-tighter">
                {synthMode ? 'CYBER-SYNTH' : isYouTubeTrack ? 'STREAM' : isPlaying ? 'PLAY:MP3' : 'READY'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Skip Back */}
          <button
            onClick={handlePrevTrack}
            className="p-1.5 rounded hover:bg-cyan-500/10 text-cyan-400 active:scale-95 transition-all cursor-pointer"
            title={t('laguSebelum')}
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            id="play_pause_button"
            className="p-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 border border-cyan-500/30 text-cyan-400 transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play Music'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#dfb133] animate-pulse" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Skip Forward */}
          <button
            onClick={handleNextTrack}
            className="p-1.5 rounded hover:bg-cyan-500/10 text-cyan-400 active:scale-95 transition-all cursor-pointer"
            title={t('laguSesudah')}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 transition-all cursor-pointer ml-1"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Volume Slider styled exactly to the terminal theme */}
        <div className="flex items-center gap-2 flex-1 min-w-[100px] lg:min-w-[110px]">
          <span className="text-[9px] text-cyan-600 font-mono">VOL</span>
          <div className="relative flex items-center w-full">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            {/* custom theme backing */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-400 rounded-lg pointer-events-none shadow-[0_0_8px_rgba(6,182,212,0.8)]"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono w-6 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Selected track selection & display button */}
        <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1 w-full mt-1 border-t border-cyan-900/30 pt-1 relative">
          <Music className={`w-3 h-3 text-[#dfb133] ${isPlaying ? 'animate-spin' : ''}`} />
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 text-left text-cyan-300 hover:text-white transition-colors truncate max-w-[160px] pb-0.5"
            title={t('clickLagu')}
          >
            <span className="truncate">{audioSource}</span>
            <ChevronDown className="w-3 h-3 text-cyan-500 shrink-0" />
          </button>

          {showDropdown && (
            <div className="absolute left-0 bottom-full mb-1.5 z-50 bg-slate-950 border border-cyan-500/40 rounded-md p-2 w-[305px] shadow-[0_0_20px_rgba(6,182,212,0.45)]">
              {/* Dual-tab selector */}
              <div className="flex gap-1 border-b border-cyan-900/40 pb-1.5 mb-1.5">
                <button
                  type="button"
                  onClick={() => setActivePlayerTab('playlist')}
                  className={`flex-1 text-center py-1 text-[8.5px] font-mono rounded transition-colors uppercase border ${
                    activePlayerTab === 'playlist'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-bold shadow-[0_0_6px_rgba(6,182,212,0.2)]'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  📁 Playlist ({tracks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlayerTab('youtube')}
                  className={`flex-1 text-center py-1 text-[8.5px] font-mono rounded transition-colors uppercase border flex items-center justify-center gap-1 ${
                    activePlayerTab === 'youtube'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-bold shadow-[0_0_6px_rgba(6,182,212,0.2)]'
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Youtube className="w-2.5 h-2.5 text-red-500" /> YT Search & URL
                </button>
              </div>

              {activePlayerTab === 'playlist' ? (
                <>
                  <div className="text-[8px] uppercase tracking-widest text-cyan-500 font-bold border-b border-cyan-500/10 pb-1 mb-1 font-mono">
                    {t('pilihLagu')}
                  </div>
                  <div className="max-h-[140px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5 mb-1.5">
                    {tracks.map((track, idx) => (
                      <button
                        key={track.id}
                        onClick={() => selectTrack(idx)}
                        className={`w-full text-left text-[9px] p-1.5 rounded font-mono transition-colors flex items-center justify-between gap-2 overflow-hidden ${
                          idx === currentTrackIndex 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' 
                            : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5 min-w-0 flex-1">
                           <span className="text-slate-500 shrink-0">{idx + 1}.</span>
                          <span className="truncate text-slate-200" title={track.name}>{track.name}</span>
                          {track.youtubeId && (
                            <span className="text-[6px] px-1 bg-red-950/40 text-red-400 border border-red-500/25 rounded tracking-tighter uppercase font-bold shrink-0">
                              YT
                            </span>
                          )}
                        </span>
                        <span className="text-[7px] text-slate-400 font-sans tracking-tight shrink-0 text-right opacity-80" title={track.desc}>
                          {track.localFile && !track.resolvedUrl ? "⚠️ Missing MP3" : track.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Local file upload */}
                  <div className="border-t border-cyan-500/20 pt-1.5 mt-1">
                    <label className="flex items-center justify-center gap-1.5 px-2 py-1.5 border border-dashed border-cyan-500/40 hover:border-cyan-500/80 bg-cyan-950/30 hover:bg-cyan-950/60 rounded text-[8px] font-mono text-cyan-400 hover:text-white cursor-pointer transition-colors uppercase select-none w-full">
                      <Upload className="w-3 h-3 text-cyan-400 animate-pulse" />
                      <span>{t('putarMP3')}</span>
                      <input
                        type="file"
                        accept="audio/mp3,audio/*"
                        onChange={handleLocalUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[8px] uppercase tracking-widest text-cyan-500 font-bold pb-1.5 font-mono flex items-center justify-between">
                    <span>{t('tempelLink')}</span>
                    <Sparkles className="w-2.5 h-2.5 text-yellow-400 animate-pulse" />
                  </div>

                  {/* Link Input Bar */}
                  <div className="flex gap-1 mb-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={ytInput}
                        onChange={(e) => setYtInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleYoutubeSubmit();
                          }
                        }}
                        placeholder="Nama lagu, ID, atau Link YouTube..."
                        className="w-full bg-slate-900 border border-cyan-500/30 rounded px-1.5 py-1 text-[9px] font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 pr-5"
                      />
                      {extractYoutubeId(ytInput) ? (
                        <Link className="absolute right-1.5 top-1.5 w-2.5 h-2.5 text-red-500 animate-pulse" />
                      ) : (
                        <Search className="absolute right-1.5 top-1.5 w-2.5 h-2.5 text-slate-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleYoutubeSubmit()}
                      className="px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 hover:border-cyan-400 text-cyan-300 rounded text-[8px] font-mono font-bold uppercase transition-colors shrink-0"
                    >
                      PUTAR
                    </button>
                  </div>

                  {/* Status alert inside panel */}
                  {ytSearchStatus && (
                    <div className="p-1 px-1.5 mb-1.5 bg-cyan-950/40 border border-cyan-500/30 text-[7px] font-mono text-cyan-300 rounded uppercase tracking-wider animate-pulse leading-normal">
                      {ytSearchStatus}
                    </div>
                  )}

                  {/* Interactive Dynamic Results / Recommendations Grid */}
                  <div className="text-[7.5px] uppercase tracking-wider text-slate-400 font-mono mb-1 font-bold">
                    {ytInput.trim() ? `🔍 ${t('searchResult')}` : `💡 ${t('cyberStreamRecom')}`}
                  </div>

                  <div className="max-h-[110px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5 font-mono">
                    {(ytInput.trim() 
                      ? ALL_LIBRARY_SONGS.filter(s => 
                          s.name.toLowerCase().includes(ytInput.toLowerCase()) || 
                          s.desc.toLowerCase().includes(ytInput.toLowerCase()) || 
                          s.tags.toLowerCase().includes(ytInput.toLowerCase())
                        )
                      : ALL_LIBRARY_SONGS
                    ).map((song, sIdx) => {
                      const isCurrentlyPlaying = currentTrack.youtubeId === song.youtubeId;
                      return (
                        <button
                          key={song.youtubeId || sIdx}
                          type="button"
                          onClick={() => handleYoutubeSubmit(song.youtubeId)}
                          className={`w-full text-left text-[8.5px] p-1.5 rounded font-mono transition-colors flex items-center justify-between gap-1 border ${
                            isCurrentlyPlaying
                              ? 'bg-red-500/10 border-red-500/30 text-red-400 font-bold'
                              : 'border-transparent text-slate-400 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <span className="truncate flex items-center gap-1 min-w-0 flex-1">
                            <span className="text-red-500 shrink-0">▶</span>
                            <span className="truncate text-slate-200" title={song.name}>{song.name}</span>
                          </span>
                          <span className="text-[6.5px] text-slate-500 tracking-tight shrink-0 text-right uppercase">
                            {isCurrentlyPlaying ? (
                              <span className="text-red-400 font-bold flex items-center gap-0.5">
                                <span className="animate-ping text-[6px]">●</span> ACTIVE
                              </span>
                            ) : (
                              song.desc.replace("(YT Audio)", "").replace("(Alternative Indie Pop)", "Indie Pop")
                            )}
                          </span>
                        </button>
                      );
                    })}

                    {ytInput.trim() && ALL_LIBRARY_SONGS.filter(s => 
                      s.name.toLowerCase().includes(ytInput.toLowerCase()) || 
                      s.desc.toLowerCase().includes(ytInput.toLowerCase()) || 
                      s.tags.toLowerCase().includes(ytInput.toLowerCase())
                    ).length === 0 && (
                      <div className="text-[7.5px] text-slate-500 font-mono text-center py-2 italic">
                        {t('noPresetMatches')}<br />
                        {t('clickToForce')}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <button 
            onClick={forceProcedural}
            title={t('proceduralForceTitle')}
            className="ml-auto text-[8px] bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 border border-yellow-400/30 px-1 rounded font-mono"
          >
            {t('proceduralForceButton')}
          </button>
        </div>
      </div>

      {/* Clock and Language Toggler Container */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-cyan-500/20 py-2 px-3 rounded-md w-full sm:w-auto justify-between sm:justify-start shrink-0">
          <span className="text-[8px] text-slate-500 font-mono tracking-wider uppercase">LANG</span>
          <div className="flex border border-cyan-500/30 rounded overflow-hidden p-0.5">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2 py-0.5 text-[9.5px] font-mono rounded-sm transition-all font-bold cursor-pointer ${
                language === 'id'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-[9.5px] font-mono rounded-sm transition-all font-bold cursor-pointer ${
                language === 'en'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-300 border border-transparent'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Clock widget for desktop/mobile */}
        <div className="flex items-center gap-2.5 bg-slate-950 border border-cyan-500/20 py-2.5 px-4 rounded-md w-full sm:w-auto flex-1 sm:flex-none justify-center">
          <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="font-mono text-right flex flex-col justify-center">
            <span className="text-cyan-400 font-bold tracking-widest text-xs">{timeStr || '00:00:00'}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest">{t('realTimeID')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
