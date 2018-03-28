import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';
import 'react-dates/lib/css/_datepicker.css';

import ConfigureStore from './store/configureStore';
import AppRouter, { history } from './routers/AppRouter';
import { login, logout } from './actions/auth';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import './styles/styles.scss';

const store = ConfigureStore();
let hasRendered = false;

const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch(login(user.uid));
    renderApp();
    if (history.location.pathname === '/') {
      history.push('/dashboard');
    }
  } else {
    store.dispatch(logout());
    renderApp();
    history.push('/');
  }
});
