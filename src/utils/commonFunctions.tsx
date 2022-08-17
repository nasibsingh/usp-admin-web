import moment from 'moment';

export const convertIsoDatoToIsoDateTime = (date?:string):(string|undefined) => {
  if (!date) {
    return undefined;
  }
  return `${date}T${moment().format('HH:mm:ssZ')}`;
};

export const convertToIsoDateTime = (date?:string):(string|undefined) => {
  if (!date) {
    return undefined;
  }
  return moment(date).format('YYYY-MM-DDTHH:mm:ssZ');
};

export const convertToIsoDate = (date?:string):(string|undefined) => {
  if (!date) {
    return undefined;
  }
  return moment(date).format('YYYY-MM-DD');
};

export const isUndefined = (value:unknown):boolean => value === undefined;
export const isNull = (value:unknown):boolean => value === null;

export const getApiDate = (value:(string|moment.Moment|undefined|null)):(string|undefined|null) => {
  if (isNull(value)) return null;
  if (isUndefined(value)) return undefined;
  return convertToIsoDate(value as string);
};

/* eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types */
export const getEditUrl = (route:string) => (entity:any):string => (
  route.replace(':id', entity?.id)
);
export const getButtonClass = (data ? : any) => {
  const {
    disabled,
    icon,
    isLoading,
    secondary,
  } = data;
  if (secondary && disabled) {
    return 'c-button--outline loading disabled';
  }
  if (secondary && isLoading) {
    return 'c-button--outline disabled';
  }
  if (secondary) {
    return 'c-button--outline';
  }
  if (icon) {
    return 'c-button--with-icon';
  } if (disabled) {
    return 'disabled';
  }
  return null;
};
