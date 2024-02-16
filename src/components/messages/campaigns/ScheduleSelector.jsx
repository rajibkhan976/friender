import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCampaignSchedule } from "../../../actions/CampaignsActions";
import moment from "moment";
import DropSelector from "../../formComponents/DropSelector";
import DayChooseBalls from "../../common/DayChooseBalls";
import { timeOptions } from "../../../helpers/timeOptions";

const ScheduleSelector = (props) => {
	const {
		handleSetShowPopup,
		popupCoordPos,
		scheduleTime,
		selectedSchedule,
		setScheduleTime,
	} = props;

	const dispatch = useDispatch();
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);

	const onChangeStartingTime = (event) => {
		if (
			timeOptions.findIndex((item) => item.value === scheduleTime.end) >
			timeOptions.findIndex((item) => item.value === event.target.value)
		) {
			setScheduleTime(() => {
				return {
					...scheduleTime,
					start: event.target.value,
				};
			});
		}
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
			? campaignSchedule.filter((item) => item.isSaved)
			: [];

		if (
			scheduleTime.date &&
			scheduleTime.start &&
			scheduleTime.end &&
			timeOptions.findIndex((item) => item.value === scheduleTime.start) <
				timeOptions.findIndex((item) => item.value === scheduleTime.end)
		) {
			if (
				selectedSchedule &&
				!campaignScheduleArr.every(
					(item) =>
						moment(item.start).format("DD-MM-YYYY h:mm: A") ===
							moment(selectedSchedule.start).format("DD-MM-YYYY h:mm A") &&
						moment(item.end).format("DD-MM-YYYY h:mm A") ===
							moment(selectedSchedule.end).format("DD-MM-YYYY h:mm A")
				)
			) {
				campaignScheduleArr = campaignSchedule.filter(
					(item) =>
						moment(item.start).format("DD-MM-YYYY h:mm: A") !==
							moment(selectedSchedule.start).format("DD-MM-YYYY h:mm A") &&
						moment(item.end).format("DD-MM-YYYY h:mm A") !==
							moment(selectedSchedule.end).format("DD-MM-YYYY h:mm A")
				);
			}

			const dateArr = scheduleTime.date.map((item) =>
				moment(item).format("MMMM DD, YYYY")
			);
			const dateTimeArrObj = [];
			dateArr.forEach((item) => {
				const start = new Date(`${item} ${scheduleTime.start}`);
				const end = new Date(`${item} ${scheduleTime.end}`);
				dateTimeArrObj.push({
					isSaved: true,
					isEditMode: true,
					start: start,
					end: end,
				});
			});
			dateTimeArrObj.forEach((item) => {
				if (
					Array.isArray(campaignScheduleArr) &&
					campaignScheduleArr.length > 0 &&
					campaignScheduleArr.every(
						(schedule) =>
							moment(item.start).format("DD-MM-YYYY h:mm: A") !==
								moment(schedule.start).format("DD-MM-YYYY h:mm A") &&
							moment(item.end).format("DD-MM-YYYY h:mm A") !==
								moment(schedule.end).format("DD-MM-YYYY h:mm A")
					)
				) {
					campaignScheduleArr.push({
						isSaved: true,
						isEditMode: true,
						start: item.start,
						end: item.end,
					});
				}
				if (
					Array.isArray(campaignScheduleArr) &&
					campaignScheduleArr.length === 0
				) {
					campaignScheduleArr.push({
						isSaved: true,
						isEditMode: true,
						start: item.start,
						end: item.end,
					});
				}
			});
		}

		dispatch(updateCampaignSchedule([...campaignScheduleArr]));

		setScheduleTime(() => {
			return {
				date: [new Date()],
				start: "",
				end: "",
			};
		});
		handleSetShowPopup(false);

		return new Promise((resolve, reject) => {
			if (
				scheduleTime.date &&
				scheduleTime.start &&
				scheduleTime.end &&
				timeOptions.findIndex((item) => item.value === scheduleTime.start) <
					timeOptions.findIndex((item) => item.value === scheduleTime.end)
			) {
				resolve("Campaign schedule updated!");
			} else {
				reject("Campaign schedule update rejected!");
			}
		});
	};

	const handleCancelCampaignCreation = () => {
		let campaignScheduleArr = Array.isArray(campaignSchedule)
			? campaignSchedule.map((item) => item)
			: [];
		if (
			selectedSchedule &&
			campaignScheduleArr.some(
				(item) =>
					moment(item.start).format("DD-MM-YYYY h:mm A") ===
						moment(selectedSchedule.start).format("DD-MM-YYYY h:mm A") &&
					moment(item.end).format("DD-MM-YYYY h:mm A") ===
						moment(selectedSchedule.end).format("DD-MM-YYYY h:mm A")
			)
		) {
			campaignScheduleArr = campaignScheduleArr.filter(
				(item) =>
					moment(item.start).format("DD-MM-YYYY h:mm A") !==
						moment(selectedSchedule.start).format("DD-MM-YYYY h:mm A") &&
					moment(item.end).format("DD-MM-YYYY h:mm A") !==
						moment(selectedSchedule.end).format("DD-MM-YYYY h:mm A")
			);
		} else {
			campaignScheduleArr.pop();
		}
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

	useEffect(() => {
		return () => {
			setScheduleTime(() => {
				return {
					date: [new Date()],
					start: "",
					end: "",
				};
			});
		};
	}, []);

	return (
		<div
			className='campaign-scheduler-popup-container'
			style={{
				top: `${popupCoordPos.y ? popupCoordPos.y + "px" : "45%"}`,
				left: `${popupCoordPos.x ? popupCoordPos.x + "px" : "50%"}`,
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
					onClick={() => {
						handleSaveCampaignSchedule()
							.then((response) => {
								if (response) {
									const rbcEventArr =
										document.getElementsByClassName("rbc-event");
									if (rbcEventArr && rbcEventArr.length > 0) {
										for (let i = 0; i < rbcEventArr.length; i++) {
											if (
												!rbcEventArr[i].classList?.value.includes(
													"campaign-saved"
												)
											) {
												rbcEventArr[i].classList.add("campaign-saved");
											}
										}
									}
								}
							})
							.catch((error) => error);
					}}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default ScheduleSelector;
