import { useState } from "react";
import CampaignScheduler from "./CampaignScheduler";
import CreateCampaignFormWrapper from "./CreateCampaignFormWrapper";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CreateCampaignWrapper = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });

	return (
		<div className='create-campaign-scheduler-container'>
			<div className='create-campaign-form-container'>
				<CreateCampaignFormWrapper />
			</div>
			<div className='create-campaign-scheduler'>
				{showPopup && (
					<CampaignSchedulerPopup
						popupCoordPos={popupCoordPos}
						handleSetShowPopup={(status) => setShowPopup(status)}
					/>
				)}
				<CampaignScheduler
					handleSetShowPopup={(status) => setShowPopup(status)}
					handleSetPopupPos={(pos) => {
						setPopupCoordPos({ x: pos.X, y: pos.Y });
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
