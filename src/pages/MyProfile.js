import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfilePhoto from "../assets/images/profilePhoto.png";
import NumberRangeInput from "../components/common/NumberRangeInput";
import { fetchUserAmount, saveUserAmount } from "../services/authentication/facebookData";
import extensionMethods from "../configuration/extensionAccesories";

import "../assets/scss/pages/myprofile.scss";


const MyProfile = () => {
    const profiles = useSelector((state) => state.profilespace.profiles);
    const [userDetails, setUserDetails] = useState(null);
    const [intentedAmount, setIntentedAmount] = useState(0);
    const [shouldEditIntendedAmount, setShouldEditIntendedAmount] = useState(false);

    useEffect(() => {
        fetchUserAmount()
        .then((res) => {
            if (res?.amount && parseFloat(res?.amount)) {
                setIntentedAmount(parseFloat(res?.amount));
            }
        });
        setUserDetails({
            name: JSON.parse(localStorage.getItem('fr_facebook_auth'))?.name ? JSON.parse(localStorage.getItem('fr_facebook_auth'))?.name : profiles[0]?.name ? profiles[0]?.name : "Anonymous",
            email: localStorage.getItem('fr_default_email'),
            facebookID: localStorage.getItem('fr_default_fb'),
            userDP: profiles[0]?.fb_profile_picture ? profiles[0]?.fb_profile_picture : ProfilePhoto,
            facebookURL: profiles[0]?.fb_profile_url,
            plan: localStorage?.getItem('fr_plan'),
            planName: localStorage?.getItem('fr_plan_name')
        })
    }, [profiles]);

    const onChangeIntendedAmount = (event) => {
		let intentedAmount = event.target.value;

        if (typeof intentedAmount === "number" && parseFloat(intentedAmount).toFixed(2)) {
            setIntentedAmount(parseFloat(intentedAmount).toFixed(2));
        } else {
            setIntentedAmount(event.target.value);
        }
	};

	const handleIncrementDecrementVal = (type) => {
        let amount = parseFloat(intentedAmount);
		if (type === "INCREMENT") {
            let incrementedAmount = amount + 0.1;
			setIntentedAmount(parseFloat(incrementedAmount).toFixed(2));
		}

		if (type === "DECREMENT" && amount > 0) {
            let idecrementedAmount = amount - 0.1;
			setIntentedAmount(parseFloat(idecrementedAmount).toFixed(2));
		}
	};

    const handleSaveUserAmount = () => {
        if (intentedAmount && parseFloat(intentedAmount).toFixed(2) >= 0) {
            saveUserAmount({amount: parseFloat(intentedAmount)})
            .then((resp) => {
                if (resp) {
                    console.log("save amount response", resp);
                    fetchUserAmount()
                    .then((res) => {
                        if (res?.amount && parseFloat(res?.amount)) {
                            setIntentedAmount(parseFloat(res?.amount));
                            const sendEssentialsPayload = {
                                action: "sendEssentials",
                                fr_token: localStorage.getItem("fr_token"),
                                amount: parseFloat(intentedAmount)
                            };
                            extensionMethods.sendMessageToExt(
                                sendEssentialsPayload
                            );
                        }
                    });
                }
            });
        }
        setShouldEditIntendedAmount(false)
    }
    
    console.log('intentedAmount', intentedAmount);
    console.log('profiles', profiles);

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
                                    userDetails?.planName ?
                                        userDetails?.planName :
                                        userDetails?.plan
                                }
                                {/* {
                                    (userDetails?.plan == 1 || userDetails?.plan == "1") ?
                                        'FREE' :
                                        // userDetails?.plan == 2 ?
                                        //     'BASIC' :
                                            'ULTIMATE'
                                } */}
                                {/* {userDetails?.plan == 1 &&
                                    <Tooltip
                                        direction="top"
                                        textContent="Your data will be deleted after 30 days of inactivity."
                                        type="info"
                                    />
                                } */}
                            </span>
                        </h4>
                    </div>
                    <p>Email: <a href={`mailto:${userDetails?.email}`}>{userDetails?.email}</a></p>
                    <p>Facebook ID: <span>{(userDetails?.facebookID && userDetails?.facebookID != 'null') ? userDetails?.facebookID : 'Please complete the getting started'}</span></p>
                    <p>Facebook URL:
                        <a href={(userDetails?.facebookURL && userDetails?.facebookURL != 'null') ? userDetails?.facebookURL : ''} target="_blank" rel="noreferrer">
                            {(userDetails?.facebookURL && userDetails?.facebookID != 'null') ? `facebook.com/${userDetails?.facebookID}` : 'Please complete the getting started'}
                        </a>
                    </p>
                </div>
                <div className="info-box-footer">
                    <div className="info-box-footer-txt">How much do you value 1 hour of your time in dollars?</div>
                    <div className="value-info">
                    {shouldEditIntendedAmount ?
                        <>
                            <NumberRangeInput
                                value={intentedAmount}
                                step={"0.1"}
                                handleChange={onChangeIntendedAmount}
                                setIncrementDecrementVal={handleIncrementDecrementVal}
                                customStyleClass='intended-amount'
                            />
                            <div className="save-amount-btn" onClick={handleSaveUserAmount}>
                                Save
                            </div>
                        </>
                        
                    :
                        <>
                            <div className="value-amount">{intentedAmount}</div>
                            <div className="value-action">
                                <div className="value-action-txt" onClick={() => setShouldEditIntendedAmount(true)}>Edit</div>
                            </div>
                        </>
                    }
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default MyProfile;