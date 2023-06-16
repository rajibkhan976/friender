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
let savedFbUId = localStorage.getItem("fr_default_fb");

export const handlewhiteListUser = (dispatch, friendId, status) => {
  const payload = [
    {
      fbUserId: savedFbUId,
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
      fbUserId: savedFbUId,
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

export const GenderRenderer = memo((params) => {
  let genderFriend = "N/A";
  if (params.value?.length > 0) {
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
      <span>{genderFriend}</span>
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
            "N/A"
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
            "N/A"
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
  if (params.value) {
    emailSync = params.value.toLowerCase();
  }

  return (
    <span className={`sync-email d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <EnvelopeIcon /> 
      </figure>
      <span className={`sync-txt`}>{emailSync}</span>
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
      <span className={`sync-txt`}>{reqSync}</span>
    </span>
  );
});
export const KeywordRenderer = memo((params) => {
  const keywords =
    params.value?.length > 0 && params.value[0].selected_keywords?.length > 0
      ? params.value[0].selected_keywords
      : null;
    
  const [ matchedKeyword, setMatchedKeyword ] = 
    useState(params?.data.matchedKeyword ? 
      params?.data.matchedKeyword.split(",").filter(keyW => keyW.trim() !== "") : [])
  
  return (
    <>
      {keywords && keywords?.length > 0 ? 
      <span
        className={`sync-box-wrap d-flex f-align-center key-box-wrap`}
      >
          {Array.isArray(matchedKeyword)
              ? <span className={`sync-txt tags positive-tags`}>
                  {matchedKeyword[0]}
                </span>
              : 0}
          {Array.isArray(matchedKeyword) && matchedKeyword.length > 1 ? 
          <span 
            className="syn-tag-count" 
            onClick={() => {
              params.setKeyWords({
                keywords: keywords,
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
  if (params.value) {
    countryName = params.value.toLowerCase();
  }

  return (
    <span className={` d-flex f-align-center`}>
      <span className={`capText sync-txt`}>{countryName}</span>
    </span>
  );
});
export const CountryTierRenderer = memo((params) => {
  let countryTierName = "N/A";
  if (params.value) {
    countryTierName = params.value.toLowerCase();
  }

  return (
    <span className={` d-flex f-align-center`}>
      <span className={`sync-txt`}>{countryTierName}</span>
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
              <span className="friendSource tooltipFullName" data-text={sourceFriend}>
                {/* {params?.data?.finalSource} : {sourceFriend} */}
               <SourceGroupIcon/> <span >{sourceFriend}</span>
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
            "N/A"
          )}
        </div>
      ) : (
        <div className="friend-sync-source d-flex f-align-center">
          {params?.data?.finalSource ? (
            <>
              <figure className="friend-source text-center">
                {params?.data?.finalSource === "sync" ? <FacebookSyncIcon /> : ""}
              </figure>
              <span className="friendSource tooltipFullName" data-text={params?.data?.finalSource}>
                {/* {params?.data?.finalSource} : {sourceFriend} */}
                <SourceGroupIcon/> <span >
                   {params?.data?.finalSource}</span> 
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
            "N/A"
          )}
        </div>
      )}
    </>
  );
});
