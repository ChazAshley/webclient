import { createContext, ReactNode, useContext, useMemo } from 'react';
import useMe from '~/common/queries/useMe';
import { AuthContext } from './auth';

export interface GlobalContextType {
  me: ReturnType<typeof useMe>;
  isInitialLoading: boolean;
}

export const GlobalContext = createContext<GlobalContextType>(null!);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const me = useMe(auth?.interceptorsAdded);

  const value = useMemo(
    () => ({
      me,
      isInitialLoading: Boolean(me.isInitialLoading),
    }),
    [me],
  );

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}
