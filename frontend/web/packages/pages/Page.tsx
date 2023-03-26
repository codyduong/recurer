import styled from 'styled-components';

export const Main = styled.main`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background: #eee;
  overflow-y: scroll;
`;

export const Center = styled.div`
  display: flex;
  flex-flow: column nowrap;
  max-width: 600px;
  gap: 16px;
  margin: 16px;
`;
