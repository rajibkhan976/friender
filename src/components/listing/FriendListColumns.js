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
  SyncSourceIcon,
  NeuterIcon,
  Tier3Icon,
  Tier2Icon,
  Tier1Icon,
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
import { updateWhiteListStatusOfSelectesList } from "../../actions/FriendListAction";
import { utils } from "../../helpers/utils";
//let savedFbUId = localStorage.getItem("fr_default_fb");

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
        ` Contact ${status === 1 ? "whitelisted" : "removed from whitelist"
        } successfully!`,
        "success",
        1000,
        "bottom-right"
      );
     // console.log("response after white listing >>>>>>",res)
      dispatch(updateWhiteListStatusOfSelectesList(res.data));
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
        ` Contact ${status === 1 ? "blacklisted" : "removed from blacklist"
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
  const [white, setWhite] = useState(params.data.whitelist_status);
  const [black, setBlack] = useState(params.data.blacklist_status);
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

      {white ? (
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
    <span className={`sync-date d-flex f-align-center h-100 w-100`}>
      {/* <figure className={`sync-ico text-center`}>
        <CommentIcon />
      </figure>
      <span className={`sync-dt`}>{commentCount || 0}</span> */}
      {commentCount || 0}
    </span>
  );
});

export const EngagementRenderer = memo((params) => {
  const engagementCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center h-100 w-100`}>
      {engagementCount || 0}
    </span>
  )
})

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

export const AgeRenderer = memo((params) => {
  let statusSync = params.data.created_at.toLowerCase();
  // inputTimeString.replace(" ", "T") + ".000Z";
  //console.log("utc time>>",statusSync);
  const localTime=utils.convertUTCtoLocal(statusSync.replace(" ", "T") + ".000Z");
 // console.log("status sysnc>>>>>>local date",localTime);
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

  if (days) age = days;
  else if (hours) age = 1;
  else if (minutes) age = 1;
  else age = 1;

 let showingDate = new Date(localTime); 
 function getMonthName(monthNumber) {
 // const date = new Date();
  showingDate.setMonth(monthNumber - 1);

  return showingDate.toLocaleString('en-US', { month: 'short' });
}

let tooltipDateFormat = showingDate.getDate() +" " + getMonthName(showingDate.getMonth() + 1, ) + ", "+ showingDate.getFullYear() + "  "+ JSON.stringify(showingDate).slice(12, 17);
console.log('tooltipDateFormat', tooltipDateFormat);

 return (
    <span className={` d-flex f-align-center w-100 h-100`}>
      <span className="tooltipFullName ageTooltip w-100 h-100 d-flex f-align-center" data-text={tooltipDateFormat}>
         {age}
      </span>
    </span>
   );

});

export const RecentEngagementRenderer = memo((params) => {
  const [inactiveAfter, setInactiveAfter] = useState(params?.inactiveAfter ? params?.inactiveAfter : 30);
  const [statusSync, setStatusSync] = useState(params?.data?.last_engagement_date);
  let currentUTC = helper.curretUTCTime();
  let diffTime = Math.abs(currentUTC - new Date(statusSync).valueOf());
  let days = Math.floor(diffTime / (24 * 60 * 60 * 1000));
  // let cutoff = 10; //here Friends will be considered as inactive after
  let date = new Date(statusSync);
  let currentYear = date.getFullYear();
  let currentMonth = date.getMonth() + 1; // 0 - 11
  let currentDay = date.getDate();
  if (currentMonth < 10) {
    currentMonth = "0" + currentMonth
  }
  let dateFormat = currentMonth + " / " + currentDay + " / " + currentYear;
  
  useEffect(() => {
    if(params?.inactiveAfter) {
      setInactiveAfter(params?.inactiveAfter)
    }
    if(params?.data?.last_engagement_date) {
      setStatusSync(params?.data?.last_engagement_date)
    }
  }, [params])

  return (
    <span className={`h-100 w-100 d-flex f-align-center`}>
      <span 
        className={
          !(inactiveAfter && statusSync)  ? 
            "" : "tooltipFullName small h-100 w-100 d-flex"
        } data-text={(inactiveAfter && statusSync) && "Last engaged on " + dateFormat}>
        {(inactiveAfter && statusSync) ?
            <span className={days > inactiveAfter ? "activeEngaged notAct" : "activeEngaged actUser"}>
              {/* <span className="dot"></span> {days} day(s) */}
              <span className="dot"></span> {days}
            </span> : <span className="activeEngaged notAct"><span className="dot"></span> Never</span>}
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
      {genderFriend === "male" || genderFriend === "female" || genderFriend === "neuter" ? (
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
          ) : genderFriend === "neuter" ? (
            <NeuterIcon />
          ) : (
            "-"
          )}
        </figure>
      ) : (
        "-"
      )}
      {/* <span className={genderFriend === "N/A" ? "muted-text" : ""}>{genderFriend}</span> */}
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
    <span className={`sync-date d-flex f-align-center h-100 w-100`}>
      {/* <figure className={`sync-ico text-center`}>
        <MessageIcon />
      </figure>
      <span className={`sync-dt`}>{messageCount || 0}</span> */}
      {messageCount || 0}
    </span>
  );
});

