import React, { createContext, useContext, useEffect, useState } from "react";

interface MountContextType {
  isMounted: boolean;
}

const MountContext = createContext<MountContextType>({ isMounted: false });

export function MountProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <MountContext.Provider value={{ isMounted }}>
      {children}
    </MountContext.Provider>
  );
}

export const useMountStatus = () => useContext(MountContext);
