import { ModalState, ModalActionProps, getDefaultModalState } from '../models';
import {
  SHOW_POPUP, UPDATE_POPUP, HIDE_POPUP, Action,
} from '../actions';

const getResolveFunction = (action: Action<ModalActionProps>) => {
  if (action.payload.resolveWithPromise) {
    return action.payload.resolveWithPromise;
  }
  const newResolve = () => action.payload.resolve && action.payload.resolve();

  return () => new Promise<void>(
    (resolve, reject) => {
      if (newResolve()) { // Falsy means success here, so truthy means rejecting
        reject();
      } else {
        resolve();
      }
    },
  );
};

const getRejectFunction = (action: Action<ModalActionProps>) => {
  if (action.payload.rejectWithPromise) {
    return action.payload.rejectWithPromise;
  }
  const newReject = () => action.payload.reject && action.payload.reject();

  return () => new Promise<void>(
    (resolve, reject) => {
      if (newReject()) { // Falsy means success here, so truthy means rejecting
        reject();
      } else {
        resolve();
      }
    },
  );
};

export default (
  state: ModalState = getDefaultModalState(),
  action: Action<ModalActionProps>,
): ModalState => {
  switch (action.type) {
    case SHOW_POPUP: {
      const resolveFunc = getResolveFunction(action);
      const rejectFunc = getRejectFunction(action);
      // Get new state, just in case moving from one popup to another
      return {
        ...getDefaultModalState(),
        ...action.payload,
        show: true,
        resolve: resolveFunc,
        reject: rejectFunc,
      };
    }
    case UPDATE_POPUP: {
      const resolveFunc = getResolveFunction(action);
      const rejectFunc = getRejectFunction(action);
      return {
        ...state,
        ...action.payload,
        resolve: resolveFunc,
        reject: rejectFunc,
      };
    }
    case HIDE_POPUP:
      return getDefaultModalState();
    default:
      return state;
  }
};
