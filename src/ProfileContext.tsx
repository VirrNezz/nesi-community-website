import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  profilePic: string;
  updateProfilePic: (newUrl: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profilePic, setProfilePic] = useState<string>(() => {
    return localStorage.getItem('nesinezz_pfp') || '/default-avatar.png';
  });

  const updateProfilePic = (newUrl: string) => {
    setProfilePic(newUrl);
    localStorage.setItem('nesinezz_pfp', newUrl);
  };

  return (
    <ProfileContext.Provider value={{ profilePic, updateProfilePic }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};
