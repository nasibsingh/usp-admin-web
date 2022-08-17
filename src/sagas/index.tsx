/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable func-names */
/* eslint no-underscore-dangle: [2, { "allow": ["_requestDate"] }] */
import { call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { push } from 'connected-react-router';
import {
  apiCall,
  ping,
  login,
} from '../api';
import {
  APICALL,
  SetLocale,
  ApiCall,
  updateToken,
  action,
  PAGINATED_APICALL,
  PagedApiCall,
  createBasicActions,
  SET_LOCALE,
  LANGUAGE, LOGIN,
} from '../actions';
import {
  defaultAuthState, getStateFromToken, getToken, Role,
  Right,
} from '../reducers/auth';
import { HttpStatus, routes } from '../utils';
import { MetaData } from '../models';

declare type callback = (body: any) => any;
declare type errorHandler = (body: any, response: Response) => any;
export const setLanguageAction = createBasicActions<any>(LANGUAGE);
export function* handleResponse(
  response: Response,
  callback: callback,
  error?: errorHandler,
  ignoreStatus = false,
): any {
  try {
    if (response.status === HttpStatus.Ok) {
      const body = yield response.json();
      const authToken = response?.headers
        ?.get('Authorization')
        ?.split('Bearer ')[1];
      if (authToken) {
        yield put(updateToken(authToken));
      }
      const callbackResult = callback(body);
      if (callbackResult) {
        yield* callbackResult;
      }
    } else if (
      !ignoreStatus
      && (response.status === HttpStatus.Forbidden
        || response.status === HttpStatus.Unauthorized)
    ) {
      /** @Note
       * Logout user ,Usually we take this path,
       * but sometimes we want to ignore 403's,
       * especially when logging in
       * */
      // yield put(logout());
    } else if (error) {
      const body = yield response.json();
      const callbackResult = error(body, response);
      if (callbackResult) {
        yield* callbackResult;
      }
    }
  } catch (e) {
    if (error) {
      const callbackResult = error(e, response);
      if (callbackResult) {
        yield* callbackResult;
      }
    }
  }
}

function* doFetchBaseData() {
  if (getToken()) {
    const result: any = yield call(ping);
    yield* handleResponse(
      result,
      function* () {},
      function* () {
        // yield put(logout());
      },
      true,
    );
  } else {
    // yield put(logout());
  }
}

function* updateLocale(event: SetLocale) {
  const locale = event.payload;
  if (locale) {
    yield put(setLanguageAction.update(locale));
  }
}

function toArray<T>(param: T | T[] | void) {
  if (param) {
    return param instanceof Array ? param.filter((p) => !!p) : [param];
  }

  return [];
}

function* doApiCall<
  RequestProps,
  SuccessProps extends { _requestDate: Date },
  FailureProps extends Response
>(event: { payload: ApiCall<RequestProps, SuccessProps, FailureProps> }) {
  const {
    request: {
      requestProps: { payload, method, isFormData },
    },
    success,
    failure,
  } = event.payload;

  const {
    request: {
      requestProps: { endpoint },
    },
  } = event.payload;
  const date = new Date();

  try {
    const result: any = yield call(apiCall, endpoint, method, payload, isFormData);
    yield* handleResponse(
      result,
      function* (body: SuccessProps) {
        const newBody = body;
        if (body) {
          newBody._requestDate = date;
        }
        if (success.resolve) {
          const actions = toArray(success.resolve(newBody));
          yield* actions.map((act) => put(act));
        }
      },
      function* (body: FailureProps): any {
        if (failure.reject) {
          const actions = toArray(failure.reject(body));
          yield* actions.map((act) => put(act));
        }
      },
    );
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
}

export function getPaginationParameters(filter: MetaData<any>): string {
  const {
    order, direction, page, limit, filters,
  } = filter;
  const simpleParams = {
    order,
    direction,
    page,
    limit,
  };

  let filterParams: string[] = [];

  Object.keys(filters).forEach((key) => {
    filterParams = filterParams.concat(
      filters[key] ? [`filter[${key}]=${filters[key]}`] : [],
    );
  });

  return Object.keys(simpleParams)
    .map((key: keyof typeof simpleParams) => (simpleParams[key] ? `${key}=${String(simpleParams[key])}` : ''))
    .concat(filterParams)
    .filter((value) => value)
    .join('&');
}

function* doPaginatedApiCall<
  MetaDataProps,
  SuccessProps,
  FailureProps extends Response
>(event: { payload: PagedApiCall<MetaDataProps> }) {
  const {
    request: { endpoint, filter, loadMore: isLoadMore },
    update,
    loadMore,
  } = event.payload;
  const finalEndpoint = `${endpoint}?${getPaginationParameters(filter)}`;
  try {
    const result: any = yield call(apiCall, finalEndpoint);
    yield* handleResponse(result, function* (body: SuccessProps) {
      if (isLoadMore) {
        yield put(action(loadMore.action, body));
      } else {
        yield put(action(update.action, body));
      }
    });
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
  }
}
export function* doLogin(event: any) {
  try {
    const result = yield call(login, event.payload.formData);
    yield* handleResponse(
      result,
      function* (body) {
        const newState = getStateFromToken(defaultAuthState, body?.token);
        if (newState?.role === Role.INVALID) {
          yield event.payload.reject({ message: 'Invalid Credentials' });
        } else {
          yield put(updateToken(body?.token));
          yield event.payload.resolve(body);
        }
      },
      function* (body) {
        yield event.payload.reject(body);
      },
      true,
    );
  } catch (e) {
    event.payload.reject(e);
  }
}
export function* rootSaga(): SagaIterator<void> {
  yield takeEvery(SET_LOCALE, updateLocale);
  yield takeEvery(APICALL, doApiCall as any);
  yield takeEvery(LOGIN, doLogin);
  yield takeEvery(PAGINATED_APICALL, doPaginatedApiCall as any);
}
