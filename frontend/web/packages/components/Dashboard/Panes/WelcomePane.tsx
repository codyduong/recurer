import { PaneSection, PaneHeader, PaneSubtitle } from './Pane';
import { SpinnerFlow } from 'packages/SpinkitLoadable';
import styled from 'styled-components';

const WelcomePaneSection = styled(PaneSection)`
  background-color: #dfd4be;
  box-shadow: 4px 4px 8px 0px rgba(221, 159, 24, 0.2);
`;

const WelcomePaneHeader = styled(PaneHeader)`
  color: #dd9f18;
`;

const StyledSpinner = styled(SpinnerFlow)`
  --sk-color: currentColor;
  && {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 1rem;
    padding-top: 8px;
    height: calc(var(--sk-size) * 1);
    width: calc(var(--sk-size) * 1 - 8px);
  }
`;

interface WelcomePaneProps {
  username: string | undefined;
}

const WelcomePane = ({ username }: WelcomePaneProps): JSX.Element => {
  return (
    <WelcomePaneSection>
      <WelcomePaneHeader>
        Welcome back {username ? username + '!' : <StyledSpinner />}
      </WelcomePaneHeader>
      <PaneSubtitle>
        You&apos;ve completed <b>50%</b> of your tasks for this week. You have
        accumulated <b>192</b> points.
      </PaneSubtitle>
    </WelcomePaneSection>
  );
};

export default WelcomePane;
