import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CampaignContext } from "../../../pages/messages/index";
import CampaignScheduler from "./CampaignScheduler";
import CalenderModal from "../../common/CampaignModal";

const CampaignsCalendar = () => {
	const campaignsCreated = useSelector(
		(state) => state.campaign.campaignsArray
	);
	const [calendarModalType, setCalenderModalType] = useState("CREATE_CAMPAIGN");
	const [open, setOpen] = useState(false);
	const { setCampaignViewMode } = useContext(CampaignContext);

	useEffect(() => {
		setCampaignViewMode("campaignCalendar");
	}, []);

	return (
		<div className='create-campaign-scheduler-container global-campaign-calendar-view'>
			<div className='create-campaign-scheduler'>
				{open && (
					<CalenderModal
						type={calendarModalType}
						open={open}
						setOpen={setOpen}
					/>
				)}
				<CampaignScheduler
					campaignsList={campaignsCreated}
					handleSetShowPopup={(status) => setOpen(status)}
					setCalenderModalType={(type) => setCalenderModalType(type)}
				/>
			</div>
		</div>
	);
};

export default CampaignsCalendar;
