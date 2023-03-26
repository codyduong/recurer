import { PaneSection, PaneHeader, PaneSubtitle } from './Pane';
import styled from 'styled-components';
import ButtonLink from 'packages/components/ButtonLink';
import { Spinner } from 'packages/SpinkitLoadable';
import { GetTasksQuery } from 'graphql-gen/types';
import Button from 'packages/components/Button';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';

const TaskPaneSection = styled(PaneSection)`
  background-color: #d2e7f5;
  box-shadow: 4px 4px 8px 0px rgba(24, 126, 221, 0.2);
  --pane-primary-text-color: #187edd;
`;

const TaskPaneCompleteSection = styled(TaskPaneSection)`
  background-color: #d3f5d2;
  box-shadow: 4px 4px 8px 0px rgba(24, 221, 41, 0.2);
  --pane-primary-text-color: #18dd29;
`;

const TaskPaneHeader = styled(PaneHeader)`
  color: var(--pane-primary-text-color);
`;

const TaskButtonLink = styled(ButtonLink)`
  color: var(--pane-primary-text-color);
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

const TaskColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
  &:last-child {
    align-items: flex-end;
    text-align: right;
  }
  &:first-child {
    align-items: flex-start;
    text-align: left;
  }
`;

const TaskRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 16px;
  & > * {
    display: flex;
    flex: 0 1 50%;
    max-width: 50%;
  }
`;

const TaskRowFinal = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 4px 0;
`;

const TaskDate = styled.span`
  font-size: 1rem;
`;

const TaskPoints = styled.span`
  font-size: 1rem;
  padding-right: 8px;
`;

const TaskHeader = styled.h3`
  font-size: 24px;
`;

const TaskProgress = styled.div<{ percent: number }>`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.103);
  background: ${({ percent }) =>
    `linear-gradient(90deg, rgba(255,255,255,0.25) ${
      100 - percent
    }%, rgba(98, 158, 214, 1) ${100 - percent}%, rgba(98, 158, 214, 1) 100%);`};
  border-radius: 8px;
  padding-right: 8px;
`;

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
  progressBar?: boolean;
}

const Task = ({
  task,
  setTaskModalOpen,
  setTaskToUpdate,
  progressBar = false,
}: TaskProps): JSX.Element => {
  const handleEditingTask = (): void => {
    setTaskToUpdate(task);
    setTaskModalOpen(true);
  };

  const percent = (task.pointsCompleted * 100) / task.points;

  return (
    <TaskPane key={task.id}>
      <TaskRow>
        <TaskColumn>
          <TaskDate>{dayjs(task.dateEnd).format('llll')}</TaskDate>
          <TaskHeader>{task.title}</TaskHeader>
        </TaskColumn>
        {progressBar && task.points > 0 && (
          <TaskColumn>
            <TaskPoints>
              {task.pointsCompleted} / {task.points} points
            </TaskPoints>
            <TaskProgress percent={percent}>{percent.toFixed(2)}%</TaskProgress>
          </TaskColumn>
        )}
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
  --sk-color: var(--pane-primary-text-color);
`;

interface TaskPaneProps {
  tasks: GetTasksQuery['tasks'] | undefined;
  tasksLoading: boolean;
  setTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTaskToUpdate: React.Dispatch<
    React.SetStateAction<GetTasksQuery['tasks'][number] | undefined>
  >;
}

const TasksPane = ({
  tasks = [],
  tasksLoading: loading,
  setTaskModalOpen,
  setTaskToUpdate,
}: TaskPaneProps): JSX.Element => {
  const todoTasks = tasks.filter((task) => !task.complete);
  const doneTasks = tasks.filter((task) => task.complete);

  return (
    <>
      <TaskPaneSection>
        <TaskPaneHeader>To-do</TaskPaneHeader>
        {loading ? (
          <StyledSpinner />
        ) : todoTasks.length === 0 ? (
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
              {todoTasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  setTaskModalOpen={setTaskModalOpen}
                  setTaskToUpdate={setTaskToUpdate}
                  progressBar
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
      <TaskPaneCompleteSection>
        <TaskPaneHeader>Completed</TaskPaneHeader>
        {loading ? (
          <StyledSpinner />
        ) : doneTasks.length === 0 ? (
          <PaneSubtitle>There are no completed tasks to display</PaneSubtitle>
        ) : (
          <>
            <TasksWrapper>
              {doneTasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  setTaskModalOpen={setTaskModalOpen}
                  setTaskToUpdate={setTaskToUpdate}
                />
              ))}
            </TasksWrapper>
          </>
        )}
      </TaskPaneCompleteSection>
    </>
  );
};

export default TasksPane;
