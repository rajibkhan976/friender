import { memo } from "react";
import {
  CommentIcon,
  CalendarIcon,
  FeMaleIcon,
  MaleIcon,
  MessageIcon,
  WhitelabelIcon,
  ReactionIcon,
  FacebookSyncIcon,
} from "../../assets/icons/Icons";

export const CommentRenderer = memo((params) => {
  const commentCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <CommentIcon />
      </figure>
      <span className={`sync-dt`}>{commentCount}</span>
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

export const GenderRenderer = memo((params) => {
  const genderFriend = params.value.toLowerCase();

  return (
    <div className={`friend-gender d-flex fa-align-center`}>
      {genderFriend === "male" || genderFriend === "female" ? (
        <figure className="friend-gender-ico text-center">
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
      <span className={`sync-dt`}>{messageCount}</span>
    </span>
  );
});
export const NameCellRenderer = memo((params) => {
  return (
    <a href={params.data.friendProfileUrl} target="_blank" rel="noreferrer">
      <span className="name-image-renderer">
        <span
          className="fb-display-pic"
          style={{
            backgroundImage: `url(${params.data.friendProfilePicture})`,
          }}
        ></span>
        <span className="fb-name">{params.value}</span>
        {params.data.whitelist_status ? (
          <span className="profile-whitelabeled">{<WhitelabelIcon />}</span>
        ) : (
          ""
        )}
      </span>
    </a>
  );
});
export const ReactionRenderer = memo((params) => {
  const reactionCount = params.value;

  return (
    <span className={`sync-date d-flex f-align-center`}>
      <figure className={`sync-ico text-center`}>
        <ReactionIcon />
      </figure>
      <span className={`sync-dt`}>{reactionCount}</span>
    </span>
  );
});

export const SourceRenderer = memo((params) => {
  const sourceFriend = params.value.toLowerCase();

  return (
    <div className="friend-sync-source d-flex f-align-center">
      {sourceFriend ? (
        <>
          <figure className="friend-source text-center">
            {sourceFriend === "sync" ? <FacebookSyncIcon /> : ""}
          </figure>
          <span>{sourceFriend}</span>
        </>
      ) : (
        "N/A"
      )}
    </div>
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
