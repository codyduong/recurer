import { PaneSection, PaneHeader, PaneSubtitle } from './Pane';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import GET_TASKS from './GetTasks.graphql';
import ButtonLink from 'packages/components/ButtonLink';
import { useEffect, useState } from 'react';
import loadable from '@loadable/component';
import { Spinner } from 'packages/SpinkitLoadable';
import { GetTasksQuery } from 'graphql-gen/types';
import Button from 'packages/components/Button';
import EditIcon from '@mui/icons-material/Edit';

const CreateTaskModal = loadable(
  () =>
    import(
      /* webpackPrefetch: true */ 'packages/components/Dashboard/CreateTaskModal'
    ),
  { ssr: false }
);

const TaskPaneSection = styled(PaneSection)`
  background-color: #bed2df;
  box-shadow: 4px 4px 8px 0px rgba(24, 126, 221, 0.2);
`;

const TaskPaneHeader = styled(PaneHeader)`
  color: #187edd;
`;

const TaskButtonLink = styled(ButtonLink)`
  color: #187edd;
`;

const TasksWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  margin-bottom: 12px;
`;

const TaskPane = styled.div`
  display: flex;
  flex-flow: column nowrap;
  color: #272727;
  &::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: #272727;
  }
`;

const TaskRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  & > * {
    max-width: 50%;
  }
`;

const TaskRowFinal = styled(TaskRow)`
  padding: 4px 0;
`;

const TaskColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const TaskDate = styled.span`
  font-size: 1rem;
`;

const TaskPoints = styled.span`
  font-size: 1rem;
`;

const TaskHeader = styled.h3`
  font-size: 24px;
`;

const TaskProgress = styled.div``;

const TaskSubtitle = styled.span`
  font-size: 1rem;
  max-width: 60%;
`;

interface TaskProps {
  task: GetTasksQuery['tasks'][number];
  setTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskToUpdate: React.Dispatch<
    React.SetStateAction<GetTasksQuery['tasks'][number] | undefined>
  >;
}

const Task = ({
  task,
  setTaskModalOpen,
  setTaskToUpdate,
}: TaskProps): JSX.Element => {
  const handleEditingTask = () => {
    setTaskToUpdate(task);
    setTaskModalOpen(true);
  };

  return (
    <TaskPane key={task.id}>
      <TaskRow>
        <TaskColumn>
          <TaskDate>{task.deadline}</TaskDate>
          <TaskHeader>{task.title}</TaskHeader>
        </TaskColumn>
        <TaskColumn>
          <TaskPoints>
            {task.points} / {task.points} points
          </TaskPoints>
          <TaskProgress>57%</TaskProgress>
        </TaskColumn>
      </TaskRow>
      <TaskRow>
        <TaskSubtitle>{task.content}</TaskSubtitle>
      </TaskRow>
      <TaskRowFinal>
        <Button
          hierarchy="secondary"
          size="small"
          icon={<EditIcon />}
          onClick={() => {
            handleEditingTask();
          }}
        >
          Edit Task
        </Button>
      </TaskRowFinal>
    </TaskPane>
  );
};

const StyledSpinner = styled(Spinner)`
  --sk-color: #187edd;
`;

interface TaskPaneProps {
  foo?: never;
}

const TasksPane = (props: TaskPaneProps): JSX.Element => {
  const { data, loading } = useQuery(GET_TASKS);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] =
    useState<GetTasksQuery['tasks'][number]>();

  const tasks = data?.tasks ?? [];

  return (
    <TaskPaneSection>
      <TaskPaneHeader>To-do</TaskPaneHeader>
      <CreateTaskModal
        open={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
        }}
        taskToUpdate={taskToUpdate}
      />
      {loading ? (
        <StyledSpinner />
      ) : tasks.length === 0 ? (
        <PaneSubtitle>
          You&apos;ve completed all your tasks for today.{' '}
          <TaskButtonLink
            onClick={() => {
              setTaskModalOpen(true);
            }}
          >
            Create a new task?
          </TaskButtonLink>
        </PaneSubtitle>
      ) : (
        <>
          <TasksWrapper>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                setTaskModalOpen={setTaskModalOpen}
                setTaskToUpdate={setTaskToUpdate}
              />
            ))}
          </TasksWrapper>
          <TaskButtonLink
            onClick={() => {
              setTaskModalOpen(true);
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
