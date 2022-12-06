import {BrowserRouter,Navigate,Route, Routes} from "react-router-dom";
// import {DarkModeContext} from './context/DarkModeContext';
import PrivateRoutes from "./middleware/PrivateRoutes";
import UnProtectedRoute from "./middleware/UnProtectedRoute";
import { history } from "./helpers/history";
import MainComponent from "./components";
import LoginPage from "./pages/Auth/Login";
import SignupPage from "./pages/Auth/Signup";
import ForgetPasswordPage from "./pages/Auth/ForgetPassword";
import CreatePasswordPage from "./pages/Auth/CreatePassword";
import ResetPasswordPage from "./pages/ResetPassword";
import OnboardingPage from "./pages/Onboarding";
import GettingStartedPage from "./pages/GettingStarted";
import AuthLayout from "./pages/Auth/AuthLayout";
import InstallSuccess from "./pages/extension/InstallSuccess";
import MySetting from "./pages/mysetting/MySetting";
import FriendsList from "./pages/Friends/FriendsList";
import IncomingPendingRequest from "./pages/Friends/IncomingPendingRequest";
import IncomingRejectedRequest from "./pages/Friends/IncomingRejectedRequest";
import LostFriends from "./pages/Friends/LostFriends";
import Unfriend from "./pages/Friends/Unfriend";
import TermsConditions from "./pages/TermsConditions";
import 'react-toastify/dist/ReactToastify.css';


const LoginComponent = AuthLayout(LoginPage);
const SignupComponent = AuthLayout(SignupPage);
const ForgetPasswordComponent = AuthLayout(ForgetPasswordPage);
const CreatePasswordComponent = AuthLayout(CreatePasswordPage);

const Routeing = () => {
  return (
    <BrowserRouter history={history}>
      <Routes>
      <Route element={<PrivateRoutes><MainComponent /></PrivateRoutes>}>
          <Route path="/" element={<MainComponent />}>
            <Route index element={<GettingStartedPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />}></Route>
            <Route path="settings/my-settings" element={<MySetting/>}></Route>
            <Route path="friends/friend-list" element={<FriendsList />}></Route>
            <Route path="friends/incoming-pending-request" element={<IncomingPendingRequest />}></Route>
            <Route path="friends/incoming-rejected-request" element={<IncomingRejectedRequest />}></Route>
            <Route path="friends/lost-friends" element={<LostFriends />}></Route>
            <Route path="friends/unfriend" element={<Unfriend />}></Route>
            <Route path="onboarding" element={<OnboardingPage />}></Route>
            <Route path="extension.success" element={<InstallSuccess/>}></Route>
          </Route>
      </Route>
      <Route element={<UnProtectedRoute />}>
        <Route path="/login" element={<LoginComponent />}></Route> 
        <Route path="/signup" element={<SignupComponent/>}></Route>
        <Route path="/forget-password" element={<ForgetPasswordComponent/>}></Route>
        <Route path="/forget-password/:token" element={<CreatePasswordComponent/>}></Route>
        <Route path="/terms-conditions" element={<TermsConditions/>}></Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
      
    </Routes>
    
  </BrowserRouter>
  );
}

export default Routeing;
