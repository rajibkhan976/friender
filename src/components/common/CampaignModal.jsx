import { useState, useEffect } from "react";
import { XMarkIcon } from "assets/icons/Icons";
import DropSelectMessage from "components/messages/DropSelectMessage";
import DropSelector from "components/formComponents/DropSelector";
import DayChooseBalls from "components/common/DayChooseBalls";
import NumberRangeInput from "components/common/NumberRangeInput";
import ColorPickerBalls from "components/common/ColorPickerBalls";
import { fetchGroups } from "actions/MessageAction";
import { useDispatch, useSelector } from "react-redux";
import {
	createCampaign,
	updateCampaign,
	updateCampaignSchedule,
	updateCampaignStatus,
} from "actions/CampaignsActions";
import { useNavigate } from "react-router-dom";
import {
	ClockedSchedularIcon,
	MessagesLimitCalenderIcon,
	MessageCalenderIcon,
	ClockCalenderIcon,
	CheckedSchedulerIcon,
	DeleteIcon,
	EditPenIcon,
	DangerIcon,
} from "assets/icons/Icons";
import Switch from "components/formComponents/Switch";
import Modal from "components/common/Modal";
import Alertbox from "components/common/Toast";
import moment from "moment";

const CalenderModal = ({
	type = "CREATE_CAMPAIGN",
	open = false,
	setOpen,
	scheduleTime,
	setScheduleTime,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [calenderModalOpen, setCalenderModalOpen] = useState(open);
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const current_fb_id = localStorage.getItem("fr_default_fb");
	const [isLoadingBtn, setLoadingBtn] = useState(false);

	// CAMPAIGN NAME STATE..
	const [campaignName, setCampaignName] = useState({
		value: "",
		placeholder: "Ex. Word Boost",
		isError: false,
		errorMsg: "",
	});

	// SELECT MESSAGE SATES..
	const [groupMessages, setGroupMessages] = useState([]);
	const [selectMessageOptionOpen, setSelectMessageOptionOpen] = useState(false);
	const [groupMsgSelect, setGroupMsgSelect] = useState(null);
	const [quickMsg, setQuickMsg] = useState(null);
	const [quickMsgModalOpen, setQuickMsgModalOpen] = useState(false);
	const [usingSelectOption, setUsingSelectOption] = useState(false);
	const [unselectedError, setUnselectedError] = useState(false);

	// TIME DELAY..
	const [timeDelay, setTimeDelay] = useState(3);

	// MESSAGE LIMIT/24HR STATE..
	const [msgLimit, setMsgLimit] = useState(100);

	// CAMPAIGN COLOR PICK..
	const [campaginColorPick, setCampaignColorPick] = useState("#92B0EA");

	// TIME DURATIONS..
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	// END DATE AND TIME
	const [endDateAndTime, setEndDateAndTime] = useState("");

	const timeDelays = [
		{
			value: 3,
			label: "3 min",
			selected: true,
		},
		{
			value: 5,
			label: "5 min",
			selected: false,
		},
		{
			value: 10,
			label: "10 min",
			selected: false,
		},
		{
			value: 15,
			label: "15 min",
			selected: false,
		},
	];

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

	// CAMPAIGN HEADER TOGGLE..
	const [isCampaignToggleOn, setCampaignToggle] = useState(false);

	// MOUSEOVER EVENTS STATES..
	const [isMouseOverBtn, setMouseOverBtn] = useState({
		editBtn: false,
		deleteBtn: false,
	});

	// CAMPAIGN DELETE MODAL OPEN/CLOSE..
	const [isCampaignDeleteModalOpen, setCampaignDeleteModalOpen] =
		useState(false);

	// HANDLE CAMPAIGNS NAME FUNCTION..
	const handleCampaignName = (event) => {
		// event.preventDefault();
		const value = event.target.value;
		setCampaignName({ ...campaignName, value });
	};

	// HANDLE THE BLUR EFFECT'S VALIDATION FOR TEXT FIELDS..
	const handleBlurValidationOnTextField = (event) => {
		const value = event.target.value.trim();

		if (value.length < 1) {
			setCampaignName({
				...campaignName,
				isError: true,
				errorMsg: "Enter campaign name",
			});
		} else {
			setCampaignName({ ...campaignName, isError: false, errorMsg: "" });
		}
	};

	// TIME DELAY..
	const onChangeTimeDelay = (event) => {
		setTimeDelay(Number(event.target.value));
	};

	// TIME DURATIONS..
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

	// HANDLE MESSAGE LIMIT/24HR INPUT..
	const handleMessageLimitOnBlur = (event) => {
		const value = event.target.value;

		if (value?.trim() === "") {
			setMsgLimit(100);
		}

		if (value?.trim() !== "" && value?.trim() < 1) {
			setMsgLimit(1);
		}

		if (value?.trim() >= 999) {
			setMsgLimit(999);
		}
	};

	// INCREMENTING AND DECREMENTING FOR MESSAGE LIMIT/25HR..
	const incrementDecrementVal = (type) => {
		if (type === "INCREMENT") {
			setMsgLimit((prev) => prev + 1);

			if (msgLimit >= 999) {
				setMsgLimit(999);
			}
		}

		if (type === "DECREMENT") {
			setMsgLimit((prev) => prev - 1);

			if (msgLimit <= 1) {
				setMsgLimit(1);
			}
		}
	};

	// STORE VIEW MODE FOR SPECIFIC VIEW/SETTINGS PAGE..
	const storeEdit = (viewMode = "view") => {
		localStorage.setItem(
			"fr_editCampaign_view",
			JSON.stringify({
				mode: viewMode,
			})
		);
	};

	// HANDLE EDIT CAMPAIGN BUTTON..
	const handleEditCampaignBtn = (_event) => {
		storeEdit("settings");
		// NAVIGATE TO THE EDIT PAGE..
		navigate(`/messages/campaigns/${1}`);
		setCalenderModalOpen(false);
	};

	// HANDLE END DATE AND TIME VALUE ON CHANGE..
	const handleChangeEndDateAndTime = (event) => {
		const value = event.target.value;
		const parsedDate = moment(value);
		const formattedDate = parsedDate.format("YYYY-MM-DD HH:mm:ss");
		setEndDateAndTime(formattedDate);
	};

	// HANDLE DELETE CAMPAIGN BUTTON..
	const handleDeleteCampaignBtn = (_event) => {
		// DELETE FUNCTION..
		setCampaignDeleteModalOpen(true);
	};

	// CREATE/ADD CAMPAIGN FUNCTION..
	const campaignAddRequestToAPI = async (payload) => {
		console.log("PAYLOAD OF MODAL CAMPAIGN CREATION - ", payload);

		try {
			const response = await dispatch(createCampaign(payload)).unwrap();

			if (response?.data) {
				Alertbox(`${response?.message}`, "success", 1000, "bottom-right");
				setLoadingBtn(false);
				navigate("/messages/campaigns");
				setCalenderModalOpen(false);
			} else {
				if (response?.error?.code === "resource_conflict") {
					Alertbox(
						"The campaign name is already in use, please try a different name.",
						"error",
						1000,
						"bottom-right"
					);
					setLoadingBtn(false);
				} else if (response?.error?.code === "bad_request") {
					Alertbox(
						`${response?.error?.message}`,
						"error",
						1000,
						"bottom-right"
					);
					setLoadingBtn(false);
				} else {
					Alertbox(
						"Failed to create the campaign. Please check your input and try again.",
						"error",
						1000,
						"bottom-right"
					);
					setLoadingBtn(false);
				}
			}
		} catch (error) {
			console.log("Error Catch:", error);
			Alertbox(
				"An unexpected error occurred. Please try again later.",
				"error",
				1000,
				"bottom-right"
			);
			setLoadingBtn(false);
		}
	};

	// TRANSFORM CAMPAIGN SCHEDULES PROPERTY INTO THE OBJECT FOR API PAYLOAD..
	const transformCampaignSchedulesPayload = (schedules = []) => {
		const transformSchedules =
			schedules?.length &&
			schedules.map((schedule) => {
				const fromTime = moment(schedule.start).format("YYYY-MM-DD HH:mm:ss");
				const toTime = moment(schedule.end).format("YYYY-MM-DD HH:mm:ss");
				const day = moment(schedule.start).format("dddd");

				return {
					day,
					from_time: fromTime,
					end_time: toTime,
				};
			});

		return transformSchedules;
	};

	// SAVE CAMPAIGN..
	const handleClickToSaveCampaign = (data) => {
		const transformCampaignSchedules =
			transformCampaignSchedulesPayload(campaignSchedule);
		const payload = {
			...data,
			fbUserId: current_fb_id,
			schedule: transformCampaignSchedules,
		};
		campaignAddRequestToAPI(payload);
	};

	// HANDLE SUBMIT MODEL..
	const handleSubmitModalCampaign = (event) => {
		event.preventDefault();

		if (!isLoadingBtn) {
			setLoadingBtn(true);

			// UNHANDLED VALUES.. TIME DURATIONS,
			console.log("START - END TIME DURATIONS - ", startTime, endTime);

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
			}

			if (!groupMsgSelect?._id && quickMsg === null) {
				setUnselectedError(true);
				setLoadingBtn(false);
				return false;
			}

			handleClickToSaveCampaign({
				campaignName: campaignName?.value,
				messageGroupId: groupMsgSelect?._id,
				quickMessage: quickMsg,
				messageLimit: msgLimit,
				campaignEndTimeStatus: true,
				campaignEndTime: endDateAndTime,
				timeDelay: timeDelay,
				campaignLabelColor: campaginColorPick,
			});
		}
	};

	useEffect(() => {
		if (isCampaignToggleOn) {
			Alertbox("Campaign Toggleed", "success", 3000, "bottom-right");
		}
	}, [isCampaignToggleOn]);

	useEffect(() => {
		// Fetching All Group Messages.
		dispatch(fetchGroups())
			.unwrap()
			.then((res) => {
				const data = res?.data;
				if (data && data.length) {
					setGroupMessages(data);
				}
			})
			.catch((error) =>
				console.log("Error when try to fetching all groups -- ", error)
			);
	}, []);

	const handleCancleCampaignCreation = () => {
		let campaignScheduleArr = Array.isArray(campaignSchedule)
			? campaignSchedule.map((item) => item)
			: [];
		campaignScheduleArr.pop();
		dispatch(updateCampaignSchedule(campaignScheduleArr));
		setOpen(false);
	};

	// useEffect(() => {
	//     if (quickMsgModalOpen === true) {
	//         setCalenderModalOpen(false);
	//     }
	// }, [quickMsgModalOpen, calenderModalOpen]);

	if (type === "CREATE_CAMPAIGN") {
		return (
			<div
				className='modal campaigns-modal'
				style={{ display: calenderModalOpen ? "block" : "none" }}
			>
				<div className='modal-content-wraper'>
					<span
						className='close-modal campaign-close-modal'
						onClick={handleCancleCampaignCreation}
					>
						<XMarkIcon color='lightgray' />
					</span>

					<div className='modal-header d-flex f-align-center campaign-modal-header'>
						<span style={{ color: "#fff", fontSize: "15px" }}>
							{"Create new campaign"}
						</span>
					</div>

					<div className='modal-content campaign-modal-content'>
						{/* NAME / MESSAGE SELECT COMPONENT */}
						<div className='row'>
							<div className='col'>
								<label className='mb'>Name</label>

								<input
									type='text'
									className={`campaigns-name-field ${
										campaignName?.isError ? "campaigns-error-input-field" : ""
									}`}
									placeholder={campaignName?.placeholder}
									value={campaignName?.value}
									onChange={handleCampaignName}
									onBlur={handleBlurValidationOnTextField}
								/>

								{campaignName?.isError && (
									<span className='text-red campaign-modal-name-error'>
										{campaignName?.errorMsg}
									</span>
								)}
							</div>

							<div className='col'>
								<label className='mb'>Message</label>

								<DropSelectMessage
									type='CAMPAIGNS_MODAL_MESSAGE'
									openSelectOption={selectMessageOptionOpen}
									handleIsOpenSelectOption={setSelectMessageOptionOpen}
									groupList={groupMessages}
									groupSelect={groupMsgSelect}
									setGroupSelect={setGroupMsgSelect}
									quickMessage={quickMsg}
									setQuickMessage={setQuickMsg}
									quickMsgModalOpen={quickMsgModalOpen}
									setQuickMsgOpen={setQuickMsgModalOpen}
									isDisabled={false}
									usingSelectOptions={usingSelectOption}
									setUsingSelectOptions={setUsingSelectOption}
									unselectedError={unselectedError}
									setUnselectedError={setUnselectedError}
									customWrapperClass='campaigns-modal-select-msg-wrapper'
									customSelectPanelClass='campaigns-modal-select-panel'
									customSelectPanelPageClass='campaigns-modal-select-panel-page'
									customErrorMsgStyleClass='campaigns-modal-name-error'
									customQuickMsgTooltipStyleClass='campaign-quick-msg-tooltip'
								/>
							</div>
						</div>

						{/* TIME DELAY / MESSAGE LIMIT COMPONENT */}
						<div className='row mt-2'>
							<div className='col'>
								<label className='mb'>Time delay</label>

								<DropSelector
									selects={timeDelays}
									// id='start-time-span'
									defaultValue={
										timeDelays?.find((el) => el.value === timeDelay)?.value
									}
									extraClass='campaign-time-select-full'
									height='40px'
									width='inherit'
									handleChange={onChangeTimeDelay}
								/>
							</div>

							<div className='col'>
								<label className='mb'>Message limit/24hr</label>

								<NumberRangeInput
									value={msgLimit}
									handleChange={(event) => setMsgLimit(event.target.value)}
									handleBlur={handleMessageLimitOnBlur}
									setIncrementDecrementVal={incrementDecrementVal}
									customStyleClass='campaign-modal-num-input'
									placeholder='Enter value'
								/>
							</div>
						</div>

						{/* CHOOSE DAY(S) BALLS COMPONENT */}
						<div className='row mt-2'>
							<div className='col'>
								<label>Choose day(s)</label>

								<div className='ml'>
									<DayChooseBalls
										scheduleTime={scheduleTime}
										setScheduleTime={setScheduleTime}
									/>
								</div>
							</div>
						</div>

						{/* COLOR PICKER COMPONENT */}
						<div className='row mt-2'>
							<div className='col-full'>
								<label>Pick color</label>

								<div className='ml mt'>
									<ColorPickerBalls
										colorPick={campaginColorPick}
										setColorPick={setCampaignColorPick}
									/>
								</div>
							</div>
						</div>

						{/* TIME DURATION / END DATE & TIME COMPONENT */}
						<div className='row mt-2'>
							<div className='col'>
								<label>Time duration</label>

								<div className='col-sm mt'>
									<DropSelector
										selects={timeOptions}
										id='start-time-span'
										defaultValue={
											timeOptions?.find((el) => el.value === startTime)?.value
										}
										extraClass='fr-select-new tinyWrap campaign-time-select-half'
										height='40px'
										width='120px'
										handleChange={onChangeStartingTime}
									/>

									<span>to</span>

									<DropSelector
										selects={timeOptions}
										id='end-time-span'
										defaultValue={
											timeOptions?.find((el) => el.value === endTime)?.value
										}
										extraClass='fr-select-new tinyWrap campaign-time-select-half'
										height='40px'
										width='120px'
										handleChange={onChangeEndingTime}
									/>
								</div>
							</div>

							<div className='col'>
								<label>End date & time</label>

								<input
									type='datetime-local'
									className='mt'
									value={endDateAndTime}
									onChange={handleChangeEndDateAndTime}
								/>
							</div>
						</div>
					</div>

					<div
						className='modal-buttons d-flex justifyContent-end campaign-modal-buttons'
						style={{ gap: "10px" }}
					>
						<button
							className='btn btn-grey'
							onClick={handleCancleCampaignCreation}
						>
							Cancel
						</button>
						<button
							className={`btn ${
								isLoadingBtn ? "campaign-loading-save-btn" : ""
							}`}
							disabled={campaignName.value.trim() === "" || unselectedError}
							onClick={handleSubmitModalCampaign}
						>
							{isLoadingBtn ? "Loading.." : "Save"}
						</button>
					</div>
				</div>
			</div>
		);
	} else if (type === "VIEW_DETAILS") {
		return (
			<>
				<Modal
					modalType='DELETE'
					headerText={"Delete"}
					bodyText={"Are you sure you want to delete ?"}
					open={isCampaignDeleteModalOpen}
					setOpen={setCampaignDeleteModalOpen}
					ModalFun={() => {}}
					btnText={"Yes, Delete"}
					ModalIconElement={() => <DangerIcon />}
					additionalClass={`campaign-view-details-delete-modal`}
				/>

				<div
					className='modal campaigns-modal campaign-view-details-modal'
					style={{ display: calenderModalOpen ? "block" : "none" }}
				>
					<div className='modal-content-wraper'>
						<div className='d-flex'>
							<span
								className='close-modal campaign-close-modal'
								onClick={() => {
									setOpen(false);
									setCalenderModalOpen(false);
								}}
							>
								<XMarkIcon
									color='lightgray'
									size={13}
								/>
							</span>
						</div>

						{/* CAMPAIGN VIEW DETAILS HEADER */}
						<div className='modal-header d-flex f-align-center campaign-modal-header campaign-view-details-header'>
							<span style={{ color: "#fff", fontSize: "15px" }}>
								{"My Events of this campaigns view"}
							</span>

							<div className='campaign-modal-header-actions'>
								<div className='campaign-view-details-toggle'>
									<Switch
										checked={isCampaignToggleOn}
										handleChange={() => setCampaignToggle(!isCampaignToggleOn)}
										// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
										// smallVariant
									/>
								</div>

								<div
									className='mb campaign-edit-pen'
									onClick={handleEditCampaignBtn}
									onMouseEnter={() =>
										setMouseOverBtn({
											...isMouseOverBtn,
											editBtn: !isMouseOverBtn?.editBtn,
										})
									}
									onMouseLeave={() =>
										setMouseOverBtn({ ...isMouseOverBtn, editBtn: false })
									}
								>
									<EditPenIcon
										size={13}
										color={`${!isMouseOverBtn?.editBtn ? "#767485" : "yellow"}`}
									/>
								</div>

								<div
									className='mb campaign-delete-bin'
									onClick={handleDeleteCampaignBtn}
									onMouseEnter={() =>
										setMouseOverBtn({
											...isMouseOverBtn,
											deleteBtn: !isMouseOverBtn?.deleteBtn,
										})
									}
									onMouseLeave={() =>
										setMouseOverBtn({ ...isMouseOverBtn, deleteBtn: false })
									}
								>
									<DeleteIcon
										size={13}
										color={`${!isMouseOverBtn?.deleteBtn ? "#767485" : "red"}`}
									/>
								</div>
							</div>
						</div>

						{/* CAMPAIGN VIEW DETAILS CONTENT */}
						<div className='modal-content campaign-modal-content'>
							<div className='row'>
								<div className='col-full campaign-view-details-col'>
									<div className='icon icon-checked-schedular'>
										<CheckedSchedulerIcon />
									</div>

									<div className='text'>
										<p>Tuesday | 04:00am - 06:00am</p>
										<span>Scheduled for</span>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-full campaign-view-details-col'>
									<div className='icon icon-clock-calender'>
										<ClockCalenderIcon />
									</div>

									<div className='text'>
										<p>Auto (15-20 sec)</p>
										<span>Time delay</span>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-full campaign-view-details-col'>
									<div className='icon icon-message-calender'>
										<MessageCalenderIcon />
									</div>

									<div className='text'>
										<p>Group name will be here</p>
										<span>Message</span>
									</div>
								</div>
							</div>

							<div className='row'>
								<div className='col-full campaign-view-details-col'>
									<div className='icon icon-messages-limit-calender'>
										<MessagesLimitCalenderIcon />
									</div>

									<div className='text'>
										<p>23</p>
										<span>Message limit / 24hr</span>
									</div>
								</div>
							</div>
						</div>

						{/* CAMPAIGN VIEW DETAILS FOOTER */}
						<div className='campaign-modal-footer'>
							{/* == */}
							<div className='row'>
								<div className='col-full campaign-view-details-col'>
									<div className='icon icon-checked-schedular'>
										<ClockedSchedularIcon />
									</div>

									<div className='text'>
										<p>01 Dec, 2023 06:00am</p>
										<span>Campaign end date & time</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	} else {
		return null;
	}
};

export default CalenderModal;
