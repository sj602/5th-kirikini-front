import React, { useEffect } from 'react';
import AppNavigator from './src/screens';
import configureStore from './src/store/configureStore';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://80f39517da28453699f627d33362527a@sentry.io/1872780'
});

const store = configureStore();

const App = props => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
