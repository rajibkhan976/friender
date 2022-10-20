import React from 'react';
import {BrowserRouter,Route, Routes} from "react-router-dom";
// import {DarkModeContext} from './context/DarkModeContext';
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import ForgetPasswordPage from "./pages/Auth/ForgetPassword";
import CreatePasswordPage from "./pages/Auth/CreatePassword";
import Success from "./pages/Auth/Success";
import SuccessPasswordChange from "./pages/Auth/SuccessPasswordChange";
import AuthLayout from "./pages/Auth/AuthLayout";

const LoginComponent = AuthLayout(LoginPage);
const SignupComponent = AuthLayout(SignupPage);
const ForgetPasswordComponent = AuthLayout(ForgetPasswordPage);
const SuccessComponent = AuthLayout(Success);
const SuccessPasswordComponent = AuthLayout(SuccessPasswordChange);
const CreatePasswordComponent = AuthLayout(CreatePasswordPage);

const Routeing = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginComponent />}>
          </Route> 
          <Route path="/signup" element={<SignupComponent/>}>
            </Route>
          <Route path="/forget-password" element={<ForgetPasswordComponent/>}>
          </Route>
          <Route path="/success" element={<SuccessComponent/>}>
          </Route>
          <Route path="/success-password-change" element={<SuccessPasswordComponent/>}>
          </Route>
          <Route path="/create-password" element={<CreatePasswordComponent/>}>
          </Route> 
        </Routes>
      </BrowserRouter>
  );
}

export default Routeing;
