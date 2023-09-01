/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect} from "react";
import Moment from "react-moment";
import Switch from "../../components/formComponents/Switch";
import SettingLoader from "../../components/common/loaders/SettingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import {
  fetchFriendRequestSettings,
  updateDefaultFriendRequestSettings,
} from "../../services/SettingServices";
import Alertbox from "../../components/common/Toast";
import Tooltip from "../../components/common/Tooltip";
import "../../assets/scss/component/common/_requestSent.scss"

const FriendRequestSentVersion = () => {
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  //const [defaultFbId, setDefaultFbId] = useState(null);
  // const [noDataFound, setNoDataFound] = useState(false);
  const [sortCriteria, setSortCriteria] = useState({
    sort: "settings_name",
    type: "dsc",
  });
  const [headPoints, setHeadPoints] = useState({
    totalRun: null,
    profileViewed: null,
    requestSent: null,
    savedTime: null,
  });
  const [friendRequestHitory, setFriendRequestHistory] = useState();
  const [expanded, setExpanded] = useState("none");
  const setShowDetailsFn = (idx) => {
    setExpanded("none");
    setShowDetails((current) => (current != idx ? idx : false));
  };

  const newTimeSavedFun=(objArr)=>{
    const newArr= objArr.map((item)=>{
      let startDate=new Date(item.created_at);
      let endDate=new Date(item.updated_at)
      const differenceInSeconds = Math.abs((endDate.getTime() - startDate.getTime()) / 1000);
      console.log("sn:",item.settings_name);
      console.log("diff:",item.created_at,item.updated_at,differenceInSeconds);
      console.log("time:",startDate.getTime(),endDate.getTime());
      console.log("profile view",item.profile_viewed,item.profile_viewed!= undefined && item.profile_viewed? item.profile_viewed*30:item.friend_request_send!=undefined && item.friend_request_send?item.friend_request_send*30:0*30)
      item.time_saved=differenceInSeconds+(item.profile_viewed!= undefined && item.profile_viewed? item.profile_viewed*30:item.friend_request_send!=undefined && item.friend_request_send?item.friend_request_send*30:0*30)
      return item;
    })
    return newArr;
  }
  const fetchUserRequestSettings = async () => {
    setLoading(true);

    try {
      let savedFbUId = localStorage.getItem("fr_default_fb");

      if (!savedFbUId) {
      //   setDefaultFbId(savedFbUId);
      // } else {
        const getCurrentFbProfile = await fetchUserProfile();
        if (getCurrentFbProfile) {
          savedFbUId = localStorage.setItem(
            "fr_default_fb",
            getCurrentFbProfile[0].fb_user_id
          );
        }
      }

      const fetchedSets = await fetchFriendRequestSettings({
        token: localStorage.getItem("fr_token"),
        fbUserId: savedFbUId,
      });

    

      if (fetchedSets) {
        if (Array.isArray(fetchedSets)) {
          console.log("timesaved records",newTimeSavedFun(fetchedSets))
          setFriendRequestHistory(newTimeSavedFun(fetchedSets));
        }
        // const totalTime = secToHeaderTotaltime(
        //   fetchedSets?.reduce((acc,curr)=>acc+curr.time_saved,0)
        // );

        const totalTime = newTimeSavedFun(fetchedSets)?.reduce((acc, curr) => {
          console.log("reducer",curr,curr.time_saved)
          return parseInt(acc) + parseInt(curr.time_saved)}, 0) / (60 * 60);

          console.log("total time ***",totalTime)
          // console.log('profileViewedP::::', fetchedSets.map(el => console.log(el.time_saved, totalTime)));

        let headerOptions = {
          totalRun: fetchedSets?.length,
          profileViewed:  fetchedSets?.reduce((acc, curr) => {
            if (typeof curr.profile_viewed === 'number') {
              return acc + curr.profile_viewed;
            }
            return acc;
          }, 0),
          requestSent: fetchedSets?.reduce((acc,curr) => acc+curr.friend_request_send,0),
            
          savedTime: totalTime,
        };
        
        setHeadPoints(headerOptions);
        //TotalSavedTimeFn(headerOptions.savedTime);
      } else {
        setFriendRequestHistory([]);
      }
      setLoading(false);
     // setNoDataFound(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
     // setNoDataFound(true);
    }
  };


  const toggleDefaultRequest = async (event, item) => {
    // console.log('id', id, 'event', event.target.checked);
    if (event.target.checked) {
      try {
        if (item.default_sttings !== 1) {
          const updatedData = await friendRequestHitory.map((x) =>
            x._id === item._id
              ? { ...x, default_sttings: 1 }
              : { ...x, default_sttings: 0 }
          );

          if (updatedData) {
            console.log("updatedData", updatedData);
            setFriendRequestHistory(updatedData);

            const updateDefault = await updateDefaultFriendRequestSettings({
              settingsId: item._id,
              defaultSttings: 1,
            });

            if (updateDefault) {
              Alertbox(
                `Default friend request setting updated.`,
                "success",
                1000,
                "bottom-right"
              );
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   *
   * @returns total list of friend requests
   * along-with sorting
   */
  const DataSettingsRow = () => {
    const friendRequestListing = friendRequestHitory;
  
    friendRequestListing?.sort((a, b) =>
      sortCriteria.type === "asc"
        ? !isNaN(a[sortCriteria.sort]) && !isNaN(b[sortCriteria.sort])
          ? a[sortCriteria.sort] - b[sortCriteria.sort]
          : a[sortCriteria.sort].localeCompare(b[sortCriteria.sort], "en", {
              numeric: true,
            })
        : !isNaN(a[sortCriteria.sort]) && !isNaN(b[sortCriteria.sort])
        ? b[sortCriteria.sort] - a[sortCriteria.sort]
        : b[sortCriteria.sort].localeCompare(a[sortCriteria.sort], "en", {
            numeric: true,
          })
    );

    return friendRequestListing?.map((item) => (
      <div
        className="setting  paper setting-checked listing-table-wraper"
        key={item._id}
      >
        <div className="ind-history-listings">
          <div className="table-data summary">
            <figure>
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="40"
                  height="40"
                  rx="20"
                  fill="#FC5BFF"
                  fillOpacity="0.1"
                />
                <path
                  d="M17.5556 21.3232L17.4358 21.3124C15.908 21.1735 15.1441 21.104 14.9015 20.5814C14.6588 20.0588 15.0987 19.4304 15.9785 18.1736L19.5612 13.0554C20.1424 12.2252 20.433 11.81 20.6836 11.8983C20.9342 11.9866 20.9005 12.4922 20.8331 13.5034L20.6299 16.5519C20.5685 17.4721 20.5379 17.9322 20.8023 18.2419C21.0667 18.5515 21.5259 18.5933 22.4444 18.6768L22.5642 18.6877C24.092 18.8265 24.8559 18.896 25.0985 19.4186C25.3412 19.9412 24.9013 20.5696 24.0215 21.8264L20.4388 26.9446C19.8576 27.7748 19.567 28.19 19.3164 28.1017C19.0658 28.0134 19.0995 27.5078 19.1669 26.4966L19.3701 23.4481C19.4315 22.5279 19.4621 22.0678 19.1977 21.7581C18.9333 21.4485 18.4741 21.4067 17.5556 21.3232Z"
                  fill="#FC5BFF"
                />
              </svg>
            </figure>
            <div className="table-data-info-wraper">
              <h4>{item.settings_name}</h4>
              <p>
                Set this automtion for next run
                <span className="toogle-options">
                  <Switch
                    checked={
                      item.default_sttings && item.default_sttings === 1
                        ? true
                        : false
                    }
                    handleChange={(e) => toggleDefaultRequest(e, item)}
                    isDisabled={
                      item.default_sttings && item.default_sttings === 1
                        ? true
                        : false
                    }
                  />
                </span>
              </p>
            </div>
          </div>

          <div className="table-data">
            <p className="info-texts">{typeof item?.profile_viewed == 'number' && item.profile_viewed}</p>
          </div>

          <div className="table-data">
            <p className="info-texts">
              {item.friend_request_send ? item.friend_request_send : 0}
            </p>
          </div>

          <div className="table-data">
            <div className="date-info-wraper">
              <figure>
                <svg
                  width="10"
                  height="15"
                  viewBox="0 0 10 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 5.26494C2.5 4.4734 1.44722 4.2636 1.16791 5.00422C0.492283 6.79574 0 8.39839 0 9.26486C0 12.0263 2.23858 14.2649 5 14.2649C7.76142 14.2649 10 12.0263 10 9.26486C10 8.33396 9.43178 6.55331 8.67844 4.60163C7.70257 2.07344 7.21464 0.80934 6.61233 0.741252C6.4196 0.719466 6.20934 0.758636 6.03739 0.848363C5.5 1.12877 5.5 2.5075 5.5 5.26494C5.5 6.09337 4.82843 6.76494 4 6.76494C3.17157 6.76494 2.5 6.09337 2.5 5.26494Z"
                    fill="url(#paint0_linear_6527_71330)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_6527_71330"
                      x1="1.5"
                      y1="17.7353"
                      x2="7.5"
                      y2="-2.26465"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFE600" />
                      <stop offset="1" stopColor="#FF3D00" />
                    </linearGradient>
                  </defs>
                </svg>
              </figure>
              <p className="info-texts highlighted">
                 {item?.time_saved===0||!item?.time_saved?"0 sec":secToReadableFormat(item?.time_saved)}
              </p>
            </div>
          </div>

          <div className="table-data">
            <div className="date-info-wraper">
              <figure>
                <svg
                  width="13"
                  height="14"
                  viewBox="0 0 13 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.38762 0.538032L9.38831 1.06277C11.3166 1.21389 12.5903 2.52784 12.5924 4.54283L12.6 10.4409C12.6028 12.6378 11.2226 13.9895 9.01026 13.993L3.60632 14C1.40784 14.0028 0.0103716 12.6189 0.00760708 10.4157L4.65482e-06 4.5869C-0.00275986 2.55862 1.22607 1.24818 3.15432 1.07117L3.15363 0.546428C3.15294 0.238582 3.38101 0.00699808 3.68511 0.00699808C3.9892 0.00629843 4.21728 0.237183 4.21797 0.545029L4.21866 1.03478L8.32397 1.02919L8.32328 0.539431C8.32259 0.231586 8.55066 0.000701235 8.85476 1.58584e-06C9.15194 -0.000698064 9.38693 0.230186 9.38762 0.538032ZM1.06509 4.80311L11.5288 4.78912V4.54424C11.4991 3.04 10.7444 2.25079 9.38975 2.13325L9.39044 2.67198C9.39044 2.97283 9.15615 3.21141 8.85896 3.21141C8.55486 3.21211 8.3261 2.97423 8.3261 2.67338L8.32541 2.10666L4.2201 2.11226L4.22079 2.67828C4.22079 2.97983 3.99341 3.21771 3.68931 3.21771C3.38521 3.21841 3.15645 2.98123 3.15645 2.67968L3.15576 2.14095C1.80806 2.27598 1.06233 3.06798 1.0644 4.58552L1.06509 4.80311ZM8.56799 7.98297V7.99066C8.5749 8.3125 8.83753 8.55668 9.15614 8.54968C9.46715 8.54199 9.71526 8.27542 9.70835 7.95358C9.69384 7.64574 9.44434 7.39456 9.13402 7.39526C8.8161 7.40226 8.5673 7.66113 8.56799 7.98297ZM9.13887 11.1244C8.82095 11.1174 8.56454 10.8522 8.56385 10.5304C8.55694 10.2086 8.81197 9.942 9.12989 9.9343H9.1368C9.46163 9.9343 9.72495 10.1995 9.72495 10.5283C9.72564 10.8571 9.46301 11.1237 9.13887 11.1244ZM5.72048 7.99424C5.7343 8.31608 5.99762 8.56726 6.31554 8.55326C6.62655 8.53857 6.87466 8.2727 6.86084 7.95086C6.85324 7.63602 6.59752 7.39115 6.28651 7.39184C5.96859 7.40584 5.71979 7.6724 5.72048 7.99424ZM6.31827 11.093C6.00035 11.107 5.73772 10.8558 5.72321 10.534C5.72321 10.2121 5.97133 9.94626 6.28925 9.93157C6.60025 9.93087 6.85666 10.1757 6.86357 10.4899C6.87809 10.8124 6.62928 11.0783 6.31827 11.093ZM2.87297 8.01868C2.88679 8.34052 3.15011 8.59239 3.46803 8.5777C3.77904 8.56371 4.02715 8.29714 4.01264 7.9753C4.00573 7.66046 3.75001 7.41558 3.43831 7.41628C3.12039 7.43028 2.87228 7.69684 2.87297 8.01868ZM3.47098 11.0964C3.15307 11.1111 2.89044 10.8592 2.87592 10.5374C2.87523 10.2156 3.12404 9.949 3.44196 9.93501C3.75297 9.93431 4.00937 10.1792 4.01629 10.494C4.0308 10.8159 3.78268 11.0824 3.47098 11.0964Z"
                    fill="#4285F4"
                  />
                </svg>
              </figure>
              <p className="info-texts">
                <Moment format=" Do MMMM YYYY,  h:mm a">
                  {item.created_at}
                </Moment>
              </p>
            </div>
          </div>

          <div className="table-data">
            <div className="date-info-wraper">
              <figure>
                <svg
                  width="13"
                  height="14"
                  viewBox="0 0 13 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.38762 0.538032L9.38831 1.06277C11.3166 1.21389 12.5903 2.52784 12.5924 4.54283L12.6 10.4409C12.6028 12.6378 11.2226 13.9895 9.01026 13.993L3.60632 14C1.40784 14.0028 0.0103716 12.6189 0.00760708 10.4157L4.65482e-06 4.5869C-0.00275986 2.55862 1.22607 1.24818 3.15432 1.07117L3.15363 0.546428C3.15294 0.238582 3.38101 0.00699808 3.68511 0.00699808C3.9892 0.00629843 4.21728 0.237183 4.21797 0.545029L4.21866 1.03478L8.32397 1.02919L8.32328 0.539431C8.32259 0.231586 8.55066 0.000701235 8.85476 1.58584e-06C9.15194 -0.000698064 9.38693 0.230186 9.38762 0.538032ZM1.06509 4.80311L11.5288 4.78912V4.54424C11.4991 3.04 10.7444 2.25079 9.38975 2.13325L9.39044 2.67198C9.39044 2.97283 9.15615 3.21141 8.85896 3.21141C8.55486 3.21211 8.3261 2.97423 8.3261 2.67338L8.32541 2.10666L4.2201 2.11226L4.22079 2.67828C4.22079 2.97983 3.99341 3.21771 3.68931 3.21771C3.38521 3.21841 3.15645 2.98123 3.15645 2.67968L3.15576 2.14095C1.80806 2.27598 1.06233 3.06798 1.0644 4.58552L1.06509 4.80311ZM8.56799 7.98297V7.99066C8.5749 8.3125 8.83753 8.55668 9.15614 8.54968C9.46715 8.54199 9.71526 8.27542 9.70835 7.95358C9.69384 7.64574 9.44434 7.39456 9.13402 7.39526C8.8161 7.40226 8.5673 7.66113 8.56799 7.98297ZM9.13887 11.1244C8.82095 11.1174 8.56454 10.8522 8.56385 10.5304C8.55694 10.2086 8.81197 9.942 9.12989 9.9343H9.1368C9.46163 9.9343 9.72495 10.1995 9.72495 10.5283C9.72564 10.8571 9.46301 11.1237 9.13887 11.1244ZM5.72048 7.99424C5.7343 8.31608 5.99762 8.56726 6.31554 8.55326C6.62655 8.53857 6.87466 8.2727 6.86084 7.95086C6.85324 7.63602 6.59752 7.39115 6.28651 7.39184C5.96859 7.40584 5.71979 7.6724 5.72048 7.99424ZM6.31827 11.093C6.00035 11.107 5.73772 10.8558 5.72321 10.534C5.72321 10.2121 5.97133 9.94626 6.28925 9.93157C6.60025 9.93087 6.85666 10.1757 6.86357 10.4899C6.87809 10.8124 6.62928 11.0783 6.31827 11.093ZM2.87297 8.01868C2.88679 8.34052 3.15011 8.59239 3.46803 8.5777C3.77904 8.56371 4.02715 8.29714 4.01264 7.9753C4.00573 7.66046 3.75001 7.41558 3.43831 7.41628C3.12039 7.43028 2.87228 7.69684 2.87297 8.01868ZM3.47098 11.0964C3.15307 11.1111 2.89044 10.8592 2.87592 10.5374C2.87523 10.2156 3.12404 9.949 3.44196 9.93501C3.75297 9.93431 4.00937 10.1792 4.01629 10.494C4.0308 10.8159 3.78268 11.0824 3.47098 11.0964Z"
                    fill="#4285F4"
                  />
                </svg>
              </figure>
              <p className="info-texts">
                <Moment format=" Do MMMM YYYY,  h:mm a">
                  {item.updated_at}
                </Moment>
              </p>
            </div>
          </div>

          <div className="table-data hide-show">
            <span
              className={
                showDetails === item._id
                  ? "hide-expand expanded"
                  : "hide-expand"
              }
            >
              <figure
                className="expand-details"
                onClick={() => setShowDetailsFn(item._id)}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 12L18 24"
                    stroke="#BDBDBD"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24 18L12 18"
                    stroke="#BDBDBD"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </figure>

              <figure
                className="hide-details"
                onClick={() => setShowDetailsFn(item._id)}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24 18L12 18"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </figure>
            </span>
          </div>
        </div>
        {showDetails === item._id && (
          <div className="details-listings-wraper paper">
            <div
              className={
                (item.keyword||item.negative_keyword)
                  ? "detail-table-wraper detail-grid-wrapper"
                  : "detail-table-wraper"
              }
            >
              <div className="detail-table-row">
                {item.gender_filter && (
                  <div className="detail-table-cell">
                    <p className="detail-table-heading">Gender</p>
                    <p className="detail-table-content">
                      {item.gender_filter_value}
                    </p>
                  </div>
                )}
                {((item.look_up_interval) != null) &&
                    <div className="detail-table-cell">
                    <p className="detail-table-heading">Look up interval</p>
                    <p className="detail-table-content">
                      {/* {console.log("item::::::", item)} */}
                      {((item.look_up_interval) === ".5") ? 
                      <>
                      30 Sec
                      </>

                      :
                      <>

                        {((item.look_up_interval) === "auto") ? 
                        <>
                        {item.look_up_interval}
                        </>
                        :
                        <>
                        {item.look_up_interval} Min
                        </>
                      
                      
                      }
                      </>
                      
                    }
                      
                    </p>
                    </div>
                }
                
                <div className="detail-table-cell">
                  <p className="detail-table-heading">Profile request limit</p>
                  <p className="detail-table-content">
                    {item.request_limit_type === "Limited"
                      ? item.request_limit
                      : "∞"}
                  </p>
                </div>
                {item.country_filter_enabled && item.country_filter && (
                  <div className="detail-table-cell">
                    <p className="detail-table-heading">Country level</p>
                    <p className="detail-table-content">
                      {item.country_filter_value?.map((itemCountry, indexC) => (
                        <span key={indexC}>{itemCountry}</span>
                      ))}
                    </p>
                  </div>
                )}
                {item.country_filter_enabled && item.tier_filter && (
                  <div className="detail-table-cell">
                    <p className="detail-table-heading">Tier level</p>
                    <p className="detail-table-content">
                      {item.tier_filter_value?.map((itemTier, indexT) => (
                        <span key={indexT}>{itemTier}</span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
              {(item.keyword||item.negative_keyword) && (
                <div className="detail-table-row">
                  {item.selected_keywords?.length > 0 && (
                    <div className="detail-table-cell key-detail-cell posKey-detail-cell">
                      <p className="detail-table-heading">Keywords</p>
                      <ul className="tagListings">
                        {item.selected_keywords
                          ?.slice(0, 10)
                          .map((keyItem, index) => {
                            return (
                              <li
                                className="possitive-keywords"
                                key={"positive-" + index}
                              >
                                {keyItem}
                              </li>
                            );
                          })}
                        {item.selected_keywords.length > 10 &&
                        (expanded === "positive" || expanded === "all")
                          ? item.selected_keywords
                              .slice(10, item.selected_keywords.length)
                              .map((keyItem, index) => {
                                return (
                                  <li
                                    className="possitive-keywords"
                                    key={"positive-" + index}
                                  >
                                    {keyItem}
                                  </li>
                                );
                              })
                          : ""}
                        {item.selected_keywords.length > 10 &&
                        (expanded === "none" || expanded === "negative") ? (
                          <li
                            className="extra-keywords possitives"
                            onClick={() =>
                              setExpanded(
                                expanded === "none" ? "positive" : "all"
                              )
                            }
                          >
                            +{item.selected_keywords.length - 10}
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  )}
                  {item.selected_negative_keywords?.length > 0 && (
                    <div className="detail-table-cell key-detail-cell">
                      <p className="detail-table-heading">Negative keywords</p>
                      <ul className="tagListings">
                        {item.selected_negative_keywords
                          ?.slice(0, 10)
                          .map((keyItem, index) => {
                            return (
                              <li
                                className="negative-keywords"
                                key={"positive-" + index}
                              >
                                {keyItem}
                              </li>
                            );
                          })}
                        {item.selected_negative_keywords.length > 10 &&
                        (expanded === "negative" || expanded === "all")
                          ? item.selected_negative_keywords
                              .slice(10, item.selected_negative_keywords.length)
                              .map((keyItem, index) => {
                                return (
                                  <li
                                    className="negative-keywords"
                                    key={"positive-" + index}
                                  >
                                    {keyItem}
                                  </li>
                                );
                              })
                          : ""}
                        {item.selected_negative_keywords.length > 10 &&
                        (expanded === "none" || expanded === "positive") ? (
                          <li
                            className="extra-keywords negatives"
                            onClick={() =>
                              setExpanded(
                                expanded === "none" ? "negative" : "all"
                              )
                            }
                          >
                            +{item.selected_negative_keywords.length - 10}
                          </li>
                        ) : (
                          ""
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    ));
  };

  /**
   * set sort type */

  const setSort = (sortBy, typeOfsort) => {
    if (sortCriteria.sort === sortBy) {
      setSortCriteria({
        ...sortCriteria,
        type: sortCriteria.type === "asc" ? "dsc" : "asc",
      });
    } else {
      setSortCriteria({
        sort: sortBy,
        type: typeOfsort,
      });
    }
  };

  // useEffect(() => {
    // console.log("sortCriteria changed to::::", sortCriteria);
  // }, [sortCriteria]);

  useEffect(() => {
    // console.log("In versions page");
    fetchUserRequestSettings();
  }, []);


  const secToHeaderTotaltime=(seconds)=> {
    let y = Math.floor(seconds / 31536000);
    let mo = Math.floor((seconds % 31536000) / 2628000);
    let d = Math.floor(((seconds % 31536000) % 2628000) / 86400);
    let h = Math.floor((seconds % (3600 * 24)) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    let sqzTime
    if (parseFloat(y) > 0) {
      if (parseFloat(y) > 10) {
        sqzTime =`10+ Years`;
      } else {
        sqzTime= `${y}${mo > 0 ? "+" : ""} ${y > 1 ? " Years" : "Year"}`;
      }
    } else if (parseFloat(mo) > 0) {
      sqzTime =`${mo}${d > 0 ? "+" : ""} ${mo > 1 ? " Months" : "Month"}`;
    } else if (parseFloat(d) > 0) {
      sqzTime= `${d}${h > 0 ? "+" : ""} ${d > 1 ? " Days" : "Day"}`;
    } else if (parseFloat(h) > 0) {
      sqzTime= `${h}${m > 0 ? "+" : ""} ${h > 1 ? " Hrs" : "Hr"}`;
    } else if (parseFloat(m) > 0) {
      sqzTime =`${m}${s > 0 ? "+" : ""} ${m > 1 ? " Mins" : "Min"}`;
    } else if(parseFloat(s) > 0) {
      sqzTime= `${s}${s > 1 ? " Secs" : "Sec"}`;
    }else{
      sqzTime= "0 Seconds";
    }

    let yDisplay = y > 0 ? y + (y === 1 ? " year, " : " years, ") : "";
    let moDisplay = mo > 0 ? mo + (mo === 1 ? " month, " : " months, ") : "";
    let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds ") : "";
    return{
      smallTime:sqzTime,
      fullTime: yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay
    }
  }
  /**
   * function to turm seconds to readable formate
   * @param {number} seconds 
   * @returns 
   */
  const secToReadableFormat = (seconds) => {
    console.log('time saved>>>>>>', seconds)
    let y = Math.floor(seconds / 31536000);
    let mo = Math.floor((seconds % 31536000) / 2628000);
    let d = Math.floor(((seconds % 31536000) % 2628000) / 86400);
    let h = Math.floor((seconds % (3600 * 24)) / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);
    let yDisplay = y > 0 ? y + (y === 1 ? " y, " : " y, ") : "";
    let moDisplay = mo > 0 ? mo + (mo === 1 ? " m, " : " m, ") : "";
    let dDisplay = d > 0 ? d + (d === 1 ? " d, " : " d, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " hr, " : " hrs, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " min, " : " mins, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " sec" : " secs ") : "";
    
    return yDisplay + moDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
  };

  return (
    <div className="setting-content request-sent-wraper">
      <div className="settings paper">
        <div className="setting">
          <div className="info-wraper">
            <div className="setting  paper setting-checked inividual-info">
              <figure>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    width="60"
                    height="60"
                    rx="30"
                    fill="#4972FF"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M30 19.4846C29.3425 19.4846 28.7706 19.9062 27.6267 20.7494L25.9058 22.0178C25.7256 22.1506 25.6354 22.2171 25.5387 22.2729C25.442 22.3288 25.3394 22.3736 25.1343 22.4632L23.1753 23.3194C21.8732 23.8884 21.2221 24.173 20.8934 24.7423C20.5646 25.3117 20.6438 26.0178 20.802 27.43L21.0401 29.5546C21.065 29.7771 21.0775 29.8883 21.0775 30C21.0775 30.1117 21.065 30.223 21.0401 30.4454L20.802 32.57C20.6438 33.9823 20.5646 34.6884 20.8934 35.2577C21.2221 35.8271 21.8732 36.1116 23.1753 36.6807L25.1343 37.5368C25.3394 37.6265 25.442 37.6713 25.5387 37.7272C25.6354 37.783 25.7256 37.8494 25.9058 37.9822L27.6267 39.2507C28.7706 40.0939 29.3425 40.5154 30 40.5154C30.6574 40.5154 31.2294 40.0939 32.3733 39.2507L32.3733 39.2507L34.0942 37.9822C34.2744 37.8494 34.3645 37.783 34.4612 37.7272C34.558 37.6713 34.6605 37.6265 34.8657 37.5368L36.8246 36.6807C38.1268 36.1116 38.7779 35.8271 39.1066 35.2577C39.4353 34.6884 39.3562 33.9823 39.1979 32.57L38.9599 30.4454L38.9599 30.4454C38.935 30.223 38.9225 30.1117 38.9225 30C38.9225 29.8883 38.9349 29.7771 38.9599 29.5547L38.9599 29.5546L39.1979 27.43C39.3562 26.0178 39.4353 25.3117 39.1066 24.7423C38.7779 24.173 38.1268 23.8884 36.8246 23.3194L34.8657 22.4632L34.8657 22.4632C34.6605 22.3736 34.558 22.3288 34.4612 22.2729C34.3645 22.2171 34.2744 22.1506 34.0942 22.0178L32.3733 20.7494C31.2294 19.9062 30.6574 19.4846 30 19.4846ZM30 34C32.2091 34 34 32.2092 34 30C34 27.7909 32.2091 26 30 26C27.7908 26 26 27.7909 26 30C26 32.2092 27.7908 34 30 34Z"
                    fill="#4972FF"
                  />
                </svg>
              </figure>
              <div className="individuals-informations">
                <h4
                  className={
                    !headPoints || headPoints.totalRun == null
                      ? "skeleton-loader"
                      : ""
                  }
                >
                  {headPoints && headPoints?.totalRun && headPoints.totalRun}
                </h4>
                <p>Total automation ran</p>
              </div>
            </div>
            <div className="setting  paper setting-checked inividual-info">
              <figure>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    width="60"
                    height="60"
                    rx="30"
                    fill="#26C0E2"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.6647 27.9179C20.2608 25.3884 23.9184 21 30.0836 21C36.2488 21 39.9064 25.3884 41.5025 27.9179C41.9596 28.6423 42.1882 29.0045 42.1657 29.622C42.1433 30.2395 41.8787 30.5981 41.3496 31.3151C39.4948 33.8289 35.4312 38.3228 30.0836 38.3228C24.736 38.3228 20.6724 33.8289 18.8176 31.3151C18.2885 30.5981 18.024 30.2395 18.0015 29.622C17.979 29.0045 18.2076 28.6423 18.6647 27.9179ZM30.0836 34.6108C32.8171 34.6108 35.033 32.3949 35.033 29.6614C35.033 26.9279 32.8171 24.712 30.0836 24.712C27.3502 24.712 25.1342 26.9279 25.1342 29.6614C25.1342 32.3949 27.3502 34.6108 30.0836 34.6108Z"
                    fill="#26C0E2"
                  />
                  <circle cx="30" cy="29.7" r="3" fill="#26C0E2" />
                </svg>
              </figure>
              <div className="individuals-informations">
                <h4
                  className={
                    !headPoints || headPoints.profileViewed == null
                      ? "skeleton-loader"
                      : ""
                  }
                >
                  {headPoints &&
                    headPoints?.profileViewed &&
                    headPoints.profileViewed}
                </h4>
                <p>Total profile viewed</p>
              </div>
            </div>
            <div className="setting  paper setting-checked inividual-info">
              <figure>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    width="60"
                    height="60"
                    rx="30"
                    fill="#605BFF"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31.3249 33.0763C30.8883 33.0257 30.4456 33 30 33C28.0188 33 26.0929 33.5085 24.5211 34.4465C23.3007 35.1749 22.3467 36.1307 21.7411 37.2183C21.4664 37.7117 21.7956 38.2902 22.3484 38.4054C25.8568 39.1365 29.4437 39.3594 33 39.074V39H32C30.3431 39 29 37.6569 29 36C29 34.5753 29.9932 33.3825 31.3249 33.0763Z"
                    fill="#605BFF"
                  />
                  <path
                    d="M36 32L36 40"
                    stroke="#605BFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 36L32 36"
                    stroke="#605BFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="30" cy="26" r="5" fill="#605BFF" />
                </svg>
              </figure>
              <div className="individuals-informations">
                <h4
                  className={
                    !headPoints || headPoints.requestSent == null
                      ? "skeleton-loader"
                      : ""
                  }
                >
                  {headPoints &&
                    headPoints?.requestSent &&
                    headPoints.requestSent}
                </h4>
                <p>Total request sent</p>
              </div>
            </div>
            <div className="setting  paper setting-checked inividual-info">
              <figure>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    width="60"
                    height="60"
                    rx="30"
                    fill="#F29339"
                  />
                  <path
                    d="M42 30C42 36.6274 36.6274 42 30 42C23.3726 42 18 36.6274 18 30C18 23.3726 23.3726 18 30 18C36.6274 18 42 23.3726 42 30Z"
                    fill="#F29339"
                    stroke="#F29339"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 23V29.75C30 29.8881 30.1119 30 30.25 30H34"
                    stroke="#1C1C1E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </figure>
              <div className="individuals-informations">
              <h4
                  // title={
                  //   headPoints && headPoints?.savedTime && headPoints.savedTime.fullTime&& headPoints.savedTime.fullTime
                  // }
                  className={
                    !headPoints || headPoints.savedTime == null
                      ? "skeleton-loader"
                      : "time-saved-heading"
                  }
                >
                  {headPoints && headPoints?.savedTime &&
                    headPoints?.savedTime > 1 ? 
                      (headPoints?.savedTime % 1 === 0 ? headPoints?.savedTime : Math.floor(headPoints?.savedTime)) + '+ hour(s)' : 
                      headPoints?.savedTime === 0 ? '0 hour(s)' : 
                      (headPoints?.savedTime === null || headPoints?.savedTime === undefined) ? '' :
                      'Less than 1 hour'
                  }

                  {/* {totalTmeSavedDisplay} */}
                </h4>
                <p>Total time saved</p>
                {/* <Tooltip
                  textContent={headPoints && headPoints?.savedTime && headPoints.savedTime.fullTime&& headPoints.savedTime.fullTime}  
                />  */}
              </div>
            </div>
          </div>
        </div>
        <div className="history-listing-wrapers">
          {friendRequestHitory && friendRequestHitory?.length > 0 ? (
            <div className="history-listing-wraper">
              <div className="history-display-wraper">
                <div className="setting table-head-content">
                  <div className="cutom-table-wraper">
                    <div className="table-heads">
                      <span className="table-head-name">Summary</span>
                      <span
                        className="filter-icons"
                        onClick={() => setSort("settings_name", "asc")}
                      >
                        <figure className="up-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 5.25014H6.26486C6.792 5.25014 7.05536 4.55218 6.68357 4.14577L3.84857 0.93952C3.73273 0.812816 3.58136 0.749512 3.43007 0.749512C3.2789 0.749512 3.12815 0.812816 3.01329 0.93952L0.173981 4.14624C-0.197761 4.55171 0.0654672 5.25014 0.592717 5.25014Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                        <figure className="down-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 0.900002H6.26486C6.792 0.900002 7.05536 1.59797 6.68357 2.00438L3.84857 5.21063C3.73273 5.33733 3.58136 5.40063 3.43007 5.40063C3.2789 5.40063 3.12815 5.33733 3.01329 5.21063L0.173981 2.00391C-0.197761 1.59844 0.0654672 0.900002 0.592717 0.900002Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                      </span>
                    </div>

                    <div className="table-heads">
                      <span className="table-head-name">Profile Viewed</span>
                      <span
                        className="filter-icons"
                        onClick={() => setSort("profile_viewed", "asc")}
                      >
                        <figure className="up-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 5.25014H6.26486C6.792 5.25014 7.05536 4.55218 6.68357 4.14577L3.84857 0.93952C3.73273 0.812816 3.58136 0.749512 3.43007 0.749512C3.2789 0.749512 3.12815 0.812816 3.01329 0.93952L0.173981 4.14624C-0.197761 4.55171 0.0654672 5.25014 0.592717 5.25014Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                        <figure className="down-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 0.900002H6.26486C6.792 0.900002 7.05536 1.59797 6.68357 2.00438L3.84857 5.21063C3.73273 5.33733 3.58136 5.40063 3.43007 5.40063C3.2789 5.40063 3.12815 5.33733 3.01329 5.21063L0.173981 2.00391C-0.197761 1.59844 0.0654672 0.900002 0.592717 0.900002Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                      </span>
                    </div>

                    <div className="table-heads">
                      <span className="table-head-name">Request Sent</span>
                      <span
                        className="filter-icons"
                        onClick={() => setSort("friend_request_send", "asc")}
                      >
                        <figure className="up-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 5.25014H6.26486C6.792 5.25014 7.05536 4.55218 6.68357 4.14577L3.84857 0.93952C3.73273 0.812816 3.58136 0.749512 3.43007 0.749512C3.2789 0.749512 3.12815 0.812816 3.01329 0.93952L0.173981 4.14624C-0.197761 4.55171 0.0654672 5.25014 0.592717 5.25014Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                        <figure className="down-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 0.900002H6.26486C6.792 0.900002 7.05536 1.59797 6.68357 2.00438L3.84857 5.21063C3.73273 5.33733 3.58136 5.40063 3.43007 5.40063C3.2789 5.40063 3.12815 5.33733 3.01329 5.21063L0.173981 2.00391C-0.197761 1.59844 0.0654672 0.900002 0.592717 0.900002Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                      </span>
                    </div>

                    <div className="table-heads">
                      <span className="table-head-name">Time Saved</span>
                      <span
                        className="filter-icons"
                        onClick={() => setSort("time_saved", "asc")}
                      >
                        <figure className="up-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 5.25014H6.26486C6.792 5.25014 7.05536 4.55218 6.68357 4.14577L3.84857 0.93952C3.73273 0.812816 3.58136 0.749512 3.43007 0.749512C3.2789 0.749512 3.12815 0.812816 3.01329 0.93952L0.173981 4.14624C-0.197761 4.55171 0.0654672 5.25014 0.592717 5.25014Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                        <figure className="down-icon">
                          <svg
                            width="7"
                            height="6"
                            viewBox="0 0 7 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.592717 0.900002H6.26486C6.792 0.900002 7.05536 1.59797 6.68357 2.00438L3.84857 5.21063C3.73273 5.33733 3.58136 5.40063 3.43007 5.40063C3.2789 5.40063 3.12815 5.33733 3.01329 5.21063L0.173981 2.00391C-0.197761 1.59844 0.0654672 0.900002 0.592717 0.900002Z"
                              fill="#53525F"
                            />
                          </svg>
                        </figure>
                      </span>
                    </div>

                    <div className="table-heads start-end-info">
                      <span className="table-head-name">
                        Last Start Date & Time
                      </span>
                      {/* <span className="filter-icons" onClick={()=>setSort('last_start_date', 'asc')}>
                      <figure className="up-icon">
                        <svg
                          width="7"
                          height="6"
                          viewBox="0 0 7 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.592717 5.25014H6.26486C6.792 5.25014 7.05536 4.55218 6.68357 4.14577L3.84857 0.93952C3.73273 0.812816 3.58136 0.749512 3.43007 0.749512C3.2789 0.749512 3.12815 0.812816 3.01329 0.93952L0.173981 4.14624C-0.197761 4.55171 0.0654672 5.25014 0.592717 5.25014Z"
                            fill="#53525F"
                          />
                        </svg>
                      </figure>
                      <figure className="down-icon">
                        <svg
                          width="7"
                          height="6"
                          viewBox="0 0 7 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.592717 0.900002H6.26486C6.792 0.900002 7.05536 1.59797 6.68357 2.00438L3.84857 5.21063C3.73273 5.33733 3.58136 5.40063 3.43007 5.40063C3.2789 5.40063 3.12815 5.33733 3.01329 5.21063L0.173981 2.00391C-0.197761 1.59844 0.0654672 0.900002 0.592717 0.900002Z"
                            fill="#53525F"
                          />
                        </svg>
                      </figure>
                    </span> */}
                    </div>

                    <div className="table-heads start-end-info">
                      <span className="table-head-name">
                        Last End Date & Time
                      </span>
                      {/* <span className="filter-icons" onClick={()=>setSort('last_end_date', 'asc')}>
                      <figure className="up-icon">
                        <svg
                          width="7"
                          height="6"
                          viewBox="0 0 7 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.592717 5.25014H6.26486C6.792 5.25014 7.05536 4.55218 6.68357 4.14577L3.84857 0.93952C3.73273 0.812816 3.58136 0.749512 3.43007 0.749512C3.2789 0.749512 3.12815 0.812816 3.01329 0.93952L0.173981 4.14624C-0.197761 4.55171 0.0654672 5.25014 0.592717 5.25014Z"
                            fill="#53525F"
                          />
                        </svg>
                      </figure>
                      <figure className="down-icon">
                        <svg
                          width="7"
                          height="6"
                          viewBox="0 0 7 6"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.592717 0.900002H6.26486C6.792 0.900002 7.05536 1.59797 6.68357 2.00438L3.84857 5.21063C3.73273 5.33733 3.58136 5.40063 3.43007 5.40063C3.2789 5.40063 3.12815 5.33733 3.01329 5.21063L0.173981 2.00391C-0.197761 1.59844 0.0654672 0.900002 0.592717 0.900002Z"
                            fill="#53525F"
                          />
                        </svg>
                      </figure>
                    </span> */}
                    </div>

                    <div className="table-heads">
                      <span className="table-head-name">Settings History</span>
                    </div>
                  </div>
                </div>
                <div className="table-contents-wrapers">
                  <DataSettingsRow />
                </div>
              </div>
            </div>
          ) : (
            <NoDataFound />
          )}
        </div>
      </div>

      {loading && <SettingLoader />}
    </div>
  );
};

export default FriendRequestSentVersion;
