import { NavLink, useNavigate } from "react-router-dom";
import Themewitch from "../common/Themeswitch";
import ProfilePhoto from "../../assets/images/profilePhoto.png";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const SidebarPopUp = (props) => {

  const profiles = useSelector((state) => state.profilespace.profiles);
  const navigate = useNavigate();
  useEffect(() => {
    // console.log('props facebookAuthInfoStatus', props?.facebookAuthInfoStatus);
  }, [])
  // console.log("******** PROPS",props,profiles)
  
  // open profile on fb
  const openProfileonFb = (e) => {
    e.preventDefault();
    
    if (props?.facebookAuthInfoStatus) {
      // console.log('here');
      navigate(props?.facebookAuthInfoStatus?.link)
    } else if (props?.profiles) {
      // console.log('here', props?.profiles[0]?.fb_profile_url);
      navigate(props?.profiles[0]?.fb_profile_url)
    } else {
      // console.log('here');
      navigate('/')
    }
  }
  return (
    <div
    className="profile-popup"
    // className={
    //   props.authenticated ? "profile-popup" : "profile-popup hidden"
    // }
  >
    <div className="profile-listings-sec-wraper">
      <div className="main-profile-selected">
        {/* <img src={profiles?.filter((el) => el.fb_user_id == defaultProfileId)[0]?.fb_profile_picture} alt="" /> */}
        <img
          src={
            profiles && profiles.length && profiles[0]?.fb_profile_picture ? profiles[0]?.fb_profile_picture : props.facebookAuthInfoStatus?.picture?.data?.url?props.facebookAuthInfoStatus?.picture?.data?.url: ProfilePhoto
            // props.profiles?.filter(
            //   (el) => el.fb_user_id == props.defaultProfileId
            // )[0]?.fb_profile_picture
            //   ? props.profiles?.filter(
            //       (el) => el.fb_user_id == props.defaultProfileId
            //     )[0]?.fb_profile_picture
            //   : ProfilePhoto
          }
          alt=""
          loading="lazy"
        />
      </div>
      {/* {props.profiles?.filter(
        (el) => el.fb_user_id != props.defaultProfileId
      ).length > 0 ? (
        <div className="profile-option-listings">
          {props.authenticated && 
            <ul>
              {props.profiles
                ?.filter(
                  (el) => el.fb_user_id != props.defaultProfileId
                )
                .map((el, key) => {
                  return (
                    <li key={key} data-tooltip={el.name}>
                      <span
                        className="sub-profiles"
                        onClick={() =>
                          props.switchProfile(el.fb_user_id)
                        }
                      >
                        <span>
                          <img
                            src={el?.fb_profile_picture}
                            alt=""
                            loading="lazy"
                          />
                        </span>
                      </span>
                    </li>
                  );
                })}
            </ul>
          }
        </div>
      ) : (
        ""
      )} */}
      <button
        className="add-new-profile text-center btn-transparent"
        aria-label="button"
      >
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
        aria-label="button"
        onClick={props.setShowProfileFn}
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
        <NavLink 
          className="profile-popup-info"
          // onClick={e => openProfileonFb(e)}
          to={props?.facebookAuthInfoStatus ? props?.facebookAuthInfoStatus?.link : props?.profiles[0] ? props?.profiles[0]?.fb_profile_url : '/'}
          target="_blank"
        >
          <div className="img-section">
            <img
              src={
                profiles && profiles.length? profiles[0]?.fb_profile_picture : ProfilePhoto
                // props.profiles?.filter(
                //   (el) => el.fb_user_id == props.defaultProfileId
                // )[0]?.fb_profile_picture
                //   ? props.profiles?.filter(
                //       (el) =>
                //         el.fb_user_id == props.defaultProfileId
                //     )[0]?.fb_profile_picture
                //   : ProfilePhoto
              }
              className="profile-main"
              alt=""
              loading="lazy"
            />
            <span className="profile-status active"></span>
          </div>
          <div className="profiles-informations">
            {/* {console.log("profiles", profiles)} */}
            <p>
              {
                 profiles && profiles.length? profiles[0]?.name : "Anonymous"
              }
              {/* {props.profiles?.filter(
                (el) => el.fb_user_id == props.defaultProfileId
              )[0]?.name
                ? props.profiles?.filter(
                    (el) => el.fb_user_id == props.defaultProfileId
                  )[0]?.name
                : "Anonymous"} */}
            </p>
            <span>{props.userEmail}</span>
          </div>
        </NavLink>

        <div className="popup-menu" onClick={props.closePopupFn}>
          <ul>
            {/* <li className="no-click">
              <NavLink to="/">My Profile</NavLink>
            </li> */}
            <li>
              <NavLink to="/my-profile">
                My Profile
              </NavLink>
            </li>
            {props.authenticated && <li>
              <NavLink to="/settings/settings">
                Settings
              </NavLink>
            </li>}
            {/* <li className="no-click">
              <NavLink to="/">Rewards</NavLink>
            </li>
            <li className="no-click">
              <NavLink to="/">Trash</NavLink>
                </li>*/}
            <li onClick={props.logoOut} className="popup-logout">
              Logout
            </li>
          </ul>
        </div>
        <div className="popup-menu lower-menu">
          {/* <button className="btn-primary no-click">
            Upgrade Now
          </button> */}
          <ul>
            {/* <li onClick={props.closePopupFn}>
              <NavLink className="no-click" to="/">
                Help
              </NavLink>
            </li> */}
            {/* <li className="mode-changer">
              Dark Mode
              <Themewitch extraClass="mode-change-sidebar" />
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  </div>

    );
  };
  export default SidebarPopUp;