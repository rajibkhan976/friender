import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import FacebookAuthApp from "./pages/FacebookAuthApp";
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
import helper from "./helpers/helper";
import { useDispatch } from "react-redux";
import { getSendFriendReqst } from "./actions/FriendsAction";

import Messages from "./pages/messages";
import FacebookAuthAppSignup from "./pages/FacebookAuthAppSignup";
import GlobalContactList from "./pages/Friends/GlobalContactList";
import NonFriendList from "./pages/Friends/NonFriendList";


const LoginComponent = AuthLayout(LoginPage);
const SignupComponent = AuthLayout(SignupPage);
const ForgetPasswordComponent = AuthLayout(ForgetPasswordPage);
const CreatePasswordComponent = AuthLayout(CreatePasswordPage);
const FacebookSignupComponent = AuthLayout(FacebookAuthAppSignup)

const Settings = lazy(() => import("./pages/mysetting"));
const FriendsList = lazy(() => import("./pages/Friends/FriendsList"));
const FriendsQueue = lazy(() => import("./pages/Friends/FriendsQueue"));
const WhiteList = lazy(() => import("./pages/Friends/WhiteList"));
const IncomingPendingRequest = lazy(() =>
	import("./pages/Friends/IncomingPendingRequest")
);
const IncomingRejectedRequest = lazy(() =>
	import("./pages/Friends/IncomingRejectedRequest")
);
const LostFriends = lazy(() => import("./pages/Friends/LostFriends"));
const Unfriend = lazy(() => import("./pages/Friends/Unfriend"));
const DeactivatedFriends = lazy(() =>
	import("./pages/Friends/DeactivatedFriends")
);
const SendRequest = lazy(() => import("./pages/Friends/SendRequest"));
const BlackList = lazy(() => import("./pages/Friends/BlackList"));
const InstallSuccess = lazy(() => import("./pages/extension/InstallSuccess"));

// Message pages
const MessageGroups = lazy(() =>
	import("./pages/messages/group/MessageGroups")
);
const MessageSegments = lazy(() =>
	import("./pages/messages/segment/MessageSegments")
);
const MessageCampaigns = lazy(() => import("./pages/messages/campaigns"));
const CreateCampaign = lazy(() =>
	import("./pages/messages/campaigns/create/CreateCampaign")
);
const EditCampaign = lazy(() =>
	import("./pages/messages/campaigns/edit/EditCampaign")
);

const MyProfile = lazy(() => 
	import("./pages/MyProfile")
)

