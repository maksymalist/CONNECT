//@ts-nocheck
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import config from './config.json'
import LoadingScreen from './components/LoadingScreen'
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
const client = new ApolloClient({
  uri: `${config['api-server']}/graphql`,
  cache: new InMemoryCache(),
})
const theme = createTheme({
  palette: {
    primary: {
      main: '#6c63ff',
      contrastText: '#fff',
    },
    secondary: {
      main: 'rgb(220, 0, 78)',
      contrastText: '#fff',
    },
    info: {
      main: '#29b6f6',
      contrastText: '#fff',
    },
    action: {
      main: '#6c63ff',
      contrastText: '#fff',
    },
    success: {
      main: '#1bb978',
      contrastText: '#fff',
    },
    warning: {
      main: '#FED253',
      contrastText: '#fff',
    },
    error: {
      main: '#FF2C62',
      contrastText: '#fff',
    },
  },
})
ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </ApolloProvider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
)
