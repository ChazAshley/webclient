import { useEffect, useState } from 'react';
import AuthService from '~/services/auth';

export function AuthState({ myid, children }: { myid: number; children: JSX.Element }) {
  const [_, setRefresh] = useState(0);
  AuthService.registerUseState(setRefresh, myid);

  useEffect(() => () => AuthService.removeUseState(setRefresh), []);

  return (
    <div>
      {_}
      {children}
    </div>
  );
}
