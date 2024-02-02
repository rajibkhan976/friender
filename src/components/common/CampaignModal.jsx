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
	updateCampaignSchedule,
	fetchCampaignById,
	updateCampaignStatus,
	updateCampaign,
	deleteCampaign,
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
import { getGroupById } from 'actions/MySettingAction';
import { timeOptions } from "../../helpers/timeOptions";

const CalenderModal = ({
	type = "CREATE_CAMPAIGN",
	open = false,
	setOpen,
	scheduleTime,
	setCalenderModalType,
	setScheduleTime,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [calenderModalOpen, setCalenderModalOpen] = useState(open);
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const selectedCampaignSchedule = useSelector(
		(state) => state.campaign.selectedCampaignSchedule
	);
	const editingCampaign = useSelector(
		(state) => state.campaign.editingCampaign
	);
	const campaignsArray = useSelector(
		(state) => state.campaign.campaignsArray
	);
	const current_fb_id = localStorage.getItem("fr_default_fb");
	const [isLoadingBtn, setLoadingBtn] = useState(false);
	const [isEditingModal, setIsEditingModal] = useState(false);

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

	// CAMPAIGN HEADER TOGGLE..
	const [isCampaignToggleOn, setCampaignToggle] = useState(() => editingCampaign ? editingCampaign?.status : false);

	// MOUSEOVER EVENTS STATES..
	const [isMouseOverBtn, setMouseOverBtn] = useState({
		editBtn: false,
		deleteBtn: false,
	});

	// CAMPAIGN DELETE MODAL OPEN/CLOSE..
	const [isCampaignDeleteModalOpen, setCampaignDeleteModalOpen] =
		useState(false);

	useEffect(() => {
		if (scheduleTime) {
			setStartTime(scheduleTime?.start);
			setEndTime(scheduleTime?.end);
		}
	}, [scheduleTime]);

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
		// storeEdit("settings");
		// NAVIGATE TO THE EDIT PAGE..
		// navigate(`/messages/campaigns/${1}`);
		// setCalenderModalOpen(false);
		setIsEditingModal(true);
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
		if (campaignsArray?.length) {
			if (!isEditingModal) {
				const campaignExistsCheck = campaignsArray.findIndex((campaign) => campaign?.campaign_name?.trim() === payload?.campaignName?.trim());

				if (campaignExistsCheck > -1) {
					Alertbox("The campaign name is already in use, please try a different name.", "error", 1000, "bottom-right");
					setCampaignName({ ...campaignName, isError: true, errorMsg: "" });
					setLoadingBtn(false);
					return false;
				}
			}
		}

		try {
			let response;

			if (!isEditingModal) {
				response = await dispatch(createCampaign(payload)).unwrap();
			} else {
				response = await dispatch(updateCampaign(payload)).unwrap();
			}

			if (response?.data) {
				const rbcEventArr = document.getElementsByClassName("rbc-event");
				if (rbcEventArr && rbcEventArr.length > 0) {
					for (let i = 0; i < rbcEventArr.length; i++) {
						if (!rbcEventArr[i].classList?.value.includes("campaign-saved")) {
							rbcEventArr[i].classList.add("campaign-saved");
						}
					}
				}
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
					to_time: toTime,
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
		setCalenderModalType("");
		setCalenderModalOpen(false);
		setOpen(false);
	};

	useEffect(() => {
		if (selectedCampaignSchedule && selectedCampaignSchedule.id) {
			dispatch(
				fetchCampaignById({
					fbUserId: current_fb_id,
					campaignId: selectedCampaignSchedule.id,
				})
			);
		}
	}, [selectedCampaignSchedule]);


	useEffect(() => {
		if (editingCampaign) {
			setCampaignToggle(editingCampaign?.status);
		}
	}, [editingCampaign]);


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
		setCalenderModalType("");
		setCalenderModalOpen(false);
		setOpen(false);
	};

	// DELETE CAMPAIGN API REQUEST..
	const campaignDeleteAPIReq = async (id) => {
		try {
			const response = await dispatch(
				deleteCampaign([{ campaignId: id }])
			).unwrap();

			if (response?.data) {
				setCampaignDeleteModalOpen(false);
				Alertbox(
					`Campaign(s) has been deleted successfully.`,
					"success",
					1000,
					"bottom-right"
				);
			} else if (response?.error?.code === "bad_request") {
				setCampaignDeleteModalOpen(false);
				Alertbox(`${response?.error?.message}`, "error", 1000, "bottom-right");
			} else {
				setCampaignDeleteModalOpen(false);
				Alertbox(
					`Failed to delete the campaign. Please check your input and try again.`,
					"error",
					1000,
					"bottom-right"
				);
			}
		} catch (error) {
			setCampaignDeleteModalOpen(false);
			Alertbox(error, "error", 1000, "bottom-right");
		} finally {
			setCampaignDeleteModalOpen(false);
		}
	};

	// useEffect(() => {
	//     if (quickMsgModalOpen === true) {
	//         setCalenderModalOpen(false);
	//     }
	// }, [quickMsgModalOpen, calenderModalOpen]);

	// CAMPAIGN STATUS UPDATE VIA API.. 
	const camapignStatusToggleUpdateAPI = async (campaignId, campaignStatus) => {
		try {
			await dispatch(updateCampaignStatus({ campaignId, campaignStatus })).unwrap();
			Alertbox(`The campaign has been successfully turned ${campaignStatus ? "ON" : "OFF"}`, "success", 3000, "bottom-right");
			return false;

		} catch (error) {
			// Handle other unexpected errors
			Alertbox(
				error?.message,
				"error",
				1000,
				"bottom-right"
			);
			return false;
		}
	};

	// CAMPAIGN TOGGLE BUTTON SWITCHING..
	const handleCampaignStatusChange = async (e) => {
		const placeholderCampaign = campaignsArray?.length && campaignsArray?.find(camp => camp?.campaign_id === editingCampaign?._id);

		if (placeholderCampaign) {
			if ((placeholderCampaign?.friends_pending === 0 || new Date(placeholderCampaign?.campaign_end_time) < new Date()) && e.target.checked) {
				Alertbox(
					`${placeholderCampaign?.friends_pending === 0
						? "This campaign currently has no pending friend(s). To turn on the campaign, please add some friends"
						: "The campaign you are attempting to turn on has exceeded its end date and time. To proceed, you need to modify the campaign accordingly."
					}`,
					"warning",
					3000,
					"bottom-right"
				);
				return false;
			} else {
				setCampaignToggle(e.target.checked);
				camapignStatusToggleUpdateAPI(placeholderCampaign?.campaign_id, e.target.checked);
			}
		}
	};




	// FETCHING THE GROUP BY ID..
	const fetchGroupMessage = (groupId) => {
		dispatch(getGroupById(groupId))
			.unwrap()
			.then((res) => {
				const data = res?.data;

				if (data.length) {
					setGroupMsgSelect(data[0]);
					localStorage.setItem('fr_using_campaigns_message', true);
				}
			});
	};


	// PREVIEW OF DATA AT FIELD FOR EDITING MODE..
	useEffect(() => {
		if (isEditingModal && editingCampaign) {
			setCampaignName({ ...campaignName, value: editingCampaign?.campaign_name });
			setTimeDelay(editingCampaign?.time_delay);
			setMsgLimit(editingCampaign?.message_limit);
			setCampaignColorPick(editingCampaign?.campaign_label_color);
			setEndDateAndTime(editingCampaign?.campaign_end_time);

			if (editingCampaign?.message_group_id) {
				// Fetching the group from the id here..
				fetchGroupMessage(editingCampaign?.message_group_id);
			}

			if (selectedCampaignSchedule) {
				const originalStartDate = moment(selectedCampaignSchedule?.start);
				const formattedStartTime = originalStartDate.format("hh:mm a");

				const originalEndDate = moment(selectedCampaignSchedule?.end);
				const formattedEndTime = originalEndDate.format("hh:mm a");

				setStartTime(formattedStartTime);
				setEndTime(formattedEndTime);
			}
		}
	}, [isEditingModal]);
	

	console.log("DETAILS -- ", editingCampaign); console.log("SELECTED SCHEDULE -- ", selectedCampaignSchedule);


	if (type === "CREATE_CAMPAIGN" || isEditingModal) {
		return (
			<div
				className='modal campaigns-modal'
				style={{ display: calenderModalOpen ? "block" : "none" }}
			>
				<div className='modal-content-wraper'>
					<span
						className='close-modal campaign-close-modal'
						onClick={handleCancelCampaignCreation}
					>
						<XMarkIcon color='lightgray' />
					</span>

					<div className='modal-header d-flex f-align-center campaign-modal-header'>
						{isEditingModal && (
							<span
								onClick={() => setIsEditingModal(false)}
								style={{
									background: '#0094FF1A',
									borderRadius: '50px',
									height: '30px',
									width: '30px',
									textAlign: 'center',
									paddingTop: '2px',
									cursor: 'pointer'
								}}>
								<svg width="15" height="15" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M9.08073 4H0.914062M0.914062 4L4.41406 7.5M0.914062 4L4.41406 0.5" stroke="#0094FF" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
						)}

						<span style={{ color: "#fff", fontSize: "15px" }}>
							{!isEditingModal ? "Create new campaign" : 'Edit Campaign'}
						</span>
					</div>

					<div className='modal-content campaign-modal-content'>
						{/* NAME / MESSAGE SELECT COMPONENT */}
						<div className='row'>
							<div className='col'>
								<label className='mb'>Name</label>

								<input
									type='text'
									className={`campaigns-name-field ${campaignName?.isError ? "campaigns-error-input-field" : ""
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
									value={timeDelay}
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
										value={
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
										value={timeOptions?.find((el) => el.value === endTime)?.value}
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
							onClick={handleCancelCampaignCreation}
						>
							Cancel
						</button>
						<button
							className={`btn ${isLoadingBtn ? "campaign-loading-save-btn" : ""
								}`}
							disabled={campaignName.value.trim() === "" || unselectedError}
							onClick={handleSubmitModalCampaign}
						>
							{isLoadingBtn ? "Saving..." : "Save"}
						</button>
					</div>
				</div>
			</div>
		);

	} else if (type === "VIEW_DETAILS") {
		return (
			<>
				{isCampaignDeleteModalOpen && (
					<Modal
						modalType='DELETE'
						headerText={"Delete"}
						bodyText={"Are you sure you want to delete ?"}
						open={isCampaignDeleteModalOpen}
						setOpen={setCampaignDeleteModalOpen}
						ModalFun={() => {
							campaignDeleteAPIReq(selectedCampaignSchedule?.id);
						}}
						btnText={"Yes, Delete"}
						ModalIconElement={() => <DangerIcon />}
						additionalClass={`campaign-view-details-delete-modal`}
					/>
				)}
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
							<div
								className='campaign-modal-title'
								style={{ color: "#fff", fontSize: "15px" }}
							>
								{editingCampaign?.campaign_name}
							</div>

							<div className='campaign-modal-header-actions'>
								<div className='campaign-view-details-toggle'>
									<Switch
										checked={isCampaignToggleOn}
										handleChange={handleCampaignStatusChange}
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
										<p>{`${moment(selectedCampaignSchedule?.start).format(
											"dddd"
										)} | ${moment(selectedCampaignSchedule?.start).format(
											"hh:mm:ssa"
										)} - ${moment(selectedCampaignSchedule?.end).format(
											"hh:mm:ssa"
										)}`}</p>
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
										<p>{editingCampaign?.time_delay}</p>
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
										<p>{editingCampaign?.group_name}</p>
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
										<p>{editingCampaign?.message_limit}</p>
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
										<p>
											{moment(
												editingCampaign?.campaign_end_time || new Date()
											).format("DD MMM, YYYY hh:mm:ssa")}
										</p>
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
