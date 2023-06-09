import styled from 'styled-components';
import ModalExitComponent from './ModalExitComponent';
import { useModal } from 'packages/components/Modal/ModalContext';

const ModalHeadingStyled = styled.h2`
  font-size: 1.5rem;
  margin: ${({ theme }) =>
    `${theme.spacing.px[50]} 0px ${theme.spacing.px['150']}`};
  &.uppercase {
    text-transform: uppercase;
  }
`;

type ModalHeadingProps = React.PropsWithoutRef<JSX.IntrinsicElements['h2']> & {
  exitLabel?: string;
};

const ModalHeading = ({
  children,
  exitLabel = 'Exit Modal',
  ...rest
}: ModalHeadingProps): JSX.Element => {
  const { onExit, ariaLabelledBy } = useModal();

  return (
    <ModalHeadingStyled id={ariaLabelledBy} {...rest}>
      {children}
      <ModalExitComponent onClick={onExit} aria-label={exitLabel} />
    </ModalHeadingStyled>
  );
};

export default ModalHeading;
