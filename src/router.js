import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import EndUser from "./EndUser";
import DesignerSide from "./DesignerSide";

function App() {
  return (
    <Router basename="/ConCreate-web">
      <Switch>
        <Route exact path="/" component={EndUser} />
        <Route exact path="/designer" component={DesignerSide} />
      </Switch>
    </Router>
  ); 
};

export default App;