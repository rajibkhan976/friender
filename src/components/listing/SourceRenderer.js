import { memo } from "react";
import { FacebookSyncIcon } from "../../assets/icons/Icons";

const SourceRenderer = (params) => {
    const sourceFriend = params.value.toLowerCase();

    return (
      <div className="friend-sync-source d-flex f-align-center">
        {sourceFriend ? 
        <>
          <figure
            className="friend-source text-center"
          >
            {
              sourceFriend == 'sync' ?
              <FacebookSyncIcon /> : ''
            }
          </figure> 
          <span>{sourceFriend}</span>
        </>: 'N/A'
        }
      </div>
    )
}

export default memo(SourceRenderer);