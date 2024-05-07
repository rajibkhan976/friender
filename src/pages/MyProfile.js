import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Tooltip from "../components/common/Tooltip";
import ProfilePhoto from "../assets/images/profilePhoto.png";

import "../assets/scss/pages/myprofile.scss";


const MyProfile = () => {
    const profiles = useSelector((state) => state.profilespace.profiles);
    const [userDetails, setUserDetails] = useState(null)

    useEffect(()=>{
        setUserDetails({
            name: JSON.parse(localStorage.getItem('fr_facebook_auth')).name,
            email: localStorage.getItem('fr_default_email'),
            facebookID: localStorage.getItem('fr_default_fb'),
            userDP: profiles[0]?.fb_profile_picture ? profiles[0]?.fb_profile_picture : ProfilePhoto,
            facebookURL: profiles[0]?.fb_profile_url,
            plan: localStorage?.getItem('fr_plan') ? localStorage?.getItem('fr_plan') : '1'
        })
    }, [profiles])
    return (
        <div className="main-content-inner d-flex d-flex-column my-profile">
            <div className="info-box">
                <header><h5>Account Details</h5></header>
                <div className="info-box-content">
                    <div className="user-image-name d-flex f-align-center">
                        <figure
                            style={{
                                backgroundImage: `url(${userDetails?.userDP})`
                            }}
                        ></figure>
                        <h4 className="d-flex f-1 f-justify-between f-align-center">
                            {userDetails?.name}
                            <span className="plan-alert-button">
                                {
                                    (userDetails?.plan == 1 || userDetails?.plan == "1") ?
                                        'FREE' :
                                        // userDetails?.plan == 2 ?
                                        //     'BASIC' :
                                            'ULTIMATE'
                                }
                                {userDetails?.plan == 1 &&
                                    <Tooltip
                                        direction="top"
                                        textContent="Your data will be deleted after 30 days of inactivity."
                                        type="info"
                                    />
                                }
                            </span>
                        </h4>
                    </div>
                    <p>Email: <a href={`mailto:${userDetails?.email}`}>{userDetails?.email}</a></p>
                    <p>Facebook ID: <span>{userDetails?.facebookID}</span></p>
                    <p>Facebook URL: <a href={userDetails?.facebookURL} target="_blank" rel="noreferrer">{`facebook.com/${userDetails?.facebookID}`}</a></p>
                </div>
            </div>
        </div>
    );
}
 
export default MyProfile;