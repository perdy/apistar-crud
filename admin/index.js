import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";

import createHistory from "history/createBrowserHistory";
import { connectRouter, routerMiddleware } from "connected-react-router";

import createSagaMiddleware from "redux-saga";

import injectTapEventPlugin from "react-tap-event-plugin";

import App from "./App";
import "semantic-ui-css/semantic.min.css";
import "./index.css";
import reducers from "./ducks";
import sagas from "./sagas";

const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;

if (process.env.NODE_ENV === "development") {
  const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (typeof composeWithDevToolsExtension === "function") {
    composeEnhancers = composeWithDevToolsExtension;
  }
}

const store = createStore(
  connectRouter(history)(reducers),
  composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware))
);

sagaMiddleware.run(sagas);

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById("root")
);
