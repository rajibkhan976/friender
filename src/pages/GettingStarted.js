import { useState, useEffect, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import FacebookConnect from "../components/common/FacebookConnect";
import Award from "../components/common/Award";
import Bulb from "../assets/images/bulb.png";
import extensionAccesories from "../configuration/extensionAccesories";
import {
  saveUserProfile,
  fetchUserProfile,
} from "../services/authentication/facebookData";
import { getFriendList } from "../actions/FriendsAction";
import helper from "../helpers/helper";
import {
  setProfileSpaces,
  setDefaultProfileId,
  addProfileSpace,
} from "../actions/ProfilespaceActions";
// import socket  from "../configuration/socket-connection";
// import {fetchFriendList} from "../services/friends/FriendListServices"
import { io } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
//import Video from "../assets/images/video.png";
// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const extInstallationChkDelay = 1000 * 5; // 5 secs
const token = localStorage.getItem("fr_token");

// // if ( token && (!socket.connected || !socket.auth || !socket.auth.token) ){
//   console.log("socket connection from GS page")
//   let socket = io(SOCKET_URL, {
//     transports: ["websocket", "polling"], // use WebSocket first, if available
//     auth: {token: localStorage.getItem("fr_token")}
//   });
// //}

const GettingStartedPage = (props) => {
  const dispatch = useDispatch();
  // let token_onboarding = localStorage.getItem('fr_onboarding');
  // console.log("fr_onboarding is :" , token_onboarding);
  const [installFrinder, setInstallFrinder] = useState(false);
  const [installFrinderLoader, setInstallFrinderLoader] = useState(true);
  const [facebookConnect, setFacebookConnect] = useState(false);
  const [facebookConnectLoader, setFacebookConnectLoader] = useState(true);
  // const [connectingFacebook, setConnectingFacebook] = useState(false);
  const [syncFriends, setSyncFriends] = useState(false);
  const [syncFriendsLoader, setSyncFriendsLoader] = useState(false);
  // const [fbConnected, setFbConnected] = useState(false);
  const [isFriendlistSynced, setIsFriendlistSynced] = useState(false);
  //const [forthStep, setForthStep] = useState(false);
  const [fbProfile, setFbProfile] = useState({});
  const [totalFriends, setTotalFriends] = useState(0);
  const [syncedFrieneds, setSyncedFrieneds] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const profiles = useSelector((state) => state.profilespace.profiles);
  const {isSynced, setIsSynced}=useOutletContext();

  // useEffect(() => {
  //   console.log("socket", socket, localStorage.getItem("fr_token"))
  //   if (!socket.connected || !socket.auth || !socket.auth.token){
  //     console.log("reconnect socket from GS")
  //     socket = io(SOCKET_URL, {
  //       transports: ["websocket", "polling"], // use WebSocket first, if available
  //       auth: {token: localStorage.getItem("fr_token")}
  //     });
  //   }
  //   socket.on('connect', function () {
  //     console.log("Joining socket")
  //     socket.emit('join', {token: localStorage.getItem("fr_token")});
  //   });
  //   socket.on("disconnect", (reason) => {
  //     console.log("disconnect due to " + reason);
  //     socket.connect();
  //   });
  //   socket.on("connect_error", (e) => {
  //     console.log("There Is a connection Error", e);
  //     socket.io.opts.transports = ["polling","websocket",];
  //   });

  // }, []);

  // socket.on("finalFriendList", (facebookFriendList)=>{
  //   console.log("--", facebookFriendList.friendListCount);
  //   if(facebookFriendList.friendListCount >= 0){
  //     setIsFriendlistSynced(true);
  //     setIsSynced(true)
  //     setIsSyncing(false)
  //   }
  // });

  // socket.on("sendUpdate", (facebookFriendListUpdate)=>{
  //   // console.log("sendUpdate ::: ", facebookFriendListUpdate);

  //   if (facebookFriendListUpdate?.isSyncing) {
  //     helper.setCookie("fr_isSyncing", facebookFriendListUpdate?.isSyncing);
  //     localStorage.setItem("fr_update", facebookFriendListUpdate?.update);
  //   } else {
  //     setTimeout(() => {
  //       console.log("deleting cookie from GS")
  //       localStorage.setItem("fr_update", "");
  //       helper.deleteCookie("fr_isSyncing");
  //     }, 1000*30)
  //   }

  // });

  useEffect(() => {
    setIsSynced(false);
    (async () => {
      extInstallationStatus();
      setIsSyncing(
        localStorage.getItem("fr_isSyncing")
          ? localStorage.getItem("fr_isSyncing") === "active"
            ? true
            : false
          : false
      );
      // setSyncFriendsLoader(localStorage.getItem("fr_isSyncing") === "active" ? true : false);
      const friendCountPayload = {
        action: "syncprofile",
        frLoginToken: localStorage.getItem("fr_token"),
      };
      const facebookProfile = await extensionAccesories.sendMessageToExt(
        friendCountPayload
      );
      localStorage.setItem("fr_current_fbId", facebookProfile.uid);
      let currentLoggedInFbUser = facebookProfile.uid;
      let defaultProfile = localStorage.getItem("fr_default_fb");

      // Set default profile
      // remove below if checking(only) to achive loggedin user as default
      if (!localStorage.getItem("fr_default_fb")) {
        console.log("default fbid is not found ---->");
        const profileSpaces = await fetchUserProfile();
        const currentProfilesFromDatabase =
          profileSpaces.length > 0
            ? profileSpaces.filter(
                (el) =>
                  el &&
                  el?.fb_user_id?.toString() ===
                    facebookProfile?.uid?.toString()
              )
            : [];

        // isCurrentProfileAvailable =  currentProfilesFromDatabase.length > 0 ? true : false; //localStorage.getItem("fr_default_fb") ? (localStorage.getItem("fr_default_fb") == facebookProfile.uid ? true : false) :

        if (currentProfilesFromDatabase.length) {
          console.log("default user set in useEffect --->");
          defaultProfile =
            currentProfilesFromDatabase[0]?.fb_user_id.toString();
          localStorage.setItem("fr_default_fb", defaultProfile);
          dispatch(setDefaultProfileId(defaultProfile));
        }
      }

      console.log("facebookProfile ::: ", facebookProfile, defaultProfile);
      setFacebookConnectLoader(false);

      let isCurrentProfileAvailable = false;
      if (Number(currentLoggedInFbUser) === Number(defaultProfile)) {
        isCurrentProfileAvailable = true;
      }

      if (facebookProfile) {
        // setFacebookConnectLoader(false);
        setFbProfile({
          ...facebookProfile,
          isCurrentProfileAvailable: isCurrentProfileAvailable,
        });
        setFacebookConnect(
          facebookProfile?.isFbLoggedin &&
            isCurrentProfileAvailable &&
            Number(currentLoggedInFbUser) === Number(defaultProfile)
            ? true
            : false
        );

        console.log(
          "got fb profile",
          facebookProfile?.isFbLoggedin && isCurrentProfileAvailable
            ? true
            : false
        );
      }

      // console.log("currentProfilesFromDatabase ::: ", currentProfilesFromDatabase)

      console.log("isCurrentProfileAvailable", isCurrentProfileAvailable);

      if (isCurrentProfileAvailable) {
        if (Number(currentLoggedInFbUser) === Number(defaultProfile)) {
          console.log("default user logged in fb");
          setIsSynced(true);
          setFacebookConnect(true);
          setFacebookConnect(true);
          setFacebookConnectLoader(false);
          setSyncFriendsLoader(false);
          setSyncFriends(false);
          setIsFriendlistSynced(false);
          setIsSyncing(false);

          console.log("friend lenght found in fb loader - ", facebookConnect);
        } else {
          console.log(
            "current fb logged user is not default user",
            currentLoggedInFbUser,
            defaultProfile,
            currentLoggedInFbUser === defaultProfile
          );
          setFacebookConnectLoader(false);
          setFacebookConnect(false);
          return true;
        }
      }
      // const getCurrentFbProfile = await fetchUserProfile()
    })();
  }, []);

  const extInstallationStatus = async () => {
    let isInstalled = await extensionAccesories.isExtensionInstalled({
      action: "extensionInstallation",
      frLoginToken: localStorage.getItem("fr_token"),
    });

    if (isInstalled) {
      //console.log("Extension installed")
      setInstallFrinderLoader(false);
      setInstallFrinder(true);
      clearInterval(checkInstallationIntv);
    } else {
      setInstallFrinder(false);
    }
  };

  const checkInstallationIntv = setInterval(() => {
    if (!installFrinder) {
      extInstallationStatus();
    }
  }, extInstallationChkDelay);

  const setConnectingFacebookFn = async (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const connectProfile = async (e) => {
    e.preventDefault();
    console.log("connect profile");
    // store facebook info in DB
    //if successfully done
    setFacebookConnectLoader(true);
    const facebookProfile = await extensionAccesories.sendMessageToExt({
      action: "syncprofile",
      frLoginToken: localStorage.getItem("fr_token"),
    });
    if (facebookProfile?.uid != fbProfile?.uid) {
      alert(
        "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
          localStorage.getItem("fr_default_fb") +
          "Or click on refresh."
      );
      setFacebookConnectLoader(false);
      return;
    }

    const getCurrentFbProfile = await fetchUserProfile();
    const currentProfilesFromDatabase =
      getCurrentFbProfile.length > 0
        ? getCurrentFbProfile.filter(
            (el) =>
              el &&
              el?.fb_user_id?.toString() === facebookProfile?.uid?.toString()
          )
        : [];

    // console.log("fbProfile ::::::: ",fbProfile)

    // console.log("userProfileRes :::::::::::::::: ", userProfileRes)

    localStorage.setItem("fr_current_fbId", fbProfile.uid.toString());

    if (currentProfilesFromDatabase.length) {
      console.log("set default id from connect prof----->");
      localStorage.setItem("fr_default_fb", fbProfile.uid.toString());
      dispatch(setDefaultProfileId(fbProfile.uid.toString()));
    }

    setOpenModal(false);
    setFacebookConnect(true);
    setFbProfile({ ...fbProfile, isfbProfile: false });
    setFacebookConnectLoader(false);
    setIsSynced(currentProfilesFromDatabase.length ? true : false);
    setSyncFriends(false);
    setIsSyncing(false);
    setSyncFriendsLoader(false);
  };

  const refreshProfile = async (e) => {
    e.preventDefault();
    console.log("Refreshing fb connection");
    const friendCountPayload = {
      action: "syncprofile",
      frLoginToken: localStorage.getItem("fr_token"),
    };
    const facebookProfile = await extensionAccesories.sendMessageToExt(
      friendCountPayload
    );
    // const getCurrentFbProfile = await fetchUserProfile()
    // setAllProfileSpace(getCurrentFbProfile);
    if (facebookProfile) {
      // const isCurrentProfileAvailable = getCurrentFbProfile?.filter(el => el.fb_user_id === facebookProfile.uid).length > 0 ? true : false;
      // setFbProfile({...facebookProfile, isCurrentProfileAvailable : isCurrentProfileAvailable});
      setFbProfile(facebookProfile);
      setOpenModal(true);
    }
  };

  // Check syncing progress if failed to listen socket
  const checkSyncProgress = async () => {
    let checkingIntv = setInterval(() => {
      console.log("checking GS sync status");
      let isSyncing = helper.getCookie("fr_isSyncing");
      let syncState = localStorage.getItem("fr_update");
      if (isSyncing && syncState != "Syncing Friends...") {
        setIsFriendlistSynced(true);
        setIsSynced(true);
        setIsSyncing(false);
        clearInterval(checkingIntv);
      }
    }, 1000 * 30);
  };
  const checkSyncProgressCount = async () => {
    let totalFrndLenth = localStorage.getItem("friendLength");

    let checkingIntv = setInterval(() => {
      let progressCount = localStorage.getItem("fr_countBadge");
      setSyncedFrieneds(localStorage.getItem("fr_countBadge"));
      console.log("Check badge count", progressCount, totalFrndLenth);
      if (Number(totalFrndLenth) == Number(progressCount)) {
        clearInterval(checkingIntv);
        localStorage.removeItem("fr_countBadge");
      }
    }, 500);
  };
  const setSyncFriendsFn = async (e) => {
    setSyncFriendsLoader(true);
    const facebookProfile = await extensionAccesories.sendMessageToExt({
      action: "syncprofile",
      frLoginToken: localStorage.getItem("fr_token"),
    });
    if (facebookProfile?.uid != localStorage.getItem("fr_current_fbId")) {
      alert(
        "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
          localStorage.getItem("fr_current_fbId")
      );
      setSyncFriendsLoader(false);
      return;
    }

    // Save profile
    const profilebody = {
      userId: fbProfile.uid.toString(),
      name: fbProfile.text,
      profilePicture: fbProfile.photo,
      profileUrl: "https://www.facebook.com" + fbProfile.path,
    };
    const profileSpacePayload = {
      name: fbProfile.text,
      fb_user_id: fbProfile.uid.toString(),
      fb_profile_picture: fbProfile.photo,
      fb_profile_url: "https://www.facebook.com" + fbProfile.path,
    };
    const userProfileRes = await saveUserProfile(profilebody);

    if (userProfileRes) {
      console.log("set default from sunc frnd----->>>");
      localStorage.setItem("fr_default_fb", profilebody.userId);
      dispatch(addProfileSpace(profileSpacePayload));
      dispatch(setDefaultProfileId(fbProfile.uid.toString()));
    }
    helper.setCookie("fr_isSyncing", "active");
    localStorage.setItem("fr_update", "Syncing Friends...");
    setIsSyncing(true);
    checkSyncProgress();

    const friendCountPayload = {
      action: "syncFriendLength",
      frLoginToken: localStorage.getItem("fr_token"),
    };
    console.log("sending request for fr lenght");
    const facebookFriendLength = await extensionAccesories.sendMessageToExt(
      friendCountPayload
    );
    console.log("Friend lenght resp", facebookFriendLength);
    if (facebookFriendLength) {
      setSyncFriendsLoader(false);
      console.log("FR len dom", facebookFriendLength.friendLength);
      setTotalFriends(facebookFriendLength.friendLength);
      localStorage.setItem("friendLength", facebookFriendLength.friendLength);

      setSyncFriends(true);
      const friendListPayload = {
        action: "syncFriendList",
        frLoginToken: localStorage.getItem("fr_token"),
      };

      // Check badge count
      checkSyncProgressCount();
      let syncResp = await extensionAccesories.sendMessageToExt(
        friendListPayload
      );
      console.log("syncResp", syncResp);
    }
  };

  return (
    <div className="main-content-inner content-wraper">
      <div className="heading-text-wraper">
        <h3>Getting Started</h3>
        <p>
          {" "}
          Welcome to Friender, please complete some simple steps to achieve a
          seamless experience in friender.
        </p>
      </div>
      <div className="setup-wraper d-flex">
        <span className="bulb-icon">
          <img src={Bulb} alt="" />
        </span>
        <h5>Steps to make quality friends and track engagements</h5>
      </div>
      <div className="steps-wraper">
        <div
          className={
            installFrinder ? "ind-steps d-flex activated" : "ind-steps d-flex"
          }
        >
          <span className="step-icon m-right-25">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                opacity="0.2"
                cx="15"
                cy="14.9997"
                r="11.6667"
                fill="white"
              />
              <path
                opacity="0.5"
                d="M10.8333 15.0003L13.7783 18.213C13.8378 18.2779 13.94 18.2779 13.9995 18.213L20 11.667"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="step-info m-right-25">Install Friender Extension</p>
          {installFrinder ? (
            <>
              {installFrinderLoader && (
                <div className="lds-ring">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              {!installFrinderLoader && (
                <span className="step-action">Installed</span>
              )}
            </>
          ) : (
            <span className="step-action">
              <a
                href="https://chrome.google.com/webstore/detail/friender/gjlalklkjpjnglmnbhgioefkfgaigjkp/"
                target="_blank"
              >
                Install now
              </a>
            </span>
          )}
        </div>

        {installFrinder && (
          <>
            <div
              className={
                facebookConnect
                  ? "ind-steps d-flex activated"
                  : "ind-steps d-flex"
              }
            >
              <span className="step-icon m-right-25">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    opacity="0.2"
                    cx="15"
                    cy="14.9997"
                    r="11.6667"
                    fill="white"
                  />
                  <path
                    opacity="0.5"
                    d="M10.8333 15.0003L13.7783 18.213C13.8378 18.2779 13.94 18.2779 13.9995 18.213L20 11.667"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <p className="step-info m-right-25">
                Let us connect to your facebook account
              </p>
              {facebookConnectLoader ? (
                <div className="lds-ring">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                !openModal && (
                  <>
                    {facebookConnect ? (
                      <>
                        <span className="step-action">Connected</span>
                      </>
                    ) : (
                      <span
                        className="step-action"
                        onClick={setConnectingFacebookFn}
                      >
                        {" "}
                        Connect now
                      </span>
                    )}
                  </>
                )
              )}
              {openModal && <span className="step-action"> Connecting</span>}
            </div>
            {!facebookConnect && openModal && (
              <FacebookConnect
                fbProfile={fbProfile}
                refreshProfile={refreshProfile}
                connectProfile={connectProfile}
                facebookConnect={facebookConnect}
              />
            )}
          </>
        )}
        {facebookConnect && (
          <div
            className={
              syncFriends > 0 || isSynced
                ? "ind-steps d-flex activated"
                : "ind-steps award-step d-flex"
            }
          >
            <span className="step-icon sync-facebook m-right-25">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  opacity="0.2"
                  cx="15"
                  cy="14.9997"
                  r="11.6667"
                  fill="white"
                />
                <path
                  opacity="0.5"
                  d="M10.8333 15.0003L13.7783 18.213C13.8378 18.2779 13.94 18.2779 13.9995 18.213L20 11.667"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p className="step-info m-right-25">
              Sync your friends list and engagement{" "}
            </p>
            {syncFriendsLoader ? (
              <div className="lds-ring">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (syncFriends || isSyncing) && !isSynced ? (
              <>
                <div className="lds-ring">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                {syncedFrieneds > 0 && (
                  <span className="step-action">
                    {syncedFrieneds} / {totalFriends}
                  </span>
                )}
              </>
            ) : isSynced ? (
              <span className="step-action">Synced</span>
            ) : (
              <span className="step-action" onClick={setSyncFriendsFn}>
                Sync now{" "}
              </span>
            )}
          </div>
        )}
        {isSynced && (
          <>
            <Award />
            {/* <div className={forthStep ? "ind-steps d-flex activated": "ind-steps d-flex"}>
                        <span className="step-icon m-right-25">
                          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle opacity="0.2" cx="15" cy="14.9997" r="11.6667" fill="white"/>
                            <path opacity="0.5" d="M10.8333 15.0003L13.7783 18.213C13.8378 18.2779 13.94 18.2779 13.9995 18.213L20 11.667" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </span>
                        <p className="step-info m-right-25">Watch video tutorial</p>
                        <p className="step-action" onClick={setForthStepFn}>Watch now</p>
                      </div> */}
          </>
        )}
        {/* {forthStep &&
                      <div className="intermediate-wraper">
                      <div className="video-wraper">
                        <img src={Video} alt=''/>
                      </div>
                    </div>
                    } */}
      </div>
    </div>
  );
};

export default GettingStartedPage;
