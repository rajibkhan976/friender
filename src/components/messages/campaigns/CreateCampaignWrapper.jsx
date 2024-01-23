import { useState } from "react";
import CampaignScheduler from "./CampaignScheduler";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CreateCampaignWrapper = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	return (
		<div className='create-campaign-scheduler'>
			{showPopup && (
				<CampaignSchedulerPopup
					endTime={endTime}
					handleSetShowPopup={(status) => setShowPopup(status)}
					popupCoordPos={popupCoordPos}
					setEndTime={setEndTime}
					startTime={startTime}
					setStartTime={setStartTime}
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
