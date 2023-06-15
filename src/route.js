import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import {DarkModeContext} from './context/DarkModeContext';
import PrivateRoutes from "./middleware/PrivateRoutes";
import UnProtectedRoute from "./middleware/UnProtectedRoute";
import { history } from "./helpers/history";
import MainComponent from "./components";
import LoginPage from "./pages/Auth/Login";
// import SignupPage from "./pages/Auth/Signup";
import ForgetPasswordPage from "./pages/Auth/ForgetPassword";
import CreatePasswordPage from "./pages/Auth/CreatePassword";
import ResetPasswordPage from "./pages/ResetPassword";
import OnboardingPage from "./pages/Onboarding";
import GettingStartedPage from "./pages/GettingStarted";
import AuthLayout from "./pages/Auth/AuthLayout";
// import InstallSuccess from "./pages/extension/InstallSuccess";
import MySetting from "./pages/mysetting/MySetting";
import FriendRequestSentVersion from "./pages/mysetting/FriendRequestSentVersion";
import BrowserManager from "./pages/mysetting/BrowserManager";
// import FriendsList from "./pages/Friends/FriendsList";
// import WhiteList from "./pages/Friends/WhiteList";
// import IncomingPendingRequest from "./pages/Friends/IncomingPendingRequest";
// import IncomingRejectedRequest from "./pages/Friends/IncomingRejectedRequest";
// import LostFriends from "./pages/Friends/LostFriends";
// import Unfriend from "./pages/Friends/Unfriend";
// import DeactivatedFriends from "./pages/Friends/DeactivatedFriends";
import TermsConditions from "./pages/TermsConditions";
import "react-toastify/dist/ReactToastify.css";
import Friends from "./pages/Friends";
// import Settings from "./pages/mysetting";
// import InactiveFriends from "./pages/Friends/InactiveFriends";
// import Message from "./pages/message";
// import SendRequest from "./pages/Friends/SendRequest";
// import BlackList from "./pages/Friends/BlackList";
// import Friends from "./components/friends";
import { alertBrodcater } from "./components/common/AlertBrodcater";

const LoginComponent = AuthLayout(LoginPage);
// const SignupComponent = AuthLayout(SignupPage);
const ForgetPasswordComponent = AuthLayout(ForgetPasswordPage);
const CreatePasswordComponent = AuthLayout(CreatePasswordPage);

const Settings = lazy(() => import('./pages/mysetting'));
const FriendsList = lazy(() => import('./pages/Friends/FriendsList'));
const WhiteList = lazy(() => import("./pages/Friends/WhiteList"));
const IncomingPendingRequest = lazy(() => import("./pages/Friends/IncomingPendingRequest"));
const IncomingRejectedRequest = lazy(() => import("./pages/Friends/IncomingRejectedRequest"));
const LostFriends = lazy(() => import("./pages/Friends/LostFriends"));
const Unfriend = lazy(() => import("./pages/Friends/Unfriend"));
const DeactivatedFriends = lazy(() => import("./pages/Friends/DeactivatedFriends"));
const SendRequest = lazy(() => import("./pages/Friends/SendRequest"));
const BlackList = lazy(() => import("./pages/Friends/BlackList"));
const InstallSuccess = lazy(() => import("./pages/extension/InstallSuccess"));

const Routeing = () => {
  alertBrodcater()
  return (
    <BrowserRouter history={history}>
      <Routes>
        <Route
          element={
            <PrivateRoutes>
              <MainComponent />
            </PrivateRoutes>
          }
        >
          <Route path="/" element={<MainComponent />}>
            <Route index element={<GettingStartedPage />} />
            <Route
              path="reset-password"
              element={<ResetPasswordPage />}
            ></Route>
            <Route path="settings" element={<Suspense fallback={"Loading Settings..."}><Settings /></Suspense>}>
              <Route path="settings" element={<MySetting />}></Route>
              <Route
                path="request-history"
                element={<FriendRequestSentVersion />}
              ></Route>
              <Route
                path="browser-manager"
                element={<BrowserManager />}
              ></Route>
            </Route>
              {/* <Route path="dmf" element={<DynamicMergeFields />}></Route> */}
            {/* <Route path="message" element={<Message />}>
            </Route> */}

            {/* <Route path="settings/my-settings" element={<MySetting />}></Route> */}
            <Route path="friends" element={<Friends />}>
              <Route path="friend-list" element={<Suspense fallback={""}><FriendsList /></Suspense>}></Route>
              <Route path="whitelisted-friends" element={<Suspense fallback={""}><WhiteList /></Suspense>}></Route>
              <Route path="blacklisted-friends" element={<Suspense fallback={""}><BlackList /></Suspense>}></Route>
              <Route
                path="incoming-pending-request"
                element={<Suspense fallback={""}><IncomingPendingRequest /></Suspense>}
              ></Route>

              <Route path="pending-request" element={<Suspense fallback={""}><SendRequest /></Suspense>}></Route>
              <Route
                path="incoming-rejected-request"
                element={<Suspense fallback={""}><IncomingRejectedRequest /></Suspense>}
              ></Route>
              <Route path="unfriended-friends" element={<Suspense fallback={""}><Unfriend /></Suspense>}></Route>
              <Route
                path="deactivated-friends"
                element={<Suspense fallback={""}><DeactivatedFriends /></Suspense>}
              ></Route>
              <Route path="lost-friends" element={<Suspense fallback={""}><LostFriends /></Suspense>}></Route>
            </Route>
            <Route path="onboarding" element={<OnboardingPage />}></Route>
          </Route>
        </Route>
        <Route element={<UnProtectedRoute />}>
          <Route path="/login" element={<LoginComponent />}></Route>
          {/* <Route path="/signup" element={<SignupComponent />}></Route> */}
          <Route
            path="/forget-password"
            element={<ForgetPasswordComponent />}
          ></Route>
          <Route
            path="/forget-password/:token"
            element={<CreatePasswordComponent />}
          ></Route>
          <Route path="/terms-conditions" element={<TermsConditions />}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/extension-success" element={<Suspense fallback={'Loading your extension...'}><InstallSuccess /></Suspense>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routeing;