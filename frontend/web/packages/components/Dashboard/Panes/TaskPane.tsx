import { PaneSection, PaneHeader, PaneSubtitle } from './Pane';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import GET_TASKS from './GetTasks.graphql';
import ButtonLink from 'packages/components/ButtonLink';
import { useState } from 'react';
import loadable from '@loadable/component';
import { Spinner } from 'packages/SpinkitLoadable';

const CreateTaskModal = loadable(
  () =>
    import(
      /* webpackPrefetch: true */ 'packages/components/Dashboard/CreateTaskModal'
    ),
  { ssr: false }
);

const TaskPaneSection = styled(PaneSection)`
  background-color: #bed2df;
`;

const TaskPaneHeader = styled(PaneHeader)`
  color: #187edd;
`;

const TaskButtonLink = styled(ButtonLink)`
  color: #187edd;
`;

const TaskPane = styled.div``;

const StyledSpinner = styled(Spinner)`
  --sk-color: #187edd;
`;

interface TaskPaneProps {
  foo?: undefined;
}

const TasksPane = (props: TaskPaneProps): JSX.Element => {
  const { data, loading } = useQuery(GET_TASKS);
  const [creatingTask, setCreatingTask] = useState(false);

  const tasks = data?.tasks ?? [];

  return (
    <TaskPaneSection>
      <TaskPaneHeader>To-do</TaskPaneHeader>
      <CreateTaskModal
        open={creatingTask}
        onClose={() => {
          setCreatingTask(false);
        }}
      />
      {loading ? (
        <StyledSpinner />
      ) : tasks.length === 0 ? (
        <PaneSubtitle>
          You&apos;ve completed all your tasks for today.{' '}
          <TaskButtonLink
            onClick={() => {
              setCreatingTask(true);
            }}
          >
            Create a new task?
          </TaskButtonLink>
        </PaneSubtitle>
      ) : (
        <>
          {tasks.map((task) => (
            <TaskPane key={task.id}>
              {task.title}
              {task.content}
            </TaskPane>
          ))}
          <TaskButtonLink
            onClick={() => {
              setCreatingTask(true);
            }}
          >
            Create a new task?
          </TaskButtonLink>
        </>
      )}
    </TaskPaneSection>
  );
};

export default TasksPane;
