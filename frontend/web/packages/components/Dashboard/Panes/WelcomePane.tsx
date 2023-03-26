import { PaneSection, PaneHeader, PaneSubtitle } from './Pane';
import { SpinnerFlow } from 'packages/SpinkitLoadable';
import styled from 'styled-components';

const WelcomePaneSection = styled(PaneSection)`
  background-color: #dfd4be;
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
        You&apos;ve completed 50% of your tasks for this week. You have
        accumulated 192 points.
      </PaneSubtitle>
    </WelcomePaneSection>
  );
};

export default WelcomePane;
