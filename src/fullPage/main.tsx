import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
// import { RelayEnvironment } from './relay';
// import { RelayEnvironmentProvider } from 'react-relay/hooks';
import { ChakraProvider } from '@chakra-ui/react';
import { Popup } from './pages';

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Popup />
      {/* <RelayEnvironmentProvider environment={RelayEnvironment}>
        <App />
      </RelayEnvironmentProvider> */}
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
