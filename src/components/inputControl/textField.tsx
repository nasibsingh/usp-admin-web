import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Icon from '../icon';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: (string | false);
  rows?: string;
  iconName?: string;
  className?: string;
  type?: string;
  autoFocus?: boolean;
  Icon?: boolean;
  isDisabled?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  data?: string;
  inputRef?: any;
  otherIconFunc?: () => void
  onKeyBoardEnter?: (value?: string) => void;
}

const defaultProps = {
  label: undefined,
  placeholder: undefined,
  required: undefined,
  value: undefined,
  onChange: (value: string) => undefined,
  error: undefined,
  rows: undefined,
  iconName: undefined,
  className: undefined,
  type: undefined,
  autoFocus: undefined,
  Icon: undefined,
  isDisabled: undefined,
  autoComplete: undefined,
  defaultValue: undefined,
  data: undefined,
  inputRef: undefined,
  otherIconFunc: () => undefined,
  onKeyBoardEnter: (value?: undefined) => undefined,
};
const TextInput: React.FC<Props> = ({
  name, label, placeholder, required,
  value, onChange, error, type,
  iconName, className, isDisabled, defaultValue,
  inputRef, otherIconFunc, autoComplete, onKeyBoardEnter, ...props
}) => (
  <Form.Group className="c-text-field">
    {label && (
      <Form.Label htmlFor={name} className="form-label">
        <FormattedMessage id={label} />
        {required ? '*' : ''}
      </Form.Label>
    )}
    <InputGroup>
      <Form.Control
        {...props}
        ref={inputRef}
        className={`text-input ${className || ''}  ${error ? 'danger-border' : ''}`}
        onChange={(event) => {
          if (onChange) {
            onChange(event?.currentTarget?.value);
          }
        }}
        value={value || ''}
        placeholder={placeholder}
        id={name}
        type={type ?? 'text'}
        name={name}
        autoComplete={autoComplete}
        disabled={isDisabled}
        defaultValue={defaultValue}
        onKeyPress={(event: any) => {
          if (event.key === 'Enter') {
            if (onKeyBoardEnter) {
              onKeyBoardEnter();
            }
          }
        }}
      />
      <div className="text-input__search-icon">
        {iconName && (
          <div className="text-input__search-icon">
            <Icon className="" onClick={otherIconFunc} name={iconName} />
          </div>
        )}
      </div>

    </InputGroup>
    {error && (
      <FormattedMessage id={error}>
        {(txt) => <span className="text-input__error">{txt}</span>}
      </FormattedMessage>
    )}

  </Form.Group>
);
TextInput.defaultProps = defaultProps;
export default TextInput;
