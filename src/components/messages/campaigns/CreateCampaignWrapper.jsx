import { useState } from "react";
import CampaignScheduler from "./CampaignScheduler";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";

const CreateCampaignWrapper = () => {
	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });
	const [scheduleTime, setScheduleTime] = useState({
		date: new Date(),
		start: "12:00 am",
		end: "12:30 am",
	});

	return (
		<div className='create-campaign-scheduler'>
			{showPopup && (
				<CampaignSchedulerPopup
					handleSetShowPopup={(status) => setShowPopup(status)}
					popupCoordPos={popupCoordPos}
					scheduleTime={scheduleTime}
					setScheduleTime={setScheduleTime}
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
