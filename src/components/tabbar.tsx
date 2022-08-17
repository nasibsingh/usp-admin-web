import React, { useState } from 'react';

interface tabbar{
  id:number,
  component:JSX.Element,
  label:string
}

interface Props {
  name: string;
  tabbar: tabbar[];
  value?: string | number;
}
const defaultProps = {
  value: undefined,
};
const TabBar: React.FC<Props> = ({ name, value, tabbar }) => {
  const [active, setActive] = useState(value);

  const onClick = (id) => {
    setActive(id);
  };

  const renderChildren = () => {
    const activeComponent = tabbar.find((component) => component.id === active);
    return activeComponent?.component;
  };

  return (
    <div className="c-tabbar">
      {tabbar.map((option) => (
        <div
          role="presentation"
          className={`c-tabbar__button ms-2 ${
            option.id === active ? 'c-tabbar__button--active' : ''
          }`}
          id={name}
          onClick={() => {
            onClick(option.id);
          }}
        >
          {option.label}
        </div>
      ))}
      {renderChildren()}
    </div>
  );
};
TabBar.defaultProps = defaultProps;
export default TabBar;
