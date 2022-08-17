import React from 'react';
import {
  Button as BootstrapButton,
  ButtonProps,
  Spinner,
} from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Icon from './icon';
import { getButtonClass } from '../utils/commonFunctions';

interface Props extends ButtonProps {
  text: string;
  secondary?: boolean;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  icon?: string;

}

const defaultProps = {
  secondary: undefined,
  disabled: undefined,
  className: undefined,
  isLoading: undefined,
  icon: undefined,
};
const Button: React.FunctionComponent<Props> = ({
  text,
  secondary = undefined,
  disabled = undefined,
  className = undefined,
  isLoading = undefined,
  icon = undefined,
  ...props
}) => {
  const obj = {
    secondary,
    disabled,
    isLoading,
    icon,
  };
  return (
    <BootstrapButton
      {...props}
      disabled={disabled || isLoading}
      className={`c-button  ${getButtonClass(obj)} ${className || ''}`}
    >
      {icon && <Icon name={icon} />}
      {isLoading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <FormattedMessage id={text} />
      )}
    </BootstrapButton>
  );
};
Button.defaultProps = defaultProps;
export default Button;
