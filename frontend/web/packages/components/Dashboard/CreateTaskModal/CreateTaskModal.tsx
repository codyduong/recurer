import { useMutation } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import Modal from 'packages/components/Modal';
import Toggle from 'packages/components/Toggle';
import styled from 'styled-components';
import CREATE_TASK from './CreateTask.graphql';
import GET_TASKS from '../Panes/GetTasks.graphql';

const InputGroup = styled.div`
  display: flex;
  flex-flow: row wrap;
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
}

const CreateTaskModal = ({
  open,
  onClose,
}: CreateTaskModalProps): JSX.Element => {
  const [createTask] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  return (
    <Modal open={open} onClose={onClose} size="large">
      <Modal.Header>Creating a new task</Modal.Header>
      <Modal.Content>
        <Formik
          initialValues={{
            title: '',
            description: '',
            recurring: false,
          }}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            createTask({
              variables: {
                title: values.title,
                content: values.description,
                // recurringChron: values.recurring,
              },
            });
            setSubmitting(false);
          }}
        >
          {(p) => (
            <StyledForm>
              <InputGroup>
                <label htmlFor="task-title">Task Title</label>
                <Field name="title" id="task-title" as="input" />
              </InputGroup>
              <InputGroup>
                <Toggle
                  label="Recurring"
                  checked={p.values.recurring}
                  setChecked={(v) => {
                    p.setFieldValue('recurring', v);
                  }}
                />
              </InputGroup>
              <label htmlFor="task-description">Task Description</label>
              <Field name="description" id="task-description" as="textarea" />
              <Modal.Footer.Default
                backButton={false}
                nextButtonProps={{ type: 'submit' }}
              />
            </StyledForm>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );
};

export default CreateTaskModal;
