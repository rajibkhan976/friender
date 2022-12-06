import { memo } from "react";
import { CommentIcon } from "../../assets/icons/Icons";

const CommentRenderer = (params) => {
    const commentCount = params.value;
    
    return (
        <span className={`sync-date d-flex f-align-center`}>
            <figure className={`sync-ico text-center`}>
                <CommentIcon />
            </figure>
            <span className={`sync-dt`}>{commentCount}</span>
        </span>
    )
  }

  export default memo(CommentRenderer);