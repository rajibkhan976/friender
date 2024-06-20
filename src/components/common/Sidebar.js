import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//import Themewitch from "../common/Themeswitch";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import SidebarPopUp from "./SidebarPopUp";
import logoClosed from "../../assets/images/fab-icon.png";
import ProfilePhoto from "../../assets/images/profilePhoto.png";
import logoDefault from "../../assets/images/logo_sidebar.png";
import logoLight from "../../assets/images/logoL.png";
import { ModeContext } from "../../context/ThemeContext";
import { userLogout } from "../../actions/AuthAction";
import { asyncLocalStorage } from "../../helpers/AsyncLocalStorage";
import useComponentVisible from "../../helpers/useComponentVisible";
import { crealFilter, removeSelectedFriends } from "../../actions/FriendListAction";
import { SidebarIcon, SettingIcon, HomeIcon, FriendIcon, LogoutIcon, OpenInNewTab, NavMessageIcon, WorldIcon, CampaignQuicActionIcon } from "../../assets/icons/Icons";
import {
  setProfileSpaces,
  setDefaultProfileId,
} from "../../actions/ProfilespaceActions";
import { store } from "../../app/store";
import "../../assets/scss/component/common/_sidebar.scss"







const Sidebar = (props) => {
  const { clickedRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(ModeContext);
  const navigate = useNavigate();
  const [sidebarToogle, setSidebarToogle] = useState(true);
  const [subMenuFriends, setSubMenuFriends] = useState(true);
  const [subMenuMessage, setSubMenuMessage] = useState(true);
  // const [profiles, setProfiles] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const resetpassword_token = parseInt(localStorage.getItem("fr_onboarding"));
  const onboarding_token = parseInt(localStorage.getItem("fr_pass_changed"));
  const menu_status_refresh = parseInt(localStorage.getItem("submenu_status"));
  const facebookAuthInfoStatus = JSON.parse(localStorage.getItem("fr_facebook_auth"));


  // console.log("()()()()()f acebook auth info",facebookAuthInfoStatus?.accessToken)

  const [sidebarOpenFriends, setSidebarOpenFriends] = useState(false);
  const profiles = useSelector((state) => state.profilespace.profiles);
  const [token, setToken] = useState(localStorage.getItem('fr_token'))

  const defaultProfileId = useSelector(
    (state) => state.profilespace.defaultProfileId
  );



  useEffect(() => {
    // alert("a")
    getProfileData();
  }, []);


  const dispatch = useDispatch();



  useEffect(()=>{
    // alert("b")
    // setAuthenticated(false)
    const resetpassword_status = parseInt(localStorage.getItem("fr_pass_changed"));
    const onboarding_status = parseInt(localStorage.getItem("fr_onboarding"));
    const menu_refresh_status = parseInt(localStorage.getItem("submenu_status"));
    const facebookAuthInfo = JSON.parse(localStorage.getItem("fr_facebook_auth"));



  if (resetpassword_status === 1 && onboarding_status === 1 && facebookAuthInfo?.accessToken!=undefined && facebookAuthInfo?.accessToken){
    // console.log("authenticated after synced:::::::::::::::>>>>>>>>>")
    // console.log("Authentication is off and now the sidebar can access the menu buttons on screeen.2")
    setAuthenticated(true);
  }else{
    setAuthenticated(false)
  }
  if (menu_refresh_status === 1) {
    setSidebarOpenFriends(true);
  } else {
    setSidebarOpenFriends(false);
  }

  }, [props.isSynced])

  useEffect(() => {
    // alert("c")

    (async () => {
      const resetpassword_status = parseInt(localStorage.getItem("fr_pass_changed"));
      const onboarding_status = parseInt(localStorage.getItem("fr_onboarding"));
      const menu_refresh_status = parseInt(localStorage.getItem("submenu_status"));
      const facebookAuthInfo = JSON.parse(localStorage.getItem("fr_facebook_auth"));



  if (resetpassword_status === 1 && onboarding_status === 1 && facebookAuthInfo?.accessToken!=undefined && facebookAuthInfo?.accessToken){
    // console.log("authenticated after synced:::::::::::::::>>>>>>>>>")
    // console.log("Authentication is off and now the sidebar can access the menu buttons on screeen. --1")
    setAuthenticated(true);
  }else{
    setAuthenticated(false)
  }
    })()
  }, [localStorage.getItem("fr_facebook_auth") || localStorage.getItem("fr_pass_changed") || localStorage.getItem("fr_onboarding")]);

  useEffect(() => {
    const toggle = asyncLocalStorage.getItem("fr_sidebarToogle");
    toggle.then((res) => {
      if (res) {
        setSidebarToogle(JSON.parse(res.toLowerCase()));
      }
    });
  }, []);

  const closePopupFn = (e) => {
    setIsComponentVisible(false);
  };

  const setShowProfileFn = (e) => {
    // console.log('clicked', facebookAuthInfoStatus);
    // setShowProfile((current) => profiles?.length > 0 ? !current : false)
	getProfileData();
    setIsComponentVisible((current) => !current);
    setSubMenuFriends(false);
  };
  // const checkIfNotFriends = () => {
  //   return location.pathname.split("/")[location.pathname.split("/").length - 1] ===
  //     "friend-list" ||
  //   location.pathname.split("/")[location.pathname.split("/").length - 1] ===
  //     "unfriended-friends" ||
  //   location.pathname.split("/")[location.pathname.split("/").length - 1] ===
  //     "whitelisted-friends" ||
  //   location.pathname.split("/")[location.pathname.split("/").length - 1] ===
  //     "inactive-friends" ||
  //   location.pathname.split("/")[location.pathname.split("/").length - 1] ===
  //     "lost-friends"
  // }
  const setSubMenuFriendsFn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSubMenuFriends(!subMenuFriends);
  };
  const setSubMenuMessageFn = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setSubMenuMessage(!subMenuMessage)
  }
  const [dontSendFrindReqIRejct, setDontSendFrindReqIRejct] = useState(false);
  const setSidebarToogleFn = (e) => {
    localStorage.setItem("fr_sidebarToogle", !sidebarToogle);
    setSidebarToogle((current) => !current);
  };
  const setSidebarOpenFn = (e) => {
    localStorage.setItem("fr_sidebarToogle", false);
    localStorage.setItem("submenu_status", 1);
    const menu_status = parseInt(localStorage.getItem("submenu_status"));
    if (menu_status === 1) {
      setSidebarOpenFriends(true);
    }
    setSidebarToogle(false);
  };
  const setSidebarHomeOpenFn = (e) => {
    localStorage.setItem("submenu_status", 0);
    setSidebarOpenFriends(false);
    localStorage.removeItem("submenu_status");
    //menu_status_refresh = 0;
    //setSidebarToogle(false);
  };
  const [isActiveMenu, setIsActiveMenu] = useState(false);
  const [local_fb_id, setLocal_fb_id] = useState("");

  const logoOut = (e) => {
    e.preventDefault();
    dispatch(setDefaultProfileId(""));
    dispatch(setProfileSpaces([]));
    dispatch(userLogout());
    if (!darkMode) {
      toggleDarkMode();
    }
  };

  //token
  // const userToken = localStorage.getItem("fr_token");
  const userFbProfile = localStorage.getItem("fr_default_fb");
  const userEmail = localStorage.getItem("fr_default_email");

  const getProfileData = () => {
    // alert("sidebar")
    if (menu_status_refresh === 1) {
      setSidebarOpenFriends(true);
    } else {
      setSidebarOpenFriends(false);
    }
    fetchUserProfile().then((res) => {
      // console.log("user info sidebar",res)
      if (res && res.length) {

        
        if (resetpassword_token === 1 && onboarding_token === 1 && res[0]?.fb_auth_info?.accessToken!=undefined && res[0]?.fb_auth_info?.accessToken) {
          // console.log("SIDEBAR STATUS 3",resetpassword_token,onboarding_token,res)
          setAuthenticated(true);
        }else{
          setAuthenticated(false)
        }
        // setProfiles(res);
        dispatch(setProfileSpaces(res));
        if (!userFbProfile || userFbProfile == null) {
          // console.log(
          //   "set default from sidebar frnd----->>>",
          //   res[0].fb_user_id
          // );

          localStorage.setItem("fr_default_fb", res[0].fb_user_id);
          dispatch(setDefaultProfileId(res[0].fb_user_id));
          setLocal_fb_id(res[0].fb_user_id);
        } else {
          setLocal_fb_id(userFbProfile);
        }
      }
    });
  };

  const switchProfile = (profileId) => {
    // console.log("switch profile", profileId);
    localStorage.setItem("fr_default_fb", profileId);
    localStorage.removeItem("fr_tooltip")
    // dispatch( setDefaultProfileId(profileId) )
    setIsComponentVisible(false);

    if (location.pathname == "/") {
      navigate(0);
      setIsComponentVisible(false);
    } else {
      navigate("/");
      navigate(0);
      setIsComponentVisible(false);
    }
  };

  const listClick = () => {
    if (!localStorage.getItem('fr_token')) {
      store.dispatch(userLogout())
    }
    dispatch(removeSelectedFriends());
    dispatch(crealFilter());
    setSidebarOpenFn();
  };

  useEffect(() => {
    if(
      location.pathname === "/facebook-auth" ||
      location.pathname === "/reset-password" ||
      location.pathname === "/onboarding"
    ) {
      localStorage.setItem("fr_sidebarToogle", true);
      setSidebarToogle(true);
    }
    // console.log("setSubMenuFriendsFn", checkIfNotFriends());
    // setSubMenuFriends(checkIfNotFriends());
  }, [location])

  return (
		<aside
			className={
				sidebarToogle
					? "sidebar closed d-flex d-flex-column f-justify-start"
					: "sidebar d-flex d-flex-column f-justify-start"
			}
		>
			{/* {console.log("authenticated",authenticated)} */}
			{props.resetPass ? (
				<></>
			) : (
				<>
					{authenticated && facebookAuthInfoStatus?.accessToken && (
						<span
							className={sidebarToogle ? "menu-toogle closed" : "menu-toogle"}
							onClick={setSidebarToogleFn}
							// aria-label="Menu Toggle"
						>
							<SidebarIcon />
						</span>
					)}
				</>
			)}

			<div className='sidebar-opened-wraper d-flex d-flex-column f-justify-start'>
				<div className='sidebar-top-wraper d-flex'>
					<figure className='sidebar-logo logo-closed opened-sidebar'>
						<img
							src={darkMode ? logoDefault : logoLight}
							alt=''
							loading='lazy'
						/>
						<span className='logoText'>Your organic marketing best friend</span>
					</figure>
					<figure
						className={
							authenticated && facebookAuthInfoStatus?.accessToken
								? "sidebar-logo logo-closed"
								: "sidebar-logo logo-closed no-click"
						}
					>
						<img
							src={logoClosed}
							alt=''
							loading='lazy'
						/>
					</figure>
					{authenticated && facebookAuthInfoStatus?.accessToken && (
						<span
							className='settings-menu'
							onClick={setSidebarHomeOpenFn}
						>
							<NavLink
								to='/settings/settings'
								aria-label='Settings'
								className={() =>
									[
										"/settings/settings",
										"/settings/request-history",
										"/settings/browser-manager",
									].includes(location.pathname)
										? "active"
										: ""
								}
							>
								<SettingIcon />
							</NavLink>
						</span>
					)}
				</div>
				<nav className={props.resetPass ? "nav-bar no-click" : "nav-bar"}>
					{authenticated && facebookAuthInfoStatus?.accessToken && (
						<ul>
							{/* <span className="seperator"></span> */}
							<li
								className='nav-menu link-seperator'
								onClick={setSidebarHomeOpenFn}
							>
								{/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}
								<NavLink
									to='/'
									aria-label='Home'
								>
									<HomeIcon />
									<span className='nav-menu-name'>Home</span>
								</NavLink>
							</li>
							{/* <span className="seperator"></span> */}

							<li
								className={
									sidebarOpenFriends
										? "nav-menu has-child activated link-seperator"
										: "nav-menu has-child link-seperator"
								}
								onClick={setSidebarOpenFn}
							>
								<NavLink
									onClick={() => setSubMenuFriends(true)}
									to='/friends/friend-list'
									className={() =>
										[
											"/friends/friend-list",
											"/friends/pending-request",
											"/friends/unfriended-friends",
											"/friends/whitelisted-friends",
											"/friends/deactivated-friends",
											"/friends/lost-friends",
											"/friends/blacklisted-friends",
										].includes(location.pathname)
											? "active"
											: ""
									}
									aria-label='Friends'
								>
									<FriendIcon />
									<span
										onClick={(e) => setSubMenuFriendsFn(e)}
										className='nav-menu-name'
									>
										Friends{" "}
										<span
											onClick={(e) => setSubMenuFriendsFn(e)}
											className={
												subMenuFriends
													? "sub-menu-toogle"
													: "sub-menu-toogle sub-closed"
											}
										>
											<svg
												width='18'
												height='18'
												viewBox='0 0 18 18'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M13.5 6.75L9 11.25L4.5 6.75'
													stroke='white'
												/>
											</svg>
										</span>
									</span>
								</NavLink>
								{subMenuFriends && (
									<ul className='sub-menus'>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/friend-list'
												aria-label='Friends'
											>
												<span className='nav-menu-name'>- Friends list</span>
											</NavLink>
										</li>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/friends-queue'
												aria-label='Friends'
											>
												<span className='nav-menu-name'>- Friends queue</span>
											</NavLink>
										</li>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/pending-request'
												aria-label='Pending Friends'
											>
												<span className='nav-menu-name'>- Pending request</span>
											</NavLink>
										</li>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/unfriended-friends'
												aria-label='Unfriended Friends'
											>
												<span className='nav-menu-name'>- Unfriended</span>
											</NavLink>
										</li>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/whitelisted-friends'
												aria-label='Whitelisted Friends'
											>
												<span className='nav-menu-name'>- Whitelisted</span>
											</NavLink>
										</li>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/deactivated-friends'
												aria-label='Deactivated Friends'
											>
												<span className='nav-menu-name'>- Deactivated</span>
											</NavLink>
										</li>
										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/lost-friends'
												aria-label='Lost Friends'
											>
												<span className='nav-menu-name'>- Lost friends</span>
											</NavLink>
										</li>

										<li
											className='nav-menu'
											onClick={listClick}
										>
											<NavLink
												to='/friends/blacklisted-friends'
												aria-label='Blacklisted Friends'
											>
												<span className='nav-menu-name'>- Blacklisted</span>
											</NavLink>
										</li>
										{/* <li className="nav-menu" onClick={setSidebarOpenFn}>
                  <NavLink to="/friends/incoming-pending-request">
                      <span className="nav-menu-name">- Incoming Pending Request</span>
                  </NavLink>
                </li>
                <li className="nav-menu" onClick={setSidebarOpenFn}>
                  <NavLink to="/friends/incoming-rejected-request">
                      <span className="nav-menu-name">- Incoming Rejected Request</span>
                  </NavLink>
                </li> */}
									</ul>
								)}
							</li>
							{/* <span className="seperator"></span> */}
							{/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}

							<li
								className={
									sidebarOpenFriends
										? "nav-menu has-child activated link-seperator"
										: "nav-menu has-child link-seperator"
								}
								onClick={setSidebarOpenFn}
							>
								<NavLink
									to='/messages/groups'
									onClick={() => {
										setSubMenuMessage(true);
									}}
									className={() =>
										[
											"/messages/groups",
											"/messages/segments",
											"/messages/dmf",
											// '/messages/campaigns'
										].includes(location.pathname)
											? "active"
											: ""
									}
									aria-label='Messages'
								>
									<NavMessageIcon color={"#0094FF"} />
									<span className='nav-menu-name'>
										Message
										<span
											onClick={(e) => setSubMenuMessageFn(e)}
											className={
												subMenuMessage
													? "sub-menu-toogle"
													: "sub-menu-toogle sub-closed"
											}
										>
											<svg
												width='18'
												height='18'
												viewBox='0 0 18 18'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M13.5 6.75L9 11.25L4.5 6.75'
													stroke='white'
												/>
											</svg>
										</span>
									</span>
								</NavLink>

								{subMenuMessage && (
									<ul className='sub-menus'>
										<li className='nav-menu'>
											<NavLink
												to='/messages/groups'
												aria-label='Friends'
											>
												<span className='nav-menu-name'>- Groups</span>
											</NavLink>
										</li>
										<li className='nav-menu'>
											<NavLink
												to='/messages/segments'
												aria-label='Friends'
											>
												<span className='nav-menu-name'>- Segment</span>
											</NavLink>
										</li>
										<li className='nav-menu no-click'>
											<NavLink
												to='/messages/dmf'
												aria-label='Friends'
												className='no-click'
											>
												<span className='nav-menu-name'>
													- DMF <span className='warn-badget'>Coming soon</span>
												</span>
											</NavLink>
										</li>
										{/* <li className="nav-menu">
                    <NavLink to="/messages/campaigns" aria-label="Friends">
                      <span className="nav-menu-name">- Campaigns</span>
                    </NavLink>
                  </li> */}
									</ul>
								)}
							</li>

							<li className={"nav-menu campaigns-menu"}>
								<NavLink
									to='/campaigns'
									aria-label='Campaigns'
									className={"text-left"}
								>
									<CampaignQuicActionIcon />
									<span className='nav-menu-name'>Campaigns</span>
								</NavLink>
							</li>
						</ul>
					)}
				</nav>

				{authenticated &&
					facebookAuthInfoStatus?.accessToken &&
					(sidebarToogle ? (
						<nav
							className='nav-bar bottom-nav-only m-top-a closed-only'
							onClick={setSidebarHomeOpenFn}
						>
							<ul>
								<li className='nav-menu bottom-settings closed-only'>
									{/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}
									<NavLink
										to='/settings/settings'
										className={() =>
											[
												"/settings/settings",
												"/settings/request-history",
												"/settings/browser-manager",
											].includes(location.pathname)
												? "active"
												: ""
										}
									>
										<SettingIcon />
									</NavLink>
								</li>
							</ul>
						</nav>
					) : (
						""
					))}

				<ul className='bottom-nav-bar m-top-a'>
					<li className='nav-menu nav-wiki'>
						<Link
							to='https://wiki.friender.io/'
							target='_blank'
						>
							<WorldIcon />
							Friender wiki <OpenInNewTab />
						</Link>
					</li>
					{/* {sidebarToogle && ( */}
					<>
						{/* <li
                className={
                  authenticated
                    ? "nav-menu closed-only no-click"
                    : "nav-menu closed-only no-click"
                }
              >
                <NavLink to="/">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="17"
                      r="0.5"
                      fill="#BDBDBD"
                      stroke="#BDBDBD"
                    />
                    <path
                      d="M12 15V13.7396C12 13.0928 12.3971 12.5122 13 12.2778V12.2778C13.6029 12.0433 14 11.4628 14 10.8159V10C14 8.89543 13.1046 8 12 8V8C10.8954 8 10 8.89543 10 10V10.3333"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                    />
                  </svg>
                </NavLink>
              </li> */}

						<li
							ref={clickedRef}
							className={
								isComponentVisible
									? "nav-menu user-profile-image profile-opened"
									: "nav-menu user-profile-image"
							}
						>
							<span
								className='profile-photo'
								onClick={setShowProfileFn}
								style={{
									backgroundImage: `url(${(profiles && profiles[0]?.fb_profile_picture) ? profiles[0]?.fb_profile_picture : ProfilePhoto})`,
								}}
							>
								{/* <img src={profiles?.filter((el) => el.fb_user_id == defaultProfileId)[0]?.fb_profile_picture} alt="" /> */}
							</span>

							{isComponentVisible && (
								<SidebarPopUp
									authenticated={authenticated}
									profiles={profiles}
									switchProfile={switchProfile}
									setShowProfileFn={setShowProfileFn}
									userEmail={userEmail}
									closePopupFn={closePopupFn}
									logoOut={logoOut}
									defaultProfileId={defaultProfileId}
									facebookAuthInfoStatus={facebookAuthInfoStatus}
								/>
							)}
						</li>
						{!sidebarToogle && (
							<li className='nav-menu feedback-nav'>
								{/* {
                  console.log('facebookAuthInfoStatus', facebookAuthInfoStatus)
                } */}
								<span
									className='profile-photo'
									onClick={setShowProfileFn}
									style={{
										backgroundImage: `url(${
											// facebookAuthInfoStatus?.picture?.data?.url ? facebookAuthInfoStatus?.picture?.data?.url :
											profiles && profiles.length
												? profiles[0]?.fb_profile_picture
												: ProfilePhoto
										})`,
									}}
								>
									{/* <img src={profiles?.filter((el) => el.fb_user_id == defaultProfileId)[0]?.fb_profile_picture} alt="" /> */}
								</span>

								{/* {

                  console.log(
                    'authenticated', authenticated, 
                    'defaultProfileId', defaultProfileId, 
                    'isComponentVisible', isComponentVisible,
                    'facebookAuthInfoStatus', facebookAuthInfoStatus,
                    'facebookAuthInfoStatus image', facebookAuthInfoStatus?.picture?.data?.url,
                    'facebookAuthInfoStatus url', facebookAuthInfoStatus?.link
                  )
                } */}

								{/* {isComponentVisible && (

                  <SidebarPopUp 
                    authenticated={authenticated}
                    profiles={profiles}
                    switchProfile ={switchProfile}
                    setShowProfileFn ={setShowProfileFn}
                    userEmail={userEmail}
                    closePopupFn = {closePopupFn}
                    logoOut = {logoOut}
                    defaultProfileId = {defaultProfileId}
                    facebookAuthInfoStatus={facebookAuthInfoStatus}            
                  />
                )} */}
								<Link
									to='https://lnkw.co/friender-feedback'
									target='_blank'
									className='btn'
								>
									Feedback <OpenInNewTab />
								</Link>
							</li>
						)}
						{sidebarToogle ? (
							<li className='nav-menu closed-only'>
								<button
									className='btn-transparent logout-btn'
									aria-label='button'
									onClick={logoOut}
								>
									<LogoutIcon />
								</button>
							</li>
						) : (
							""
						)}

						{/* <li className="nav-menu opened-only no-click">
                <button
                  className="btn-transparent menu-detail"
                  aria-label="Invite" 
                >
                  <svg
                    width="46"
                    height="40"
                    viewBox="0 0 46 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="45"
                      height="39"
                      rx="4.5"
                      fill="#605BFF"
                      fillOpacity="0.1"
                      stroke="#605BFF"
                    />
                    <circle cx="21.5" cy="17" r="3.75" fill="#605BFF" />
                    <path
                      d="M28.25 18.5L28.25 23"
                      stroke="#605BFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M30.5 20.75L26 20.75"
                      stroke="#605BFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M26.8566 26.2869C27.2028 26.2085 27.4105 25.8486 27.257 25.5285C26.8432 24.6652 26.163 23.9066 25.2814 23.3349C24.1966 22.6313 22.8674 22.25 21.5 22.25C20.1326 22.25 18.8034 22.6313 17.7186 23.3349C16.837 23.9066 16.1568 24.6652 15.743 25.5284C15.5895 25.8486 15.7972 26.2085 16.1434 26.2869C19.6698 27.0855 23.3302 27.0855 26.8566 26.2869Z"
                      fill="#605BFF"
                    />
                  </svg>
                </button>
              </li>  */}
						{/* <li className="nav-menu opened-only no-click">
                <button className="btn-primary upgrade-btn">Upgrade</button>
              </li>  */}
						{/* <li className="nav-menu opened-only no-click">
                <NavLink to="/" aria-label="FAQ">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="17"
                      r="0.5"
                      fill="#BDBDBD"
                      stroke="#BDBDBD"
                    />
                    <path
                      d="M12 15V13.7396C12 13.0928 12.3971 12.5122 13 12.2778V12.2778C13.6029 12.0433 14 11.4628 14 10.8159V10C14 8.89543 13.1046 8 12 8V8C10.8954 8 10 8.89543 10 10V10.3333"
                      stroke="#BDBDBD"
                      strokeWidth="2"
                    />
                  </svg>
                </NavLink>
              </li> */}
					</>
				</ul>
			</div>
		</aside>
	);
};
export default Sidebar;
