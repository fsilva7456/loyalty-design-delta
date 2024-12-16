import { createContext, useContext, useState } from 'react';

interface RegenerationContextType {
  previousResult: any;
  setPreviousResult: (result: any) => void;
  originalRequest: any;
  setOriginalRequest: (request: any) => void;
}

const RegenerationContext = createContext<RegenerationContextType | undefined>(undefined);

export function RegenerationProvider({ children }: { children: React.ReactNode }) {
  const [previousResult, setPreviousResult] = useState<any>(null);
  const [originalRequest, setOriginalRequest] = useState<any>(null);

  return (
    <RegenerationContext.Provider
      value={{
        previousResult,
        setPreviousResult,
        originalRequest,
        setOriginalRequest,
      }}
    >
      {children}
    </RegenerationContext.Provider>
  );
}

export function useRegeneration() {
  const context = useContext(RegenerationContext);
  if (context === undefined) {
    throw new Error('useRegeneration must be used within a RegenerationProvider');
  }
  return context;
}