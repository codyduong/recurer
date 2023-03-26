'use client';

import { Field, Form, Formik } from 'formik';
import Logo from '@components/Logo';
import styled from 'styled-components';

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
  max-width: 664px;
  padding: 64px;
  border: solid 4px #ffffff;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const StyledLabel = styled.label`
  font-size: 2rem;
`;

const StyledField = styled(Field)`
  margin-left: 1rem;
  font-size: 2rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
`;

const Login = (): JSX.Element => {
  return (
    <LoginWrapper>
      <StyledSection>
        <Logo />
        <Subtitle>
          Design your own workflows to maximize your chances of building habits
          and encourage productivity.
        </Subtitle>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            setSubmitting(false);
          }}
        >
          <StyledForm>
            <StyledLabel htmlFor={'email'}>email</StyledLabel>
            <StyledField
              id="email"
              name="email"
              as="input"
              placeholder="abc@gmail.com"
            />
            <StyledLabel htmlFor={'password'}>password</StyledLabel>
            <StyledField
              id="password"
              name="password"
              as="input"
              type="password"
            />
          </StyledForm>
        </Formik>
      </StyledSection>
    </LoginWrapper>
  );
};

export default Login;
