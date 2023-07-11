import { memo, useEffect, useState } from "react";
import {
  CommentIcon,
  CalendarIcon,
  FeMaleIcon,
  MaleIcon,
  MessageIcon,
  WhitelabelIcon,
  ReactionIcon,
  FacebookSyncIcon,
  EnvelopeIcon,
  BlockIcon,
  OpenInNewTab, 
  SourceGroupIcon,
} from "../../assets/icons/Icons";
// import {
//   BlockListFriends,
//   whiteListFriends,
// } from "../../services/friends/FriendListServices";
import { useDispatch } from "react-redux";
import Alertbox from "../common/Toast";
import { BlockListFriend, whiteListFriend } from "../../actions/FriendsAction";
import helper from "../../helpers/helper";
//import { removeSelectedFriends } from "../../actions/FriendListAction";
import { Link } from "react-router-dom";
//let savedFbUId = localStorage.getItem("fr_default_fb");
import { getMySettings } from "../../actions/MySettingAction";

export const handlewhiteListUser = (dispatch, friendId, status) => {
  const payload = [
    {
      fbUserId: localStorage.getItem("fr_default_fb"),
      friendFbId: friendId,
      status: status,
    },
  ]; 
  dispatch(whiteListFriend({ payload: payload }))
    .unwrap()
    .then((res) => {
      Alertbox(
        ` Contact ${
          status === 1 ? "whitelisted" : "removed from whitelist"
        } successfully!`,
        "success",
        1000,
        "bottom-right"
      );
      //dispatch(removeSelectedFriends());
    })
    .catch((err) => {
      Alertbox(`${err.message} `, "error", 2000, "bottom-right");
      //dispatch(removeSelectedFriends());
    });
};
export const handleBlockingUser = (dispatch, friendId, status) => {
  const payload = [
    {
      fbUserId: localStorage.getItem("fr_default_fb"),
      friendFbId: friendId,
      status: status,
    },
  ];
  dispatch(BlockListFriend({ payload: payload }))
    .unwrap()
    .then((res) => {
      Alertbox(
        ` Contact ${
          status === 1 ? "blacklisted" : "removed from blacklist"
        } successfully!`,
        "success",
        1000,
        "bottom-right"
      );
     // dispatch(removeSelectedFriends());
    })
    .catch((err) => {
      Alertbox(`${err.message} `, "error", 2000, "bottom-right");
     // dispatch(removeSelectedFriends());
    });
};

export const NameCellRenderer = memo((params) => {
  const dispatch = useDispatch();
  return (
    <span className="name-image-renderer">
      <a href={params.data.friendProfileUrl} target="_blank" rel="noreferrer">
        <span
          className="fb-display-pic"
          style={{
            backgroundImage: `url(${params.data.friendProfilePicture})`,
          }}
        ></span>
        <span className="fb-name">{params.value}</span>
      </a>

      {params.data.whitelist_status ? (
        //dis-whiting
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handlewhiteListUser(dispatch, params.data.friendFbId, 0);
          }}
        >
          {<WhitelabelIcon color={"#FEC600"} />}
        </span>
      ) : (
        //whiting
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handlewhiteListUser(dispatch, params.data.friendFbId, 1);
          }}
        >
          {<WhitelabelIcon color={"#767485"} />}
        </span>
      )}
      {params.data.blacklist_status ? (
        //removing from  black list
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handleBlockingUser(dispatch, params.data.friendFbId, 0);
          }}
        >
          {<BlockIcon color={"#FF6A77"} />}
        </span>
      ) : (
        //black listing
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handleBlockingUser(dispatch, params.data.friendFbId, 1);
          }}
        >
          {<BlockIcon color={"#767485"} />}
        </span>
      )}
    </span>
  );
});
export const EngagementGetter = (params) => {
  // Reacts + Comments
  let engCount =
    Number(params.data.reactionThread) + Number(params.data.commentThread);
  return engCount;
};
export const EmptyRenderer = memo((params) => {
  return "";
});
export const GeneralNameCellRenderer = memo((params) => {
  return (
    <span className="name-image-renderer">
      <a href={params.data.friendProfileUrl} target="_blank" rel="noreferrer">
        <span
          className="fb-display-pic"
          style={{
            backgroundImage: `url(${params.data.friendProfilePicture})`,
          }}
        ></span>
        <span className="fb-name">{params.value}</span>
      </a>
    </span>
  ); 
});

