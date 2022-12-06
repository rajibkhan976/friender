import { memo } from "react";
import { ReactionIcon } from "../../assets/icons/Icons";

const ReactionRenderer = (params) => {
    const reactionCount = params.value;
    
    return (
        <span className={`sync-date d-flex f-align-center`}>
            <figure className={`sync-ico text-center`}>
                <ReactionIcon />
            </figure>
            <span className={`sync-dt`}>{reactionCount}</span>
        </span>
    )
  }

  export default memo(ReactionRenderer);