import React from "react";
import ReactDOM from "react-dom";
import BrowserRouter from 'react-router-dom/BrowserRouter';

import App from './router';

ReactDOM.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);