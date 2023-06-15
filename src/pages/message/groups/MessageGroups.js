import { useEffect, useState } from "react";
import NoDataFound from "../../../components/common/NoDataFound";

const MessageGroups = ({MessageObj}) => {
  const [messageObjState, setMessageObjState] = useState(null);
  useEffect(() => {
    if(MessageObj){
      setMessageObjState(MessageObj);
    }
  }, [MessageObj])
  return(
    <div className="message-content">
      <div className="paper d-flex message">
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

export default MessageGroups;