import styled from 'styled-components';
import classnames from 'classnames';

const ToggleWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  margin-right: auto;
  padding: ${({ theme }) =>
    `${theme.spacing.px(37.5)} ${theme.spacing.px[50]}`};
  padding-right: ${({ theme }) => theme.spacing.px[25]};
  border-radius: ${({ theme }) => theme.spacing.px[50]};
  box-sizing: border-box;
  outline-offset: -2px;

  &:hover {
    background-color: #ceeeff;
  }

  span {
    padding-top: 2px;
  }
`;

const ToggleLabel = styled.label`
  font-size: 14px;
  margin: 0 ${({ theme }) => theme.spacing.rem[75]} 0 0;
`;

const ToggleActual = styled.div`
  border: solid ${({ theme }) => `${theme.spacing.px[12.5]} #000000`};
  border-radius: 0.75rem;
  padding: ${({ theme }) => theme.spacing.px[25]};
  display: inline-flex;
  width: 2.25rem;
  justify-content: flex-start;
  margin-right: ${({ theme }) => theme.spacing.rem[50]};
  position: relative;

  transition: border-color 225ms cubic-bezier(0.4, 0, 0.2, 1) 0s;

  &.switch-on {
    transition: border-color 225ms cubic-bezier(1, 0.2, 0, 0.4) 0s;
    border-color: #12a149;
  }
`;

const ToggleCircle = styled.div`
  display: inline-block;
  aspect-ratio: 1;
  min-height: ${({ theme }) => theme.spacing.rem[75]};
  border-radius: 50%;
  background-color: #000000;

  transition: all 225ms cubic-bezier(0.4, 0, 0.2, 1) 0s;

  &.switch-on {
    transition: all 225ms cubic-bezier(1, 0.2, 0, 0.4) 0s;
    background-color: #12a149;
    transform: translateX(100%);
  }
`;

const ToggleState = styled.p`
  font-size: 12px;
  display: inline-block;
  min-width: 3ch;
`;

type ToggleProps = {
  label: string;
  showLabel?: boolean;
  checked: boolean | undefined;
  setChecked: React.Dispatch<boolean>;
  className?: string | undefined;
  buttonProps?: Omit<
    React.PropsWithoutRef<JSX.IntrinsicElements['button']>,
    | 'role'
    | 'aria-checked'
    | 'onClick'
    | 'tabIndex'
    | 'aria-label'
    | 'className'
  >;
};

const Toggle = ({
  label,
  showLabel = true,
  checked,
  setChecked,
  className,
  buttonProps,
}: ToggleProps): JSX.Element => {
  const switchState = classnames({
    ['switch-off']: !checked,
    ['switch-on']: checked,
  });

  return (
    <ToggleWrapper
      {...buttonProps}
      role="switch"
      aria-checked={checked}
      onClick={() => {
        setChecked(!checked);
      }}
      tabIndex={0}
      aria-label={!showLabel ? label : undefined}
      className={className}
    >
      {showLabel && <ToggleLabel as="span">{label}</ToggleLabel>}
      <ToggleActual aria-hidden className={switchState}>
        <ToggleCircle className={switchState} />
      </ToggleActual>
      <ToggleState as="span" aria-hidden>
        {checked ? 'on' : 'off'}
      </ToggleState>
    </ToggleWrapper>
  );
};

export default Toggle;
