import { useEffect, useState } from "react";
import NoDataFound from "../../../components/common/NoDataFound";

const MessageSegments = ({ MessageObj }) => {
  const [messageObjState, setMessageObjState] = useState(null);
  useEffect(() => {
    if (MessageObj) {
      setMessageObjState(MessageObj);
    }
  }, [MessageObj])
  return (
    <div className="message-content">
      <div className="paper-simple d-flex message">
        {messageObjState &&
          <div className="dmf-body">
            Groups
          </div>
        }
        {!messageObjState && <NoDataFound />}
      </div>
    </div>
  );
};

export default MessageSegments;
