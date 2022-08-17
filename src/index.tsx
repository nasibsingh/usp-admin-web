import 'core-js/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import { routerMiddleware, ConnectedRouter } from 'connected-react-router';
import sagaMiddlewareFactory from 'redux-saga';
import { HashRouter } from 'react-router-dom';
import createRootReducer from './reducers';
import { rootSaga } from './sagas';
import { fetchBaseData } from './actions';
import Screens from './screens';
import { IntlWrapper } from './components';

const history = createHashHistory();
const sagaMiddleware = sagaMiddlewareFactory();
const middlewares: Middleware[] = [sagaMiddleware, routerMiddleware(history)];

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: createRootReducer(history),
  middleware: [sagaMiddleware, routerMiddleware(history)],

});

sagaMiddleware.run(rootSaga);
store.dispatch(fetchBaseData());

function App() {
  return (

    <Provider store={store}>
      <IntlWrapper>
        <ConnectedRouter history={history}>
          <Screens />
        </ConnectedRouter>
      </IntlWrapper>

    </Provider>

  );
}

ReactDOM.render(<App />, document.getElementById('root'));
