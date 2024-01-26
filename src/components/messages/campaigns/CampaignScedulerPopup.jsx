import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCampaignSchedule } from "../../../actions/CampaignsActions";
import moment from "moment";
import DropSelector from "../../formComponents/DropSelector";

const CampaignSchedulerPopup = (props) => {
	const { handleSetShowPopup, popupCoordPos, scheduleTime, setScheduleTime } =
		props;
	const dispatch = useDispatch();
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const weekdaysArr = [
		{
			day: moment().startOf("W").format("dddd"),
			date: moment().startOf("W"),
		},
	];
	let iterator = 1;
	const buildOnWeekdaysArr = () => {
		weekdaysArr.push({
			day: moment().startOf("W").add("d", iterator).format("dddd"),
			date: moment().startOf("W").add("d", iterator),
		});
		iterator++;
		if (iterator < 7) {
			buildOnWeekdaysArr();
		}
	};
	buildOnWeekdaysArr();

	const timeOptions = [
		{
			value: "12:00  am",
			label: "12:00  am",
			selected: false,
		},
		{
			value: "12:30  am",
			label: "12:30  am",
			selected: false,
		},
		{
			value: "1:00  am",
			label: "1:00  am",
			selected: false,
		},
		{
			value: "1:30  am",
			label: "1:30  am",
			selected: false,
		},
		{
			value: "2:00  am",
			label: "2:00  am",
			selected: false,
		},
		{
			value: "2:30  am",
			label: "2:30  am",
			selected: false,
		},
		{
			value: "3:00  am",
			label: "3:00  am",
			selected: false,
		},
		{
			value: "3:30  am",
			label: "3:30  am",
			selected: false,
		},
		{
			value: "4:00  am",
			label: "4:00  am",
			selected: false,
		},
		{
			value: "4:30  am",
			label: "4:30  am",
			selected: false,
		},
		{
			value: "5:00  am",
			label: "5:00  am",
			selected: false,
		},
		{
			value: "5:30  am",
			label: "5:30  am",
			selected: false,
		},
		{
			value: "6:00  am",
			label: "6:00  am",
			selected: false,
		},
		{
			value: "6:30  am",
			label: "6:30  am",
			selected: false,
		},
		{
			value: "7:00  am",
			label: "7:00  am",
			selected: false,
		},
		{
			value: "8:00  am",
			label: "8:00  am",
			selected: false,
		},
		{
			value: "8:30  am",
			label: "8:30  am",
			selected: false,
		},
		{
			value: "9:00  am",
			label: "9:00  am",
			selected: false,
		},
		{
			value: "9:30  am",
			label: "9:30  am",
			selected: false,
		},
		{
			value: "10:00  am",
			label: "10:00  am",
			selected: false,
		},
		{
			value: "11:00  am",
			label: "11:00  am",
			selected: false,
		},
		{
			value: "11:30  am",
			label: "11:30  am",
			selected: false,
		},
		{
			value: "12:00  pm",
			label: "12:00  pm",
			selected: false,
		},
		{
			value: "12:30  pm",
			label: "12:30  pm",
			selected: false,
		},
		{
			value: "1:00  pm",
			label: "1:00  pm",
			selected: false,
		},
		{
			value: "1:30  pm",
			label: "1:30  pm",
			selected: false,
		},
		{
			value: "2:00  pm",
			label: "2:00  pm",
			selected: false,
		},
		{
			value: "2:30  pm",
			label: "2:30  pm",
			selected: false,
		},
		{
			value: "3:00  pm",
			label: "3:00  pm",
			selected: false,
		},
		{
			value: "3:30  pm",
			label: "3:30  pm",
			selected: false,
		},
		{
			value: "4:00  pm",
			label: "4:00  pm",
			selected: false,
		},
		{
			value: "4:30  pm",
			label: "4:30  pm",
			selected: false,
		},
		{
			value: "5:00  pm",
			label: "5:00  pm",
			selected: false,
		},
		{
			value: "5:30  pm",
			label: "5:30  pm",
			selected: false,
		},
		{
			value: "6:00  pm",
			label: "6:00  pm",
			selected: false,
		},
		{
			value: "6:30  pm",
			label: "6:30  pm",
			selected: false,
		},
		{
			value: "7:00  pm",
			label: "7:00  pm",
			selected: false,
		},
		{
			value: "8:00  pm",
			label: "8:00  pm",
			selected: false,
		},
		{
			value: "8:30  pm",
			label: "8:30  pm",
			selected: false,
		},
		{
			value: "9:00  pm",
			label: "9:00  pm",
			selected: false,
		},
		{
			value: "9:30  pm",
			label: "9:30  pm",
			selected: false,
		},
		{
			value: "10:00  pm",
			label: "10:00  pm",
			selected: false,
		},
		{
			value: "11:00  pm",
			label: "11:00  pm",
			selected: false,
		},
		{
			value: "11:30  pm",
			label: "11:30  pm",
			selected: false,
		},
	];

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

	const handleSaveCampaignSchedule = () => {
		let campaignScheduleArr = Array.isArray(campaignSchedule)
			? campaignSchedule.map((item) => item)
			: [];
		campaignScheduleArr.pop();
		if (scheduleTime.date && scheduleTime.start && scheduleTime.end) {
			const date = moment(scheduleTime.date).format("MMMM DD, YYYY");
			campaignScheduleArr = [
				...campaignScheduleArr,
				{
					start: new Date(`${date} ${scheduleTime.start}`),
					end: new Date(`${date} ${scheduleTime.end}`),
				},
			];
			dispatch(updateCampaignSchedule(campaignScheduleArr));
			handleSetShowPopup(false);
		}
	};

	const handleCancleCampaignCreation = () => {
		let campaignScheduleArr = Array.isArray(campaignSchedule)
			? campaignSchedule.map((item) => item)
			: [];
		campaignScheduleArr.pop();
		dispatch(updateCampaignSchedule(campaignScheduleArr));
		handleSetShowPopup(false);
	};

	return createPortal(
		<div
			className='campaign-scheduler-popup-container'
			style={{
				top: `${popupCoordPos.y}px`,
				left: `${popupCoordPos.x}px`,
			}}
		>
			<div className='campaign-scheduler-popup-header'>
				<div className='scheduler-popup-header-txt'>Choose days</div>
				<div className='scheduler-popup-header-content'>
					{weekdaysArr?.map((week, index) => (
						<div
							key={index}
							className={`popup-header-content-item ${
								moment(scheduleTime.date).format("dddd").substring(0, 2) ===
								week.day.substring(0, 2)
									? "today-circle"
									: ""
							}`}
							onClick={() =>
								setScheduleTime(() => {
									return {
										...scheduleTime,
										date: week.date,
									};
								})
							}
						>
							{week.day.substring(0, 2)}
						</div>
					))}
				</div>
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
					onClick={() => handleSetShowPopup(false)}
				>
					Cancel
				</button>
				<button
					type='button'
					className='scheduler-popup-save-btn'
					onClick={handleSaveCampaignSchedule}
				>
					Save
				</button>
			</div>
		</div>,
		document.getElementById("root")
	);
};

export default CampaignSchedulerPopup;
