import { memo, useEffect } from "react";
import { InfoIcon,
  InfoIcon2, 
  QueryIcon,
  GroupIcon,
  IncomingIcon,
  OutgoingIcon,
  SyncIcon,
  FriendsFriendIcon,
  SuggestFriendIcon,
  IncomingRequest,
  PostIcon
} from "../../assets/icons/Icons";
import '../../assets/scss/component/common/_tooltipNav.scss';
import useComponentVisible from "../../helpers/useComponentVisible";
import { Link } from "react-router-dom";

const CustomHeaderTooltip = (props) => {
  const { clickedRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const TooltipLocal = ({passedData=""}) => {
    switch (passedData?.value) {
      case "Friends source":
        return (
          <div className="ag-grid-header-tooltip ">
            {/* <figure className="fr-tooltip-icon"
              onMouseEnter={()=>{
                setIsComponentVisible(true)}} ref={clickedRef}> 
                 <QueryIcon /> 
              </figure>  */}
              <div className="header-tooltip-content" style={{
                width: '268px'
              }}>
                <ul>
                  <li><span> <OutgoingIcon/></span> Outgoing</li>
                  <li><span><IncomingIcon/></span>Incoming</li>
                  <li><span><SyncIcon/></span>Sync</li>
                  <li><span><GroupIcon/></span>Request from group</li>
                </ul>
                <div className="commingSoon"><span className="warn-badget">Coming Soon</span></div>
                <ul className="muted">
                  <li><span> <FriendsFriendIcon/></span> Request from friends friend</li>
                  <li><span> <SuggestFriendIcon/></span> Request from suggested friends</li>
                  <li><span> <PostIcon/></span> Request from post</li>
                  <li><span> <IncomingRequest/></span> Incoming request</li>
                </ul>
              </div>
          </div>
        )
        break;
    
      case "Age":
        return (
          <div className="ag-grid-header-tooltip ">
              <div className="header-tooltip-content">
                Number of days back friends synced or unfriended using friender
              </div>
          </div>
        )
        break;
    
      default:
        break;
    }
  }

    return (
      <div 
        className="fr-custom-header-tooltip"
      >
        <div className='tooltip-content'>
          <TooltipLocal
            passedData={props}
          />
        </div>
      </div>
    );
  }

export default CustomHeaderTooltip;