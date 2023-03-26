import { useLazyQuery } from '@apollo/client';
import { useAuth } from 'packages/auth/AuthContext';
import { WelcomePane } from 'packages/components/Dashboard/Panes';
import TaskPane from 'packages/components/Dashboard/Panes/TaskPane';
import { Center, Main } from 'packages/pages/Page';
import { useEffect } from 'react';
import styled from 'styled-components';
import GET_DASHBOARD from './GetDashboard.graphql';

const DashboardSection = styled(Center)``;

const Dashboard = (): JSX.Element | null => {
  const { setToken, user, setUser } = useAuth();
  const [loadUser, { data, error, loading }] = useLazyQuery(GET_DASHBOARD);

  const fixedUser = user ?? data?.currentUser;

  useEffect(() => {
    if (!fixedUser && !data && !error && !loading) {
      loadUser();
    } else if (!fixedUser && !data && (error || !loading)) {
      setToken(null);
    }
  }, [user, fixedUser]);

  useEffect(() => {
    if (!loading) {
      if (data?.currentUser) {
        // set user if we can find it
        setUser(data?.currentUser);
      }
    }
  }, [loading]);

  return (
    <Main>
      <DashboardSection>
        <button
          onClick={() => {
            setToken(null);
          }}
        >
          Sign out
        </button>
        <WelcomePane username={user?.name} />
        <TaskPane />
      </DashboardSection>
    </Main>
  );
};

export default Dashboard;
