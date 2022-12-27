import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Themewitch from "../common/Themeswitch";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import whiteArrow from "../../assets/images/Arrow-white.png";
import logoClosed from "../../assets/images/fab-icon.png";
import ProfilePhoto from "../../assets/images/profilePhoto.png";
import logoDefault from "../../assets/images/logo_sidebar.png";
import logoLight from "../../assets/images/logoL.png";
import { ModeContext } from "../../context/ThemeContext";
import { userLogout } from "../../actions/AuthAction";
import { asyncLocalStorage } from "../../helpers/AsyncLocalStorage";
import useComponentVisible from "../../helpers/useComponentVisible";
import { crealFilter } from "../../actions/FilterActions";

const Sidebar = (props) => {
  const { clickedRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const location = useLocation();
  const { darkMode } = useContext(ModeContext);
  const navigate = useNavigate();
  const [sidebarToogle, setSidebarToogle] = useState(true);
  const [subMenuFriends, setSubMenuFriends] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const resetpassword_token = parseInt(localStorage.getItem("fr_onboarding"));
  const onboarding_token = parseInt(localStorage.getItem("fr_pass_changed"));
  const menu_status_refresh = parseInt(localStorage.getItem("submenu_status"));
  const [sidebarOpenFriends, setSidebarOpenFriends] = useState(false);
  useEffect(() => {
    getProfileData();
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    if (resetpassword_token === 1 && onboarding_token === 1) {
      setAuthenticated(true);
    }
    if (menu_status_refresh === 1) {
      setSidebarOpenFriends(true);
    } else {
      setSidebarOpenFriends(false);
    }
  }, []);

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
    // setShowProfile((current) => profiles?.length > 0 ? !current : false)
    setIsComponentVisible((current) => !current);
    setSubMenuFriends(false);
  };
  const setSubMenuFriendsFn = (e) => {
    setSubMenuFriends((current) => !current);
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
    dispatch(userLogout());
  };

  //token
  // const userToken = localStorage.getItem("fr_token");
  const userFbProfile = localStorage.getItem("fr_default_fb");
  const userEmail = localStorage.getItem("fr_default_email");

  const getProfileData = () => {
    fetchUserProfile().then((res) => {
      if (res) {
        setProfiles(res);
        if (!userFbProfile || userFbProfile == null) {
          localStorage.setItem("fr_default_fb", res[0].fb_user_id);
          setLocal_fb_id(res[0].fb_user_id);
        } else {
          setLocal_fb_id(userFbProfile);
        }
      }
    });
  };

  const clickInImage = (token) => {
    localStorage.setItem("fr_default_fb", token);

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
    console.log("||You have clicked n list Change Link:::::>>>");
    dispatch(crealFilter());
    setSidebarOpenFn();
  };

  return (
    <aside
      className={
        sidebarToogle
          ? "sidebar closed d-flex d-flex-column f-justify-start"
          : "sidebar d-flex d-flex-column f-justify-start"
      }
    >
      {props.resetPass ? (
        <></>
      ) : (
        <>
          {authenticated && (
            <span
              className={sidebarToogle ? "menu-toogle closed" : "menu-toogle"}
              onClick={setSidebarToogleFn}
              // aria-label="Menu Toggle"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.7">
                  <path
                    d="M4.5 9L3.79289 9.70711L3.08579 9L3.79289 8.29289L4.5 9ZM8.29289 14.2071L3.79289 9.70711L5.20711 8.29289L9.70711 12.7929L8.29289 14.2071ZM3.79289 8.29289L8.29289 3.79289L9.70711 5.20711L5.20711 9.70711L3.79289 8.29289Z"
                    fill="white"
                  />
                  <path
                    d="M9 9L8.29289 9.70711L7.58579 9L8.29289 8.29289L9 9ZM12.7929 14.2071L8.29289 9.70711L9.70711 8.29289L14.2071 12.7929L12.7929 14.2071ZM8.29289 8.29289L12.7929 3.79289L14.2071 5.20711L9.70711 9.70711L8.29289 8.29289Z"
                    fill="white"
                  />
                </g>
              </svg>
            </span>
          )}
        </>
      )}

      <div className="sidebar-opened-wraper d-flex d-flex-column f-justify-start">
        <div className="sidebar-top-wraper d-flex">
          <figure className="sidebar-logo logo-closed opened-sidebar text-center">
            <NavLink to="/" aria-label="Logo">
              <img src={darkMode ? logoDefault : logoLight} alt="" />
            </NavLink>
          </figure>
          <figure
            className={
              authenticated
                ? "sidebar-logo logo-closed"
                : "sidebar-logo logo-closed no-click"
            }
          >
            <NavLink to="/">
              <img src={logoClosed} alt="" />
            </NavLink>
          </figure>
          {authenticated && (
            <span className="settings-menu" onClick={setSidebarHomeOpenFn}>
              <NavLink to="/settings/my-settings" aria-label="Settings">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.3018 10.185C15.57 10.3275 15.777 10.5525 15.9226 10.7775C16.2062 11.2425 16.1832 11.8125 15.9073 12.315L15.3707 13.215C15.0871 13.695 14.5583 13.995 14.0141 13.995C13.7458 13.995 13.4469 13.92 13.2016 13.77C13.0024 13.6425 12.7724 13.5975 12.5271 13.5975C11.7683 13.5975 11.1322 14.22 11.1092 14.9625C11.1092 15.825 10.404 16.5 9.52259 16.5H8.48019C7.59109 16.5 6.88594 15.825 6.88594 14.9625C6.87061 14.22 6.23444 13.5975 5.47564 13.5975C5.2227 13.5975 4.99276 13.6425 4.80115 13.77C4.55588 13.92 4.24929 13.995 3.98869 13.995C3.43683 13.995 2.90797 13.695 2.62438 13.215L2.09551 12.315C1.81192 11.8275 1.79659 11.2425 2.08019 10.7775C2.20282 10.5525 2.43276 10.3275 2.69336 10.185C2.90797 10.08 3.04594 9.9075 3.17623 9.705C3.55947 9.06 3.32953 8.2125 2.67803 7.83C1.91923 7.4025 1.67396 6.45 2.11084 5.7075L2.62438 4.8225C3.06893 4.08 4.01935 3.8175 4.78582 4.2525C5.45264 4.6125 6.31875 4.3725 6.70965 3.735C6.83229 3.525 6.90127 3.3 6.88594 3.075C6.87061 2.7825 6.95492 2.505 7.10055 2.28C7.38414 1.815 7.89768 1.515 8.4572 1.5H9.53792C10.1051 1.5 10.6186 1.815 10.9022 2.28C11.0402 2.505 11.1322 2.7825 11.1092 3.075C11.0938 3.3 11.1628 3.525 11.2855 3.735C11.6764 4.3725 12.5425 4.6125 13.217 4.2525C13.9758 3.8175 14.9339 4.08 15.3707 4.8225L15.8843 5.7075C16.3288 6.45 16.0836 7.4025 15.3171 7.83C14.6656 8.2125 14.4356 9.06 14.8265 9.705C14.9492 9.9075 15.0871 10.08 15.3018 10.185ZM6.83229 9.0075C6.83229 10.185 7.8057 11.1225 9.00906 11.1225C10.2124 11.1225 11.1628 10.185 11.1628 9.0075C11.1628 7.83 10.2124 6.885 9.00906 6.885C7.8057 6.885 6.83229 7.83 6.83229 9.0075Z"
                    fill="#BDBDBD"
                  />
                </svg>
              </NavLink>
            </span>
          )}
        </div>
        <nav className={props.resetPass ? "nav-bar no-click" : "nav-bar"}>
          {authenticated && (
            <ul>
              {/* <span className="seperator"></span> */}
              <li
                className="nav-menu link-seperator"
                onClick={setSidebarHomeOpenFn}
              >
                {/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}
                <NavLink to="/">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.27446 9.07866C5 9.66429 5 10.3305 5 11.663V15.8245C5 17.675 5 18.6002 5.58579 19.1751C6.11731 19.6967 6.94276 19.7451 8.49976 19.7495V15.0488C8.49976 13.9443 9.39519 13.0488 10.4998 13.0488H13.4998C14.6043 13.0488 15.4998 13.9443 15.4998 15.0488V19.7495C17.0571 19.7451 17.8826 19.6968 18.4142 19.1751C19 18.6002 19 17.675 19 15.8245V11.663C19 10.3305 19 9.66429 18.7255 9.07866C18.4511 8.49303 17.9356 8.05945 16.9047 7.19228L15.9047 6.35109C14.0414 4.7837 13.1098 4 12 4C10.8902 4 9.95857 4.7837 8.09525 6.35109L7.09525 7.19228C6.06437 8.05945 5.54892 8.49303 5.27446 9.07866ZM13.4998 19.75V15.0488H10.4998V19.75H13.4998Z"
                      fill="#BDBDBD"
                    />
                  </svg>
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
                  to="/friends/friend-list"
                  onClick={setSubMenuFriendsFn}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.2283 18.6183C18.6422 18.5265 18.8901 18.0956 18.7013 17.716C18.2172 16.7422 17.4295 15.8865 16.4117 15.2399C15.146 14.4358 13.5953 14 12 14C10.4047 14 8.85398 14.4358 7.58835 15.2399C6.57054 15.8865 5.78285 16.7422 5.29865 17.716C5.10992 18.0956 5.35784 18.5265 5.77169 18.6183C9.87403 19.5284 14.126 19.5284 18.2283 18.6183Z"
                      fill="#BDBDBD"
                    />
                    <ellipse
                      cx="12"
                      cy="7.5"
                      rx="4.375"
                      ry="4.5"
                      fill="#BDBDBD"
                    />
                  </svg>
                  <span className="nav-menu-name">
                    Friends{" "}
                    <span
                      className={
                        subMenuFriends
                          ? "sub-menu-toogle"
                          : "sub-menu-toogle sub-closed"
                      }
                    >
                      <svg
                        width="6"
                        height="5"
                        viewBox="0 0 6 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.4"
                          d="M2.4345 4.81539C2.4055 4.78714 2.2815 4.68047 2.1795 4.5811C1.538 3.99854 0.488 2.47881 0.1675 1.68339C0.116 1.56259 0.00699989 1.25718 -9.56413e-08 1.09401C-8.19722e-08 0.937652 0.0359999 0.788602 0.109 0.646371C0.211 0.46907 0.3715 0.326839 0.561 0.248904C0.6925 0.198734 1.086 0.120799 1.093 0.120799C1.5235 0.0428642 2.223 1.94341e-07 2.996 2.61919e-07C3.7325 3.26306e-07 4.4035 0.0428645 4.8405 0.106674C4.8475 0.11398 5.3365 0.191915 5.504 0.277156C5.81 0.433512 6 0.738919 6 1.06576L6 1.09401C5.9925 1.30687 5.8025 1.75451 5.7955 1.75451C5.4745 2.50706 4.476 3.99172 3.8125 4.58841C3.8125 4.58841 3.642 4.75645 3.5355 4.82952C3.3825 4.9435 3.193 5 3.0035 5C2.792 5 2.595 4.93619 2.4345 4.81539Z"
                          fill="#030229"
                        />
                      </svg>
                    </span>
                  </span>
                </NavLink>
                {subMenuFriends && (
                  <ul className="sub-menus">
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/friend-list">
                        <span className="nav-menu-name">- Friends List</span>
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
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/unfriend">
                        <span className="nav-menu-name">- Unfriends</span>
                      </NavLink>
                    </li>
                    {/* <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/lost-friends">
                        <span className="nav-menu-name">- Lost Friends</span>
                      </NavLink>
                    </li> */}
                    <li className="nav-menu" onClick={listClick}>
                      <NavLink to="/friends/whitelist">
                        <span className="nav-menu-name">
                          - Whitelisted Friends
                        </span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
              {/* <span className="seperator"></span> */}
            </ul>
          )}
        </nav>

        {authenticated && (
          <nav
            className="nav-bar bottom-nav-only m-top-a closed-only"
            onClick={setSidebarHomeOpenFn}
          >
            <ul>
              <li className="nav-menu bottom-settings closed-only">
                {/* className={isActiveMenu ? "nav-menu active" : "nav-menu"} */}
                <NavLink to="/settings/my-settings">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.3018 10.185C15.57 10.3275 15.777 10.5525 15.9226 10.7775C16.2062 11.2425 16.1832 11.8125 15.9073 12.315L15.3707 13.215C15.0871 13.695 14.5583 13.995 14.0141 13.995C13.7458 13.995 13.4469 13.92 13.2016 13.77C13.0024 13.6425 12.7724 13.5975 12.5271 13.5975C11.7683 13.5975 11.1322 14.22 11.1092 14.9625C11.1092 15.825 10.404 16.5 9.52259 16.5H8.48019C7.59109 16.5 6.88594 15.825 6.88594 14.9625C6.87061 14.22 6.23444 13.5975 5.47564 13.5975C5.2227 13.5975 4.99276 13.6425 4.80115 13.77C4.55588 13.92 4.24929 13.995 3.98869 13.995C3.43683 13.995 2.90797 13.695 2.62438 13.215L2.09551 12.315C1.81192 11.8275 1.79659 11.2425 2.08019 10.7775C2.20282 10.5525 2.43276 10.3275 2.69336 10.185C2.90797 10.08 3.04594 9.9075 3.17623 9.705C3.55947 9.06 3.32953 8.2125 2.67803 7.83C1.91923 7.4025 1.67396 6.45 2.11084 5.7075L2.62438 4.8225C3.06893 4.08 4.01935 3.8175 4.78582 4.2525C5.45264 4.6125 6.31875 4.3725 6.70965 3.735C6.83229 3.525 6.90127 3.3 6.88594 3.075C6.87061 2.7825 6.95492 2.505 7.10055 2.28C7.38414 1.815 7.89768 1.515 8.4572 1.5H9.53792C10.1051 1.5 10.6186 1.815 10.9022 2.28C11.0402 2.505 11.1322 2.7825 11.1092 3.075C11.0938 3.3 11.1628 3.525 11.2855 3.735C11.6764 4.3725 12.5425 4.6125 13.217 4.2525C13.9758 3.8175 14.9339 4.08 15.3707 4.8225L15.8843 5.7075C16.3288 6.45 16.0836 7.4025 15.3171 7.83C14.6656 8.2125 14.4356 9.06 14.8265 9.705C14.9492 9.9075 15.0871 10.08 15.3018 10.185ZM6.83229 9.0075C6.83229 10.185 7.8057 11.1225 9.00906 11.1225C10.2124 11.1225 11.1628 10.185 11.1628 9.0075C11.1628 7.83 10.2124 6.885 9.00906 6.885C7.8057 6.885 6.83229 7.83 6.83229 9.0075Z"
                      fill="#BDBDBD"
                    />
                  </svg>
                </NavLink>
              </li>
            </ul>
          </nav>
        )}

        <ul className="bottom-nav-bar m-top-a">
          {sidebarToogle && (
            <>
              <li
                className={
                  authenticated
                    ? "nav-menu closed-only"
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
              </li>

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
                      profiles?.filter((el) => el.fb_user_id == local_fb_id)[0]
                        ?.fb_profile_picture
                        ? profiles?.filter(
                            (el) => el.fb_user_id == local_fb_id
                          )[0]?.fb_profile_picture
                        : ProfilePhoto
                    })`,
                  }}
                >
                  {/* <img src={profiles?.filter((el) => el.fb_user_id == local_fb_id)[0]?.fb_profile_picture} alt="" /> */}
                </span>

                {isComponentVisible && (
                  <>
                    <div
                      className={
                        authenticated ? "profile-popup" : "profile-popup hidden"
                      }
                    >
                      <div className="profile-listings-sec-wraper">
                        <div className="main-profile-selected">
                          {/* <img src={profiles?.filter((el) => el.fb_user_id == local_fb_id)[0]?.fb_profile_picture} alt="" /> */}
                          <img
                            src={
                              profiles?.filter(
                                (el) => el.fb_user_id == local_fb_id
                              )[0]?.fb_profile_picture
                                ? profiles?.filter(
                                    (el) => el.fb_user_id == local_fb_id
                                  )[0]?.fb_profile_picture
                                : ProfilePhoto
                            }
                            alt=""
                          />
                        </div>
                        {profiles?.filter((el) => el.fb_user_id != local_fb_id)
                          .length > 0 ? (
                          <div className="profile-option-listings">
                            <ul>
                              {profiles
                                ?.filter((el) => el.fb_user_id != local_fb_id)
                                .map((el, key) => {
                                  return (
                                    <li key={key} data-tooltip={el.name}>
                                      <span
                                        className="sub-profiles"
                                        onClick={() =>
                                          clickInImage(el.fb_user_id)
                                        }
                                      >
                                        <span>
                                          <img
                                            src={el?.fb_profile_picture}
                                            alt=""
                                          />
                                        </span>
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        ) : (
                          ""
                        )}
                        <button className="add-new-profile text-center btn-transparent">
                          <svg
                            width="38"
                            height="38"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 16H20V20H16V22H20V26H22V22H26V20H22V16ZM21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.59 29 13 25.41 13 21C13 16.59 16.59 13 21 13C25.41 13 29 16.59 29 21C29 25.41 25.41 29 21 29Z"
                              fill="#767485"
                            />
                            <rect
                              x="1"
                              y="1"
                              width="40"
                              height="40"
                              rx="20"
                              stroke="#767485"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="4 8"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="current-profile-info-wraper">
                        <button
                          className="btn-transparent close-popup"
                          onClick={setShowProfileFn}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.5 4.5L4.5 13.5"
                              stroke="#9A9AA9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.5 4.5L13.5 13.5"
                              stroke="#9A9AA9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <div className="profile-inner-wraper">
                          <div className="profile-popup-info">
                            <div className="img-section">
                              <img
                                src={
                                  profiles?.filter(
                                    (el) => el.fb_user_id == local_fb_id
                                  )[0]?.fb_profile_picture
                                    ? profiles?.filter(
                                        (el) => el.fb_user_id == local_fb_id
                                      )[0]?.fb_profile_picture
                                    : ProfilePhoto
                                }
                                className="profile-main"
                                alt=""
                              />
                              <span className="profile-status active"></span>
                            </div>
                            <div className="profiles-informations">
                              {console.log("profiles", profiles)}
                              <p>
                                {profiles?.filter(
                                  (el) => el.fb_user_id == local_fb_id
                                )[0]?.name
                                  ? profiles?.filter(
                                      (el) => el.fb_user_id == local_fb_id
                                    )[0]?.name
                                  : "Anonymous"}
                              </p>
                              <span>{userEmail}</span>
                            </div>
                          </div>

                          <div className="popup-menu" onClick={closePopupFn}>
                            <ul>
                              <li>
                                <NavLink to="/">My Profile</NavLink>
                              </li>
                              <li>
                                <NavLink to="/settings/my-settings">
                                  My Settings
                                </NavLink>
                              </li>
                              <li>
                                <NavLink to="/">Rewards</NavLink>
                              </li>
                              <li>
                                <NavLink to="/">Trash</NavLink>
                              </li>
                              <li>
                                <NavLink onClick={logoOut}>Logout</NavLink>
                              </li>
                            </ul>
                          </div>
                          <div className="popup-menu lower-menu">
                            <button className="btn-primary">Upgrade Now</button>
                            <ul>
                              <li onClick={closePopupFn}>
                                <NavLink to="/">Help</NavLink>
                              </li>
                              <li className="mode-changer">
                                Dark Mode
                                <Themewitch extraClass="mode-change-sidebar" />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </li>
              <li className="nav-menu closed-only">
                <button
                  className="btn-transparent logout-btn"
                  onClick={logoOut}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.1601 11.3079C13.5391 11.3079 13.8388 11.6139 13.8388 12.001C13.8388 12.379 13.5391 12.694 13.1601 12.694H7.87143V16.9965C7.87143 19.2017 9.62549 21.0019 11.7938 21.0019H16.0864C18.2459 21.0019 20 19.2107 20 17.0055V7.00543C20 4.79119 18.2371 3 16.0776 3H11.7762C9.62549 3 7.87143 4.79119 7.87143 6.99643V11.3077H4.28841L5.67453 9.87658C5.93443 9.60655 5.93443 9.1655 5.67453 8.89547C5.41463 8.61644 4.99013 8.61644 4.73024 8.88647L2.20056 11.5058C2.07061 11.6408 2.00131 11.8118 2.00131 12.0008C2.00131 12.1808 2.07061 12.3608 2.20056 12.4869L4.73024 15.1061C4.86018 15.2412 5.03345 15.3132 5.19805 15.3132C5.37132 15.3132 5.54458 15.2412 5.67453 15.1061C5.93443 14.8361 5.93443 14.3951 5.67453 14.125L4.28841 12.6939H7.875V11.3079H13.1601Z"
                      fill="#BDBDBD"
                    />
                  </svg>
                </button>
              </li>
            </>
          )}

          {!sidebarToogle && (
            <>
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
                      profiles?.filter((el) => el.fb_user_id == local_fb_id)[0]
                        ?.fb_profile_picture
                        ? profiles?.filter(
                            (el) => el.fb_user_id == local_fb_id
                          )[0]?.fb_profile_picture
                        : ProfilePhoto
                    })`,
                  }}
                >
                  {/* <img src={profiles?.filter((el) => el.fb_user_id == local_fb_id)[0]?.fb_profile_picture} alt="" /> */}
                </span>

                {isComponentVisible && (
                  <>
                    <div
                      className={
                        authenticated ? "profile-popup" : "profile-popup hidden"
                      }
                    >
                      <div className="profile-listings-sec-wraper">
                        <div className="main-profile-selected">
                          {/* <img src={profiles?.filter((el) => el.fb_user_id == local_fb_id)[0]?.fb_profile_picture} alt="" /> */}
                          <img
                            src={
                              profiles?.filter(
                                (el) => el.fb_user_id == local_fb_id
                              )[0]?.fb_profile_picture
                                ? profiles?.filter(
                                    (el) => el.fb_user_id == local_fb_id
                                  )[0]?.fb_profile_picture
                                : ProfilePhoto
                            }
                            alt=""
                          />
                        </div>
                        {profiles?.filter((el) => el.fb_user_id != local_fb_id)
                          .length > 0 ? (
                          <div className="profile-option-listings">
                            <ul>
                              {profiles
                                ?.filter((el) => el.fb_user_id != local_fb_id)
                                .map((el, key) => {
                                  return (
                                    <li key={key} data-tooltip={el.name}>
                                      <span
                                        className="sub-profiles"
                                        onClick={() =>
                                          clickInImage(el.fb_user_id)
                                        }
                                      >
                                        <span>
                                          <img
                                            src={el?.fb_profile_picture}
                                            alt=""
                                          />
                                        </span>
                                      </span>
                                    </li>
                                  );
                                })}
                            </ul>
                          </div>
                        ) : (
                          ""
                        )}
                        <button className="add-new-profile text-center btn-transparent">
                          <svg
                            width="38"
                            height="38"
                            viewBox="0 0 42 42"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 16H20V20H16V22H20V26H22V22H26V20H22V16ZM21 11C15.48 11 11 15.48 11 21C11 26.52 15.48 31 21 31C26.52 31 31 26.52 31 21C31 15.48 26.52 11 21 11ZM21 29C16.59 29 13 25.41 13 21C13 16.59 16.59 13 21 13C25.41 13 29 16.59 29 21C29 25.41 25.41 29 21 29Z"
                              fill="#767485"
                            />
                            <rect
                              x="1"
                              y="1"
                              width="40"
                              height="40"
                              rx="20"
                              stroke="#767485"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="4 8"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="current-profile-info-wraper">
                        <button
                          className="btn-transparent close-popup"
                          onClick={setShowProfileFn}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.5 4.5L4.5 13.5"
                              stroke="#9A9AA9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M4.5 4.5L13.5 13.5"
                              stroke="#9A9AA9"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <div className="profile-inner-wraper">
                          <div className="profile-popup-info">
                            <div className="img-section">
                              <img
                                src={
                                  profiles?.filter(
                                    (el) => el.fb_user_id == local_fb_id
                                  )[0]?.fb_profile_picture
                                    ? profiles?.filter(
                                        (el) => el.fb_user_id == local_fb_id
                                      )[0]?.fb_profile_picture
                                    : ProfilePhoto
                                }
                                className="profile-main"
                                alt=""
                              />
                              <span className="profile-status active"></span>
                            </div>
                            <div className="profiles-informations">
                              {console.log("profiles", profiles)}
                              <p>
                                {profiles?.filter(
                                  (el) => el.fb_user_id == local_fb_id
                                )[0]?.name
                                  ? profiles?.filter(
                                      (el) => el.fb_user_id == local_fb_id
                                    )[0]?.name
                                  : "Anonymous"}
                              </p>
                              <span>{userEmail}</span>
                            </div>
                          </div>

                          <div className="popup-menu" onClick={closePopupFn}>
                            <ul>
                              <li>
                                <NavLink to="/">My Profile</NavLink>
                              </li>
                              <li>
                                <NavLink to="/settings/my-settings">
                                  My Settings
                                </NavLink>
                              </li>
                              <li>
                                <NavLink to="/">Rewards</NavLink>
                              </li>
                              <li>
                                <NavLink to="/">Trash</NavLink>
                              </li>
                              <li>
                                <NavLink onClick={logoOut}>Logout</NavLink>
                              </li>
                            </ul>
                          </div>
                          <div className="popup-menu lower-menu">
                            <button className="btn-primary">Upgrade Now</button>
                            <ul>
                              <li onClick={closePopupFn}>
                                <NavLink to="/">Help</NavLink>
                              </li>
                              <li className="mode-changer">
                                Dark Mode
                                <Themewitch extraClass="mode-change-sidebar" />
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </li>
              <li className="nav-menu opened-only">
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
              </li>
              <li className="nav-menu opened-only">
                <button className="btn-primary upgrade-btn">Upgrade</button>
              </li>
              <li className="nav-menu opened-only">
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
              </li>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};
export default Sidebar;
