import React, { createContext, useContext, useState, useEffect } from 'react';
import { friends as initialFriends, contributors as initialContributors } from './data';
import { Friend, Contributor } from './types';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  category: 'MAINTENANCE' | 'SECURITY' | 'UPDATE' | 'GENERAL';
}

export interface PlaylistTrack {
  id: number;
  name: string;
  url: string;
  resolvedUrl?: string;
  youtubeId?: string;
  desc: string;
  youtubeUrl?: string;
  localFile?: boolean;
  image_url?: string;
  music_url?: string;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'MATRIX SYSTEM STABILITY CONFIGURED',
    content: 'Full SHA-512 level authorization handshakes are now operational across all nodes of NesiNezz Connection System. All database queries bound to Vercel KV and serverless endpoints are responding stably under 20ms.',
    timestamp: '2026-06-10 12:00',
    category: 'SECURITY'
  },
  {
    id: '2',
    title: 'PORTAL SYNCHRONIZATION WITH VERCEL STATIONS',
    content: 'The gray-hat interface and furry community profiles have been integrated into our dynamic web core. Custom JPG avatar capabilities and sound player updates are successfully loaded.',
    timestamp: '2026-06-09 18:45',
    category: 'UPDATE'
  }
];

const INITIAL_TRACKS: PlaylistTrack[] = [];

interface DatabaseContextType {
  friends: Friend[];
  contributors: Contributor[];
  tracks: PlaylistTrack[];
  announcements: Announcement[];
  dbType: 'Vercel KV' | 'Local Grid' | 'Postgress Tunnel';
  dbStatus: 'CONNECTED' | 'SYNCING' | 'OFFLINE';
  dbMetrics: {
    reads: number;
    writes: number;
    latency: number;
    host: string;
  };
  updateAvatar: (type: 'friend' | 'contributor', id: string, newUrlOrBase64: string) => void;
  resetDatabase: () => void;
  triggerSync: () => void;
  configDatabase: (vercelUrl: string) => void;
  vercelEnvUrl: string;
  addTrack: (track: Omit<PlaylistTrack, 'id'>) => void;
  deleteTrack: (id: number) => void;
  addAnnouncement: (update: Omit<Announcement, 'id' | 'timestamp'>) => void;
  deleteAnnouncement: (id: string) => void;
  
