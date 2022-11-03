import {BrowserRouter,Navigate,Route, Routes} from "react-router-dom";
// import {DarkModeContext} from './context/DarkModeContext';

import PrivateRoutes from "./middleware/PrivateRoutes";
import UnProtectedRoute from "./middleware/UnProtectedRoute";
import { history } from "./helpers/history"

import MainComponent from "./components"
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import ForgetPasswordPage from "./pages/Auth/ForgetPassword";
import CreatePasswordPage from "./pages/Auth/CreatePassword";
// import Success from "./pages/Auth/Success";
import Dashboard from "./pages/Dashboard";
// import SuccessPasswordChange from "./pages/Auth/SuccessPasswordChange";
import AuthLayout from "./pages/Auth/AuthLayout";

const LoginComponent = AuthLayout(LoginPage);
const SignupComponent = AuthLayout(SignupPage);
const ForgetPasswordComponent = AuthLayout(ForgetPasswordPage);
const CreatePasswordComponent = AuthLayout(CreatePasswordPage);
const DashboardComponent = AuthLayout(Dashboard);

const Routeing = () => {
  return (
    <BrowserRouter history={history}>
      <Routes>
        <Route path="/" element={<PrivateRoutes><MainComponent /></PrivateRoutes>}>
          <Route index element={<DashboardComponent />} />
        </Route>
      <Route element={<UnProtectedRoute />}>
        <Route path="/login" element={<LoginComponent />}></Route> 
        <Route path="/signup" element={<SignupComponent/>}></Route>
        <Route path="/forget-password" element={<ForgetPasswordComponent/>}></Route>
        <Route path="/forget-password/:token" element={<CreatePasswordComponent/>}></Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
  );
}

export default Routeing;
