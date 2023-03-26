import classNames from 'classnames';
import {
  useRef,
  useEffect,
  isValidElement,
  createElement,
  forwardRef,
} from 'react';
import styled from 'styled-components';
import Color from 'color';

const ButtonStyled = styled.button`
  display: flex;
  flex-direction: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  box-sizing: border-box;

  &.lg {
    height: 48px;
    font-size: 22px;
    padding: 10px 12px;

    & > svg {
      padding-bottom: 2px;
    }
  }

  &.md {
    height: 42px;
    font-size: 20px;
    border-radius: 14px;
    padding: 8px 8px 4px;
    & > svg {
      padding-bottom: 3px;
    }
  }

  &.sm {
    height: 28px;
    font-size: 14px;
    border-radius: 8px;
    padding: 6px 8px 4px 6px;

    & > svg {
      padding-bottom: 2px;
    }
  }

  color: #fff;
  background-color: #12a149;

  &.primary {
    &.destructive {
      background: #a11212;
    }
  }

  &.secondary {
    // similiar to link-text
    color: unset;
    background-color: unset;
    &:hover {
      background-color: #ceeeff;
    }
  }
`;

export const ButtonSize = {
  small: 'small',
  medium: 'medium',
  large: 'large',
} as const;

const ButtonSizeRemap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
} as const;

export const ButtonHierarchy = {
  primary: 'primary',
  secondary: 'secondary',
} as const;

export const ButtonAction = {
  default: 'default',
  destructive: 'destructive',
  productive: 'productive',
} as const;

export type IconProps = {
  width?: number;
  height?: number;
};

export type ButtonRef = {
  button?: React.LegacyRef<HTMLButtonElement>;
  icon?: React.LegacyRef<SVGSVGElement>;
};

export type ButtonProps = React.PropsWithoutRef<
  JSX.IntrinsicElements['button']
> & {
  hierarchy?: (typeof ButtonHierarchy)[keyof typeof ButtonHierarchy];
  action?: (typeof ButtonAction)[keyof typeof ButtonAction];
  size?: (typeof ButtonSize)[keyof typeof ButtonSize];
  ref?: React.MutableRefObject<ButtonRef | null>;
  icon?: React.ComponentType<JSX.IntrinsicElements['svg']> | React.ReactNode;
} & IconProps;

export const Button = ({
  hierarchy = 'primary',
  action = 'default',
  size = 'large',
  className: oldClassName,
  disabled,
  children,
  ref = useRef<ButtonRef>({}),

  icon: c,
  width,
  height,

  ...rest
}: ButtonProps): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef(null);

  const className = classNames(oldClassName, 'button', ButtonSizeRemap[size], {
    ['primary']: hierarchy == ButtonHierarchy.primary,
    ['secondary']: hierarchy == ButtonHierarchy.secondary,
    ['destructive']: action == ButtonAction.destructive,
    ['productive']: action == ButtonAction.productive,
    ['disabled']: disabled,
  });

  useEffect(() => {
    return () => {
      ref.current = null;
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.button = buttonRef;
    }
  }, [buttonRef]);

  useEffect(() => {
    if (ref.current) {
      ref.current.icon = iconRef;
    }
  }, [iconRef]);

  const iconProps: IconProps = {};
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    iconProps,
    ref
  ): React.ReactElement<IconProps> {
    return isValidElement(c)
      ? c
      : typeof c === 'function' ||
        (c !== null &&
          typeof c === 'object' &&
          'render' in c &&
          typeof (c as any)['render'] === 'function')
      ? createElement(c as any, { ...iconProps, ref })
      : (c as any);
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <ButtonStyled
      ref={buttonRef}
      className={className}
      disabled={disabled}
      type="button"
      {...rest}
    >
      <Icon ref={iconRef} width={width} height={height} {...iconProps} />
      {children}
    </ButtonStyled>
  );
};

export default Button;
