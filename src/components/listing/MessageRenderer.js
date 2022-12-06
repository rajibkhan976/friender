import { memo } from "react";
import { MessageIcon } from "../../assets/icons/Icons";

const MessageRenderer = (params) => {
    const messageCount = params.value;
    
    return (
        <span className={`sync-date d-flex f-align-center`}>
            <figure className={`sync-ico text-center`}>
                <MessageIcon />
            </figure>
            <span className={`sync-dt`}>{messageCount}</span>
        </span>
    )
  }

  export default memo(MessageRenderer);