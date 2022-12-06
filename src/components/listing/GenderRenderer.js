import { memo } from "react";
import { FeMaleIcon, MaleIcon } from "../../assets/icons/Icons";

const GenderRenderer = (params) => {
    const genderFriend = params.value.toLowerCase();
    
    return (
      <div className={`friend-gender d-flex fa-align-center`}>
        {(genderFriend == 'male' || genderFriend == 'female') ? 
        <figure
          className="friend-gender-ico text-center"
        >
          {genderFriend == 'male' ? <MaleIcon /> : genderFriend == 'female' ? <FeMaleIcon /> : ''}
        </figure> : ''}
        <span>
          {genderFriend}
        </span>
      </div>
    )
  }

  export default memo(GenderRenderer);