import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
/*
  Router and Route can get you between different url's
  To set an error on ALL, you need '*'
  But to ommit Error from our paths in Route, we need Switch
  Switch renders FIRST one that is possible
*/

function App() {
  return (
    <AuthWrapper>
      <Router>
        <Switch>
          <PrivateRoute path="/" exact={true}>
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>

          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
