import Fire from "../../assets/images/fire.png";
import Button from "../formComponents/Button";
import { Link } from "react-router-dom";
import { lazy } from "react";
import AwardDefault from '../../assets/animations/components/AwardDefault'
import AwardLight from '../../assets/animations/components/AwardLight';
//import { produceWithPatches } from "immer";
const Award = (props) => {
  // const AwardDefault = lazy(() => import('../../assets/animations/components/AwardDefault'));
  // const AwardLight = lazy(() => import('../../assets/animations/components/AwardLight'));

  return (
    <div className="intermediate-wraper">
    <div className="rewards-wraper d-flex">
    <div className="reward-left-wraper">
      <div className="reward-left-section">
        <div className="cup-animation dark-theme">
          {/* Lotti animation placed */}
            <AwardDefault
                loop = {4}
                play
                background="transparent"
                style={{ width: "221px", height: "192px" }}
              />
          {/* Lotti animation placed */}
        </div>
        <div className="cup-animation light-theme">
          {/* Lotti animation placed */}
            <AwardLight
                loop = {4}
                play
                background="transparent"
                style={{ width: "221px", height: "192px" }}
              />
          {/* Lotti animation placed */}
        </div>
      </div>
      <div className="reward-right-section">
        <h2>Congratulations!</h2>
        <p>You have sucessfully completed your first 4 steps</p>

        <Link to="/contacts/friend-list" className="btn-primary btn link-btn">Your friend list is ready. Click here</Link>
        {/* <div className="time-save-wraper d-flex">
          <span className="fire-wraper">
            <img src={Fire} alt="" />
          </span>
          <p className="saved-hour"><span>5 Hours</span> You saved</p>
        </div> */}
      </div>
      </div>
      {/* <div className="reward-right-wraper">
        <h3>Results</h3>
        
        <div className="result-row d-flex">

          <div className="ind-result d-flex">
            <div className="ind-result-icon highlighted">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect opacity="0.2" width="50" height="50" rx="25" fill="#00CA14"/>
                <path d="M22.2474 30.367C22.5075 30.3127 22.6624 30.0405 22.5332 29.8083C22.2482 29.2965 21.7992 28.8467 21.2249 28.504C20.4853 28.0625 19.579 27.8232 18.6466 27.8232C17.7143 27.8232 16.808 28.0625 16.0684 28.504C15.494 28.8467 15.0451 29.2965 14.7601 29.8083C14.6308 30.0405 14.7858 30.3127 15.0459 30.3669C17.4209 30.8619 19.8724 30.8619 22.2474 30.367Z" fill="#00CA14"/>
                <ellipse cx="18.6469" cy="25.0004" rx="2.35294" ry="2.35294" fill="#00CA14"/>
                <path d="M34.9524 30.367C35.2126 30.3127 35.3675 30.0405 35.2383 29.8083C34.9533 29.2965 34.5043 28.8467 33.93 28.504C33.1903 28.0625 32.2841 27.8232 31.3517 27.8232C30.4194 27.8232 29.5131 28.0625 28.7734 28.504C28.1991 28.8467 27.7502 29.2965 27.4652 29.8083C27.3359 30.0405 27.4908 30.3127 27.751 30.3669C30.126 30.8619 32.5775 30.8619 34.9524 30.367Z" fill="#00CA14"/>
                <ellipse cx="31.352" cy="25.0004" rx="2.35294" ry="2.35294" fill="#00CA14"/>
                <path d="M18.2962 29.374L19.1699 29.8605L18.2962 29.374C17.711 30.4252 18.477 31.4861 19.3946 31.6773C23.0917 32.4478 26.9078 32.4478 30.6049 31.6773C31.5225 31.4861 32.2885 30.4252 31.7033 29.374L30.8296 29.8605L31.7033 29.374C31.1799 28.4339 30.3728 27.6379 29.3797 27.0452C28.1025 26.283 26.5633 25.8828 24.9998 25.8828C23.4362 25.8828 21.897 26.283 20.6198 27.0452C19.6267 27.6379 18.8196 28.4339 18.2962 29.374Z" fill="#00CA14" stroke="#0F3814" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="25.0001" cy="22.6466" rx="3.52941" ry="3.52941" fill="#00CA14"/>
              </svg>
            </div>
            <div className="ind-result-info">
              <h3>50</h3>
              <p>Total Friends</p>
            </div>
          </div>

          <div className="ind-result d-flex">
            <div className="ind-result-icon">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="50" height="50" rx="25" fill="#303033"/>
                  <ellipse cx="23.3337" cy="21.6667" rx="4.16667" ry="4.16667" fill="#BDBDBD"/>
                  <path d="M30.833 23.333L30.833 28.333" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M33.333 25.833L28.333 25.833" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M29.2854 31.9855C29.6701 31.8983 29.9009 31.4984 29.7304 31.1427C29.2705 30.1835 28.5148 29.3407 27.5352 28.7054C26.3299 27.9237 24.853 27.5 23.3337 27.5C21.8143 27.5 20.3375 27.9237 19.1321 28.7054C18.1525 29.3407 17.3968 30.1835 16.937 31.1427C16.7665 31.4984 16.9972 31.8983 17.3819 31.9855C21.3001 32.8728 25.3672 32.8728 29.2854 31.9855Z" fill="#BDBDBD"/>
                </svg>
              </div>
            <div className="ind-result-info">
              <h3>50%</h3>
              <p>Male Ratio</p>
            </div>
          </div>

          <div className="ind-result d-flex">
            <div className="ind-result-icon">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="50" rx="25" fill="#303033"/>
                <path d="M33.6531 25.6869L32.0975 31.14C31.8681 31.9406 31.1275 32.5 30.2956 32.5H21.875C21.5294 32.5 21.25 32.22 21.25 31.875V23.125C21.25 22.9906 21.2931 22.8594 21.3737 22.7519L24.7438 18.2269C25.1175 17.7588 25.6563 17.5 26.2338 17.5C27.2769 17.5 28.125 18.3481 28.125 19.3913V22.5H31.2513C32.0419 22.5 32.7681 22.8619 33.2438 23.4931C33.7213 24.1256 33.87 24.925 33.6531 25.6869Z" fill="#BDBDBD"/>
                <path d="M19.375 22.5H16.875C16.5294 22.5 16.25 22.78 16.25 23.125V31.875C16.25 32.22 16.5294 32.5 16.875 32.5H19.375C19.7206 32.5 20 32.22 20 31.875V23.125C20 22.78 19.7206 22.5 19.375 22.5ZM18.125 30.9375C17.6075 30.9375 17.1875 30.5175 17.1875 30C17.1875 29.4825 17.6075 29.0625 18.125 29.0625C18.6425 29.0625 19.0625 29.4825 19.0625 30C19.0625 30.5175 18.6425 30.9375 18.125 30.9375Z" fill="#BDBDBD"/>
              </svg>
            </div>
            <div className="ind-result-info">
              <h3>55</h3>
              <p>Reactions</p>
            </div>
          </div>

        </div>

        <div className="result-row d-flex">

          <div className="ind-result d-flex">
            <div className="ind-result-icon">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="50" height="50" rx="25" fill="#303033"/>
              <path d="M20.8165 29.5571C20.6721 29.6169 20.5649 29.7266 20.5138 29.7788C20.5086 29.7842 20.504 29.7889 20.5 29.7929L18.3536 31.9393C18.0386 32.2543 17.5 32.0312 17.5 31.5858V26C17.5 24.1002 17.5011 22.7257 17.642 21.6775C17.781 20.6437 18.0477 20.0025 18.5251 19.5251C19.0025 19.0477 19.6437 18.781 20.6775 18.642C21.7257 18.5011 23.1002 18.5 25 18.5H27C27.9387 18.5 28.6177 18.5003 29.1546 18.5369C29.687 18.5732 30.0429 18.6436 30.3394 18.7664C31.197 19.1217 31.8783 19.803 32.2336 20.6606C32.3564 20.9571 32.4268 21.313 32.4631 21.8454C32.4997 22.3823 32.5 23.0613 32.5 24C32.5 24.9387 32.4997 25.6177 32.4631 26.1546C32.4268 26.687 32.3564 27.0429 32.2336 27.3394C31.8783 28.197 31.197 28.8783 30.3394 29.2336C30.0429 29.3564 29.687 29.4268 29.1546 29.4631C28.6177 29.4997 27.9387 29.5 27 29.5H21.2071C21.2014 29.5 21.1948 29.4999 21.1874 29.4998C21.1144 29.499 20.961 29.4972 20.8165 29.5571ZM20.8165 29.5571L21.0079 30.019L20.8165 29.5571C20.8165 29.5571 20.8165 29.5571 20.8165 29.5571Z" fill="#BDBDBD" stroke="#BDBDBD" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21.5 22.5H29.5" stroke="#131314" strokeLinecap="round"/>
              <path d="M21.4998 25.4998L27 25.5" stroke="#131314" strokeLinecap="round"/>
            </svg>
            </div>
            <div className="ind-result-info">
              <h3>12</h3>
              <p>Messages</p>
            </div>
          </div>

          <div className="ind-result d-flex">
            <div className="ind-result-icon">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="50" rx="25" fill="#303033"/>
                <ellipse cx="23.3337" cy="21.6667" rx="4.16667" ry="4.16667" fill="#BDBDBD"/>
                <path d="M30.833 23.333L30.833 28.333" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round"/>
                <path d="M33.333 25.833L28.333 25.833" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round"/>
                <path d="M29.2854 31.9855C29.6701 31.8983 29.9009 31.4984 29.7304 31.1427C29.2705 30.1835 28.5148 29.3407 27.5352 28.7054C26.3299 27.9237 24.853 27.5 23.3337 27.5C21.8143 27.5 20.3375 27.9237 19.1321 28.7054C18.1525 29.3407 17.3968 30.1835 16.937 31.1427C16.7665 31.4984 16.9972 31.8983 17.3819 31.9855C21.3001 32.8728 25.3672 32.8728 29.2854 31.9855Z" fill="#BDBDBD"/>
              </svg>
            </div>
            <div className="ind-result-info">
              <h3>50%</h3>
              <p>Female Ratio</p>
            </div>
          </div>

          <div className="ind-result d-flex">
            <div className="ind-result-icon">
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="50" rx="25" fill="#303033"/>
                <path d="M25.4163 17.5C23.3173 17.5022 21.305 18.337 19.8208 19.8212C18.3366 21.3054 17.5018 23.3177 17.4996 25.4167C17.4922 27.3727 18.2176 29.2606 19.533 30.7083L17.6246 32.625C17.5639 32.6808 17.5224 32.7544 17.5059 32.8352C17.4895 32.916 17.4989 32.9999 17.533 33.075C17.5642 33.1511 17.6173 33.2162 17.6855 33.2622C17.7537 33.3082 17.834 33.3329 17.9163 33.3333H25.4163C27.5159 33.3333 29.5296 32.4993 31.0142 31.0146C32.4989 29.5299 33.333 27.5163 33.333 25.4167C33.333 23.317 32.4989 21.3034 31.0142 19.8187C29.5296 18.3341 27.5159 17.5 25.4163 17.5ZM22.083 27.0833C21.9182 27.0833 21.757 27.0345 21.62 26.9429C21.483 26.8513 21.3761 26.7212 21.3131 26.5689C21.25 26.4166 21.2335 26.2491 21.2656 26.0874C21.2978 25.9258 21.3772 25.7773 21.4937 25.6607C21.6103 25.5442 21.7587 25.4648 21.9204 25.4327C22.082 25.4005 22.2496 25.417 22.4019 25.4801C22.5541 25.5432 22.6843 25.65 22.7759 25.787C22.8674 25.9241 22.9163 26.0852 22.9163 26.25C22.9163 26.471 22.8285 26.683 22.6722 26.8393C22.5159 26.9955 22.304 27.0833 22.083 27.0833ZM25.4163 27.0833C25.2515 27.0833 25.0904 27.0345 24.9533 26.9429C24.8163 26.8513 24.7095 26.7212 24.6464 26.5689C24.5833 26.4166 24.5668 26.2491 24.599 26.0874C24.6311 25.9258 24.7105 25.7773 24.827 25.6607C24.9436 25.5442 25.0921 25.4648 25.2537 25.4327C25.4154 25.4005 25.5829 25.417 25.7352 25.4801C25.8875 25.5432 26.0176 25.65 26.1092 25.787C26.2008 25.9241 26.2496 26.0852 26.2496 26.25C26.2496 26.471 26.1618 26.683 26.0056 26.8393C25.8493 26.9955 25.6373 27.0833 25.4163 27.0833ZM28.7496 27.0833C28.5848 27.0833 28.4237 27.0345 28.2867 26.9429C28.1496 26.8513 28.0428 26.7212 27.9797 26.5689C27.9167 26.4166 27.9002 26.2491 27.9323 26.0874C27.9645 25.9258 28.0438 25.7773 28.1604 25.6607C28.2769 25.5442 28.4254 25.4648 28.5871 25.4327C28.7487 25.4005 28.9163 25.417 29.0685 25.4801C29.2208 25.5432 29.351 25.65 29.4425 25.787C29.5341 25.9241 29.583 26.0852 29.583 26.25C29.583 26.471 29.4952 26.683 29.3389 26.8393C29.1826 26.9955 28.9706 27.0833 28.7496 27.0833Z" fill="#BDBDBD"/>
              </svg> 
            </div>
            <div className="ind-result-info">
              <h3>36</h3>
              <p>Comments</p>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  </div>
  );
};
export default Award;