export const UnlinkedNameCellRenderer = memo((params) => {
  return (
    <span className="name-image-renderer">
      <span
        className="fb-display-pic"
        style={{
          backgroundImage: `url(${params.data.friendProfilePicture})`,
        }}
      ></span>
      <span className="fb-name">{params.value}</span>
      <a href={params.data.friendProfileUrl} target="_blank" rel="noreferrer" className="ico-open-link">
        <OpenInNewTab />
      </a>
    </span>
  );
});

export const UnlinkedNameCellWithOptionsRenderer = memo((params) => {
  const [white, setWhite]=useState(params.data.whitelist_status);
  const [black, setBlack]=useState(params.data.blacklist_status);
  const dispatch = useDispatch();
  return (
    <span className="name-image-renderer">
      <span
        className="fb-display-pic"
        style={{
          backgroundImage: `url(${params.data.friendProfilePicture})`,
        }}
      ></span>
      <span className="tooltipFullName" data-text={params.value} >
        <span className="fb-name">{params.value}</span>
      </span>
      
      <a href={params.data.friendProfileUrl} target="_blank" rel="noreferrer" className="ico-open-link">
        <OpenInNewTab />
      </a>

      {white? (
        //dis-whiting
        <span
          className="profile-whitelabeled"
          onClick={() => {
             handlewhiteListUser(dispatch, params.data.friendFbId, 0);
            setWhite(false);
          }}
        >
          {<WhitelabelIcon color={"#FEC600"} />}
        </span>
      ) : (
        //whiting
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handlewhiteListUser(dispatch, params.data.friendFbId, 1);
            setWhite(true);
          }}
        >
          {<WhitelabelIcon color={"#767485"} />}
        </span>
      )}
      {black ? (
        //removing from  black list
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handleBlockingUser(dispatch, params.data.friendFbId, 0);
            setBlack(false);
          }}
        >
          {<BlockIcon color={"#FF6A77"} />}
        </span>
      ) : (
        //black listing
        <span
          className="profile-whitelabeled"
          onClick={() => {
            handleBlockingUser(dispatch, params.data.friendFbId, 1);
            setBlack(true);
          }}
        >
          {<BlockIcon color={"#767485"} />}
        </span>
      )}
    </span>
  );
});

export const CommentRenderer = memo((params) => {
  const commentCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <CommentIcon />
      </figure>
      <span className={`sync-dt`}>{commentCount || 0}</span>
    </span>
  );
});

