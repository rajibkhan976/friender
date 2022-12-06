import { useState, useEffect } from "react";
import FB from "../../assets/images/faceBook.png";
import Profile from "../../assets/images/profiles.png";
import Tick from "../../assets/images/tick.png";
const FacebookConnect = (props) => {
  const [noConnect, setNoConnect] = useState(true);
  const setNoConnectFn = (e) => {
    setNoConnect(false);
  };
  useEffect(()=>{
    console.log("props data ::: ", props.fbProfile)
  }, [])
  const [connectionErrors, setConnectionErrors] = useState(false);
  const setConnectionErrorsFn = (e) => {
    setConnectionErrors((current) => !current);
  };

  return (
    <div className="fb-connection-rules">
      <div className="facebook-connect-wraper">
        {!props.fbProfile.isFbLoggedin && <div className={props.fbProfile.isFbLoggedin ? "no-fb-present hide" : "no-fb-present"}>
          <p className="connect-error">Could not find any facebook account!</p>
          <p className="connect-info">
            Please make sure you have logged In to your facebook account in your
            browser, Once done, click on the Refresh button.
          </p>
          <div className="fb-connect-btn-wraper">
            <button className="fb-connect-btn" onClick={(e) => {
                          window.open("https://www.facebook.com/", "_blank")
                        }}>
              <img src={FB} alt="" />
            </button>
            <button className="fb-reset-btn" onClick={(e)=>props.refreshProfile(e)}>Refresh</button>
          </div>
        </div>}
        {props.fbProfile.isFbLoggedin  && (
          <div className="fb-account-connect">
            <div className="facebook-profile-info-wraper d-flex">
              <span className="profile-fb-img">
                <img src={props.fbProfile.photo} alt="" />
              </span>
              <span className="profile-fb-info">
                <h3>
                  {props.fbProfile.text}
                  <span className="profile-verification">
                    <img src={Tick} alt="" />
                  </span>
                </h3>
                <p>{"https://www.facebook.com" + props.fbProfile.path}</p>
              </span>
            </div>
            <div className="fb-connect-btn-wraper">
              <button
                className={
                  connectionErrors
                    ? "fb-connect-btn disabled"
                    : "fb-connect-btn"
                }
                onClick={props.connectProfile}
              >
                Connect
              </button>
              <button className="fb-reset-btn" onClick={props.refreshProfile}>
                Refresh
              </button>
            </div>
            {connectionErrors && (
              <p className="facebook-connection-problem">
                Something went wrong! Make sure in your browser you have logged
                into your facebook account. try again, click on the Refresh
                button.
              </p>
            )}
          </div>
        )}
      </div>
      {props.fbProfile.isFbLoggedin && !props.fbProfile.isCurrentProfileAvailable && (
        <>
          <p className="fb-rules-heading">
            If you want to use another Facebook Account. follow this steps.
          </p>
          <ul className="fb-rules-ul">
            <li>
              1. Please logout your current facebook account. visit{" "}
              <a href="facebook.com" target="_blank">
                Facebook.com
              </a>
            </li>
            <li>
              2. Then please login a facebook account that you want to connect.
            </li>
            <li>3. Then came back in this page and click on the Refresh.</li>
            <li>4. And then you can see your current facebook account.</li>
            <li>
              5. Now you can click on Connect to add your facebook account.
            </li>
          </ul>
        </>
      )}
    </div>
  );
};
export default FacebookConnect;