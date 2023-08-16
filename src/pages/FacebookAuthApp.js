import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import module from "./Auth/styling/authpages.module.scss";
import FacebookLogin from 'react-facebook-login';
import { ConnectToFacebook, DisabledConnectToFacebook, Logo } from "../assets/icons/Icons";
import Checkbox from "../components/formComponents/Checkbox";
import extensionAccesories from "../configuration/extensionAccesories";
import {
  saveUserProfile
} from "../services/authentication/facebookData";
import Alertbox from "../components/common/Toast";

const FacebookAuthApp = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [showConnect, setShowConnect] = useState(false)

  const connectProfile = async (facebookAuthInfo) => {
    console.log("facebookAuthInfo", facebookAuthInfo)
    if(facebookAuthInfo){
        const profilebody = {
        name: facebookAuthInfo?.name,
        profilePicture: facebookAuthInfo?.picture?.data?.url,
        fbAuthInfo : facebookAuthInfo
      };
      const facebookProfile = await extensionAccesories.sendMessageToExt({
        action: "syncprofile",
        frLoginToken: localStorage.getItem("fr_token"),
      });
      console.log("facebookProfile",facebookProfile)
      // if(facebookProfile?.error == "No response"){
      //   alert("Facebook authentication failed, either you are not logged in or facebook has changed its response structure. Please try again or contact friender support")
      //   return false
      // }

      switch(facebookProfile?.error?.message){
        case "No response":
          Alertbox(
            `Facebook authentication failed, either you are not logged in or facebook has changed its response structure. Please try again or contact friender support`,
            "error",
            1000,
            "bottom-right"
          );
          return false
          break;
        case "Could not establish connection. Receiving end does not exist.":
          // Alertbox(
          //   `Please install the extension to complete the authentication`,
          //   "error",
          //   1000,
          //   "bottom-right"
          // );
          // Alternate method, we wil fetch fb user id linked with facebook auth account in GS page with the help of profile link
          // Save the  profile data into to database
          const userProfileRes = await saveUserProfile(profilebody);
          console.log("saving data without user id as ext is not installed",userProfileRes)
      
          // If the response to save profile is true then save the fb details in localstorage else dont move forward
            if(userProfileRes?.status == 200){
              localStorage.setItem(`fr_facebook_auth`, JSON.stringify(facebookAuthInfo))
              return true
            }
          return false
      }  

      
      console.log("facebookprofile info",facebookProfile)
      localStorage.setItem("fr_current_fbId", facebookProfile.uid.toString());
   
        // userId: facebookProfile?.uid.toString(),
        // name: facebookAuthInfo?.name,
        // profilePicture: facebookAuthInfo?.picture?.data?.url,
        // profileUrl: "https://www.facebook.com" + facebookProfile.path,
        // fbAuthInfo : facebookAuthInfo

      profilebody["userId"] = facebookProfile?.uid.toString()
      profilebody["profileUrl"] = "https://wwww.facebook.com" + facebookProfile.path
      console.log("******* Ext installed and userId fetched",profilebody)
      // Save the  profile data into to database
       const userProfileRes = await saveUserProfile(profilebody);
       console.log("888888 userProfiles response",userProfileRes)
  
       // If the response to save profile is true then save the fb details in localstorage else dont move forward
        if(userProfileRes?.status == 200){
          localStorage.setItem(`fr_facebook_auth`, JSON.stringify(facebookAuthInfo))
          return true
        }
      }else{
        Alertbox(
            `Facebook authentication failed, please try again`,
            "error",
            1000,
            "bottom-right"
          );
          return false
        }
    };


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
  const responseFacebook = async (response) => {
    /**Sample facebook auth response payload structure and info
     * 
     * {
          "name": "Let Story Drive",
          "picture": {
              "data": {
                  "height": 50,
                  "is_silhouette": false,
                  "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=799242078402565&height=50&width=50&ext=1692966739&hash=AeSaRSf_8ogdCpXupmo",
                  "width": 50
              }
          },
          "id": "799242078402565",
          "accessToken": "EAAJiz63djOQBOxUFCtmCgQII54IfognM4kdtDtdj2k4oWrFXdltjcLJmWcQm461TNUijobCzdzE3jZAJZCaSYcUdLWWLVbbkicNAHdMclFZCCFCA63F7NdRJRtuW1aI2xxNLwHVmy8VjXcHpHZAjbzCurIpw772aWZBy4TaIS0iymay1M6toFPVTs1LDsoQ3yFZAH8vs5insMZCHVTyOBkfCBYEfrUZD",
          "userID": "799242078402565",
          "expiresIn": 5261,
          "signedRequest": "nf3iTrIF9exChJdstPJHJFeAAS5vRJx7xXK9RcNthZ0.eyJ1c2VyX2lkIjoiNzk5MjQyMDc4NDAyNTY1IiwiY29kZSI6IkFRQXVWZjdESURsS2R1cEF4QnMtRUJDN2trdkxtR2tVN0VxRUd4VlVmLThNTk9RaHVhWUJlYUNDTFlyS2hzRTkwV0xPVEkxV2ZQWjFKZVdJd2hLN3RLenhIUHhXVVJSbXA3RXJBYXRQMjRJMENXT0Z4LUlBQkZvWTh4dGh4OFpGV0I3X0tvb2Y2R09Qc3dyaGNYa2pZSlk1cURHbmhZUzNYeWp2Snc0T0plZ2Zvd3NTcEo5TWZMZy1tTE9ra1FRS0x3UmVocnhOZHJydVFGblpZM3NNNEhnYkR0UE9WMTh1UzlscXlzZmRaMEVrSmZDbDFxNlVXZnRXTlNURUFuUVVzVklSMTZZYmlDT3dwRTVSVzEzZHB6dHVqcXhCRS1YQVFoY1lILXpnYVBoam9hMDYwQThrYmNmWVZzc2U1dkthcHd3dlhObGxtRXg3bHV0MFJDSlY1N3pYIiwiYWxnb3JpdGhtIjoiSE1BQy1TSEEyNTYiLCJpc3N1ZWRfYXQiOjE2OTAzNzQ3Mzl9",
          "graphDomain": "facebook",
          "data_access_expiration_time": 1698150739
      }
     * 
     */

    // If and only if user is authenticated from facebook auth app then do the following : 
    console.log("facebook auth response",response)
    if (response.status != "unknown" && response?.accessToken != undefined) {
      /**
       * Save the facbook auth response object after stringifying.
       * 
       * - Fetch facebook user id immediately and then save all the data to the store fb profile service
       */

      if(response?.link == undefined){
        Alertbox(
          `Facebook authentication failed, you need to allow timeline link access in order to proceed with Friender`,
          "error",
          1000,
          "bottom-right"
        );
        return false
      }
      let checkAuth = await connectProfile(response)
      if(checkAuth == true){
        proceedFurther()
      }
    }
  }

  useEffect(() => {
    /**
     *  @facebookAuthInfo is holding the facebook auth response in Stringify version, please parse it to get the object info.
     * 
     */
    let facebookAuthInfo = JSON.parse(localStorage.getItem("fr_facebook_auth"));
    /**
     * Check if facebook auth is already done and token is available then move forward :
     */
    if (facebookAuthInfo?.accessToken != undefined && facebookAuthInfo?.accessToken) {
      proceedFurther()
    }
  }, []);

  return (
    <div className={`${module['page-wrapers']} ${module['fb-auth-wrapper']}`}>
      <div className={module["logo-wraper"]}>
        <span className={module["logo-wraper-text"]}>
          <Logo />
          <span>Your organic marketing best friend</span>
        </span>
      </div>
      <div className={module["auth-heading-info"]}>
        <h3 className={`${module['onboarding-heading']} text-center`}>Enhance account security</h3>
        <p className="text-center reset-password">
          By incorporating Facebook authentication, we are ensuring a safer and more protected friender experience
        </p>

        <div className={module["fr-auth-disclaimer"]}>
          <p>Friender strictly permits only one Facebook account per user. Any additional Facebook accounts associated with Friender will be permanently deleted..</p>
        </div>
      </div>
      <div className={module['get-check-facebook']}>
        <Checkbox
          checkValue={showConnect}
          onChangeCheck={() => setShowConnect(!showConnect)}
          checkText="I have comprehended and accepted this information"
          extraClass={module['fb-checkmark-text']}
        />
        {showConnect ?
            <span className={module['connect-to-facebook']}>
              <span className={module["facebook-btn"]}>
                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  fields="name,picture,link"
                  scope="public_profile,user_link"
                  callback={responseFacebook}
                />
              </span>
              <ConnectToFacebook />
            </span>
          : <DisabledConnectToFacebook />
        }
      </div>
    </div>
  );
};

export default FacebookAuthApp;
