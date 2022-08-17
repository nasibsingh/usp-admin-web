import { Action } from '../actions';
import { PagedEntity, getDefaultMetaData } from '../models';

export const createBasicReducer = <T extends unknown>(
  key:string, initialState:T,
) => (state:T = initialState, action:Action<T>):T => {
    switch (action.type) {
      case `${key}_UPDATE`: {
        const { payload } = action;
        if (typeof payload === 'object') {
          if (Array.isArray(payload)) {
            return [...payload as any] as T;
          }
          return { ...payload as any };
        }
        return payload;
      }
      case `${key}_RESET`:
        return initialState;
      default:
        return state;
    }
  };

export const createPagedReducer = <T extends unknown>(
  key:string, initialEntity:T[],
):any => {
  const initialState:PagedEntity<T> = {
    metadata: getDefaultMetaData<T>(),
    records: initialEntity,
  };
  return (
    state:PagedEntity<T> = initialState,
    action:Action<PagedEntity<T>>,
  ):PagedEntity<T> => {
    switch (action.type) {
      case `${key}_PAGINATION_UPDATE`: {
        const { payload } = action;
        return {
          metadata: { ...payload.metadata },
          records: [...payload.records],
          requestDate: new Date(),
        };
      }
      case `${key}_PAGINATION_LOAD_MORE`: {
        const { payload } = action;
        return {
          metadata: { ...payload.metadata },
          records: [...state.records, ...payload.records],
          requestDate: new Date(),
        };
      }
      case `${key}_PAGINATION_RESET`:
        return initialState;
      default:
        return state;
    }
  };
};
