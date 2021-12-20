import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import { createStore } from "redux";

import rootReducer from "./reducers";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import ReactPWAInstallProvider from "react-pwa-install";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const client = new ApolloClient({
  uri: "https://connect-backend-2.herokuapp.com/graphql",
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#6c63ff",
      contrastText: "#fff",
    },
    secondary: {
      main: "rgb(220, 0, 78)",
      contrastText: "#fff",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ReactPWAInstallProvider enableLogging>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ReactPWAInstallProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
