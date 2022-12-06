import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
// import {createStore, applyMiddleware, compose} from "redux";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers/index";
import { store } from './app/store';
import { ThemeContextProvider } from './context/ThemeContext';
import { LoaderContextProvider } from './context/PageLoaderContext'
import './assets/scss/index.scss';
import Routeing from './route';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import {frInstance} from "./configuration/fr-instance";
import './index.css';
axios.interceptors.request.use(frInstance.authorizerInterceptor);
frInstance.disableProdConsole();

// const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <ThemeContextProvider>
      {/* <ToastContainer /> */}
        <LoaderContextProvider>
      <Routeing />    
     
        </LoaderContextProvider>
      </ThemeContextProvider>
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



