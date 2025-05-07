import React, { createContext, useState, useContext } from "react";

type UserContextType = {
  profileImage: string;
  setProfileImage: (url: string) => void;
};

const defaultImage = "https://picsum.photos/100";

const UserContext = createContext<UserContextType>({
  profileImage: defaultImage,
  setProfileImage: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileImage, setProfileImage] = useState(defaultImage);

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
