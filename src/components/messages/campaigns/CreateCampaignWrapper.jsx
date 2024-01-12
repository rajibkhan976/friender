import { useState } from "react";
import CampaignScheduler from "./CampaignScheduler";
import CreateCampaignFormWrapper from "./CreateCampaignFormWrapper";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CreateCampaignWrapper = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });

	return (
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
	);
};

export default CreateCampaignWrapper;
