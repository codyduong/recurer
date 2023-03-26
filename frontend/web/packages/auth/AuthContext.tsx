import useLocalStorage from 'packages/hooks/useLocalStorage';
import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useCookies } from 'react-cookie';

type AuthContext = {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContextDefaultValue = {
  token: null,
  setToken: (): void => undefined,
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
    cookies['token']
      ? JSON.parse(cookies['token'].replace('Bearer ', ''))
      : null
  );

  useEffect(() => {
    if (token !== null) {
      setCookie('token', `Bearer ${JSON.stringify(token)}`, {
        sameSite: 'strict',
        secure: true,
      });
      setLocalToken(`Bearer ${JSON.stringify(token)}`);
    } else {
      clearCookie('token');
      setLocalToken(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuth = (): AuthContext => {
  const context = useContext(AuthContext);

  console.log(context);

  return context;
};
