import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "../components/common/Footer";
import Sidebar from "../components/common/Sidebar";
import FacebookConnect from "../components/common/FacebookConnect";
import Award from "../components/common/Award";
import module from "./Auth/styling/authpages.module.scss";
import Bulb from "../assets/images/bulb.png";
import extensionAccesories from "../configuration/extensionAccesories";
import {saveUserProfile, fetchUserProfile} from "../services/authentication/facebookData"
import { getFriendList } from "../actions/FriendsAction";
// import {fetchFriendList} from "../services/friends/FriendListServices"
import { io } from 'socket.io-client'
//import Video from "../assets/images/video.png";
const ENDPOINTEST = process.env.REACT_APP_SOCKET_URL_LOCAL;
const extInstallationChkDelay = 1000*5; // 5 secs

const socket = io(ENDPOINTEST, {
  transports: ["websocket"] // use WebSocket first, if available
});
socket.on("connect_error", () => {
  // console.log("There Is a connection Error");
  socket.io.opts.transports = ["polling", "websocket"];
});

const GettingStartedPage = (props) => {
  const dispatch = useDispatch();
  let token_onboarding = localStorage.getItem('fr_onboarding');
  // console.log("fr_onboarding is :" , token_onboarding);
  const [installFrinder, setInstallFrinder] = useState(false);
  const [installFrinderLoader, setInstallFrinderLoader] = useState(false);
  const [facebookConnect, setFacebookConnect] = useState(false);
  const [facebookConnectLoader, setFacebookConnectLoader] = useState(false);
  // const [connectingFacebook, setConnectingFacebook] = useState(false);
  const [syncFriends, setSyncFriends] = useState(false);
  const [syncFriendsLoader, setSyncFriendsLoader] = useState(false);
  // const [fbConnected, setFbConnected] = useState(false);
  const [isFriendlistSynced, setIsFriendlistSynced] = useState(false);
  //const [forthStep, setForthStep] = useState(false);
  const [fbProfile, setFbProfile] = useState({});
  const [totalFriends, setTotalFriends] = useState(0);
  const [syncedFrieneds, setSyncedFrieneds] = useState(0);
  const [allProfileSpace, setAllProfileSpace] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isSynced, setIsSynced] = useState(false);


  socket.on("friendlistcount", (count)=>{
    // console.log("count : ", count)
    setSyncedFrieneds(count.count);
  });

  socket.on("finalFriendList", (facebookFriendList)=>{
    // console.log("facebookFriendList ::: ", facebookFriendList, facebookFriendList.friendListCount);
    if(facebookFriendList.friendListCount && facebookFriendList.friendListCount > 0){
      // console.log("facebookFriendList ::: ", facebookFriendList)
      setSyncedFrieneds(facebookFriendList.friendListCount);
      setIsFriendlistSynced(true);
      setIsSynced(true)
    }
  });

  useEffect(()=>{
    (async () => {
      setFacebookConnectLoader(true);
      setSyncFriendsLoader(true);
      setFacebookConnect(false);
      await extInstallationStatus();

      const friendCountPayload = {
        action : "syncprofile", frLoginToken : localStorage.getItem("fr_token")
      }
      const facebookProfile = await extensionAccesories.sendMessageToExt(friendCountPayload);
      const getCurrentFbProfile = await fetchUserProfile({token : localStorage.getItem('fr_token')})
      const gotFbToken = localStorage.getItem('fr_default_fb');
      setAllProfileSpace(getCurrentFbProfile);
      localStorage.setItem("fr_current_fbId", facebookProfile.uid)
      // console.log ("The allProfileSpace is showing", facebookProfile);
      const currentProfilesFromDatabase = getCurrentFbProfile.filter(el => el && (el.fb_user_id === facebookProfile.uid))
      // console.log("facebookProfile.uid ", facebookProfile.uid)
      // console.log("localStorage.getItem(fr_default_fb).uid ", localStorage.getItem("fr_default_fb"))
      const isCurrentProfileAvailable =  currentProfilesFromDatabase.length > 0 ? true : false; //localStorage.getItem("fr_default_fb") ? (localStorage.getItem("fr_default_fb") == facebookProfile.uid ? true : false) :
      if(facebookProfile)
      {
        setFbProfile({...facebookProfile, isCurrentProfileAvailable : isCurrentProfileAvailable});
        setFacebookConnect(facebookProfile.isFbLoggedin && isCurrentProfileAvailable ? true : false);
        setFacebookConnectLoader(false);
      }

      if(currentProfilesFromDatabase && !gotFbToken) {
        //const userToken = localStorage.getItem("fr_token");
        localStorage.setItem('fr_default_fb', currentProfilesFromDatabase[0].fb_user_id.toString());
      }

      // console.log("currentProfilesFromDatabase ::: ", currentProfilesFromDatabase)
      if(isCurrentProfileAvailable)
      {
      console.log("currentProfilesFromDatabase.length ? currentProfilesFromDatabase[0].fb_user_id.toString() ::: ", currentProfilesFromDatabase.length && currentProfilesFromDatabase[0].fb_user_id.toString())
        dispatch(getFriendList({"token" : localStorage.getItem('fr_token'), "fbUserId" : currentProfilesFromDatabase.length ? currentProfilesFromDatabase[0].fb_user_id.toString() : facebookProfile.uid.toString()})).unwrap()
          .then((response) => {
            // console.log("response :::b ", response)
            if(response && response.data && response.data.length>0 && response.data[0].friend_details.length > 0){
              setIsSynced(true); 
              setSyncFriendsLoader(false);
            }else {
              // console.log("jhsfbhjkbghj")
              setIsSynced(false);
              setFacebookConnect(true);
              setSyncFriendsLoader(false);
              setIsFriendlistSynced(false)
              setSyncFriends(false)
              setSyncFriendsLoader(false)
            }
          })
        }
      else if(!isCurrentProfileAvailable){
        console.log("isCurrentProfileAvailable", isCurrentProfileAvailable)
        setFacebookConnect(false);
        setIsSynced(false);
        setSyncFriendsLoader(false);
        setIsFriendlistSynced(false)
        setSyncFriends(false)
        setSyncFriendsLoader(false)
      }
    })();
  },[])

  const extInstallationStatus = async () => {
    let isInstalled = await extensionAccesories.isExtensionInstalled({
      action : "extensionInstallation", 
      frLoginToken : localStorage.getItem("fr_token")
    });

    if(isInstalled)
    { 
      console.log("Extension installed")
      setInstallFrinder(true);   
      clearInterval(checkInstallationIntv);
    } else {
       setInstallFrinder(false);
    }
  }

  const checkInstallationIntv = setInterval (() => {
    if (!installFrinder) {
      extInstallationStatus();
    }
  }, extInstallationChkDelay)

  const setConnectingFacebookFn = async (e) => {
    e.preventDefault();
    setOpenModal(true)
  };

  const connectProfile = async (e) => {
    e.preventDefault();
    // store facebook info in DB
    //if successfully done
    setFacebookConnectLoader(true);
    // console.log("fbProfile ::::::: ",fbProfile)
    const profilebody = {
                          "token" : localStorage.getItem("fr_token"),
                          "userId" : fbProfile.uid,
                          "name" : fbProfile.text,
                          "profilePicture" : fbProfile.photo,
                          "profileUrl" : "https://www.facebook.com" + fbProfile.path
                        }
    const userProfileRes = await saveUserProfile(profilebody);
    // console.log("userProfileRes :::::::::::::::: ", userProfileRes)
    if(userProfileRes){
      localStorage.setItem("fr_default_fb", profilebody.userId);
      localStorage.setItem("fr_current_fbId", profilebody.userId)
      // console.log("jhscgjhsdfghjg")
      setOpenModal(false)
      setFacebookConnect(true);
      setFbProfile({...fbProfile, isfbProfile : false});
      setFacebookConnectLoader(false);
      setIsSynced(false)
      setSyncFriends(false)
      setSyncFriendsLoader(false)
    }
  }

  const refreshProfile = async (e) => {
    e.preventDefault();
    const friendCountPayload = {
      action : "syncprofile", frLoginToken : localStorage.getItem("fr_token")
    }
    const facebookProfile = await extensionAccesories.sendMessageToExt(friendCountPayload);
    const getCurrentFbProfile = await fetchUserProfile({token : localStorage.getItem('fr_token')})
      setAllProfileSpace(getCurrentFbProfile);
      if(facebookProfile)
      {
        const isCurrentProfileAvailable = getCurrentFbProfile.filter(el => el.fb_user_id === facebookProfile.uid).length > 0 ? true : false;
        setFbProfile({...facebookProfile, isCurrentProfileAvailable : isCurrentProfileAvailable});
        setOpenModal(true)
      }
  }

  const setSyncFriendsFn = async(e) => {
    e.preventDefault();
    setSyncFriendsLoader(true);
    if(localStorage.getItem("fr_current_fbId") !== localStorage.getItem("fr_default_fb")){
      alert("Please login to following facebook account https://www.facebook.com/profile.php?id=" + localStorage.getItem("fr_default_fb"))
      setSyncFriendsLoader(false);
      return;
    }
    const friendCountPayload = {
      action : "syncFriendLength", frLoginToken : localStorage.getItem("fr_token")
    }

    const facebookFriendLength = await extensionAccesories.sendMessageToExt(friendCountPayload);
    if(facebookFriendLength){
      setSyncFriendsLoader(false);
      setTotalFriends(facebookFriendLength.friendLength.split(" ")[0]);
      // localStorage.setItem("friendLength", facebookFriendLength.friendLength)
      setSyncFriends(true)
      const friendListPayload = {
        action : "syncFriendList", frLoginToken : localStorage.getItem("fr_token")
      }
      await extensionAccesories.sendMessageToExt(friendListPayload);
    }
  };

  return (
          <div className="main-content-inner content-wraper">
            <div className="heading-text-wraper">
              <h3>Getting Started</h3>
              <p>
                {" "}
                Welcome to Friender, please complete some simple steps to
                achieve a seamless experience in friender.
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
                  installFrinder
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
                  Install Friender Extension
                </p>
                {installFrinder ? (
                  <>
                  {installFrinderLoader && <div className="lds-ring"><span></span><span></span><span></span><span></span></div>}
                  {!installFrinderLoader && <span className="step-action">Installed</span>}
                  </>
                ) : (
                  <span className="step-action" >
                    <a href="https://s3.amazonaws.com/extension.friender.io/dist.zip" target="_blank">Install now</a>
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
                    {facebookConnectLoader ? <div className="lds-ring"><span></span><span></span><span></span><span></span></div> :
                      (!openModal && <>
                            { facebookConnect ? (
                              <>
                              <span className="step-action">Connected</span>
                              </>
                            ) :  (
                              <span
                                className="step-action"
                                onClick={setConnectingFacebookFn}
                              > Connect now </span>
                            )}
                      </>)}
                    {openModal && <span
                        className="step-action"
                      > Connecting</span>}
                  </div>
                  {!facebookConnect && openModal && <FacebookConnect
                    fbProfile = {fbProfile}
                    refreshProfile={refreshProfile}
                    connectProfile={connectProfile}
                    facebookConnect={facebookConnect}
                />}
              </>
              )}
              {facebookConnect && (
                  <div
                    className={
                      (syncFriends > 0 || isSynced)
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
                    {syncFriendsLoader ? <div className="lds-ring"><span></span><span></span><span></span><span></span></div>
                     :
                     syncFriends ? (
                      <>
                      <span className="step-action">{syncedFrieneds} / {totalFriends}</span>
                      </>
                    ) : (
                        isSynced ? <span className="step-action">Synced</span> :
                        <span className="step-action" onClick={setSyncFriendsFn}>Sync now</span>
                    )}
                  </div>
              )}
              {(isFriendlistSynced || isSynced) && (
                <>
                  <Award 
                    friendsCount={totalFriends}
                  />
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