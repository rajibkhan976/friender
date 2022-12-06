import { memo } from "react";

const HasConversationRenderer = (params) => {
    const messageCount = params.value;
    
    return (
      <div className={`friend-gender d-flex fa-align-center`}>
        {(messageCount > 0) ? 
        <span
          className="has-conversation conv-yes text-center"
        >
          Yes
        </span> : <span
          className="has-conversation conv-no text-center"
        >
          No
        </span>}
      </div>
    )
  }

  export default memo(HasConversationRenderer);