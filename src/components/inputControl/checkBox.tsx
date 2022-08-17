import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  onChange?: (value: any) => void;
  isDisabled?: boolean;
  value?: boolean | any;
  error?: (string | false);
  className?: string
}

const defaultProps = {
  onChange: undefined,
  isDisabled: undefined,
  value: undefined,
  error: undefined,
  className: undefined,
  label: undefined,
};
const CheckBox: React.FC<Props> = ({
  name, label, onChange, isDisabled, value, error, className,
  ...props
}) => (
  <Form.Group className={`c-checkbox ${className || ''}`}>
    <Form.Check
      {...props}
      className="ps-0"
      disabled={isDisabled}
      type="checkbox"
      id={name}
      name={name}
      label={label}
      checked={!!value}
      onChange={() => {
        if (onChange) {
          onChange(value);
        }
      }}
    />
    {error && (
    <FormattedMessage id={error}>
      {(txt) => <span className="input-error">{txt}</span>}
    </FormattedMessage>
    )}
  </Form.Group>
);
CheckBox.defaultProps = defaultProps;
export default CheckBox;
