import React from 'react';
import {
  Switch, Route, Redirect, HashRouter,
} from 'react-router-dom';
import { routes } from '../utils';
import Component from './component';
import Login from './login';
import Dashboard from './dashboard';
import { AuthenticationStatus } from '../reducers/auth';
import OnlyWith from '../components/onlyWith';

const App: React.FC = () => (
  <div id="app-router">
    <HashRouter>
      <OnlyWith status={AuthenticationStatus.AUTHENTICATED}>
        <Switch>

          <Route
            path={routes.dashboard}
            component={Dashboard}
          />
          <Route
            component={() => <Redirect to={routes.dashboard} />}
          />
        </Switch>
      </OnlyWith>
      <OnlyWith status={AuthenticationStatus.NOT_AUTHENTICATED}>
        <Switch>
          <Route
            path={routes.login}
            component={Login}
          />
          <Route
            component={() => <Redirect to={routes.login} />}
          />
        </Switch>
      </OnlyWith>
    </HashRouter>

  </div>
);

export default App;
