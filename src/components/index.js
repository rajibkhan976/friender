
import { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoaderContext } from "../context/PageLoaderContext";
import { ModeContext } from "../context/ThemeContext";
import PageLoader from "../components/common/loaders/PageLoader";
import { ToastContainer } from "react-toastify";
import { fetchUserProfile } from "../services/authentication/facebookData";
import { ReactComponent as FriendQueueErrorIcon } from "../assets/images/FriendQueueErrorIcon.svg";
import PlanModal from "./common/PlanModal";
import { kyubiUserCheck, alertUserStatusUpdate } from "../services/authentication/AuthServices";
import {
	setProfileSpaces,
	setDefaultProfileId,
} from '../actions/ProfilespaceActions';
import { userLogout } from '../actions/AuthAction';
import { getUserSyncData } from "../actions/FriendsAction";
import Alertbox from "./common/Toast";


const Sidebar = lazy(() => import("./common/Sidebar"));
const PageHeader = lazy(() => import("./common/PageHeader"));
const Footer = lazy(() => import("./common/Footer"));



const MainComponent = () => {
	const dispatch = useDispatch();
	const [showFriendsQueueErr, setShowFriendsQueueErr] = useState(false);
	const [showErrorReallyOff, setShowErrorReallyOff] = useState(false)
	const friendsQueueErrorCount = useRef(0);
	const navigate = useNavigate();
	const location = useLocation();
	const { darkMode, toggleDarkMode } = useContext(ModeContext);
	const { pageLoaderMode, switchLoaderOn, switchLoaderOff } =
		useContext(LoaderContext);
	const [isSynced, setIsSynced] = useState(false);
	//const [isHeader, setIsHeader] = useState(false);
	const planModal = useSelector((state) => state.plan.showModal);
	const [fbAuthInfo, setFBAuthInfo] = useState(null)
	const ssList_data = useSelector((state) => state.ssList.ssList_data);
	const [alertUserStatusCheck, setAlertUserStatusCheck] = useState(null);
	const [signoutOnProcess, setSignoutOnProcess] = useState(false);

	const friendsQueueRecords = useSelector(
		(state) => state.friendsQueue.friendsQueueRecords
	);

	// const friendsQueueErrorRecordsCount = useSelector((state) => state.friendsQueue.friendsQueueErrorRecordsCount);
	const friendsQueueErrorRecordsCount = useSelector((state) => state.ssList.friendsQueueErrorRecordsCount)

	const showHeader = () => {
		if (
			location.pathname == "/" ||
			location.pathname == "/onboarding" ||
			location.pathname == "/reset-password" ||
			location.pathname == "/extension-success"
		) {
			return false;
		} else {
			return true;
		}
	};


	/**
	 * Logout Function
	 */
	const handleSignoutFunc = async () => {
		setSignoutOnProcess(true);
		try {
			await alertUserStatusUpdate();

			// Logout here..
			dispatch(setDefaultProfileId(""));
			dispatch(setProfileSpaces([]));
			dispatch(userLogout());
			if (!darkMode) {
				toggleDarkMode();
			}

			setSignoutOnProcess(false);

		} catch (error) {
			console.log('ERROR HERE -- ', error);
		}
	};


	// #region Kyubi User Check
	// Calling Kyubi Server to Check User's Status..
	useEffect(() => {
		const myExtensionId = process.env.REACT_APP_KYUBI_EXTENSION_ID;
		const currentEmail = localStorage.getItem('fr_default_email');

		// console.log('SUSPENSION FUNCTION');

		(async () => {
			if (myExtensionId && currentEmail) {
				const kyubiUserCheckAPiResponse = await kyubiUserCheck(myExtensionId, currentEmail);

				if (kyubiUserCheckAPiResponse?.status === false) {
					dispatch(setDefaultProfileId(""));
					dispatch(setProfileSpaces([]));
					dispatch(userLogout());
					if (!darkMode) {
						toggleDarkMode();
					}
				}
			}
		})();
	}, [navigate, dispatch, toggleDarkMode, darkMode]);


	// #region User Alert Check
	useEffect(() => {
		(async () => {
			try {
				const userProfile = await fetchUserProfile();

				const alertUserStatus = {
					alert_message: userProfile[0]?.alert_message,
					alert_status: userProfile[0]?.alert_message_status,
				};

				setAlertUserStatusCheck(alertUserStatus);

			} catch(error) {
				console.log('User Profile Error -- ', error);
			}
		})();
	}, [navigate]);


	useEffect(() => {
		switchLoaderOn();
		const fetchUserData = async () => {
			try {
				let password_reset_status = localStorage.getItem("fr_pass_changed");
				let user_onbording_status = localStorage.getItem("fr_onboarding");
				let isSignupUser = localStorage.getItem("fr_signup");

				// console.log("in index isSignupUser", isSignupUser);

				const userProfile = await fetchUserProfile();
				// console.log("user info index",userProfile)
				let fbAuthValidation = userProfile[0]?.fb_auth_info;

				if (fbAuthValidation != undefined && user_onbording_status == 1) {
					localStorage.setItem(
						"fr_facebook_auth",
						JSON.stringify(fbAuthValidation)
					);

					setFBAuthInfo(JSON.stringify(fbAuthValidation))
				}

				// console.log("****** user profile",userProfile,user_onbording_status,fbAuthValidation)
				if (fbAuthValidation == undefined) {
					console.log("1");
					localStorage.removeItem("fr_facebook_auth");
					navigate("/facebook-auth");

					setFBAuthInfo(null)
					// facebook auth : true && reset password  : false = go to reset password
				} else if (
					fbAuthValidation != undefined &&
					password_reset_status != 1
				) {
					console.log("2");
					localStorage.setItem(
						"fr_facebook_auth",
						JSON.stringify(fbAuthValidation)
					);

					setFBAuthInfo(JSON.stringify(fbAuthValidation))

					navigate("/reset-password");
					// facebook auth : true && user onboarding : false =  go back to facebook auth
				} else if (
					fbAuthValidation != undefined &&
					user_onbording_status != 1
				) {
					console.log("3");
					localStorage.removeItem("fr_facebook_auth");
					setFBAuthInfo(null)
					navigate("/facebook-auth");
				} else {
					// facebook auth : true && reset password : true && onboarding : true = getting started
					// console.log("4")
					// navigate("/getting-started")
				}
				onPageLoad();

				// if((fbAuthValidation == undefined || fbAuthValidation!=undefined) &&  password_reset_status== 1 && user_onbording_status == "0"){
				//   navigate("/")
				// }

				// console.log('fbAuthValidation >>>>>', userProfile[0]?.fb_user_id);
				if (userProfile[0]?.fb_user_id) {
					// console.log('userProfile', userProfile[0]?.fb_user_id);
					dispatch(getUserSyncData(userProfile[0]?.fb_user_id))
				}
			} catch (error) {
				console.error("Error fetching data:", error);
				// Alertbox(
				// 	{error},
				// 	"error",
				// 	1000,
				// 	"bottom-right"
				// );
			}
		};

		fetchUserData();

		// console.log("*******************user_onboarding_status",user_onbording_status)

		// if (password_reset_status != 1) {
		//   navigate("/reset-password");
		// } else {
		//   if (user_onbording_status != 1) {
		//     navigate("/onboarding");
		//   }
		// }

		const onPageLoad = () => {
			switchLoaderOff();
		};


		if (document.readyState === "complete") {
			// onPageLoad();
		} else {
			window.addEventListener("load", onPageLoad);
			return () => window.removeEventListener("load", onPageLoad);
		}
	}, []);

	useEffect(() => {
		console.log(friendsQueueRecords, friendsQueueErrorRecordsCount);
		if (friendsQueueRecords) {
			// console.log(friendsQueueRecords);
			// let count = 0;
			// friendsQueueRecords.forEach((item) => {
			// 	if (item && item?.status === 0 && item?.is_active === true) {
			// 		count++;
			// 	}
			// });
			friendsQueueErrorCount.current = friendsQueueErrorRecordsCount;
			if (friendsQueueErrorRecordsCount > 0) {
				setShowFriendsQueueErr(true);
			}

			if (friendsQueueErrorRecordsCount === 0 || showErrorReallyOff) {
				setShowFriendsQueueErr(false);
			}
		}
	}, [friendsQueueRecords, friendsQueueErrorRecordsCount]);

	useEffect(() => {
		if (ssList_data?.length > 0 && location?.pathname.includes("friends-queue")) {
			if (friendsQueueErrorRecordsCount > 0) {
				setShowFriendsQueueErr(true);
			}

			if (friendsQueueErrorRecordsCount === 0 || showErrorReallyOff) {
				setShowFriendsQueueErr(false);
			}
		}
	}, [ssList_data, friendsQueueErrorRecordsCount])

	useEffect(() => {
		if (location.pathname.split('/').includes("friends-queue")) {
			setShowErrorReallyOff(false)
		}
	}, [location.pathname])

	return (
		<main
			className={
				darkMode
					? `main theme-default ${location.pathname == "/extension-success" ? "success-page" : ""
					}`
					: `main theme-light ${location.pathname == "/extension-success" ? "success-page" : ""
					}`
			}
		>
			{showFriendsQueueErr && location?.pathname?.includes("friends-queue") && !showErrorReallyOff &&
				alertUserStatusCheck && alertUserStatusCheck?.alert_status === 0 && (
					<div className='friend-queue-error-report'>
						<div className='friend-queue-error-txt'>
							<FriendQueueErrorIcon className='friend-queue-error-icon' />
							{`Sending friend requests to ${friendsQueueErrorRecordsCount ? friendsQueueErrorRecordsCount : 0} individual(s) was unsuccessful either due to an
					unknown error from Facebook or they already exists in the friend/pending list.`}
						</div>
						<button
							className='friend-queue-error-close-btn'
							type='button'
							onClick={() => {
								setShowErrorReallyOff(true)
								setShowFriendsQueueErr(false)
							}}
						>
							Close
						</button>
					</div>
				)}

			{alertUserStatusCheck && alertUserStatusCheck?.alert_status === 1 && (
				<div className="friend-queue-error-report user-alert-status-bg">
					<div className="friend-queue-error-txt user-alert-status-txt">
						<FriendQueueErrorIcon className="friend-queue-error-icon" />
						<span
							dangerouslySetInnerHTML={{ __html: alertUserStatusCheck?.alert_message }}
						></span>
					</div>

					<button
						className="friend-queue-error-close-btn user-alert-signout-btn"
						type="button"
						onClick={handleSignoutFunc}
						disabled={signoutOnProcess}
					>
						{signoutOnProcess ? "Signing out..." : "Sign out"}
					</button>
				</div>
			)}
			<ToastContainer />
			<div className={`main-wrapper ${(showFriendsQueueErr && location?.pathname?.includes("friends-queue")) && !showErrorReallyOff ? 'showingQueue' : ''}`}>
				<div className='body-content-wraper'>
					<Suspense fallback={""}>
						<Sidebar
							isSynced={isSynced}
							fbAuthInfo={fbAuthInfo}
						/>
					</Suspense>
					<div className='main-content rightside-content d-flex'>
						{showHeader() && (
							<Suspense fallback={""}>
								<PageHeader />
							</Suspense>
						)}
						<Outlet context={{ isSynced, setIsSynced }} />
					</div>
				</div>
				<Suspense fallback={""}>
					<Footer />
				</Suspense>
			</div>
			{pageLoaderMode ? <PageLoader /> : ""}
			{planModal && <PlanModal />}
		</main>
	);
};

export default MainComponent;
