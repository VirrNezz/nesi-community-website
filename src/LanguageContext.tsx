import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'id' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const DICTIONARY: Record<Language, Record<string, string>> = {
  id: {
    // Nav & System
    selectNode: 'PILIH NODE KONEKSI:',
    homeDeck: 'Dasbor Utama',
    friendlist: 'Daftar Teman',
    connections: 'Koneksi',
    myProfile: 'Profil Saya',
    lockTerminal: 'Kunci Terminal',
    lockDesc: 'Paksa penguncian keamanan dan putar ulang animasi intro',
    sysStable: 'SYS: STABLE',
    connectingWorlds: 'Menghubungkan dunia & OC',
    realTimeID: 'REAL-LIFE TIME [ID]',
    proceduralSynth: 'Synthesizer prosedural cyber retro lofi (Live)',
    standby: 'SNDBY',

    // Player Context
    pilihLagu: 'Pilih Lagu Dari Playlist',
    putarMP3: '📁 Putar MP3 Lokal',
    tempelLink: 'Tempel Link / Cari Lagu',
    gagalLoad: 'Tidak ada preset cocok. Klik PUTAR untuk memaksakan Link/ID!',
    laguSebelum: 'Lagu Sebelumnya',
    laguSesudah: 'Lagu Selanjutnya',
    clickLagu: 'Klik untuk memilih lagu atau cari dari YouTube',
    searchResult: 'Hasil Pencarian (Klik untuk Putar)',
    cyberStreamRecom: 'Rekomendasi Aliran Cyber',
    noPresetMatches: 'Tidak ada preset cocok.',
    clickToForce: 'Klik PUTAR untuk memaksakan Link/ID di atas!',
    proceduralForceButton: 'SYNTH',
    proceduralForceTitle: 'Klik untuk paksa audio synthesizer lokal jika internet tidak lancar',

    // Home Tab
    aboutWebTitle: 'TENTANG WEBSITE CONNECTION',
    softwareStackTitle: 'SOFTWARE STACK',
    contributorsTitle: 'KONTRIBUTOR WEBSITE',
    portalSoftwareTitle: 'PORTAL SOFTWARE DEPLOYMENT',
    portalFAQTitle: 'PORTAL SYSTEM F.A.Q',
    classification: 'KLASIFIKASI',
    securityTier: 'TINGKAT KEAMANAN',
    responsive: 'RESPONSIF',
    reactive: 'REAKTIF',
    themeColor: 'WARNA TEMA',

    // Connection Tab
    connectingSocialTitle: 'MENGHUBUNGKAN MEDIA SOSIAL.....',
    tunnelLoadingTitle: 'MEMBANGUN LINK TERKUNCI TERENKRIPSI [SECURE]',
    statusActiveBanner: 'STATUS AKTIF: PENALURAN SOSIAL MULTI-SALURAN AMAN TERVERIFIKASI DENGAN PROXY VIRTUAL. TIDAK DIPERLUKAN POPUP EKSTERNAL.',
    establishHandshakeLink: 'BANGUN LINK JABAT TANGAN',
    latencyControlled: 'sistem kendali-latensi v4.0.0 // pintas filter dengan proxy',

    // Profile Tab
    aboutOwnerText: 'Saya adalah programmer fullstack otodidak dan penjelajah keamanan gray hat. Sangat tertarik dengan synthwave, fursuiting, terminal konsol kontras tinggi, dan estetika furry.',
    emailLabel: 'KORESPONDENSI SUREL:',
    telephonyLabel: 'GERBANG TELEPON AMAN:',
    operationalSectorLabel: 'SEKTOR OPERASIONAL:',
    registrationLabel: 'STAPEL REGISTRASI:',
    userClassificationTitle: 'PERAN MATRIKS KLASIFIKASI PENGGUNA',
    roleNodeName: 'Nama Node Peran',
    securityClearanceCode: 'Kode Clearance Keamanan',
    primaryMandateDesc: 'Deskripsi Mandat Utama',
    securityStatsCheck: 'PEMERIKSAAN STATISTIK KEAMANAN:',
    securityStatsText: 'SEKTOR YANG DIPETAKAN DIREKONSTRUKSI SECARA STATIS PADA RUNTIME. TIDAK ADA KELENTURAN / KEBOCORAN TERDETEKSI. SEMUA JABAT TANGAN DISELESAIKAN KE IP PORT BLOK KONEKSI AMAN.',

    // Friendlist Tab
    filterFriendsMatrix: 'FILTER MATRIKS TEMAN:',
    bukaCiriCiri: 'Buka Info Ciri-Ciri',
    closePanel: 'Tutup panel',
    ciriKhasTitle: 'CIRI-CIRI / KARAKTERISTIK:',
    secureMediaLinks: 'LINK MEDIA AMAN:',
    friendBadgeSahabat: 'SAHABAT (BEST FRIEND)',
    friendBadgePacar: 'RELATIONSHIP (PACAR - SPESIAL)',
    friendBadgeNormal: 'KONEKSI TERPETAKAN',

    // Intro Screen localizations
    sysAccessProgress: 'AKSES SYSTEM SEDANG BERLANGSUNG',
    loadingMemStations: 'PENGISIAN PACKET MEMORY...',
    coreEnginesReady: 'ENGINE CACHE SIAP 100%',
    lockingTerminalIntegrity: 'MENGAMANKAN INTEGRITAS TERMINAL...',
    authorizeConnection: 'OTORISASI KONEKSI',
    accessGranted: 'AKSES DIIZINKAN'
  },
  en: {
    // Nav & System
    selectNode: 'SELECT CONNECTION NODE:',
    homeDeck: 'Home Deck',
    friendlist: 'Friendlist',
    connections: 'Connections',
    myProfile: 'My Profile',
    lockTerminal: 'Lock Terminal',
    lockDesc: 'Force security lockout and replay intro animation',
    sysStable: 'SYS: STABLE',
    connectingWorlds: 'Connecting worlds & OCs',
    realTimeID: 'REAL-LIFE TIME [EN]',
    proceduralSynth: 'Lofi retro cyber synth procedural engine (Live)',
    standby: 'STDBY',

    // Player Context
    pilihLagu: 'Select Song From Playlist',
    putarMP3: '📁 Play Local MP3',
    tempelLink: 'Paste Link / Search Song',
    gagalLoad: 'No presets matching. Click PLAY to force load Link/ID!',
    laguSebelum: 'Previous Song',
    laguSesudah: 'Next Song',
    clickLagu: 'Click to choose song or search from YouTube',
    searchResult: 'Search Results (Click to Play)',
    cyberStreamRecom: 'Cyber Stream Recommendations',
    noPresetMatches: 'No matching presets.',
    clickToForce: 'Click PLAY to force load the above Link/ID!',
    proceduralForceButton: 'SYNTH',
    proceduralForceTitle: 'Click to force local synth play if internet access latency is high',

    // Home Tab
    aboutWebTitle: 'ABOUT WEBSITE CONNECTION',
    softwareStackTitle: 'SOFTWARE STACK',
    contributorsTitle: 'WEBSITE CONTRIBUTORS',
    portalSoftwareTitle: 'PORTAL SOFTWARE DEPLOYMENT',
    portalFAQTitle: 'PORTAL SYSTEM F.A.Q',
    classification: 'CLASSIFICATION',
    securityTier: 'SECURITY TIER',
    responsive: 'RESPONSIVE',
    reactive: 'REACTIVE',
    themeColor: 'THEME COLOR',

    // Connection Tab
    connectingSocialTitle: 'CONNECTING TO SOCIAL MEDIA.....',
    tunnelLoadingTitle: 'ESTABLISHING ENCRYPTED TUNNEL LINKS [SECURE]',
    statusActiveBanner: 'STATUS ACTIVE: SECURE MULTI-CHANNEL SOCIAL TUNNELLING VERIFIED WITH VIRTUAL PROXIES. NO OUTSIDE POPUPS REQUIRED.',
    establishHandshakeLink: 'ESTABLISH HANDSHAKE LINK',
    latencyControlled: 'latency-controlled system v4.0.0 // bypass filters with proxy',

    // Profile Tab
    aboutOwnerText: "I'm a self-taught fullstack programmer and gray hat security explorer. Fascinated by synthwave, fursuiting, high-contrast console terminals, and furry aesthetics.",
    emailLabel: 'EMAIL CORRESPONDENCE:',
    telephonyLabel: 'SECURE TELEPHONY GATE:',
    operationalSectorLabel: 'OPERATIONAL SECTOR:',
    registrationLabel: 'REGISTRATION STAPLE:',
    userClassificationTitle: 'USER CLASSIFICATION MATRIX ROLES',
    roleNodeName: 'Role Node Name',
    securityClearanceCode: 'Security Clearance Code',
    primaryMandateDesc: 'Primary Mandate Description',
    securityStatsCheck: 'SECURITY STATS CHECK:',
    securityStatsText: 'MAPPED SECTORS ARE STATICALLY RECONSTRUCTED AT RUNTIME. NO WRITES / LEAKS DETECTED. ALL PERTINENT HANDSHAKES RESOLVED TO SECURE IP BLOCKPORTS.',

    // Friendlist Tab
    filterFriendsMatrix: 'FILTER FRIENDS MATRIX:',
    bukaCiriCiri: 'Show Characteristics',
    closePanel: 'Close panel',
    ciriKhasTitle: 'CHARACTERISTICS / FEATURES:',
    secureMediaLinks: 'SECURE MEDIA LINKS:',
    friendBadgeSahabat: 'SAHABAT (BEST FRIEND)',
    friendBadgePacar: 'RELATIONSHIP (PACAR - SPECIAL)',
    friendBadgeNormal: 'CONNECTION MAPPED',

    // Intro Screen localizations
    sysAccessProgress: 'SYSTEM ACCESS IN PROGRESS',
    loadingMemStations: 'FLOODING_MEM_STATIONS...',
    coreEnginesReady: 'CORE_ENGINES_READY_100%',
    lockingTerminalIntegrity: 'SECURING TERMINAL INTEGRITY...',
    authorizeConnection: 'AUTHORIZE CONNECTION',
    accessGranted: 'ACCESS GRANTED'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nesinezz_portal_language');
    return (saved === 'en' || saved === 'id') ? saved : 'id';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('nesinezz_portal_language', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return DICTIONARY[language][key] || DICTIONARY['id'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
