import { createContext, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken }}>{children}</AuthContext.Provider>
  );
};
