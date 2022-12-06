import { memo } from "react";
import { WhitelabelIcon } from "../../assets/icons/Icons";

const NameCellRenderer = (params) => {
    
    return (
        <span className="name-image-renderer">
            <span 
                className='fb-display-pic'
                style={{
                    backgroundImage: `url(${params.data.friendProfilePicture})`
                }}
            >
            </span>
            <span className="fb-name">
                {params.value}
            </span>
            {
                params.data.whitelist_status ?
                <span className="profile-whitelabeled">
                    {<WhitelabelIcon />}
                </span> : ''
            }
        </span>
    )
  }

  export default memo(NameCellRenderer);