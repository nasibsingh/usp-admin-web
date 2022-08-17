import React from 'react';
import Datetime from 'react-datetime';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Form } from 'react-bootstrap';
import Icon from './icon';

interface Props {
  name: string;
  onChange?: (value?:string)=>void;
  value?: any;
  intl?:string;
  showTime?: boolean;
  isDisabled?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  future?: boolean;
  past?: boolean;
  validDate?: (current: any) => boolean;
  viewDate?: moment.Moment;
  formGroupclass?: string;
}

const defaultProps = {
  onChange: undefined,
  value: undefined,
  showTime: undefined,
  isDisabled: undefined,
  className: undefined,
  placeholder: undefined,
  label: undefined,
  required: undefined,
  error: undefined,
  future: undefined,
  past: undefined,
  validDate: undefined,
  viewDate: undefined,
  formGroupclass: undefined,
};
const DatetimeInput: React.FC<Props> = ({
  name,
  onChange,
  intl,
  value,
  className,
  isDisabled,
  showTime,
  placeholder,
  label,
  required,
  error,
  future,
  past,
  validDate,
  formGroupclass,
}) => {
  const timeFormat = showTime ? undefined : false;
  const handlePickerEvent = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };
  let isValidDate;
  if (past) {
    isValidDate = (current: any) => moment().isAfter(current);
  } else if (future) {
    isValidDate = (current: any) => moment().isBefore(current);
  } else {
    isValidDate = validDate;
  }

  let newValue;
  if (value) {
    newValue = moment(value);
  }

  return (
    <Form.Group className={formGroupclass}>
      {label && (
        <Form.Label htmlFor={name} className="mb-2">
          <FormattedMessage id={label} />
          {required ? '*' : ''}
        </Form.Label>
      )}
      <div className="datetime-container">
        <Datetime
          className={`datetime ${className ?? ''}`}
          inputProps={{
            name,
            id: name,
            disabled: isDisabled,
            readOnly: true,
            placeholder: `${
              placeholder
                ? 'hh'
                : ''
            }`,
          }}
          dateFormat="DD/MM/YYYY"
          value={newValue}
          onChange={handlePickerEvent}
          timeFormat={timeFormat}
          isValidDate={isValidDate}
          closeOnSelect
        />
        <Icon name="calender" className="datetime-icon" />
      </div>
      {error && (
        <FormattedMessage id={error}>
          {(txt) => <span className="input-error">{txt}</span>}
        </FormattedMessage>
      )}
    </Form.Group>
  );
};
DatetimeInput.defaultProps = defaultProps;
export default DatetimeInput;
