import { useState } from "react";
import CampaignScheduler from "./CampaignScheduler";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";
import ScheduleSelector from "./ScheduleSelector";

const CreateCampaignWrapper = () => {
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });
	const [showPopup, setShowPopup] = useState(false);
	const [scheduleTime, setScheduleTime] = useState({
		date: [new Date()],
		start: "",
		end: "",
	});

	return (
		<div className='create-campaign-scheduler'>
			{showPopup && (
				<CampaignSchedulerPopup>
					<ScheduleSelector
						handleSetShowPopup={(status) => setShowPopup(status)}
						popupCoordPos={popupCoordPos}
						scheduleTime={scheduleTime}
						selectedSchedule={selectedSchedule}
						setScheduleTime={setScheduleTime}
					/>
				</CampaignSchedulerPopup>
			)}
			<CampaignScheduler
				campaignsList={[]}
				handleSetShowPopup={(status) => setShowPopup(status)}
				handleSetPopupPos={(pos) => {
					setPopupCoordPos({ x: pos.X, y: pos.Y });
				}}
				handleSetSelectedSchedule={setSelectedSchedule}
				selectedSchedule={selectedSchedule}
				setScheduleTime={setScheduleTime}
			/>
		</div>
	);
};

export default CreateCampaignWrapper;