export const ReactionRenderer = memo((params) => {
  const reactionCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center w-100 h-100`}>
      {/* <figure className={`sync-ico text-center`}> */}
        {/* <ReactionIcon /> */}
      {/* </figure> */}
      {/* <span className={`sync-dt`}>{reactionCount || 0}</span> */}
      {reactionCount || 0}
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
      <span className={emailSync === "N/A" ? `muted-text` : `sync-txt`}>{emailSync}</span>
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
      className={`sync-box-wrap d-flex f-align-center ${reqSync === 1 ? "green" : "yellow"
        }`}
    >
      <span className={reqSync === "N/A" ? `muted-text` : `sync-txt`}>{reqSync}</span>
    </span>
  );
});
export const KeywordRenderer = memo((params) => {
  // const keywords =
  //   params.value?.length > 0 && params.value[0].selected_keywords?.length > 0
  //     ? params.value[0].selected_keywords
  //     : null;

  const [matchedKeyword, setMatchedKeyword] =
    useState(params?.data.matchedKeyword ?
      params?.data.matchedKeyword.split(",").filter(keyW => keyW.trim() !== "") : [])

  // console.log(matchedKeyword);

  //className={sourceFriend.length > 12 ? "friendSource tooltipFullName" : "friendSource"} data-text={sourceFriend.length > 12 && sourceFriend}
  return (
    <>
      {matchedKeyword?.length > 0 ?
        <span
          className={`sync-box-wrap d-flex f-align-center key-box-wrap`}
        >
          {Array.isArray(matchedKeyword)
            ? <span className={matchedKeyword[0].length > 12 ? "tooltipFullName sync-txt tags positive-tags" : "sync-txt tags positive-tags"} data-text={matchedKeyword[0].length > 12 && matchedKeyword[0]}>
              {matchedKeyword[0].length > 12 ? matchedKeyword[0].substring(0, 12) + '...' : matchedKeyword[0]}
            </span>
            : 0}
          {Array.isArray(matchedKeyword) && matchedKeyword.length > 1 ?
            <span
              className="syn-tag-count"
              onClick={() => {
                params.setKeyWords({
                  matchedKeyword: matchedKeyword,
                });
                params.setModalOpen(true);
              }}
            >+{matchedKeyword.length - 1}</span>
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
      <span className={countryName === "N/A" ? `d-flex muted-text f-align-center` : `d-flex f-align-center capText sync-txt`}>
        {
          (params?.data?.tier?.toLowerCase() !== "na" &&
          params?.data?.tier?.toLowerCase() !== "n/a" &&
          countryName?.toLowerCase() !== "na" &&
          countryName?.toLowerCase() !== "n/a") ?
          <>
            <span className="inline-icon tier-icon">
              {
                params?.data?.tier === "Tier3" ? <Tier3Icon /> : 
                params?.data?.tier === "Tier2" ? <Tier2Icon /> :
                <Tier1Icon />
              }
            </span>
            <span className="country-name">{countryName}</span>
          </> : <span className="muted-text">N/A</span>
        }
      </span>
    </span>
  );
});



export const CountryTierRenderer = memo((params) => {
  let countryTierName = "N/A";
  if (params.value && params.value != "N/A") {
    countryTierName = params.value.toLowerCase();
  }

  return (
    <span className={` d-flex f-align-center`}>
      <span className={countryTierName === "N/A" ? "muted-text" : "capText sync-txt"}>{countryTierName}</span>
    </span>
  );
});

export const RefriendCountRenderer = memo((params) => {
  // console.log('params?.value', params?.value);
  return params?.value ? params?.value : <span className="muted-text">N/A</span>
})

export const SourceRendererPending = memo((params) => {
  // console.log('params?.data?.groupName', params?.data);
  const sourceFriend = params?.data?.groupName;

  return (
    <>
      {params?.data?.groupUrl && sourceFriend ? (
        <div
          className="friend-sync-source d-flex f-align-center"
        >
        {/* {console.log('here')} */}
          {sourceFriend ? (
            <>
              <figure className="friend-source text-center">
                {sourceFriend === "sync" ? <FacebookSyncIcon /> : ""}
              </figure>
              <span className={sourceFriend.length > 12 ? "friendSource tooltipFullName" : "friendSource"} data-text={sourceFriend.length > 12 && sourceFriend}>

                <SourceGroupIcon /> <span >{sourceFriend.length > 12 ? sourceFriend.substring(0, 12) + "..." : sourceFriend}</span>
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
        {/* {console.log('here')} */}
          {params?.data?.finalSource ? (
            <>
              <figure className="friend-source text-center">
                <SyncSourceIcon />
              </figure>
              <span className={params?.data?.finalSource.length > 12 ? "friendSource tooltipFullName" : "friendSource"} data-text={params?.data?.finalSource}>
                {params?.data?.finalSource.length > 12 ? params?.data?.finalSource.substring(0, 12) + "..." : params?.data?.finalSource}
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
