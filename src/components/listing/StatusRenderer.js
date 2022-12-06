import { memo } from "react";

const StatusRenderer = (params) => {
    const statusFriend = params.value.toLowerCase();

    return (
      <span className={`account-status status-${statusFriend}`}>
        <span className={`status-bg`}></span>
        <span className="status-text">{params.value === "Activate" ? "Active" : params.value === "Deactivate" ? "Inactive" : params.value}</span>
      </span>
    )
  }

  export default memo(StatusRenderer);