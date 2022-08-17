/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useEffect } from 'react';
import Select from 'react-select';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-bootstrap';
import { Option } from '../../models';

export interface MappedOption {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  name: string;
  onChange?: any;
  value?: any;
  isDisabled?: boolean;
  onSearch?: (text: string, initialLoad: boolean) => void;
  initialOption?: Option | Option[];
  multiSelect?: boolean;
  classNamePrefix?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  isClearable?: boolean;
  noOptionsMessage?: string;
  error?: string;
  isSearchable?: boolean;
  maxHeight?:number;
}

const defaultProps = {
  className: undefined,
  onChange: undefined,
  value: undefined,
  isDisabled: undefined,
  onSearch: undefined,
  initialOption: undefined,
  multiSelect: undefined,
  classNamePrefix: undefined,
  placeholder: undefined,
  label: undefined,
  required: undefined,
  isClearable: undefined,
  noOptionsMessage: undefined,
  error: undefined,
  isSearchable: undefined,
  maxHeight: undefined,
};
export const customStyles = (maxHeight?:number) => ({
  container: (provided: any) => ({
    ...provided,
    position: 'inherit',
    minWidth: 90,

  }),
  control: (provided: any, state:any) => ({
    ...provided,
    minHeight: 45,
    border: '1px solid #E8E8EA',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: 'none',
    backgroundColor: state.isDisabled ? '#eff2f4' : '#ffffff',
    '&:hover': {
      borderColor: '#E8E8EA',
    },
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,

  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
    maxHeight: maxHeight ?? 300,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: 14,
    cursor: 'pointer',
    zIndex: 9999,
    backgroundColor: state.isSelected ? 'black' : 'transparent',
    textAlign: 'left',
    '&:hover': {
      backgroundColor: state.isSelected ? '#FAE7E8' : '#FAE7E8',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    fontSize: 14,
    color: '#9599A0',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontSize: 14,
    color: '#14223E',
  }),
  input: (provided: any) => ({
    ...provided,
    fontSize: 14,
  }),
  valueContainer: (provided: any) => ({
    ...provided,
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
  }),
  multiValue: (provided: any) => ({
    ...provided,

    // #DFE7F5
    color: '#FFFFFF',
    fontSize: 14,
    backgroundColor: '#000000',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderTopLeftRadius: 2,
    fontSize: 14,

  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#000000',
      color: '#FFFFFF',
    },
  }),
});

const SelectInput: React.FC<Props> = ({
  onSearch,
  options,
  name,
  onChange,
  value,
  initialOption,
  multiSelect,
  label,
  classNamePrefix,
  placeholder,
  required,
  isClearable,
  noOptionsMessage,
  error,
  isDisabled,
  maxHeight,
  ...props
}) => {
//   const intl = useIntl();

  const mapOption = (option: Option): MappedOption => ({
    value: option.id,
    label: option.intl
      ? option.label
      : option.label,
  });

  const singleValue: undefined | Option = multiSelect
    ? undefined
    : (initialOption as Option);

  const multiValue: undefined | Option[] = multiSelect
    ? (initialOption as Option[])
    : undefined;

  const selectValue = multiSelect
    ? value ?? (multiValue && multiValue.map((v) => `${v.id}`)) ?? []
    : value ?? (singleValue && singleValue.id) ?? '';

  let finalOptions: Option[] = [...options];

  if (multiSelect && multiValue) {
    finalOptions = multiValue
      .filter((v) => !options.find((option) => option.id === v.id))
      .concat(options);
  } else if (singleValue) {
    if (!options.find((option) => option.id === singleValue.id)) {
      finalOptions = [singleValue].concat(options);
    }
  }

  const getSelectedValue = (): MappedOption | MappedOption[] | undefined => {
    if (multiSelect) {
      return finalOptions
        .filter((option) => !!selectValue.includes(option.id))
        .map(mapOption);
    }
    if (selectValue) {
      const opt = finalOptions.find((option) => option.id === selectValue);
      if (opt) {
        return mapOption(opt);
      }
    }
    return undefined;
  };

  useEffect(() => {
    if (finalOptions.length === 0 && onSearch) {
      onSearch('', true);
    }
  }, []);

  return (
    <Form.Group className={isDisabled ? 'cursor--not-allowed' : ''}>
      {label && (
        <Form.Label htmlFor={name}>
          <FormattedMessage id={label} />
          {required ? '*' : ''}
        </Form.Label>
      )}

      <Select
        {...props}
        isDisabled={isDisabled}
        classNamePrefix={classNamePrefix ?? 'react-select'}
        isMulti={multiSelect}
        instanceId={name}
        name={name}
        options={finalOptions.map(mapOption)}
        styles={customStyles(maxHeight)}
        isClearable={isClearable ?? false}
        value={getSelectedValue() ?? (multiSelect ? [] : '')}
        onChange={(newValue: any) => {
          if (onChange) {
            /* eslint-disable no-unused-expressions */
            multiSelect
              ? onChange(newValue?.map((p: any) => p.value) ?? [])
              : onChange(newValue?.value ?? '');
            /* eslint-enable no-unused-expressions */
          }
        }}
        onInputChange={(input) => {
          if (onSearch) {
            onSearch(input, false);
          }
        }}
        placeholder={`${
          'ss'
        }`}
        components={{
          IndicatorSeparator: null,
        }}
      />

      {error && (
        <FormattedMessage id={error}>
          {(txt) => <span className="input-error">{txt}</span>}
        </FormattedMessage>
      )}
    </Form.Group>
  );
};
SelectInput.defaultProps = defaultProps;
export default SelectInput;
