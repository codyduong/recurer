import { useMutation } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import Modal from 'packages/components/Modal';
import Toggle from 'packages/components/Toggle';
import styled from 'styled-components';
import CREATE_TASK from './CreateTask.graphql';
import UPDATE_TASK from './UpdateTask.graphql';
import DELETE_TASK from './DeleteTask.graphql';
import GET_TASKS from 'packages/pages/Dashboard/GetTasks.graphql';
import Button from 'packages/components/Button';
import { GetTasksQuery } from 'graphql-gen/types';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const InputGroup = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  max-width: 420px;
  gap: 16px;
`;

const InputGroupDatetime = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  max-width: 420px;
  gap: 16px;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column nowrap;
  gap: 12px;
  font-size: 1rem;

  & > label {
    font-size: inherit;
  }
  & > input {
    font-size: inherit;
    margin-left: 1rem;
  }
`;

export interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCloseAnimationComplete?: () => void;
  taskToUpdate: GetTasksQuery['tasks'][number] | undefined;
}

const CreateTaskModal = ({
  open,
  onClose,
  onCloseAnimationComplete,
  taskToUpdate: task,
}: CreateTaskModalProps): JSX.Element => {
  const refetchQueries = [{ query: GET_TASKS }];
  const [createTask] = useMutation(CREATE_TASK, { refetchQueries });
  const [updateTask] = useMutation(UPDATE_TASK, { refetchQueries });
  const [deleteTask] = useMutation(DELETE_TASK, { refetchQueries });

  const handleDeletion = (): void => {
    task &&
      deleteTask({
        variables: {
          id: task.id,
        },
      });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      onCloseAnimationComplete={onCloseAnimationComplete}
      size="large"
    >
      <Modal.Header>
        {task?.id ? 'Updating task' : 'Creating new task'}
      </Modal.Header>
      <Modal.Content>
        <Formik
          initialValues={{
            title: task?.title ?? '',
            description: task?.content ?? '',
            points: task?.points ?? 0,
            pointsCompleted: task?.pointsCompleted ?? 0,
            recurring: false,
            dateStart: '',
            dateEnd: '',
          }}
          onSubmit={(values, { setSubmitting }) => {
            if (!task?.id) {
              createTask({
                variables: {
                  title: values.title,
                  content: values.description,
                  // recurringChron: values.recurring,
                  points: values.points,
                  pointsCompleted: values.pointsCompleted,
                  dateEnd: values.dateEnd,
                  complete: values.points === values.pointsCompleted
                },
              });
            } else {
              updateTask({
                variables: {
                  id: task.id,
                  title: values.title,
                  content: values.description,
                  points: values.points,
                  pointsCompleted: values.pointsCompleted,
                  complete: values.points === values.pointsCompleted
                },
              });
            }
            setSubmitting(false);
            onClose();
          }}
        >
          {(p) => (
            <StyledForm>
              <InputGroup>
                <label htmlFor="task-title">Task Title</label>
                <Field name="title" id="task-title" as="input" />
              </InputGroup>
              <InputGroup>
                <label htmlFor="task-points-completed">
                  Task Points Completed
                </label>
                <Field
                  name="pointsCompleted"
                  id="task-points-completed"
                  as="input"
                  type="number"
                  min={0}
                />
              </InputGroup>
              <InputGroup>
                <label htmlFor="task-points">Task Points Total</label>
                <Field
                  name="points"
                  id="task-points"
                  as="input"
                  type="number"
                  min={0}
                />
              </InputGroup>
              <InputGroupDatetime>
                <label htmlFor="task-points">Task date/time</label>
                <DateTimePicker
                  defaultValue={task?.dateEnd && dayjs(task.dateEnd)}
                  onChange={(value: dayjs.Dayjs | null) => {
                    p.setFieldValue(
                      'dateEnd',
                      value ? value.toISOString() : ''
                    );
                  }}
                />
              </InputGroupDatetime>
              <InputGroup>
                <Toggle
                  disabled
                  label="Recurring"
                  checked={p.values.recurring}
                  setChecked={(v) => {
                    p.setFieldValue('recurring', v);
                  }}
                />
              </InputGroup>
              <label htmlFor="task-description">Task Description</label>
              <Field name="description" id="task-description" as="textarea" />
              <Modal.Footer>
                {task?.id && (
                  <Button
                    action="destructive"
                    onClick={() => {
                      handleDeletion();
                    }}
                  >
                    Delete
                  </Button>
                )}
                <div aria-hidden />
                <Button type="submit">Save</Button>
              </Modal.Footer>
            </StyledForm>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );
};

export default CreateTaskModal;
