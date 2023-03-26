import { useLazyQuery, useQuery } from '@apollo/client';
import loadable from '@loadable/component';
import { GetTasksQuery } from 'graphql-gen/types';
import { useAuth } from 'packages/auth/AuthContext';
import breakpoints from 'packages/breakpoints';
import { WelcomePane } from 'packages/components/Dashboard/Panes';
import TaskPane from 'packages/components/Dashboard/Panes/TaskPane';
import { Center, Main } from 'packages/pages/Page';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import GET_DASHBOARD from './GetDashboard.graphql';
import GET_TASKS from './GetTasks.graphql';

const CreateTaskModal = loadable(
  () =>
    import(
      /* webpackPrefetch: true */ 'packages/components/Dashboard/CreateTaskModal'
    ),
  { ssr: false }
);

const DashboardSection = styled(Center)`
  margin: 64px 0;

  @media (min-width: ${breakpoints.md}) {
    margin: 128px 0;
  }
`;

const Dashboard = (): JSX.Element | null => {
  const { setToken, user, setUser } = useAuth();
  const [loadUser, { data, error, loading }] = useLazyQuery(GET_DASHBOARD);
  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] =
    useState<GetTasksQuery['tasks'][number]>();

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
        <CreateTaskModal
          open={taskModalOpen}
          onClose={() => {
            setTaskModalOpen(false);
          }}
          onCloseAnimationComplete={() => {
            setTaskToUpdate(undefined);
          }}
          taskToUpdate={taskToUpdate}
        />
        <TaskPane
          tasks={tasksData?.tasks}
          tasksLoading={tasksLoading}
          setTaskModalOpen={setTaskModalOpen}
          setTaskToUpdate={setTaskToUpdate}
        />
      </DashboardSection>
    </Main>
  );
};

export default Dashboard;
