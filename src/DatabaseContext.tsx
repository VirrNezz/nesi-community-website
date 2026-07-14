import React, { createContext, useContext, useState, useEffect } from 'react';
import { friends as initialFriends, contributors as initialContributors } from './data';
import { Friend, Contributor, SocialLink } from './types';
import { db, storage, auth } from './firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
    content: 'Full SHA-512 level authorization handshakes are now operational across all nodes of NesiNezz Connection System. All database queries bound to Firebase Firestore and serverless endpoints are responding stably under 20ms.',
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

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface DatabaseContextType {
  friends: Friend[];
  contributors: Contributor[];
  tracks: PlaylistTrack[];
  announcements: Announcement[];
  dbType: 'Firebase Firestore' | 'Local Grid' | 'Postgress Tunnel';
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
  configDatabase: (url: string) => void;
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

  // Real-time Storage & Secure Array mutation helpers
  uploadAvatarFile: (type: 'friend' | 'contributor', id: string, file: File) => Promise<string>;
  addSocialToFriend: (friendId: string, social: SocialLink) => Promise<void>;
  deleteSocialFromFriend: (friendId: string, platform: string) => Promise<void>;
  updateSocialInFriend: (friendId: string, index: number, updatedSocial: SocialLink) => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [contributors, setContributors] = useState<Contributor[]>(initialContributors);
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [dbStatus, setDbStatus] = useState<'CONNECTED' | 'SYNCING' | 'OFFLINE'>('CONNECTED');
  const [vercelEnvUrl, setVercelEnvUrl] = useState<string>('https://firestore.googleapis.com/v1/projects/hypnagogic-complex-vlsxp');
  const [dbType, setDbType] = useState<'Firebase Firestore' | 'Local Grid' | 'Postgress Tunnel'>('Firebase Firestore');
  
  const [dbMetrics, setDbMetrics] = useState({
    reads: 184,
    writes: 42,
    latency: 14,
    host: 'firestore.googleapis.com'
  });

  // Validate Connection to Firestore on startup as mandated by the Firebase skill
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Initialize Real-time Snapshot listeners
  useEffect(() => {
    setDbStatus('SYNCING');
    
    // 1. Friends real-time stream listener
    const unsubFriends = onSnapshot(collection(db, 'friends'), (snapshot) => {
      const friendsList: Friend[] = [];
      snapshot.forEach((d) => {
        friendsList.push({ id: d.id, ...d.data() } as Friend);
      });

      // Seed if Firestore has no data yet
      if (friendsList.length === 0 && snapshot.metadata.fromCache === false) {
        console.log("[FIREBASE SEED] Populating default OCs into Firestore friends collection...");
        initialFriends.forEach(async (f) => {
          const { id, ...friendPayload } = f;
          await setDoc(doc(db, 'friends', id), friendPayload);
        });
      } else {
        setFriends(friendsList);
        setDbMetrics(prev => ({
          ...prev,
          reads: prev.reads + snapshot.size,
          latency: Math.floor(Math.random() * 8) + 4
        }));
      }
      setDbStatus('CONNECTED');
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'friends');
      setDbStatus('OFFLINE');
    });

    // 2. Contributors real-time stream listener
    const unsubContributors = onSnapshot(collection(db, 'contributors'), (snapshot) => {
      const contributorsList: Contributor[] = [];
      snapshot.forEach((d) => {
        contributorsList.push({ id: d.id, ...d.data() } as Contributor);
      });

      // Seed if Firestore has no data yet
      if (contributorsList.length === 0 && snapshot.metadata.fromCache === false) {
        console.log("[FIREBASE SEED] Populating default roles into Firestore contributors collection...");
        initialContributors.forEach(async (c) => {
          const { id, ...contributorPayload } = c;
          await setDoc(doc(db, 'contributors', id), contributorPayload);
        });
      } else {
        setContributors(contributorsList);
        setDbMetrics(prev => ({
          ...prev,
          reads: prev.reads + snapshot.size
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'contributors');
    });

    // 3. Tracks real-time stream listener
    const unsubTracks = onSnapshot(collection(db, 'tracks'), (snapshot) => {
      const tracksList: PlaylistTrack[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        tracksList.push({ id: Number(d.id), ...data } as PlaylistTrack);
      });
      // Keep sort order deterministic
      tracksList.sort((a, b) => a.id - b.id);
      setTracks(tracksList);
      setDbMetrics(prev => ({
        ...prev,
        reads: prev.reads + snapshot.size
      }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'tracks');
    });

    // 4. Announcements real-time stream listener
    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const announcementsList: Announcement[] = [];
      snapshot.forEach((d) => {
        announcementsList.push({ id: d.id, ...d.data() } as Announcement);
      });

      // Seed if Firestore has no data yet
      if (announcementsList.length === 0 && snapshot.metadata.fromCache === false) {
        console.log("[FIREBASE SEED] Populating default log entries into Firestore announcements...");
        INITIAL_ANNOUNCEMENTS.forEach(async (a) => {
          const { id, ...annPayload } = a;
          await setDoc(doc(db, 'announcements', id), annPayload);
        });
      } else {
        setAnnouncements(announcementsList);
        setDbMetrics(prev => ({
          ...prev,
          reads: prev.reads + snapshot.size
        }));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'announcements');
    });

    return () => {
      unsubFriends();
      unsubContributors();
      unsubTracks();
      unsubAnnouncements();
    };
  }, []);

  const triggerSync = () => {
    // Re-triggering of direct real-time snapshot is done automatically by SDK
    setDbMetrics(prev => ({ ...prev, reads: prev.reads + 1 }));
  };

  const updateAvatar = async (type: 'friend' | 'contributor', id: string, newUrlOrBase64: string) => {
    try {
      setDbStatus('SYNCING');
      const collectionName = type === 'friend' ? 'friends' : 'contributors';
      await updateDoc(doc(db, collectionName, id), { avatarUrl: newUrlOrBase64 });
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${type}/${id}`);
    }
  };

  const addTrack = async (newTrackData: Omit<PlaylistTrack, 'id'>) => {
    try {
      setDbStatus('SYNCING');
      const trackId = Date.now();
      await setDoc(doc(db, 'tracks', String(trackId)), {
        ...newTrackData,
        id: trackId
      });
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'tracks');
    }
  };

  const deleteTrack = async (id: number) => {
    try {
      setDbStatus('SYNCING');
      await deleteDoc(doc(db, 'tracks', String(id)));
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tracks/${id}`);
    }
  };

  const addAnnouncement = async (newUpdateData: Omit<Announcement, 'id' | 'timestamp'>) => {
    try {
      setDbStatus('SYNCING');
      const id = 'ann_' + Date.now();
      const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
      await setDoc(doc(db, 'announcements', id), {
        ...newUpdateData,
        timestamp: timestampStr
      });
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'announcements');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      setDbStatus('SYNCING');
      await deleteDoc(doc(db, 'announcements', id));
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `announcements/${id}`);
    }
  };

  const resetDatabase = async () => {
    try {
      setDbStatus('SYNCING');
      
      // Reset by overwrite documents with default settings
      for (const f of initialFriends) {
        const { id, ...friendPayload } = f;
        await setDoc(doc(db, 'friends', id), friendPayload);
      }
      for (const c of initialContributors) {
        const { id, ...contributorPayload } = c;
        await setDoc(doc(db, 'contributors', id), contributorPayload);
      }
      
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + initialFriends.length + initialContributors.length }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reset');
    }
  };

  const configDatabase = async (url: string) => {
    setVercelEnvUrl(url);
    setDbType(url.includes('postgres') || url.includes('sql') ? 'Postgress Tunnel' : 'Firebase Firestore');
  };

  const addFriend = async (newFriendData: Omit<Friend, 'id'>) => {
    try {
      setDbStatus('SYNCING');
      const id = 'f_' + Date.now();
      await setDoc(doc(db, 'friends', id), newFriendData);
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'friends');
    }
  };

  const updateFriend = async (id: string, updatedData: Partial<Friend>) => {
    try {
      setDbStatus('SYNCING');
      await updateDoc(doc(db, 'friends', id), updatedData);
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `friends/${id}`);
    }
  };

  const deleteFriend = async (id: string) => {
    try {
      setDbStatus('SYNCING');
      await deleteDoc(doc(db, 'friends', id));
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `friends/${id}`);
    }
  };

  const addContributor = async (newContributorData: Omit<Contributor, 'id'>) => {
    try {
      setDbStatus('SYNCING');
      const id = 'c_' + Date.now();
      await setDoc(doc(db, 'contributors', id), newContributorData);
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'contributors');
    }
  };

  const updateContributor = async (id: string, updatedData: Partial<Contributor>) => {
    try {
      setDbStatus('SYNCING');
      await updateDoc(doc(db, 'contributors', id), updatedData);
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `contributors/${id}`);
    }
  };

  const deleteContributor = async (id: string) => {
    try {
      setDbStatus('SYNCING');
      await deleteDoc(doc(db, 'contributors', id));
      setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contributors/${id}`);
    }
  };

  // Complete Firebase Storage upload pipeline with uploadBytesResumable
  const uploadAvatarFile = async (type: 'friend' | 'contributor', id: string, file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        setDbStatus('SYNCING');
        const fileRef = ref(storage, `avatars/${type}/${id}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`[STORAGE UPLOAD] ${progress.toFixed(2)}% compiled...`);
          },
          (error) => {
            console.error('[STORAGE UPLOAD FAIL]', error);
            setDbStatus('CONNECTED');
            reject(error);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Immediately update the corresponding doc field in Firestore
              const collectionName = type === 'friend' ? 'friends' : 'contributors';
              await updateDoc(doc(db, collectionName, id), { avatarUrl: downloadUrl });
              
              setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
              setDbStatus('CONNECTED');
              resolve(downloadUrl);
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        setDbStatus('CONNECTED');
        reject(err);
      }
    });
  };

  // Secure array of objects updating handlers
  const addSocialToFriend = async (friendId: string, social: SocialLink) => {
    try {
      setDbStatus('SYNCING');
      const docRef = doc(db, 'friends', friendId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentSocials: SocialLink[] = data.socials || [];
        const updatedSocials = [...currentSocials, social];
        await updateDoc(docRef, { socials: updatedSocials });
        setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      }
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `friends/${friendId}/socials`);
    }
  };

  const deleteSocialFromFriend = async (friendId: string, platform: string) => {
    try {
      setDbStatus('SYNCING');
      const docRef = doc(db, 'friends', friendId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentSocials: SocialLink[] = data.socials || [];
        const updatedSocials = currentSocials.filter((s) => s.platform !== platform);
        await updateDoc(docRef, { socials: updatedSocials });
        setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
      }
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `friends/${friendId}/socials`);
    }
  };

  const updateSocialInFriend = async (friendId: string, index: number, updatedSocial: SocialLink) => {
    try {
      setDbStatus('SYNCING');
      const docRef = doc(db, 'friends', friendId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentSocials: SocialLink[] = [...(data.socials || [])];
        if (currentSocials[index]) {
          currentSocials[index] = updatedSocial;
          await updateDoc(docRef, { socials: currentSocials });
          setDbMetrics(prev => ({ ...prev, writes: prev.writes + 1 }));
        }
      }
      setDbStatus('CONNECTED');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `friends/${friendId}/socials`);
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
      deleteContributor,
      uploadAvatarFile,
      addSocialToFriend,
      deleteSocialFromFriend,
      updateSocialInFriend
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
