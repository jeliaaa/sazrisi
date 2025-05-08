import React, { createContext, useState } from "react";

type UserContextType = {
  themeColor: string;
  setThemeColor: (color: string) => void;
  profileImage: string;
  setProfileImage: (url: string) => void;
  username: string;
  email: string
};

const defaultImage = "https://picsum.photos/100";
const defaultThemeColor = "blue";
const username = "alek";
const email = "ale@gmail.com";

const UserContext = createContext<UserContextType>({
  profileImage: defaultImage,
  setProfileImage: () => { },
  themeColor: defaultThemeColor,
  setThemeColor: () => { },
  username: username,
  email: email
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileImage, setProfileImage] = useState(defaultImage);
  const [themeColor, setThemeColor] = useState(defaultThemeColor);

  return (
    <UserContext.Provider value={{ profileImage, setProfileImage, themeColor, setThemeColor, username, email }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