export const CreationRenderer = memo((params) => {
  const statusSync = params.value.toLowerCase();
  const syncDate = statusSync.split(" ")[0];
  const syncTime = statusSync.split(" ")[1];

  return (
    <span className={`sync-date d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <CalendarIcon />
      </figure>
      <span className={`sync-dt`}>{syncDate}</span>
      <span className={`sync-tm`}>{syncTime}</span>
    </span>
  );
});

export const AgeRenderer = (params) => {
  const statusSync = params.data.created_at.toLowerCase();
  let currentUTC = helper.curretUTCTime();
  let diffTime = Math.abs(currentUTC - new Date(statusSync).valueOf());
  let days = diffTime / (24 * 60 * 60 * 1000);
  let hours = (days % 1) * 24;
  let minutes = (hours % 1) * 60;
  let secs = (minutes % 1) * 60;
  [days, hours, minutes, secs] = [
    Math.floor(days),
    Math.floor(hours),
    Math.floor(minutes),
    Math.floor(secs),
  ];

  let age = 0;

  if (days) age = days + " Day(s)";
  else if (hours) age = hours + " Hour(s)";
  else if (minutes) age = minutes + " Minute(s)";
  else age = secs + " Sec(s)";

  return age;
};

export const RecentEngagementRenderer = memo((params) => {
  const dispatch = useDispatch();
  const [cutOffDays, setCutOffDays] = useState(null)
  const statusSync = params.data.last_engagement_date ?
                     params.data.last_engagement_date.toLowerCase() : params.data.created_at.toLowerCase();
  let currentUTC = helper.curretUTCTime();
  let diffTime = Math.abs(currentUTC - new Date(statusSync).valueOf());
  let days =  Math.floor(diffTime / (24 * 60 * 60 * 1000));
  let cutoff = 10; //here Friends will be considered as inactive after
  let date =  new Date(statusSync);
  let currentYear = date.getFullYear() ;
  let currentMonth = date.getMonth() + 1 ; // 0 - 11
  let currentDay = date.getDate() ; 
  if (currentMonth < 10){ 
    currentMonth = "0" + currentMonth
  }
  let dateFormat = currentMonth + " / " + currentDay + " / " + currentYear;

  // useEffect(() => {
  //   dispatch(getMySettings({ fbUserId: `${localStorage.getItem("fr_default_fb")}` })).unwrap().then((res) => {
  //     if(res) {
  //       setCutOffDays(res?.friend_inactivity_period ? res?.friend_inactivity_period : 0)
  //     }
  //   })
  // }, [])

  return (
    <span className={` d-flex f-align-center`}>
      <span className="tooltipFullName small" data-text={"Last engaged on " + dateFormat}>
        {cutOffDays !== null ?
        <span className={days > cutoff ? "activeEngaged" : "activeEngaged notAct"}>
          <span className="dot"></span> {days} day(s)
        </span> : ''}
      </span> 
    </span>
  );
});


export const GenderRenderer = memo((params) => {
  let genderFriend = "N/A";
  if (params.value?.length > 0 && params.value != "N/A") {
    genderFriend = params.value.toLowerCase();
  }

  return (
    <div className={`friend-gender d-flex fa-align-center`}>
      {genderFriend === "male" || genderFriend === "female" ? (
        <figure
          className={
            genderFriend === "male"
              ? "friend-gender-ico text-center male"
              : "friend-gender-ico text-center"
          }
        >
          {genderFriend === "male" ? (
            <MaleIcon />
          ) : genderFriend === "female" ? (
            <FeMaleIcon />
          ) : (
            ""
          )}
        </figure>
      ) : (
        ""
      )}
      <span className={genderFriend === "N/A" ? "muted-text": ""}>{genderFriend}</span>
    </div>
  );
});

export const HasConversationRenderer = memo((params) => {
  const messageCount = params.value;

  return (
    <div className={`friend-gender d-flex fa-align-center`}>
      {messageCount > 0 ? (
        <span className="has-conversation conv-yes text-center">Yes</span>
      ) : (
        <span className="has-conversation conv-no text-center">No</span>
      )}
    </div>
  );
});

export const MessageRenderer = memo((params) => {
  const messageCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <MessageIcon />
      </figure>
      <span className={`sync-dt`}>{messageCount || 0}</span>
    </span>
  );
});

export const ReactionRenderer = memo((params) => {
  const reactionCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <ReactionIcon />
      </figure>
      <span className={`sync-dt`}>{reactionCount || 0}</span>
    </span>
  );
});

export const SourceRenderer = memo((params) => {
  const sourceFriend = params?.data?.groupName;

  return (
    <>
      {params?.data?.groupUrl && sourceFriend ? (
        <Link
          to={params?.data?.groupUrl}
          className="friend-sync-source d-flex f-align-center"
          target="_blank"
        >
          {sourceFriend ? (
            <>
              <figure className="friend-source text-center">
                {sourceFriend === "sync" ? <FacebookSyncIcon /> : ""}
              </figure>
              <span>
                {/* {params?.data?.finalSource} : {sourceFriend} */}
                {sourceFriend} 
              </span>
            </>
          ) : (
            <span className="no-keywords muted-text">N/A</span>
          )}
        </Link>
      ) : (
        <div className="friend-sync-source d-flex f-align-center">
          {params?.data?.finalSource ? (
            <>
              <figure className="friend-source text-center">
                {params?.data?.finalSource === "sync" ? <FacebookSyncIcon /> : ""}
              </figure>
              <span>
                {/* {params?.data?.finalSource} : {sourceFriend} */}
               {params?.data?.finalSource}
              </span>
            </>
          ) : (
            <span className="no-keywords muted-text">N/A</span>
          )}
        </div>
      )}
    </>
  );
});

export const StatusRenderer = memo((params) => {
  const statusFriend = params.value.toLowerCase();

  return (
    <span className={`account-status status-${statusFriend}`}>
      <span className={`status-bg`}></span>
      <span className="status-text">
        {params.value === "Activate"
          ? "Active"
          : params.value === "Deactivate"
          ? "Inactive"
          : params.value}
      </span>
    </span>
  );
});

export const EmailRenderer = memo((params) => {
  let emailSync = "N/A";
  if (params.value && params.value != "N/A") {
    emailSync = params.value.toLowerCase();
  }

  return (
    <span className={`sync-email d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <EnvelopeIcon /> 
      </figure>
      <span className={emailSync === "N/A" ?`muted-text`: `sync-txt`}>{emailSync}</span>
    </span>
  );
});

export const RequestRenderer = memo((params) => {
  let reqSync = "N/A";
  if (params.value) {
    reqSync = params.value;
  }

  return (
    <span
      className={`sync-box-wrap d-flex f-align-center ${
        reqSync === 1 ? "green" : "yellow"
      }`}
    >
      <span className={reqSync === "N/A" ?`muted-text`: `sync-txt`}>{reqSync}</span>
    </span>
  );
});
export const KeywordRenderer = memo((params) => {
  const keywords =
  params?.data.matchedKeyword ? 
      params?.data.matchedKeyword.split(",").filter(keyW => keyW.trim() !== "") : null
    
  const [ matchedKeyword, setMatchedKeyword ] = 
    useState(params?.data.matchedKeyword ? 
      params?.data.matchedKeyword.split(",").filter(keyW => keyW.trim() !== "") : [])

      //className={sourceFriend.length > 12 ? "friendSource tooltipFullName" : "friendSource"} data-text={sourceFriend.length > 12 && sourceFriend}
  return (
    <>
      {keywords && matchedKeyword?.length > 0 ? 
      <span
        className={`sync-box-wrap d-flex f-align-center key-box-wrap`}
      >
          {Array.isArray(matchedKeyword)
              ? <span className={matchedKeyword[0].length > 12? "tooltipFullName sync-txt tags positive-tags" : "sync-txt tags positive-tags"}  data-text={matchedKeyword[0].length > 12 && matchedKeyword[0]}>
                  {matchedKeyword[0].length > 12 ? matchedKeyword[0].substring(0, 12) +'...' : matchedKeyword[0]}
                </span>
              : 0}
          {Array.isArray(keywords) && keywords.length > 1 ? 
          <span 
            className="syn-tag-count" 
            onClick={() => {
              params.setKeyWords({
                keywords: keywords,
                matchedKeyword: keywords,
              });
              params.setModalOpen(true);
            }}
          >+{keywords.length - 1}</span> 
          : ''}
      </span> : <span className="no-keywords muted-text">N/A</span>
    }
  </>
  );
});

export const CountryRenderer = memo((params) => {
  let countryName = "N/A";
  if (params.value && params.value != "N/A") {
    countryName = params.value.toLowerCase();
  }

  return (
    <span className={` d-flex f-align-center`}>
      <span className={countryName === "N/A" ? `muted-text`: `capText sync-txt`}>{countryName} </span>
    </span>
  );
}); 



export const CountryTierRenderer = memo((params) => {
  let countryTierName = "N/A";
  if (params.value && params.value != "N/A" ) {
    countryTierName = params.value.toLowerCase();
  }

  return (
    <span className={` d-flex f-align-center`}>
      <span className={countryTierName === "N/A" ? "muted-text" : "capText sync-txt"}>{countryTierName}</span>
    </span>
  );
});

export const RefriendCountRenderer = memo((params) => {
  console.log('params?.value', params?.value);
  return params?.value ? params?.value : 'N/A'
})

export const SourceRendererPending = memo((params) => {
  const sourceFriend = params?.data?.groupName;

  return (
    <>
      {params?.data?.groupUrl && sourceFriend ? (
        <div
          className="friend-sync-source d-flex f-align-center"
        >
          {sourceFriend ? (
            <>
              <figure className="friend-source text-center">
                {sourceFriend === "sync" ? <FacebookSyncIcon /> : ""}
              </figure>
              <span className={sourceFriend.length > 12 ? "friendSource tooltipFullName" : "friendSource"} data-text={sourceFriend.length > 12 && sourceFriend}>
                
               <SourceGroupIcon/> <span >{sourceFriend.length > 12 ? sourceFriend.substring(0, 12) + "..." : sourceFriend }</span>
                <Link
                    to={params?.data?.groupUrl}
                    className="ico-open-link"
                    target="_blank"
                  >
                    <OpenInNewTab />
                </Link>
              </span>
            </>
          ) : (
            <span className="no-keywords muted-text">N/A</span>
          )}
        </div>
      ) : (
        <div className="friend-sync-source d-flex f-align-center">
          {params?.data?.finalSource ? (
            <>
              
              <span className={params?.data?.finalSource.length > 12 ? "friendSource tooltipFullName" :"friendSource"} data-text={params?.data?.finalSource}>
              
                <span >
                  {params?.data?.finalSource.length > 12 ? params?.data?.finalSource.substring(0, 12) + "..." : params?.data?.finalSource}
                </span> 
               
              </span>
            </>
          ) : (
            <span className="no-keywords muted-text">N/A</span>
          )}
        </div>
      )}
    </>
  );
});