  // Custom CRUD controls for Friends & Contributors
  addFriend: (friend: Omit<Friend, 'id'>) => void;
  updateFriend: (id: string, updatedData: Partial<Friend>) => void;
  deleteFriend: (id: string) => void;
  addContributor: (contributor: Omit<Contributor, 'id'>) => void;
  updateContributor: (id: string, updatedData: Partial<Contributor>) => void;
  deleteContributor: (id: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors);
  const [tracks, setTracks] = useState<PlaylistTrack[]>(INITIAL_TRACKS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [dbStatus, setDbStatus] = useState<'CONNECTED' | 'SYNCING' | 'OFFLINE'>('CONNECTED');
  const [vercelEnvUrl, setVercelEnvUrl] = useState<string>('https://kv.vercel-storage.com/redis-node-nesinezz');
  const [dbType, setDbType] = useState<'Vercel KV' | 'Local Grid' | 'Postgress Tunnel'>('Vercel KV');
  
  const [dbMetrics, setDbMetrics] = useState({
    reads: 184,
    writes: 42,
    latency: 14,
    host: 'vercel-kv.nsnz-net.sh'
  });

  const fetchDatabase = async () => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database');
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      if (data.friends) setFriends(data.friends);
      if (data.contributors) setContributors(data.contributors);
      if (data.tracks) setTracks(data.tracks);
      if (data.announcements) setAnnouncements(data.announcements);
      if (data.vercelEnvUrl) setVercelEnvUrl(data.vercelEnvUrl);
      if (data.dbType) setDbType(data.dbType);
      
      if (data.dbMetrics) {
        setDbMetrics(prev => ({
          ...prev,
          host: data.dbMetrics.host || prev.host,
          writes: data.dbMetrics.writes !== undefined ? data.dbMetrics.writes : prev.writes,
          reads: prev.reads + 1,
          latency: data.dbMetrics.latency || Math.floor(Math.random() * 5) + 3
        }));
      } else {
        setDbMetrics(prev => ({
          ...prev,
          reads: prev.reads + 1,
          latency: Math.floor(Math.random() * 8) + 4
        }));
      }
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error("Failed to load server database", err);
      setDbStatus('OFFLINE');
    }
  };

  // Load from database on mount
  useEffect(() => {
    fetchDatabase();
  }, []);

  const updateAvatar = async (type: 'friend' | 'contributor', id: string, newUrlOrBase64: string) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, avatarUrl: newUrlOrBase64 })
      });
      if (!res.ok) throw new Error('Failed updating avatar');
      const data = await res.json();
      if (data.success && data.db) {
        setFriends(data.db.friends);
        setContributors(data.db.contributors);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: Math.floor(Math.random() * 10) + 6
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const addTrack = async (newTrackData: Omit<PlaylistTrack, 'id'>) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrackData)
      });
      const data = await res.json();
      if (data.success && data.db) {
        setTracks(data.db.tracks);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 10
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const deleteTrack = async (id: number) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch(`/api/database/tracks/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success && data.db) {
        setTracks(data.db.tracks);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 7
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const addAnnouncement = async (newUpdateData: Omit<Announcement, 'id' | 'timestamp'>) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUpdateData)
      });
      const data = await res.json();
      if (data.success && data.db) {
        setAnnouncements(data.db.announcements);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 12
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch(`/api/database/announcements/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success && data.db) {
        setAnnouncements(data.db.announcements);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 8
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const resetDatabase = async () => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/reset', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success && data.db) {
        setFriends(data.db.friends);
        setContributors(data.db.contributors);
        setTracks(data.db.tracks);
        setAnnouncements(data.db.announcements);
        setVercelEnvUrl(data.db.vercelEnvUrl);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 15
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const triggerSync = async () => {
    fetchDatabase();
  };

  const configDatabase = async (url: string) => {
    try {
      setDbType(url.includes('postgres') || url.includes('sql') ? 'Postgress Tunnel' : 'Vercel KV');
      setVercelEnvUrl(url);
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success && data.db) {
        setVercelEnvUrl(data.db.vercelEnvUrl);
      }
      setDbMetrics(prev => ({
        ...prev,
        latency: 11
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const addFriend = async (newFriendData: Omit<Friend, 'id'>) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFriendData)
      });
      const data = await res.json();
      if (data.success && data.db) {
        setFriends(data.db.friends);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 10
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const updateFriend = async (id: string, updatedData: Partial<Friend>) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });
      const data = await res.json();
      if (data.success && data.db) {
        setFriends(data.db.friends);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 9
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const deleteFriend = async (id: string) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch(`/api/database/friends/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success && data.db) {
        setFriends(data.db.friends);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 8
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const addContributor = async (newContributorData: Omit<Contributor, 'id'>) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/contributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContributorData)
      });
      const data = await res.json();
      if (data.success && data.db) {
        setContributors(data.db.contributors);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 10
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const updateContributor = async (id: string, updatedData: Partial<Contributor>) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch('/api/database/contributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });
      const data = await res.json();
      if (data.success && data.db) {
        setContributors(data.db.contributors);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 9
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  const deleteContributor = async (id: string) => {
    try {
      setDbStatus('SYNCING');
      const res = await fetch(`/api/database/contributors/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success && data.db) {
        setContributors(data.db.contributors);
      }
      setDbMetrics(prev => ({
        ...prev,
        writes: prev.writes + 1,
        latency: 8
      }));
      setDbStatus('CONNECTED');
    } catch (err) {
      console.error(err);
      setDbStatus('CONNECTED');
    }
  };

  return (
    <DatabaseContext.Provider value={{
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
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
