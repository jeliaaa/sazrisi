import React, { createContext, useState, useContext, ReactNode } from "react";

type UserContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void; 
  profileImage: string;
  setProfileImage: (url: string) => void;
};

const defaultImage = "https://picsum.photos/100";
const defaultThemeColor = "blue"; 

const UserContext = createContext<UserContextType>({
  profileImage: defaultImage,
  setProfileImage: () => {},
  themeColor: defaultThemeColor, 
  setThemeColor: () => {}, 
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [themeColor, setThemeColor] = useState(defaultThemeColor); 

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, themeColor, setThemeColor }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
