import { LoginUserMutation } from 'graphql-gen/types';
import useLocalStorage from 'packages/hooks/useLocalStorage';
import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useCookies } from 'react-cookie';

type AuthContext = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  user: NonNullable<LoginUserMutation['loginUser']>['user'] | null;
  setUser: React.Dispatch<
    React.SetStateAction<
      NonNullable<LoginUserMutation['loginUser']>['user'] | null
    >
  >;
};

export const AuthContextDefaultValue = {
  token: null,
  setToken: (): void => undefined,
  user: null,
  setUser: (): void => undefined,
};

const AuthContext = createContext<AuthContext>(AuthContextDefaultValue);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // TODO remove this duplication, rely on cookies entirely instead
  const [_, setLocalToken] = useLocalStorage('token');
  const [cookies, setCookie, clearCookie] = useCookies();
  const [token, setToken] = React.useState<AuthContext['token']>(
    cookies['token'] ? cookies['token'].replace('Bearer ', '') || null : null
  );
  const [user, setUser] = React.useState<AuthContext['user']>(null);

  useEffect(() => {
    if (token !== null) {
      setCookie('token', `Bearer ${token}`, {
        sameSite: 'strict',
        secure: true,
        path: '/',
      });
      setLocalToken(`Bearer ${token}`);
    } else {
      clearCookie('token', { path: '/', sameSite: true });
      setLocalToken(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);

  return context;
};
