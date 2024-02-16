import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCampaignSchedule } from "actions/CampaignsActions";
import CampaignScheduler from "./CampaignScheduler";
import CampaignSchedulerPopup from "./CampaignScedulerPopup";
import ScheduleSelector from "./ScheduleSelector";

const CreateCampaignWrapper = () => {
	const dispatch = useDispatch();
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });
	const [showPopup, setShowPopup] = useState(false);
	const [scheduleTime, setScheduleTime] = useState({
		date: [new Date()],
		start: "",
		end: "",
	});

	useEffect(() => {
		dispatch(updateCampaignSchedule([]));
	}, []);

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
