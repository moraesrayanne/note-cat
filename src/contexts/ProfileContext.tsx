import React, { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { fetchCatName } from '@/services/profile';

interface ProfileContextType {
  catName: string;
  setCatName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType>({} as ProfileContextType);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [catName, setCatName] = useState('Baden');

  useEffect(() => {
    if (!user) return;
    fetchCatName(user.id).then((name) => {
      if (name) setCatName(name);
    });
  }, [user]);

  return (
    <ProfileContext.Provider value={{ catName, setCatName }}>{children}</ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
