'use client';

import { useMutation } from '@apollo/client';
import { Field, Form, Formik } from 'formik';
import { useAuth } from 'packages/auth/AuthContext';
import styled from 'styled-components';
import LOGIN_USER from './LoginUser.graphql';

const LoginWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledSection = styled.section`
  display: flex;
  flex-flow: column nowrap;
  max-width: 600px;
  padding: 64px;
  border-radius: 1rem;
  background: #eee;
  box-shadow: 4px 10px 17px 0px rgba(0, 0, 0, 0.1);
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  margin: 2rem 0;
  font-size: 1.5rem;

  & > label {
    font-size: inherit;
  }
  & > input {
    font-size: inherit;
    margin-left: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem;
  font-weight: 700;
  color: #fff;
  background-color: #12a149;
  border-radius: 16px;
  margin-top: 1.5rem;
`;

const DemoButton = styled(LoginButton)`
  background-color: #a11212;
`;

const Login = (): JSX.Element => {
  const [login] = useMutation(LOGIN_USER);
  const { setToken } = useAuth();

  return (
    <LoginWrapper>
      <StyledSection>
        <Title>Recurii</Title>
        <Subtitle>
          Design your own workflows to maximize your chances of building habits
          and encourage productivity.
        </Subtitle>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async ({ email, password }, { setSubmitting }) => {
            setSubmitting(true);
            const { data } = await login({
              variables: {
                email: email,
                password: password,
              },
            });
            if (data) {
              console.log(data);
              setToken(data.loginUser?.token ?? null);
            }
            setSubmitting(false);
          }}
          // validateOnChange={true}
          // validate={(values) => {
          //   console.log(values);
          // }}
        >
          <StyledForm>
            <label htmlFor={'email'}>email</label>
            <Field
              id="email"
              name="email"
              as="input"
              placeholder="abc@gmail.com"
            />
            <label htmlFor={'password'}>password</label>
            <Field id="password" name="password" as="input" type="password" />
            <LoginButton type="submit">Login</LoginButton>
            <DemoButton type="submit">Demo Account</DemoButton>
          </StyledForm>
        </Formik>
      </StyledSection>
    </LoginWrapper>
  );
};

export default Login;
