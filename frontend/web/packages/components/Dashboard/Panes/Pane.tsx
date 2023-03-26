import breakpoints from 'packages/breakpoints';
import styled from 'styled-components';

export const PaneSection = styled.section`
  display: flex;
  flex-flow: column nowrap;
  font-size: 1.5rem;
  padding: 32px;
  border-radius: 16px;

  @media only screen and (min-width: ${breakpoints.sm}) {
    padding: 48px;
  }
  @media only screen and (min-width: ${breakpoints.md}) {
    padding: 64px;
  }
`;

export const PaneHeader = styled.h2`
  font-size: 2.25rem;
  font-weight: bold;
  display: flex;
  flex-flow: row;
`;

export const PaneSubtitle = styled.p`
  font-size: 1.5rem;
`;
