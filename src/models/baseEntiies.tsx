export type Status = 'ACTIVE' | 'INACTIVE';

export type BasicObject = Record<string, unknown>;

export interface MetaData<T> {
  order: keyof T | '';
  direction: 'asc' | 'desc';
  total: number;
  page: number;
  limit: number;
  filters: Record<string, string>;
  allowedFilters: Array<string>;
}

export interface PagedEntity<T> {
  metadata:MetaData<T>;
  records:T[];
  requestDate?:Date;
}

export interface PaginatedEntity {
  key:string;
  name:string;
  api:string;
  stop?:boolean;
}

export const getDefaultMetaData = <T extends unknown>(): MetaData<T> => ({
  order: '',
  direction: 'asc',
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
  allowedFilters: [],
});

export interface ModalActionProps {
  title: string;
  body?: string | ((closePopup: () => void) => JSX.Element);
  resolveText?: string;
  resolveMessage?:string;
  rejectText?: string;
  data?: { [id: string]: any };
  className?: string;
  resolveDisabled?: boolean;
  rejectDisabled?:boolean;
  modalWidth?:string;
  texttransform?:string;
  modalType?:string;
  resolve?(): void;

  resolveWithPromise?(): Promise<void>;

  reject?(): void;

  rejectWithPromise?(): Promise<void>;
}

export interface ModalState {
  show: boolean;
  title: string;
  body: string | ((closePopup: () => void) => JSX.Element);
  className: string;
  resolveText?: string;
  resolveMessage?:string;
  rejectText?: string;
  data: { [id: string]: any };
  resolveDisabled: boolean;
  resolveWithPromise: any;
  rejectDisabled:boolean;
  rejectWithPromise: any;
  texttransform?:string;
  modalType?:string;
  resolve(): Promise<void>;

  reject(): Promise<void>;
}

export const getDefaultModalState = (): ModalState => ({
  show: false,
  title: '',
  body: '',
  className: '',
  resolveText: '',
  resolveMessage: '',
  rejectText: '',
  data: {},
  resolveDisabled: false,
  resolveWithPromise: undefined,
  rejectDisabled: false,
  rejectWithPromise: undefined,
  reject: () => Promise.reject(),
  resolve: () => Promise.resolve(),
});

export interface Option {
  id: any;
  label?: any;
  intl?: boolean;
  discription?:string;
}

export enum locale {
  ENGLISH_US = 'en-US',
  HINDI = 'hi'
}
export interface UploadedFile {
  id: number;
  name: string;
  path: string;
  mimeType:string;
}
export interface HotUploadedFile {
  id:string;
  name:string;
  uploadedFile?:UploadedFile;
  hotFile?:File;
}
