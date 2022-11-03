import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/index";
import { ThemeContextProvider } from './context/ThemeContext';
import './assets/scss/index.scss';
import Routeing from './route';
import reportWebVitals from './reportWebVitals';

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeContextProvider>
        <Routeing />
      </ThemeContextProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



