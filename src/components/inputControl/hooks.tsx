import React, { useReducer } from 'react';
import { validateValue, Validator } from './validators';

export const UPDATE_FORM = 'UPDATE_FORM';
export const VALIDATE_FORM = 'VALIDATE_FORM';
export const RESET_FORM = 'RESET_FORM';
export const REMOVE_PRISTINE = 'REMOVE_PRISTINE';
export const START_SUBMITTING = 'START_SUBMITTING';
export const STOP_SUBMITTING = 'STOP_SUBMITTING';
export const UPDATE_SUBMIT_ERROR = 'UPDATE_SUBMIT_ERROR';

interface FormValue{
    value?:any;
    error?:string;
}

interface FormState{
    pristine: boolean;
    submitting:boolean;
    hasError:boolean;
    submitError?:string;
    formValues:Record<string, FormValue>
}

interface FormPayload{
    key:string;
    value?:any;
    error?:string;
    onChange?:any;
}

interface FormAction{
    type:string;
    payload?:FormPayload;
}

type FormReducer = (state:FormState, action:FormAction)=>FormState;
type FormSubmitCallBack = (formValues:Record<string, FormValue>)=>Promise<any>;

interface FormHook extends FormState{
    change:(key:string, value:any)=>void;
    reset:()=>void;
    dirty:()=>void;
    setSubmitError:(error?:string)=>void;
    handleSubmit:(callback?:FormSubmitCallBack)=>any;
    connectField:(name:string, extraProps?:Record<any, any>)=>(Field:any)=>any;
}

export const createFormReducer = (
  validators:Record<string, Validator[]> = {},
  initialValues:Record<string, any> = {},
):{
      reducer:FormReducer,
      initialState:FormState
    } => {
  let formValues:Record<string, FormValue> = {};

  Object.keys(initialValues).forEach((key) => {
    formValues = { ...formValues, [key]: { value: initialValues[key] } };
  });

  Object.keys(validators).forEach((key) => {
    const error = validateValue(key, formValues[key], { ...formValues }, validators?.[key]);
    formValues = { ...formValues, [key]: { value: formValues[key]?.value, error } };
  });

  const initialState:FormState = {
    pristine: true,
    submitting: false,
    formValues: { ...formValues },
    hasError: (Object.keys(formValues)
      .filter((key) => !!formValues[key].error).length > 0),
  };

  const reducer = (state:FormState = initialState, action:FormAction) => {
    switch (action.type) {
      case UPDATE_FORM: {
        if (!action?.payload) return state;
        const { key, value, error: customError } = action.payload;
        let newValue = value;

        if (value === '') {
          newValue = null;
        }
        let error = validateValue(key, newValue, { ...state.formValues }, validators?.[key]);

        if (customError) {
          error = customError;
        }
        const newFormValues:Record<string, FormValue> = {
          ...state.formValues,
          [key]: { value: newValue, error },
        };
        const hasError = (Object.keys(newFormValues)
          .filter((k) => !!(newFormValues[k].error)).length > 0);
        return {
          ...state,
          formValues: { ...newFormValues },
          hasError,
          submitError: undefined,
        };
      }
      case VALIDATE_FORM: {
        let newFormValues:Record<string, FormValue> = { ...state.formValues };

        Object.keys(validators).forEach((key) => {
          const value = state.formValues[key]?.value;
          const error = validateValue(key, value, { ...state.formValues }, validators?.[key]);
          newFormValues = { ...newFormValues, [key]: { value, error } };
        });
        const hasError = Object.keys(newFormValues)
          .filter((key) => !!newFormValues[key].error).length > 0;

        return {
          ...state,
          formValues: { ...newFormValues },
          hasError,
        };
      }
      case UPDATE_SUBMIT_ERROR: {
        if (!action?.payload) return state;
        const { error: submitError } = action.payload;

        return { ...state, submitError };
      }
      case REMOVE_PRISTINE:
        return { ...state, pristine: false };
      case START_SUBMITTING:
        return { ...state, submitting: true };
      case STOP_SUBMITTING:
        return { ...state, submitting: false };
      case RESET_FORM:
        return initialState;
      default:
        return state;
    }
  };
  return { reducer, initialState };
};

export const userFormReducer = (
  validators:Record<string, Validator[]> = {},
  initialValues:Record<string, any> = {},
  onChange?:(changed:Record<string, any>, extraParams:any)=>void,
):FormHook => {
  const { reducer, initialState } = createFormReducer(validators, initialValues);

  const [state, dispatch] = useReducer(reducer, initialState);

  const validateForm = () => {
    dispatch({ type: VALIDATE_FORM });
  };

  const change = (key:string, value:any) => {
    dispatch({ type: UPDATE_FORM, payload: { key, value } });
    setTimeout(() => {
      validateForm();
    }, 7);
  };

  const reset = () => {
    dispatch({ type: RESET_FORM });
  };

  const dirty = () => {
    dispatch({ type: REMOVE_PRISTINE });
  };

  const startSubmitting = () => {
    dispatch({ type: START_SUBMITTING });
  };

  const stopSubmitting = () => {
    dispatch({ type: STOP_SUBMITTING });
  };

  const setSubmitError = (error?:string) => {
    dispatch({
      type: UPDATE_SUBMIT_ERROR,
      payload: { key: 'submitError', error },
    });
  };

  const handleSubmit = (callback:FormSubmitCallBack) => async (event:any) => {
    /* eslint-disable no-unused-expressions */
    event?.preventDefault();
    dirty();
    if (!!callback && !state.hasError && !state.submitting) {
      startSubmitting();
      const data = Object.keys(state.formValues)
        .reduce((acc, key) => ({ ...acc, [key]: state.formValues[key].value }), {});
      await callback(data);
      stopSubmitting();
    } else {
      stopSubmitting();
    }
  };

  const handleChange = (value: any) => {
    if (onChange) {
      const data = Object.keys(state.formValues)
        .reduce((acc, key) => ({ ...acc, [key]: state.formValues[key].value }), {});
      onChange(value, {
        change,
        values: { ...data, ...value },
      });
    }
  };

  const connectField = (name:string, extraProps:Record<any, any> = {}) => function(Field:any) {
  return <Field
      {...extraProps}
      name={name}
      key={name}
      value={state.formValues?.[name]?.value}
      error={!state.pristine && state.formValues?.[name]?.error}
      onChange={(value:any) => {
        change(name, value);
        handleChange({ [name]: value });
      }}
    />
};

  return {
    ...state, change, reset, dirty, handleSubmit, setSubmitError, connectField,
  };
};
