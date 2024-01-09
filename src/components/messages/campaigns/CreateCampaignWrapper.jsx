import { useState } from "react";
import CampaignScheduler from "./CampaignScheduler";
import CreateCampaignFormWrapper from "./CreateCampaignFormWrapper";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CreateCampaignWrapper = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [popupTopPos, setPopupTopPos] = useState(0);
	const [popupLeftPos, setPopupLeftPos] = useState(0);

	return (
		<div className='create-campaign-scheduler-container'>
			<div className='create-campaign-form-container'>
				<CreateCampaignFormWrapper />
			</div>
			<div className='create-campaign-scheduler'>
				{showPopup && (
					<CampaignSchedulerPopup
						topPos={popupTopPos}
						leftPos={popupLeftPos}
						handleSetShowPopup={(status) => setShowPopup(status)}
					/>
				)}
				<CampaignScheduler
					handleSetShowPopup={(status) => setShowPopup(status)}
					handleSetPopupPos={(pos) => {
						setPopupTopPos(pos.Y);
						setPopupLeftPos(pos.X);
					}}
				/>
			</div>
			<div className='create-campaign-btn-container'>
				<button
					type='button'
					className='cancel-campaign-btn'
				>
					Cancel
				</button>
				<button
					type='button'
					className='save-campaign-btn'
				>
					Save campaign
				</button>
			</div>
		</div>
	);
};

export default CreateCampaignWrapper;
