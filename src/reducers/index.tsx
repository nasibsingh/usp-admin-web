import { combineReducers, Reducer } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { intlReducer } from 'react-intl-redux';
import auth, { AuthState } from './auth';
import { LANGUAGE } from '../actions';
import { createBasicReducer } from './utils';
import { locale, ModalState } from '../models';
import popup from './popup';

export interface ReduxState {
  auth:AuthState;
  router:any;
  intl:any;
  language:any;
  popup:ModalState;
}

const createRootReducer = (history:History):Reducer => combineReducers<ReduxState>({
  auth,
  popup,
  /* Special reducers */
  router: connectRouter(history),
  intl: intlReducer,
  language: createBasicReducer<string>(LANGUAGE, locale.ENGLISH_US),

});
export default createRootReducer;
