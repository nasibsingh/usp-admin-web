import React from 'react';

interface Props {
  name:string|any;
  className?:string;
  title?:string;
  onClick?:()=>void;
  onKeyPress?:()=>void;

}

const defaultProps = {
  className: undefined,
  title: undefined,
  onClick: undefined,
  onKeyPress: undefined,
};
const Icon = React.forwardRef<HTMLImageElement, Props>(({
  name, onClick, onKeyPress, ...props
}, ref) => (
  <img
    {...props}
    ref={ref}
    src={`assets/images/${name}.svg`}
    alt={name}
    onClick={onClick}
    onKeyPress={onKeyPress}
    role="presentation"
  />
));
Icon.defaultProps = defaultProps;
export default Icon;
