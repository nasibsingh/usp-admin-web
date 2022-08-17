import React from 'react';

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  name: string;
  disabled?: boolean;
}
const defaultProps = {
  disabled: undefined,
};
const SwipeToggleButton: React.FC<Props> = ({
  value, onChange, name, disabled,
}) => (
  <div
    className={`c-toggle ${value ? 'toggle-success' : ''}`}
    role="presentation"
    onClick={() => {
      if (onChange && !disabled) {
        onChange(!value);
      }
    }}
    onKeyUp={() => {
      if (onChange && !disabled) {
        onChange(!value);
      }
    }}
    id={name}
  >

    <div className={`c-toggle__button ${value ? '' : 'c-toggle--disabled'}`} />
  </div>
);
SwipeToggleButton.defaultProps = defaultProps;
export default SwipeToggleButton;
