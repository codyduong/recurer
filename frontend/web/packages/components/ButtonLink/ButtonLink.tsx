import { forwardRef, ForwardRefRenderFunction } from 'react';
import styled from 'styled-components';

const ButtonLinkStyled = styled.button``;

const ButtonLinkForwardType: ForwardRefRenderFunction<
  JSX.IntrinsicElements['button']['ref'],
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props, ref): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ButtonLinkStyled ref={ref as any} {...props} />;
};

const ButtonLink = forwardRef(ButtonLinkForwardType);

export default ButtonLink;
