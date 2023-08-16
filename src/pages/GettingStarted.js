import { useState, useEffect, startTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FacebookConnect from "../components/common/FacebookConnect";
import Award from "../components/common/Award";
import Bulb from "../assets/images/bulb.png";
import extensionAccesories from "../configuration/extensionAccesories";
import {
  saveUserProfile,
  fetchUserProfile,
} from "../services/authentication/facebookData";
import { storeFriendListIndexDb } from "../actions/FriendsAction";
import helper from "../helpers/helper";
import {
  setProfileSpaces,
  setDefaultProfileId,
  addProfileSpace,
} from "../actions/ProfilespaceActions";
import {
  fetchFriendList
} from "../services/friends/FriendListServices";
import { io } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import ToolTipPro from "../components/common/ToolTipPro";
const extInstallationChkDelay = 1000 * 5; // 5 secs
const token = localStorage.getItem("fr_token");
const GettingStartedPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [accountMismatch,setAccountMismatch] = useState(false)
  const [fbAuthProfileId, setFbAuthProfileId] = useState(null)

  /**
   * The function @proceedFurther is responsible to check which screen user will be going to after facebook auth login.
   */
     const proceedFurther = () => {
      /**
       * 1. Checking if the user has reset the password or not.
       *    - If @password_reset_status is 1 then reset password is done.
       *    - If @password_reset_status is 0 then reset password is not done yet.
       * 
       * 2. Checking if the user has answerd all the on boarding questionaries or not.
       *    - If @user_onbording_status is 1 then on boarding questioneries has been answered.
       *    - If @user_onbording_status is 0 then on boarding questioneries has not been answered yet.
       */
      let password_reset_status = localStorage.getItem("fr_pass_changed");
      let user_onbording_status = localStorage.getItem("fr_onboarding");
      let facebookAuthInfo = JSON.parse(localStorage.getItem("fr_facebook_auth"));
      /**
       * Check if facebook auth is already authenticated, if not go back to auth :
       */
      if (facebookAuthInfo?.accessToken == undefined) {
        navigate("/facebook-auth")
      }
      /**
       * 1. @case1 the password is not reset then take the user to rest password screen
       * 2. @case2 If password is alredy reset then take the user to onBoarding questionaries screen
       * 3. @case3 onBoard questionaries is also already answered then take the user to getting-started screen.
       */
      if (password_reset_status != 1) {
        navigate("/reset-password");
      } else if (user_onbording_status != 1) {
        navigate("/onboarding");
      } else {
        navigate("/")
      }
    }
    
  useEffect(()=> {
   if(installFrinder){
    //Execute this once extension installed is confirmed : 
     
     connectProfile(false)
   }
  },[installFrinder])

  
  useEffect(()=> {
      // setIsSynced(false);
      //   (async () => {
      //     extInstallationStatus();

      //     // Checking with wrong flag
      //     // setIsSyncing(
      //     //   localStorage.getItem("fr_isSyncing")
      //     //     ? localStorage.getItem("fr_isSyncing") === "active"
      //     //       ? true
      //     //       : false
      //     //     : false
      //     // );





      //     // setSyncFriendsLoader(localStorage.getItem("fr_isSyncing") === "active" ? true : false);
      //     const friendCountPayload = {
      //       action: "syncprofile",
      //       frLoginToken: localStorage.getItem("fr_token"),
      //     };
          
      //     const facebookProfile = await extensionAccesories.sendMessageToExt(
      //       friendCountPayload
      //     );
      //     // localStorage.setItem("fr_current_fbId", facebookProfile.uid);
      //     // let currentLoggedInFbUser = facebookProfile.uid;
      //     // let defaultProfile = localStorage.getItem("fr_default_fb");

      //     // Set default profile
      //     // remove below if checking(only) to achive loggedin user as default
      //     // if (!localStorage.getItem("fr_default_fb")) {
      //     //   console.log("default fbid is not found ---->");
      //     //   const profileSpaces = await fetchUserProfile();
      //     //   // const currentProfilesFromDatabase =
      //     //   //   profileSpaces.length > 0
      //     //   //     ? profileSpaces.filter(
      //     //   //         (el) =>
      //     //   //           el &&
      //     //   //           el?.fb_user_id?.toString() ===
      //     //   //             facebookProfile?.uid?.toString()
      //     //   //       )
      //     //   //     : [];

      //     //   // isCurrentProfileAvailable =  currentProfilesFromDatabase.length > 0 ? true : false; //localStorage.getItem("fr_default_fb") ? (localStorage.getItem("fr_default_fb") == facebookProfile.uid ? true : false) :

      //     //   // if (currentProfilesFromDatabase.length) {
      //     //   //   console.log("default user set in useEffect --->");
      //     //   //   defaultProfile =
      //     //   //     currentProfilesFromDatabase[0]?.fb_user_id.toString();
      //     //   //   localStorage.setItem("fr_default_fb", defaultProfile);
      //     //   //   dispatch(setDefaultProfileId(defaultProfile));
      //     //   // }
      //     // }

      //     // setFacebookConnectLoader(false);

      //     // let isCurrentProfileAvailable = false;
      //     // if (Number(currentLoggedInFbUser) === Number(defaultProfile)) {
      //     //   isCurrentProfileAvailable = true;
      //     // }

      //     // if (facebookProfile) {
      //     //   // setFacebookConnectLoader(false);
      //     //   setFbProfile({
      //     //     ...facebookProfile,
      //     //     isCurrentProfileAvailable: isCurrentProfileAvailable,
      //     //   });
      //     //   setFacebookConnect(
      //     //     facebookProfile?.isFbLoggedin &&
      //     //       isCurrentProfileAvailable &&
      //     //       Number(currentLoggedInFbUser) === Number(defaultProfile)
      //     //       ? true
      //     //       : false
      //     //   );

      //     //   console.log(
      //     //     "got fb profile",
      //     //     facebookProfile?.isFbLoggedin && isCurrentProfileAvailable
      //     //       ? true
      //     //       : false
      //     //   );
      //     // }

      //     // console.log("currentProfilesFromDatabase ::: ", currentProfilesFromDatabase)

      //     // console.log("isCurrentProfileAvailable", isCurrentProfileAvailable);

      //     // if (isCurrentProfileAvailable) {
      //     //   if (Number(currentLoggedInFbUser) === Number(defaultProfile)) {
      //     //     console.log("default user logged in fb");
      //     //     setIsSynced(true);
      //     //     setFacebookConnect(true);
      //     //     setFacebookConnect(true);
      //     //     setFacebookConnectLoader(false);
      //     //     setSyncFriendsLoader(false);
      //     //     setSyncFriends(false);
      //     //     setIsFriendlistSynced(false);
      //     //     setIsSyncing(false);

      //     //     console.log("friend lenght found in fb loader - ", facebookConnect);
      //     //   } else {
      //     //     console.log(
      //     //       "current fb logged user is not default user",
      //     //       currentLoggedInFbUser,
      //     //       defaultProfile,
      //     //       currentLoggedInFbUser === defaultProfile
      //     //     );
      //     //     setFacebookConnectLoader(false);
      //     //     setFacebookConnect(false);
      //     //     return true;
      //     //   }
      //     // }
      //     // const getCurrentFbProfile = await fetchUserProfile()



      //     let checkConnectedProfile = await connectProfile(true)
      //     if(checkConnectedProfile){
      //       setIsSynced(true);
      //       setFacebookConnect(true);
      //       setFacebookConnect(true);
      //       setFacebookConnectLoader(false);
      //       setSyncFriendsLoader(false);
      //       setSyncFriends(false);
      //       setIsFriendlistSynced(false);
      //       setIsSyncing(false);
      //     }

      //   })();



    localStorage.setItem('onboaring_page_check',false)
    extInstallationStatus();
    proceedFurther()
  },[])

  // useEffect(() => {
  //   setIsSynced(false);
  //   (async () => {
      
  //     extInstallationStatus();
  //     setIsSyncing(
  //       localStorage.getItem("fr_isSyncing")
  //         ? localStorage.getItem("fr_isSyncing") === "active"
  //           ? true
  //           : false
  //         : false
  //     );
  //     // setSyncFriendsLoader(localStorage.getItem("fr_isSyncing") === "active" ? true : false);
  //     const friendCountPayload = {
  //       action: "syncprofile",
  //       frLoginToken: localStorage.getItem("fr_token"),
  //     };
      
  //     const facebookProfile = await extensionAccesories.sendMessageToExt(
  //       friendCountPayload
  //     );
  //     localStorage.setItem("fr_current_fbId", facebookProfile.uid);
  //     let currentLoggedInFbUser = facebookProfile.uid;
  //     let defaultProfile = localStorage.getItem("fr_default_fb");

  //     // Set default profile
  //     // remove below if checking(only) to achive loggedin user as default
  //     if (!localStorage.getItem("fr_default_fb")) {
  //       console.log("default fbid is not found ---->");
  //       const profileSpaces = await fetchUserProfile();
  //       // const currentProfilesFromDatabase =
  //       //   profileSpaces.length > 0
  //       //     ? profileSpaces.filter(
  //       //         (el) =>
  //       //           el &&
  //       //           el?.fb_user_id?.toString() ===
  //       //             facebookProfile?.uid?.toString()
  //       //       )
  //       //     : [];

  //       // isCurrentProfileAvailable =  currentProfilesFromDatabase.length > 0 ? true : false; //localStorage.getItem("fr_default_fb") ? (localStorage.getItem("fr_default_fb") == facebookProfile.uid ? true : false) :

  //       // if (currentProfilesFromDatabase.length) {
  //       //   console.log("default user set in useEffect --->");
  //       //   defaultProfile =
  //       //     currentProfilesFromDatabase[0]?.fb_user_id.toString();
  //       //   localStorage.setItem("fr_default_fb", defaultProfile);
  //       //   dispatch(setDefaultProfileId(defaultProfile));
  //       // }
  //     }

  //     setFacebookConnectLoader(false);

  //     let isCurrentProfileAvailable = false;
  //     if (Number(currentLoggedInFbUser) === Number(defaultProfile)) {
  //       isCurrentProfileAvailable = true;
  //     }

  //     if (facebookProfile) {
  //       // setFacebookConnectLoader(false);
  //       setFbProfile({
  //         ...facebookProfile,
  //         isCurrentProfileAvailable: isCurrentProfileAvailable,
  //       });
  //       setFacebookConnect(
  //         facebookProfile?.isFbLoggedin &&
  //           isCurrentProfileAvailable &&
  //           Number(currentLoggedInFbUser) === Number(defaultProfile)
  //           ? true
  //           : false
  //       );

  //       console.log(
  //         "got fb profile",
  //         facebookProfile?.isFbLoggedin && isCurrentProfileAvailable
  //           ? true
  //           : false
  //       );
  //     }

  //     // console.log("currentProfilesFromDatabase ::: ", currentProfilesFromDatabase)

  //     console.log("isCurrentProfileAvailable", isCurrentProfileAvailable);

  //     if (isCurrentProfileAvailable) {
  //       if (Number(currentLoggedInFbUser) === Number(defaultProfile)) {
  //         console.log("default user logged in fb");
  //         setIsSynced(true);
  //         setFacebookConnect(true);
  //         setFacebookConnect(true);
  //         setFacebookConnectLoader(false);
  //         setSyncFriendsLoader(false);
  //         setSyncFriends(false);
  //         setIsFriendlistSynced(false);
  //         setIsSyncing(false);

  //         console.log("friend lenght found in fb loader - ", facebookConnect);
  //       } else {
  //         console.log(
  //           "current fb logged user is not default user",
  //           currentLoggedInFbUser,
  //           defaultProfile,
  //           currentLoggedInFbUser === defaultProfile
  //         );
  //         setFacebookConnectLoader(false);
  //         setFacebookConnect(false);
  //         return true;
  //       }
  //     }
  //     // const getCurrentFbProfile = await fetchUserProfile()
  //   })();
  // }, []);

  const extInstallationStatus = async () => {
    let isInstalled = await extensionAccesories.isExtensionInstalled({
      action: "extensionInstallation",
      frLoginToken: localStorage.getItem("fr_token"),
    });

    console.log("is extension Installed",isInstalled)
    // console.log("extension token",localStorage.getItem("fr_token"))

    if (isInstalled) {
      //console.log("Extension installed")
      setInstallFrinderLoader(false);
      setInstallFrinder(true);
      clearInterval(checkInstallationIntv);
      //Once extension installed connect profile and fetch info in background
      // alert("connecting profile now")
      // alert("fuckkking")
      // connectProfile()
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

  /**
   * 
   * @param {
   * true : Its going to check the fb auth id and current logged in fb in browser is same or not
   * false : The entire 3 step will execute, basically connected fb account check and do the needful                 
   *  } checkingOnly 
   * @returns if(chekcingOnly flag is true)?true/false : executes the function
   */
  const connectProfile = async (checkingOnly= false) => {
    setIsSynced(false)
    if(!checkingOnly){
      setAccountMismatch(false)
      setFacebookConnectLoader(true);
    }
    const profileData = await fetchUserProfile()
    // if user id is present already with the facebook auth information then : 
    if(profileData?.length){
      dispatch(setProfileSpaces(profileData));
      if(profileData[0].fb_user_id!= null && profileData[0].fb_user_id){
        const facebookProfile = await extensionAccesories.sendMessageToExt({
          action: "syncprofile",
          frLoginToken: localStorage.getItem("fr_token"),
        });
        console.log("facewbook data",facebookProfile)
        console.log("profile datattat",profileData)
          //If auth profile and current logged in profile is not matching then :
          setFbAuthProfileId(profileData[0]?.fb_user_id)
          if(facebookProfile?.error == "No response"){
            if(checkingOnly){
              return false
            }
            setFbProfile(undefined)
            setFacebookConnectLoader(false);
            setAccountMismatch(true)
            return 
          }
          if (facebookProfile?.uid !=  profileData[0]?.fb_user_id) {
            if(checkingOnly){
              return false
            }
          
            setFbProfile({...profileData[0]})
            // setFbAuthProfileId(profileData[0]?.fb_user_id)
            // alert(
            //   "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
            //     localStorage.getItem("fr_default_fb") +
            //     "Or click on refresh."
            // );
            setFacebookConnectLoader(false);
            setAccountMismatch(true)
            return;
          }else{
            localStorage.setItem("fr_default_fb",facebookProfile?.uid)
            if(checkingOnly){
              return true
            }
            dispatch(setDefaultProfileId(profileData[0].fb_user_id))
            setFacebookConnectLoader(false);
            setFacebookConnect(true)
            // If 3 step, checking facebook user id is done then start syncing process with facebook account.
            setSyncFriendsFn()
          }
      }else{
        const fetchUserIdViaFacebookAuthProfileUrl = await extensionAccesories.sendMessageToExt({ "action" : "getUidForThisUrl", "url" : profileData[0].fb_auth_info?.link});
        console.log("hello ******************** this is the response for facebook profile link  ", fetchUserIdViaFacebookAuthProfileUrl)
        // save fb id and then call this function again for checking the fb accounts and proceed further
       
       if(fetchUserIdViaFacebookAuthProfileUrl.status){
        dispatch(setProfileSpaces(profileData));
        dispatch(setDefaultProfileId(profileData[0].fb_user_id))
         const profilebody = {
           name: profileData[0]?.name,
           profilePicture: profileData[0]?.fb_auth_info?.picture?.data?.url,
           fbAuthInfo : profileData[0]?.fb_auth_info,
           userId : fetchUserIdViaFacebookAuthProfileUrl.uid,
           profileUrl : "https://www.facebook.com/"+fetchUserIdViaFacebookAuthProfileUrl.uid,
         };
         const userProfileRes = await saveUserProfile(profilebody);
 
         if(userProfileRes?.status == 200){
           console.log("called connect profile reccrusively")
           connectProfile(false)
         }
       }else{
        setFbProfile({...profileData[0]})
        // setFbAuthProfileId(profileData[0]?.fb_user_id)
        // alert(
        //   "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
        //     localStorage.getItem("fr_default_fb") +
        //     "Or click on refresh."
        // );
        setFacebookConnectLoader(false);
        setAccountMismatch(true)
        return;
       }

         // userId: facebookProfile?.uid.toString(),
        // name: facebookAuthInfo?.name,
        // profilePicture: facebookAuthInfo?.picture?.data?.url,
        // profileUrl: "https://www.facebook.com" + facebookProfile.path,
        // fbAuthInfo : facebookAuthInfo
      }
    }else{
      setFbProfile(undefined)
      setFacebookConnectLoader(false);
      navigate("/facebook-auth")
      // setAccountMismatch(true)
  }



    // const getCurrentFbProfile = await fetchUserProfile();
    // // const currentProfilesFromDatabase =
    // //   getCurrentFbProfile.length > 0
    // //     ? getCurrentFbProfile.filter(
    // //         (el) =>
    // //           el &&
    // //           el?.fb_user_id?.toString() === facebookProfile?.uid?.toString()
    // //       )
    //     : [];

    // console.log("fbProfile ::::::: ",fbProfile)

    // console.log("userProfileRes :::::::::::::::: ", userProfileRes)

    // localStorage.setItem("fr_current_fbId", fbProfile.uid.toString());

    // if (currentProfilesFromDatabase.length) {
    //   console.log("set default id from connect prof----->");
      // localStorage.setItem("fr_default_fb", getCurrentFbProfile[0].uid.toString());
    //   dispatch(setDefaultProfileId(fbProfile.uid.toString()));
    // }

    // setOpenModal(false);
    // setFacebookConnect(true);
    // setFbProfile({ ...fbProfile, isfbProfile: false });
    // setFacebookConnectLoader(false);
    // // setIsSynced(currentProfilesFromDatabase.length ? true : false);
    // setSyncFriends(false);
    // setIsSyncing(false);
    // setSyncFriendsLoader(false);
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
      console.log("checking progress...")
      if(progressCount!=null && progressCount){
        setSyncedFrieneds(progressCount);
        console.log("Check badge count", progressCount, totalFrndLenth,Number(totalFrndLenth) == Number(progressCount));
        if (Number(totalFrndLenth) == Number(progressCount)) {
          console.log("clear intreval")
          clearInterval(checkingIntv);
          localStorage.removeItem("fr_countBadge");
          setIsSynced(true);
                setFacebookConnect(true);
                setFacebookConnect(true);
                setFacebookConnectLoader(false);
                setSyncFriendsLoader(false);
                setSyncFriends(false);
                setIsFriendlistSynced(false);
                setIsSyncing(false);
        }
      }
    }, 500);
  };


  const setSyncFriendsFn = async (e) => {
    setSyncFriendsLoader(true);


    if(localStorage.getItem("fr_gs_synced") == "true"){
      console.log("checked from loacal")
      setIsSynced(true);
      setFacebookConnect(true);
      setFacebookConnect(true);
      setFacebookConnectLoader(false);
      setSyncFriendsLoader(false);
      setSyncFriends(false);
      setIsFriendlistSynced(false);
      setIsSyncing(false);
      return 
    }else{
      const res = await fetchFriendList({ fbUserId: localStorage.getItem("fr_default_fb") });
      let friendList = res?.data?.[0].friend_details
        ? res.data[0].friend_details.length
        : false;
  
      if(friendList){
          localStorage.setItem("fr_gs_synced",true)
          storeFriendListIndexDb(localStorage.getItem("fr_default_fb"), res);
          setIsSynced(true);
          setFacebookConnect(true);
          setFacebookConnect(true);
          setFacebookConnectLoader(false);
          setSyncFriendsLoader(false);
          setSyncFriends(false);
          setIsFriendlistSynced(false);
          setIsSyncing(false);
  
        return
      }
    }



    const crossCheckingConnectedAccount = await connectProfile(true)  
    if(!crossCheckingConnectedAccount){
      setSyncFriendsLoader(false);
      alert(
            "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
            fbAuthProfileId
          );
          return
    }
    helper.setCookie("fr_isSyncing", "active");
    localStorage.setItem("fr_update", "Syncing Friends...");

    setIsSyncing(true);
    checkSyncProgress();





    const friendCountPayload = {
      action: "syncFriendLength",
      frLoginToken: localStorage.getItem("fr_token"),
    };
    const facebookFriendLength = await extensionAccesories.sendMessageToExt(
      friendCountPayload
    );
    console.log("Total no of friends count", facebookFriendLength);
    
    
    if (facebookFriendLength!= undefined && facebookFriendLength?.friendLength) {
      setSyncFriendsLoader(false);

      console.log("FR len dom", facebookFriendLength.friendLength);
      setTotalFriends(facebookFriendLength.friendLength);
      localStorage.setItem("friendLength", facebookFriendLength?.friendLength);

      setSyncFriends(true);




      const friendListPayload = {
        action: "syncFriendList",
        frLoginToken: localStorage.getItem("fr_token"),
      };
      // Check badge count
      checkSyncProgressCount();
      localStorage.setItem("fr_gs_synced",true)
      let syncResp = await extensionAccesories.sendMessageToExt(
        friendListPayload
        );
        console.log("*********friendListPayload")
      console.log("syncResp", syncResp);
    }




    // const facebookProfile = await extensionAccesories.sendMessageToExt({
    //   action: "syncprofile",
    //   frLoginToken: localStorage.getItem("fr_token"),
    // });
    // if (facebookProfile?.uid != localStorage.getItem("fr_current_fbId")) {
    //   alert(
    //     "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
    //       localStorage.getItem("fr_current_fbId")
    //   );
    //   setSyncFriendsLoader(false);
    //   return;
    // }

    // // Save profile
    // const profilebody = {
    //   userId: fbProfile.uid.toString(),
    //   name: fbProfile.text,
    //   profilePicture: fbProfile.photo,
    //   profileUrl: "https://www.facebook.com" + fbProfile.path,
    // };
    // const profileSpacePayload = {
    //   name: fbProfile.text,
    //   fb_user_id: fbProfile.uid.toString(),
    //   fb_profile_picture: fbProfile.photo,
    //   fb_profile_url: "https://www.facebook.com" + fbProfile.path,
    // };
    // const userProfileRes = await saveUserProfile(profilebody);

    // if (userProfileRes) {
    //   console.log("set default from sunc frnd----->>>");
    //   localStorage.setItem("fr_default_fb", profilebody.userId);
    //   dispatch(addProfileSpace(profileSpacePayload));
    //   dispatch(setDefaultProfileId(fbProfile.uid.toString()));
    // }
    // helper.setCookie("fr_isSyncing", "active");
    // localStorage.setItem("fr_update", "Syncing Friends...");
    // setIsSyncing(true);
    // checkSyncProgress();

    // const friendCountPayload = {
    //   action: "syncFriendLength",
    //   frLoginToken: localStorage.getItem("fr_token"),
    // };
    // console.log("sending request for fr lenght");
    // const facebookFriendLength = await extensionAccesories.sendMessageToExt(
    //   friendCountPayload
    // );
    // console.log("Friend lenght resp", facebookFriendLength);
    // if (facebookFriendLength) {
    //   setSyncFriendsLoader(false);
    //   console.log("FR len dom", facebookFriendLength.friendLength);
    //   setTotalFriends(facebookFriendLength.friendLength);
    //   localStorage.setItem("friendLength", facebookFriendLength.friendLength);

    //   setSyncFriends(true);
    //   const friendListPayload = {
    //     action: "syncFriendList",
    //     frLoginToken: localStorage.getItem("fr_token"),
    //   };

    //   // Check badge count
    //   checkSyncProgressCount();
    //   let syncResp = await extensionAccesories.sendMessageToExt(
    //     friendListPayload
    //   );
    //   console.log("syncResp", syncResp);
    // }
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
        <div className="ind-steps d-flex activated">
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
          <p className="step-info m-right-25">Onboarding questionnaires</p>
          <span className="step-action">Completed</span>
        </div>
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
                Let us check an active login into the connected Facebook account
                <ToolTipPro
                  textContent="Ensure you're logged in with the same Facebook account in your browser."
                  type={"query-2"}
                  direction="top"
                  isInteract={false}
                />
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
                        {/* Connect now */}
                      </span>
                    )}
                  </>
                )
              )}
              {openModal && <span className="step-action"> Connecting</span>}
            </div>
            {!facebookConnect && accountMismatch && (
              <FacebookConnect
                fbProfile={fbProfile}
                shouldLoginUrl={fbAuthProfileId}
                refreshProfile={refreshProfile}
                connectProfile={()=>{connectProfile(false)}}
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
                {" "}
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
