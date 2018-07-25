import React from 'react';
import ReactDOM from 'react-dom';
import App from './AppContainer';
import './index.css';

import createHistory from 'history/createBrowserHistory';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import createSagaMiddleware from 'redux-saga';

import reducers from './ducks';
import sagas from './sagas';

import injectTapEventPlugin from 'react-tap-event-plugin';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles/';

const muiTheme = createMuiTheme({
  palette: {
    primary: { main: '#31CACC', contrastText: '#fff' },
  },
});

export const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

let composeEnhancers = compose;

if (process.env.NODE_ENV === 'development') {
  const composeWithDevToolsExtension =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  if (typeof composeWithDevToolsExtension === 'function') {
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
  <MuiThemeProvider theme={muiTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
