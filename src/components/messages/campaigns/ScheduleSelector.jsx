import { useDispatch, useSelector } from "react-redux";
import { updateCampaignSchedule } from "../../../actions/CampaignsActions";
import moment from "moment";
import DropSelector from "../../formComponents/DropSelector";
import DayChooseBalls from "../../common/DayChooseBalls";
import { timeOptions } from "../../../helpers/timeOptions";

const ScheduleSelector = (props) => {
	const { handleSetShowPopup, popupCoordPos, scheduleTime, setScheduleTime } =
		props;

	const dispatch = useDispatch();
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);

	const onChangeStartingTime = (event) => {
		setScheduleTime(() => {
			return {
				...scheduleTime,
				start: event.target.value,
			};
		});
	};

	const onChangeEndingTime = (event) => {
		if (
			timeOptions.findIndex((item) => item.value === scheduleTime.start) <
			timeOptions.findIndex((item) => item.value === event.target.value)
		) {
			setScheduleTime(() => {
				return {
					...scheduleTime,
					end: event.target.value,
				};
			});
		}
	};

	const handleSaveCampaignSchedule = async (e) => {
		if (scheduleTime.date && scheduleTime.start && scheduleTime.end) {
			let campaignScheduleArr = Array.isArray(campaignSchedule)
				? campaignSchedule.map((item) => item)
				: [];
			campaignScheduleArr.pop();
			const dateArr = scheduleTime.date.map((item) =>
				moment(item).format("MMMM DD, YYYY")
			);
			const dateTimeArrObj = [];
			dateArr.forEach((item) => {
				dateTimeArrObj.push({
					start: new Date(`${item} ${scheduleTime.start}`),
					end: new Date(`${item} ${scheduleTime.end}`),
				});
			});
			campaignScheduleArr = [...campaignScheduleArr, ...dateTimeArrObj];
			dispatch(updateCampaignSchedule(campaignScheduleArr));
		}
		setScheduleTime(() => {
			return {
				date: [new Date()],
				start: "",
				end: "",
			};
		});
		handleSetShowPopup(false);
	};

	const handleCancelCampaignCreation = () => {
		let campaignScheduleArr = Array.isArray(campaignSchedule)
			? campaignSchedule.map((item) => item)
			: [];
		campaignScheduleArr.pop();
		dispatch(updateCampaignSchedule(campaignScheduleArr));
		setScheduleTime(() => {
			return {
				date: [new Date()],
				start: "",
				end: "",
			};
		});
		handleSetShowPopup(false);
	};

	return (
		<div
			className='campaign-scheduler-popup-container'
			style={{
				top: `${popupCoordPos.y}px`,
				left: `${popupCoordPos.x}px`,
			}}
		>
			<div className='campaign-scheduler-popup-header'>
				<div className='scheduler-popup-header-txt'>Choose days</div>
				<DayChooseBalls
					scheduleTime={scheduleTime}
					setScheduleTime={setScheduleTime}
				/>
			</div>
			<div className='campaign-scheduler-popup-body'>
				<div className='scheduler-popup-body-txt'>Select time from</div>
				<div className='scheduler-popup-body-content'>
					<DropSelector
						selects={timeOptions}
						id='start-time-span'
						defaultValue={
							timeOptions?.find((el) => el.value === scheduleTime?.start)?.value
						}
						value={
							timeOptions?.find((el) => el.value === scheduleTime?.start)?.value
						}
						extraClass='fr-select-new tinyWrap'
						height='40px'
						width='inherit'
						handleChange={onChangeStartingTime}
					/>
					<span>to</span>
					<DropSelector
						selects={timeOptions}
						id='end-time-span'
						defaultValue={
							timeOptions?.find((el) => el.value === scheduleTime?.end)?.value
						}
						value={
							timeOptions?.find((el) => el.value === scheduleTime?.end)?.value
						}
						extraClass='fr-select-new tinyWrap'
						height='40px'
						width='inherit'
						handleChange={onChangeEndingTime}
					/>
				</div>
			</div>

			<div className='campaign-scheduler-popup-footer'>
				<button
					type='button'
					className='scheduler-popup-cancel-btn'
					onClick={handleCancelCampaignCreation}
				>
					Cancel
				</button>
				<button
					type='button'
					className='scheduler-popup-save-btn'
					onClick={async () => {
						await handleSaveCampaignSchedule();

						const rbcEventArr = document.getElementsByClassName("rbc-event");
						if (rbcEventArr && rbcEventArr.length > 0) {
							for (let i = 0; i < rbcEventArr.length; i++) {
								if (
									!rbcEventArr[i].classList?.value.includes("campaign-saved")
								) {
									rbcEventArr[i].classList.add("campaign-saved");
								}
							}
						}
					}}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default ScheduleSelector;