const Routeing = () => {
	const dispatch = useDispatch();
	const deleteAllInterval = async (callback) => {
		const timeInterVal = setInterval(() => {
			let cookie = helper.getCookie("deleteAllPendingFR");
			if (cookie !== "Active") {
				callback(); //callback function calling the pending list action
				// console.log("send req api got hitted>>>>");
				clearInterval(timeInterVal);
			}
		}, 500);
	};

	/**
	 * Function to check for changes in cookies
	 */
	function checkCookieChange() {
		let currentCookies = document.cookie;
		if (
			currentCookies.includes("deleteAllPendingFR") &&
			!checkCookieChange.previousCookies.includes("deleteAllPendingFR")
		) {
			deleteAllInterval(() => {
				dispatch(
					getSendFriendReqst({
						fbUserId: localStorage.getItem("fr_default_fb"),
					})
				);
			});
			// console.log('New "DPFR" cookie added!');
		}
		// Update the previous cookies for the next check
		checkCookieChange.previousCookies = currentCookies;
		// Schedule the next check
		requestAnimationFrame(checkCookieChange);
	}
	// Initial setup
	checkCookieChange.previousCookies = document.cookie;
	checkCookieChange(); // Start checking for cookie changes
	///////////////

	alertBrodcater();
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
					<Route
						path='/'
						element={<MainComponent />}
					>
						<Route
							index
							element={<GettingStartedPage />}
						/>
						<Route
							path='reset-password'
							element={<ResetPasswordPage />}
						></Route>
						<Route
							path='settings'
							element={
								<Suspense fallback={"Loading Settings..."}>
									<Settings />
								</Suspense>
							}
						>
							<Route
								path='settings'
								element={<MySetting />}
							></Route>
							<Route
								path='request-history'
								element={<FriendRequestSentVersion />}
							></Route>
							<Route
								path='browser-manager'
								element={<BrowserManager />}
							></Route>
						</Route>
						{/* <Route path="dmf" element={<DynamicMergeFields />}></Route> */}
						<Route
							path='messages'
							element={<Messages />}
						>
							<Route
								path='groups'
								element={
									<Suspense fallback={""}>
										<MessageGroups />
									</Suspense>
								}
							/>
							<Route
								path='segments'
								element={
									<Suspense fallback={""}>
										<MessageSegments />
									</Suspense>
								}
							/>
						</Route>
						<Route
							path='campaigns'
							element={
								<Suspense fallback={""}>
									<MessageCampaigns />
								</Suspense>
							}
						>
							<Route
								path='create-campaign'
								element={
									<Suspense fallback={""}>
										<CreateCampaign />
									</Suspense>
								}
							/>
							<Route
								path='/campaigns/:campaignId'
								element={
									<Suspense fallback={""}>
										<EditCampaign />
									</Suspense>
								}
							/>
						</Route>

						<Route
							path="my-profile"
							element={
								<Suspense fallback={""}>
									<MyProfile />
								</Suspense>
							}
						/>

						{/* <Route path="settings/my-settings" element={<MySetting />}></Route> */}
						<Route
							path='friends'
							element={<Friends />}
						>
							
							<Route
								path='all-contacts'
								element={
									<Suspense fallback={""}>
										<GlobalContactList />
									</Suspense>
								}
							></Route>
							<Route
								path='friend-list'
								element={
									<Suspense fallback={""}>
										<FriendsList />
									</Suspense>
								}
							></Route>
							<Route
								path='non-friends'
								element={
									<Suspense fallback={""}>
										<NonFriendList />
									</Suspense>
								}
							></Route>
							<Route
								path='friends-queue'
								element={
									<Suspense fallback={""}>
										<FriendsQueue />
									</Suspense>
								}
							></Route>
							<Route
								path='whitelisted-friends'
								element={
									<Suspense fallback={""}>
										<WhiteList />
									</Suspense>
								}
							></Route>
							<Route
								path='blacklisted-friends'
								element={
									<Suspense fallback={""}>
										<BlackList />
									</Suspense>
								}
							></Route>
							<Route
								path='incoming-pending-request'
								element={
									<Suspense fallback={""}>
										<IncomingPendingRequest />
									</Suspense>
								}
							></Route>

							<Route
								path='pending-request'
								element={
									<Suspense fallback={""}>
										<SendRequest deleteAllInterval={deleteAllInterval} />
									</Suspense>
								}
							></Route>
							<Route
								path='incoming-rejected-request'
								element={
									<Suspense fallback={""}>
										<IncomingRejectedRequest />
									</Suspense>
								}
							></Route>
							<Route
								path='unfriended-friends'
								element={
									<Suspense fallback={""}>
										<Unfriend />
									</Suspense>
								}
							></Route>
							<Route
								path='deactivated-friends'
								element={
									<Suspense fallback={""}>
										<DeactivatedFriends />
									</Suspense>
								}
							></Route>
							<Route
								path='lost-friends'
								element={
									<Suspense fallback={""}>
										<LostFriends />
									</Suspense>
								}
							></Route>
						</Route>
						<Route
							path='onboarding'
							element={<OnboardingPage />}
						></Route>
						<Route
							path='/facebook-auth'
							element={<FacebookAuthApp />}
						></Route>
					</Route>
				</Route>
				<Route element={<UnProtectedRoute />}>
					<Route
						path='/login'
						element={<LoginComponent />}
					></Route>
					<Route path="/signup" element={<SignupComponent />}></Route>
					<Route
						path='/forget-password'
						element={<ForgetPasswordComponent />}
					></Route>
					<Route
						path='/forget-password/:token'
						element={<CreatePasswordComponent />}
					></Route>
					<Route
						path='/terms-conditions'
						element={<TermsConditions />}
					></Route>
					<Route
						path='/facebook-auth-signup'
						element={<FacebookSignupComponent />}
					></Route>
				</Route>
				<Route
					path='*'
					element={<Navigate to='/' />}
				/>
				<Route
					path='/extension-success'
					element={
						<Suspense fallback={"Loading your extension..."}>
							<InstallSuccess />
						</Suspense>
					}
				></Route>
			</Routes>
		</BrowserRouter>
	);
};

export default Routeing;
