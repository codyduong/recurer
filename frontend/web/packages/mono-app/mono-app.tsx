import { ProtectedRoute, UnprotectedRoute } from './Routes';
import generateTitleTag from 'packages/titler';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthContextProvider } from 'packages/auth/AuthContext';
import loadable from 'packages/SpinkitLoadable';
import styled, { ThemeProvider } from 'styled-components';
import Redirect from 'packages/http/Redirect';
import NotFound from 'packages/components/NotFound';
import theme from 'packages/mono-app/theme';

const Login = loadable(
  () => import(/* webpackPrefetch: true */ 'packages/pages/Login')
);

const Dashboard = loadable(
  () => import(/* webpackPrefetch: true */ 'packages/pages/Dashboard')
);

const MonoAppDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Titler = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (document) {
      const state = window.__APOLLO_STATE__;
      document.title = generateTitleTag(pathname, state);
    }
  }, [pathname]);

  return null;
};

function App(): JSX.Element {
  return (
    <MonoAppDiv>
      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          <Titler />
          <Routes>
            <Route path="/" element={<Redirect to="/login" />} />
            <Route element={<UnprotectedRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Redirect to="/404" />} />
          </Routes>
        </AuthContextProvider>
      </ThemeProvider>
    </MonoAppDiv>
  );
}

export default App;
