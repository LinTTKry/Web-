import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import store from './redux/store'
import {Provider} from 'react-redux'
import {persistor} from './redux/store'
import {PersistGate} from 'redux-persist/lib/integration/react';


ReactDOM.render(
  <Provider store = {store}>
    <PersistGate loading={null} persistor={persistor}>
                <App></App>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

