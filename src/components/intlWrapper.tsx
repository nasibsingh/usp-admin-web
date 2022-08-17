import React from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import Hindi from '../language/hi.json';
import Us from '../language/en-US.json';
import { locale } from '../models';

const updateMessageFile = (local) => {
  switch (local) {
    case locale.ENGLISH_US: {
      return Us;
    }
    case locale.HINDI: {
      return Hindi;
    }
    default: Us;
  }
};
export const flattenMessages = ((nestedMessages, prefix = '') => {
  if (nestedMessages === null) {
    return {};
  }
  return Object.keys(nestedMessages).reduce((messages, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      Object.assign(messages, { [prefixedKey]: value });
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
});
function IntlWrapper({
  children,
}) {
  const local = useSelector((state: any) => state.language);
  const messages = updateMessageFile(local);

  return (
    <IntlProvider messages={flattenMessages(messages)} locale={local}>
      {children}
    </IntlProvider>
  );
}
export default IntlWrapper;
