import { createPortal } from "react-dom";
import { useState } from "react";
import moment from "moment";
import DropSelector from "../../formComponents/DropSelector";

const CampaignSchedulerPopup = (props) => {
	const { handleSetShowPopup, popupCoordPos } = props;
	const weekdaysArr = moment.weekdays();
	const today = moment().format("dddd");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

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
		setStartTime(event.target.value);
	};

	const onChangeEndingTime = (event) => {
		setEndTime(event.target.value);
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
					{weekdaysArr?.map((day, index) => (
						<div
							key={index}
							className={`popup-header-content-item ${
								today.substring(0, 2) === day.substring(0, 2)
									? "today-circle"
									: ""
							}`}
						>
							{day.substring(0, 2)}
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
							timeOptions?.find((el) => el.value === startTime)?.value
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
							timeOptions?.find((el) => el.value === endTime)?.value
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
				>
					Save
				</button>
			</div>
		</div>,
		document.getElementById("root")
	);
};

export default CampaignSchedulerPopup;
