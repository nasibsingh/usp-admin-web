import React from 'react';
import { Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

interface Props {
  name: string;
  options?: any;
  value?: string | number;
  onChange?: (value: any) => void;

}
const defaultProps = {
  options: undefined,
  value: undefined,
  onChange: undefined,
};

const RadioButton: React.FC<Props> = ({
  options, onChange, name, value,
}) => (
  <Form.Group>
    {options.map((option) => (
      <div
        role="presentation"
        className="radio-container"
        onClick={() => {
          if (onChange) {
            onChange(option.id);
          }
        }}
      >
        <input
          type="radio"
          id={`${name}_${option.id}`}
          name={name}
          checked={(option.id === value)}
        />
        <label htmlFor="">
          {option.label
            && <FormattedMessage id={option.label} />}
        </label>
      </div>
    ))}
  </Form.Group>

);
RadioButton.defaultProps = defaultProps;
export default RadioButton;
