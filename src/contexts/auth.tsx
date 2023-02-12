import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { loginAPI, LoginPayload, LoginRequestError, logoutAPI, refreshTokenAPI } from '~/api/auth';
import { useQueryClient } from '@tanstack/react-query';

export interface AuthContextType {
  signIn: (loginPayload: LoginPayload, onSucess?: VoidFunction, onError?: VoidFunction) => void;
  interceptorsAdded?: boolean;
  authState?: boolean;
  signOut: () => void;
}

let awaitRefreshTokenPromise: Promise<any> | undefined | null;

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({
  children,
  axiosClient,
}: {
  children: ReactNode;
  axiosClient: AxiosInstance;
}) {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>();
  const [interceptorsAdded, setInterceptorsAdded] = useState<boolean | undefined>();
  const [authState, setAuthState] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        if (awaitRefreshTokenPromise && config.url !== '/refresh-access-token')
          await awaitRefreshTokenPromise.catch();
        if (config?.headers?.set && config.headers.set instanceof Function && accessToken)
          config.headers.set('authorization', `Bearer ${accessToken}`);

        return config;
      },
    );

    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => response,
      async function ({
        response,
      }: {
        response: AxiosResponse<{ errorCode: string }, { sent: boolean }>;
      }) {
        const prevRequest = response?.config;

        if (
          response.status === 401 &&
          response.data.errorCode !== 'REFRESH_TOKEN' &&
          !prevRequest.data?.sent
        ) {
          prevRequest.data = { sent: true };
          if (!awaitRefreshTokenPromise) {
            // eslint-disable-next-line no-async-promise-executor
            awaitRefreshTokenPromise = new Promise((resolve, reject) => {
              const refreshFunction = async () => {
                try {
                  const refreshResponse = await refreshTokenAPI();
                  const newAccessToken = refreshResponse.data.access_token;
                  setAccessToken(newAccessToken);
                  if (prevRequest?.headers?.set && prevRequest.headers.set instanceof Function)
                    prevRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
                  resolve(prevRequest);
                } catch (err) {
                  reject(err);
                }
              };
              return refreshFunction();
            });
            try {
              const response = await awaitRefreshTokenPromise;
              awaitRefreshTokenPromise = null;
              setAuthState(true);
              return axiosClient(response);
            } catch (err) {
              setAccessToken(null);
              setAuthState(false);
              throw err;
            } finally {
              awaitRefreshTokenPromise = null;
            }
          }
        } else if (response.status === 401) {
          console.error(`error 401`);
          setAccessToken(null);
          throw response;
        }
        throw response;
      },
    );

    setInterceptorsAdded(true);
    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosClient, accessToken]);

  useEffect(() => {
    if (!accessToken && authState === false) {
      queryClient.invalidateQueries([]);
      queryClient.clear();
    }
  }, [authState, accessToken, queryClient]);

  const signIn = useCallback(
    async (loginPayload: LoginPayload, onSuccess?: VoidFunction, onError?: VoidFunction) => {
      try {
        const loginResult = await loginAPI(loginPayload);
        setAccessToken(loginResult.data.access_token);
        setAuthState(true);
        onSuccess?.();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const msg = (err as AxiosError<LoginRequestError>).response?.data?.message;
          // AuthService.setAccessToken();
          setAccessToken(null);
          toast.error(msg);
        }
        onError?.();
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    await logoutAPI();
    setAccessToken(null);
    setAuthState(false);
  }, []);

  const value = useMemo(
    () => ({
      signIn,
      signOut,
      interceptorsAdded: Boolean(interceptorsAdded),
      authState,
    }),
    [interceptorsAdded, authState, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
