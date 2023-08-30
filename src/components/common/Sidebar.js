import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Themewitch from "../common/Themeswitch";
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
import {SidebarIcon, SettingIcon, HomeIcon,FriendIcon, LogoutIcon, OpenInNewTab} from "../../assets/icons/Icons";
import {
  setProfileSpaces,
  setDefaultProfileId,
} from "../../actions/ProfilespaceActions";
import { io } from "socket.io-client";
import { store } from "../../app/store";
import "../../assets/scss/component/common/_sidebar.scss"


// import socket  from "../../configuration/socket-connection";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

// if (!socket.connected || !socket.auth || !socket.auth.token){
//   const socket = io(SOCKET_URL, {
//     transports: ["websocket", "polling"], // use WebSocket first, if available
//     auth: {token: localStorage.getItem("fr_token")}
//   });
// }
let socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // use WebSocket first, if available
  auth: { token: localStorage.getItem("fr_token") },
});

// console.log("socket connection from sidebar");

const Sidebar = (props) => {
  const { clickedRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(ModeContext);
  const navigate = useNavigate();
  const [sidebarToogle, setSidebarToogle] = useState(true);
  const [subMenuFriends, setSubMenuFriends] = useState(true);
  // const [profiles, setProfiles] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const resetpassword_token = parseInt(localStorage.getItem("fr_onboarding"));
  const onboarding_token = parseInt(localStorage.getItem("fr_pass_changed"));
  const menu_status_refresh = parseInt(localStorage.getItem("submenu_status"));
  const facebookAuthInfoStatus = JSON.parse(localStorage.getItem("fr_facebook_auth"));


  // console.log("()()()()()f acebook auth info",facebookAuthInfoStatus?.accessToken)

  const [sidebarOpenFriends, setSidebarOpenFriends] = useState(false);
  const profiles = useSelector((state) => state.profilespace.profiles);
  const [token,setToken]=useState(localStorage.getItem('fr_token'))
  const defaultProfileId = useSelector(
    (state) => state.profilespace.defaultProfileId
  );

  useEffect(() => {
    socket.on("connect", function () {
      socket.emit("join", { token: localStorage.getItem("fr_token") });
    });
    socket.on("disconnect", (reason) => {
      console.log("disconnect due to " + reason);
      socket.connect();
    });
    socket.on("connect_error", (e) => {
      console.log("There Is a connection Error", e);
      socket.io.opts.transports = ["websocket", "polling"];
    });
  }, []);

  useEffect(() => {
    // alert("a")
    getProfileData();
  }, []);


  const dispatch = useDispatch();

  // socket.on("sendUpdate", (resp) => {
  //   // console.log("Sync Uodate", resp)
  //   console.log(".")

  //   if (resp.update) {
  //     localStorage.setItem("fr_update", resp?.update);
  //   }

  //   if (resp?.friendlist) {
  //     console.log("Friend lis receive from ext sync", resp.friendlist)

  //     // Fetch friend list after 1 min
  //     setTimeout( () => {
  //       dispatch(getFriendList({ fbUserId: localStorage.getItem("fr_default_fb") }))
  //       .unwrap()
  //       .then((response) => {
  //         // Nothing do for the time being
  //       });
  //     }, 1000*30)
  //   }
  // });
  socket.on("facebookLoggedOut", (logoutUpdate) => {
    console.log("updates :::  ", logoutUpdate);
    localStorage.removeItem("fr_update");
    localStorage.removeItem("fr_isSyncing");
    localStorage.removeItem("friendLength");
  });
  useEffect(()=>{
    // alert("b")
    // setAuthenticated(false)
    const resetpassword_status = parseInt(localStorage.getItem("fr_pass_changed"));
    const onboarding_status = parseInt(localStorage.getItem("fr_onboarding"));
    const menu_refresh_status = parseInt(localStorage.getItem("submenu_status"));
    const facebookAuthInfo = JSON.parse(localStorage.getItem("fr_facebook_auth"));



  if (resetpassword_status === 1 && onboarding_status === 1 && facebookAuthInfo?.accessToken!=undefined && facebookAuthInfo?.accessToken){
    // console.log("authenticated after synced:::::::::::::::>>>>>>>>>")
    console.log("Authentication is off and now the sidebar can access the menu buttons on screeen.2")
    setAuthenticated(true);
  }else{
    setAuthenticated(false)
  }
  if (menu_refresh_status === 1) {
    setSidebarOpenFriends(true);
  } else {
    setSidebarOpenFriends(false);
  }

  },[props.isSynced])

  useEffect(() => {
    // alert("c")

    (async () => {
      const resetpassword_status = parseInt(localStorage.getItem("fr_pass_changed"));
      const onboarding_status = parseInt(localStorage.getItem("fr_onboarding"));
      const menu_refresh_status = parseInt(localStorage.getItem("submenu_status"));
      const facebookAuthInfo = JSON.parse(localStorage.getItem("fr_facebook_auth"));



  if (resetpassword_status === 1 && onboarding_status === 1 && facebookAuthInfo?.accessToken!=undefined && facebookAuthInfo?.accessToken){
    // console.log("authenticated after synced:::::::::::::::>>>>>>>>>")
    console.log("Authentication is off and now the sidebar can access the menu buttons on screeen. --1")
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
    console.log('clicked', facebookAuthInfoStatus);
    // setShowProfile((current) => profiles?.length > 0 ? !current : false)
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
      console.log("user info sidebar",res)
      if (res && res.length) {

        
        if (resetpassword_token === 1 && onboarding_token === 1 && res[0]?.fb_auth_info?.accessToken!=undefined && res[0]?.fb_auth_info?.accessToken) {
          console.log("SIDEBAR STATUS 3",resetpassword_token,onboarding_token,res)
          setAuthenticated(true);
        }else{
          setAuthenticated(false)
        }
        // setProfiles(res);
        dispatch(setProfileSpaces(res));
        if (!userFbProfile || userFbProfile == null) {
          console.log(
            "set default from sidebar frnd----->>>",
            res[0].fb_user_id
          );

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
    if(!localStorage.getItem('fr_token')){      
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
          {authenticated && facebookAuthInfoStatus?.accessToken &&(
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

      <div className="sidebar-opened-wraper d-flex d-flex-column f-justify-start">
        <div className="sidebar-top-wraper d-flex">
          <figure className="sidebar-logo logo-closed opened-sidebar">
              <img 
                src={darkMode ? logoDefault : logoLight} 
                alt="" 
                loading="lazy"
              />
              <span className="logoText">Your organic marketing best friend</span>
          </figure>
          <figure
            className={
              authenticated && facebookAuthInfoStatus?.accessToken 
                ? "sidebar-logo logo-closed"
                : "sidebar-logo logo-closed no-click"
            }
          >
            <img src={logoClosed} alt="" loading="lazy" />
          </figure>
          {authenticated && facebookAuthInfoStatus?.accessToken && (
            <span className="settings-menu" onClick={setSidebarHomeOpenFn}>
              <NavLink 
                to="/settings/settings" 
                aria-label="Settings"
                className={() =>   [
                  '/settings/settings', 
                  '/settings/request-history',
                  '/settings/browser-manager'].includes(location.pathname) ? "active" : ''}

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
                className="nav-menu link-seperator"
                onClick={setSidebarHomeOpenFn}
              >
                {/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}
                <NavLink to="/" aria-label="Home">
                  

                  <HomeIcon />
                  <span className="nav-menu-name">Home</span>
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
                  to="/friends/friend-list"
                  className={() =>   [
                    '/friends/friend-list', 
                    '/friends/pending-request',
                    '/friends/unfriended-friends',
                    '/friends/whitelisted-friends',
                    '/friends/deactivated-friends',
                    '/friends/lost-friends',
                    '/friends/blacklisted-friends'].includes(location.pathname) ? "active" : ''}
                    aria-label="Friends"
                >
                  <FriendIcon />
                  <span
                    onClick={(e) => setSubMenuFriendsFn(e)}
                    className="nav-menu-name"
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
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.5 6.75L9 11.25L4.5 6.75" stroke="white" />
                      </svg>
                    </span>
                  </span>
                </NavLink>
                {subMenuFriends && (
                  <ul className="sub-menus">
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/friend-list" aria-label="Friends">
                        <span className="nav-menu-name">- Friend List</span>
                      </NavLink>
                    </li>
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/pending-request" aria-label="Pending Friends">
                        <span className="nav-menu-name">- Pending request</span>
                      </NavLink>
                    </li>
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/unfriended-friends" aria-label="Unfriended Friends">
                        <span className="nav-menu-name">- Unfriended</span>
                      </NavLink>
                    </li>
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/whitelisted-friends" aria-label="Whitelisted Friends">
                        <span className="nav-menu-name">- Whitelisted</span>
                      </NavLink>
                    </li>
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/deactivated-friends" aria-label="Deactivated Friends">
                        <span className="nav-menu-name">- Deactivated</span>
                      </NavLink>
                    </li>
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/lost-friends" aria-label="Lost Friends">
                        <span className="nav-menu-name">- Lost Friends</span>
                      </NavLink>
                    </li>

                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/blacklisted-friends" aria-label="Blacklisted Friends">
                        <span className="nav-menu-name">
                          - Blacklisted
                        </span>
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
              {/* 
              Commented out Message feature before launch
              <li
                className="nav-menu link-seperator"
                onClick={setSidebarHomeOpenFn}
              >
                <NavLink to="/message">
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.81655 11.5571C3.67207 11.6169 3.56486 11.7266 3.51383 11.7788C3.50863 11.7842 3.50401 11.7889 3.5 11.7929L1.35355 13.9393C1.03857 14.2543 0.5 14.0312 0.5 13.5858V8C0.5 6.10025 0.501062 4.72573 0.641988 3.67754C0.78098 2.64373 1.04772 2.00253 1.52513 1.52513C2.00253 1.04772 2.64373 0.78098 3.67754 0.641988C4.72573 0.501062 6.10025 0.5 8 0.5H10C10.9387 0.5 11.6177 0.500271 12.1546 0.5369C12.687 0.573224 13.0429 0.643622 13.3394 0.766422C14.197 1.12165 14.8783 1.80301 15.2336 2.66061C15.3564 2.95707 15.4268 3.31304 15.4631 3.84541C15.4997 4.38227 15.5 5.06128 15.5 6C15.5 6.93872 15.4997 7.61773 15.4631 8.15459C15.4268 8.68696 15.3564 9.04293 15.2336 9.33939C14.8783 10.197 14.197 10.8783 13.3394 11.2336C13.0429 11.3564 12.687 11.4268 12.1546 11.4631C11.6177 11.4997 10.9387 11.5 10 11.5H4.20711C4.20143 11.5 4.19483 11.4999 4.18739 11.4998C4.11438 11.499 3.96102 11.4972 3.81655 11.5571ZM3.81655 11.5571L4.00788 12.019L3.81654 11.5571C3.81654 11.5571 3.81654 11.5571 3.81655 11.5571Z"
                      fill="#BDBDBD"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.5 4.5H12.5"
                      stroke="#131314"
                      strokeLinecap="round"
                    />
                    <path
                      d="M4.49984 7.49981L10 7.5"
                      stroke="#131314"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="nav-menu-name">Message</span>
                </NavLink>
              </li> */}
            </ul>
          )}
        </nav>

        {authenticated && facebookAuthInfoStatus?.accessToken && (
          sidebarToogle ? 
          <nav
            className="nav-bar bottom-nav-only m-top-a closed-only"
            onClick={setSidebarHomeOpenFn}
          >
            <ul>
              <li className="nav-menu bottom-settings closed-only">
                {/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}
                <NavLink 
                  to="/settings/settings"
                  className={() =>   [
                    '/settings/settings', 
                    '/settings/request-history',
                    '/settings/browser-manager'].includes(location.pathname) ? "active" : ''}
                >
                  <SettingIcon />
                </NavLink>
              </li>
            </ul>
          </nav> : ''
        )}

        <ul className="bottom-nav-bar m-top-a">
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
                  className="profile-photo"
                  onClick={setShowProfileFn}
                  style={{
                    backgroundImage: `url(${
                      facebookAuthInfoStatus?.picture?.data?.url ? facebookAuthInfoStatus?.picture?.data?.url : 
                      profiles?.filter(
                        (el) => el.fb_user_id == defaultProfileId
                      )[0]?.fb_profile_picture
                        ? profiles?.filter(
                            (el) => el.fb_user_id == defaultProfileId
                          )[0]?.fb_profile_picture
                        : ProfilePhoto
                    })`,
                  }}
                >
                  {/* <img src={profiles?.filter((el) => el.fb_user_id == defaultProfileId)[0]?.fb_profile_picture} alt="" /> */}
                </span>

                {
                  console.log(
                    'authenticated', authenticated, 
                    'defaultProfileId', defaultProfileId, 
                    'isComponentVisible', isComponentVisible,
                    'facebookAuthInfoStatus', facebookAuthInfoStatus,
                    'facebookAuthInfoStatus image', facebookAuthInfoStatus?.picture?.data?.url,
                    'facebookAuthInfoStatus url', facebookAuthInfoStatus?.link
                  )
                }

                {isComponentVisible && (

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
                )}
              </li>
              {!sidebarToogle && 
                <li
                  className="nav-menu feedback-nav"
                >
                  <Link to="https://lnkw.co/friender-feedback" target="_blank" className="btn">
                    Feedback <OpenInNewTab />
                  </Link>
                </li>
              }
              {sidebarToogle ? <li className="nav-menu closed-only">
                <button
                  className="btn-transparent logout-btn"
                  aria-label="button"
                  onClick={logoOut}
                >
                 <LogoutIcon />
                </button>
              </li> : ''}


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
