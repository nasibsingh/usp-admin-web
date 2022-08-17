import React from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Form, Alert } from 'react-bootstrap';
import md5 from 'md5';
import {
  TextField,
  Button,
  userFormReducer,
  required,
  emailValidator,
} from '../components';
import { login } from '../actions';


const validators = {
  email: [required('login.error.email'), emailValidator],
  password: [required('login.error.password')],
};

const Login: React.FC = ({
}) => {
  const reduxDispatch = useDispatch();
  const {
    submitting,
    submitError,
    handleSubmit,
    connectField,
    setSubmitError,
  } = userFormReducer(validators);

  const onSubmit = (data: any) => (
    new Promise<any>((resolve, reject) => {
      reduxDispatch(login({
        email: data.email,
        password: md5(data.password),
      }, resolve, reject));
    }).then(() => {

    }).catch((error) => {
      setSubmitError(error?.message);
    }));
  return (
    <div className="login">
      <div className="login__left">
        <img src="assets/images/left.png" />
      </div>
      <div className="login__right">
        <img src="assets/images/logo.svg" />

        <Form className="login__login-form" onSubmit={handleSubmit(onSubmit)}>
          <FormattedMessage id="login.heading">
            {(txt) => <h5 className="login__login-form-heading">{txt}</h5>}
          </FormattedMessage>

          {connectField('email', {
            label: 'Email',
            placeholder: 'Enter email',
            name: 'Email',
          })(TextField)}

          {connectField('password', {
            label: 'Password',
            placeholder: 'Enter password',
            name: 'password',
            type: 'password',
          })(TextField)}

          <Button
            type="submit"
            isLoading={submitting}
            className="mt-2 full-width"
            text="Submit"
          />
          {submitError && (
            <Alert variant="danger" className="mt-3 text-center">
              <FormattedMessage id={submitError} />
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Login;

