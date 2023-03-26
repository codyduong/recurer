import 'spinkit/spinkit.css';
import baseLoadable, {
  DefaultComponent,
  OptionsWithResolver,
} from '@loadable/component';
import styled from 'styled-components';
import classname from 'classnames';

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface SpinnerProps {
  className?: string;
}

export function SpinnerFlow({ className }: SpinnerProps): JSX.Element {
  return (
    <div className={classname('sk-flow', className)}>
      <div className="sk-flow-dot"></div>
      <div className="sk-flow-dot"></div>
      <div className="sk-flow-dot"></div>
    </div>
  );
}

export function Spinner({ className }: SpinnerProps): JSX.Element {
  return (
    <SpinnerWrapper className={className}>
      <div className="sk-circle">
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
        <div className="sk-circle-dot"></div>
      </div>
    </SpinnerWrapper>
  );
}

const loadable = ((
  importFunc: (props: unknown) => Promise<DefaultComponent<unknown>>,
  options: OptionsWithResolver<unknown, DefaultComponent<unknown>>
) => {
  return baseLoadable(importFunc, {
    fallback: <Spinner />,
    ...options,
  });
}) as typeof baseLoadable;

export default loadable;
