import React from 'react';
import { toast, TypeOptions } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import Icon from './icon';

export default (
  type:TypeOptions,
  message:string,
  icon:string,
):void => {
  toast(({ closeToast }) => (
    <>
      <div className="Toastify__toast-message">
        {icon && <Icon name={icon} className="Toastify__toast-icon pl-2 pr-2" />}
        <FormattedMessage tagName="span" id={message} />
      </div>
      <button type="button" className={type === 'error' ? 'Toastify__toast-errorclose mb-0' : 'Toastify__toast-close mb-0'} onKeyUp={closeToast} onClick={closeToast}>Close</button>
    </>
  ), { type });
};
