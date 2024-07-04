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
	deleteCampaign,
	fetchCampaignById,
	fetchAllCampaignsFromIndexDB,
	updateCampaign,
	updateCampaignSchedule,
	updateCampaignStatus,
	updateSelectedCampaignSchedule,
	syncCampaignStatus,
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
import { getGroupById } from "actions/MySettingAction";
import { timeOptions } from "../../helpers/timeOptions";
import extensionAccesories from "../../configuration/extensionAccesories"
import { showModal } from "../../actions/PlanAction";

const CalenderModal = ({
	type = "CREATE_CAMPAIGN",
	open = false,
	setOpen,
	scheduleTime,
	selectedSchedule,
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
	const campaignsArray = useSelector((state) => state.campaign.campaignsArray);
	const current_fb_id = localStorage.getItem("fr_default_fb");
	const [isLoadingBtn, setLoadingBtn] = useState(false);
	const [isEditingModal, setIsEditingModal] = useState(false);

	const [isSaveDisabled, setSaveDisabled] = useState(false);

	// CAMPAIGN NAME STATE..
	const [campaignName, setCampaignName] = useState({
		value: "",
		tempValue: "",
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

	// END DATE AND TIME
	const [endDateAndTime, setEndDateAndTime] = useState("");

	// STATE OF CAMPAIGN STATUS..
	// const [campaignEndTimeStatus, setCampaignEndTimeStatus] = useState(false);

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
	const [isCampaignToggleOn, setCampaignToggle] = useState(() =>
		editingCampaign ? editingCampaign?.status : false
	);

	// MOUSEOVER EVENTS STATES..
	const [isMouseOverBtn, setMouseOverBtn] = useState({
		editBtn: false,
		deleteBtn: false,
	});

	// CAMPAIGN DELETE MODAL OPEN/CLOSE..
	const [isCampaignDeleteModalOpen, setCampaignDeleteModalOpen] =
		useState(false);

	// TRANCATE AND ELLIPSIS TEXT..
	const truncateAndAddEllipsis = (stringText, maxLength) => {
		if (stringText?.trim()?.length >= maxLength) {
			let truncatedString = stringText.substring(0, maxLength);
			return truncatedString + "...";
		} else {
			return stringText;
		}
	};

	// HANDLE CAMPAIGNS NAME FUNCTION..
	const handleCampaignName = (event) => {
		// event.preventDefault();
		const value = event.target.value;
		setCampaignName({ ...campaignName, value, tempValue: value });
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
		} else if (value.length > 40) {
			const modifiedText = truncateAndAddEllipsis(value, 40);
			setCampaignName({ ...campaignName, tempValue: modifiedText });
		} else {
			setCampaignName({
				...campaignName,
				isError: false,
				errorMsg: "",
				tempValue: value,
			});
		}
	};

	// HANDLE THE FOCUS EVENT FOR VALIDATION ON TEXT FIELDS..
	const handleFocusValidationOnTextField = (_event) => {
		// const value = event.target.value.trim();
		setCampaignName({ ...campaignName, tempValue: campaignName?.value });
	};

	// TIME DELAY..
	const onChangeTimeDelay = (event) => {
		setTimeDelay(Number(event.target.value));
	};

	// TIME DURATIONS..
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
		dispatch(syncCampaignStatus());

		if (campaignsArray?.length) {
			if (!isEditingModal) {
				const campaignExistsCheck = campaignsArray.findIndex(
					(campaign) =>
						campaign?.campaign_name?.trim() === payload?.campaignName?.trim()
				);

				if (campaignExistsCheck > -1) {
					Array.isArray(campaignSchedule) &&
						dispatch(
							updateCampaignSchedule(
								campaignSchedule.filter((item) => item.isSaved)
							)
						);
					Alertbox(
						"The campaign name is already in use, please try a different name.",
						"error",
						1000,
						"bottom-right"
					);
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
				// console.log("response ::: ", response)
				extensionAccesories.sendMessageToExt({
					action: "update_schedules",
				});
			}

			if (response?.data) {
				dispatch(fetchAllCampaignsFromIndexDB());
				setScheduleTime(() => {
					return {
						date: [new Date()],
						start: "",
						end: "",
					};
				});

				const rbcEventArr = document.getElementsByClassName("rbc-event");

				if (rbcEventArr && rbcEventArr.length > 0) {
					for (let i = 0; i < rbcEventArr.length; i++) {
						if (!rbcEventArr[i].classList?.value.includes("campaign-saved")) {
							rbcEventArr[i].classList.add("campaign-saved");
						}
					}
				}

				Alertbox(response?.message ? `${response?.message}` : "Campaign saved", "success", 1000, "bottom-right");

				setLoadingBtn(false);
				// navigate("/messages/campaigns");
				navigate("/campaigns");
				setCalenderModalOpen(false);
			} else {
				Array.isArray(campaignSchedule) &&
					dispatch(
						updateCampaignSchedule(
							campaignSchedule.filter((item) => item.isSaved)
						)
					);
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

	const convertTo24 = (timeStr) => {
		let timeIn24 = "";
		if (timeStr) {
			const timePart = timeStr?.split(" ")[0];
			const timeFormPart = timeStr?.split(" ")[1];
			if (timeFormPart?.toLowerCase() === "pm") {
				const hourPart =
					Number(timePart?.split(":")[0]) < 12
						? Number(timePart?.split(":")[0]) + 12
						: Number(timePart?.split(":")[0]);
				const minutePart = timePart?.split(":")[1];
				timeIn24 =
					hourPart.toString() === "23" && minutePart === "59"
						? hourPart.toString() + ":" + minutePart + ":59"
						: hourPart.toString() + ":" + minutePart + ":00";
			} else {
				const hourPart =
					Number(timePart?.split(":")[0]) === 12
						? "00"
						: Number(timePart?.split(":")[0]);
				const minutePart = timePart?.split(":")[1];
				timeIn24 = hourPart.toString() + ":" + minutePart + ":00";
			}
		}
		timeIn24 =
			timeIn24?.split(":")[0]?.toString()?.length === 1
				? `0${timeIn24?.split(":")[0]}:${timeIn24?.split(":")[1]}:${
						timeIn24?.split(":")[2]
				  }`
				: timeIn24;
		return timeIn24;
	};

	// console.log("DETAILS -- ", editingCampaign);
	// console.log("SELECTED SCHEDULE -- ", selectedCampaignSchedule);
	// console.log(scheduleTime);

	// UPDATE CAMPAIGN SCHEDULES PROPERTY INTO THE OBJECT FOR API PAYLOAD..
	const updateCampaignSchedulesPayload = () => {
		const editSchedule = selectedCampaignSchedule
			? {
					day: moment(selectedCampaignSchedule?.start).format("dddd"),
					start: moment(selectedCampaignSchedule?.start).format("h:mm A"),
					end: moment(selectedCampaignSchedule?.end).format("h:mm A"),
			  }
			: null;
		let updatedCampaignSchedules =
			editSchedule &&
			editingCampaign &&
			Array.isArray(editingCampaign?.schedule)
				? [
						...editingCampaign?.schedule?.filter(
							(item) =>
								editSchedule &&
								editSchedule.day !== item.day &&
								editSchedule.start !== item.start &&
								editSchedule.end !== item.end
						),
				  ]
				: [];
		if (
			scheduleTime.date &&
			scheduleTime.start &&
			scheduleTime.end &&
			timeOptions.findIndex((item) => item.value === scheduleTime.start) <
				timeOptions.findIndex((item) => item.value === scheduleTime.end)
		) {
			const dateArr = scheduleTime.date.map((item) =>
				moment(item).format("dddd")
			);
			const newSchedules = [];
			dateArr.forEach((item) => {
				newSchedules.push({
					day: item,
					from_time: convertTo24(scheduleTime?.start),
					to_time: convertTo24(scheduleTime?.end),
				});
			});
			updatedCampaignSchedules = [...updatedCampaignSchedules, ...newSchedules];
		}
		return updatedCampaignSchedules;
	};

	// GETTING OLDER MESSAGE GROUP ID.. (FOR EDIT CAMPAIGN ONLY)
	const getOldMessageGroupId = () => {
		return localStorage.getItem("old_message_group_id_campaign")
			? localStorage.getItem("old_message_group_id_campaign")
			: "";
	};

	// SAVE CAMPAIGN..
	const handleClickToSaveCampaign = (data) => {
		const campaignSchedules = updateCampaignSchedulesPayload();
		const payload = {
			...data,
			fbUserId: current_fb_id,
			schedule: campaignSchedules,
		};
		campaignAddRequestToAPI(payload);
	};

	// HANDLE SUBMIT MODEL..
	const handleSubmitModalCampaign = (event) => {
		event.preventDefault();

		if (!isLoadingBtn) {
			setLoadingBtn(true);

			// UNHANDLED VALUES.. TIME DURATIONS,
			// console.log("scheduleTime", scheduleTime);

			if (campaignName?.value?.trim() === "") {
				setLoadingBtn(false);
				setCampaignName({
					...campaignName,
					isError: true,
					errorMsg: "Enter campaign name",
				});
			}

			if (!groupMsgSelect?._id && quickMsg === null) {
				setUnselectedError(true);
				setLoadingBtn(false);
				return false;
			}

			if (
				campaignSchedule?.length === 0 ||
				(scheduleTime && scheduleTime?.date?.length === 0)
			) {
				setSaveDisabled(true);
				setLoadingBtn(false);
				Alertbox(
					"Please ensure that you schedule your campaign for at least one specific time before saving.",
					"error",
					1000,
					"bottom-right",
					"",
					"Opps!"
				);
				return false;
			}

			if (campaignsArray?.length) {
				if (!isEditingModal) {
					const campaignExistsCheck = campaignsArray.findIndex(
						(campaign) =>
							campaign?.campaign_name?.trim() === campaignName?.value?.trim()
					);

					if (campaignExistsCheck > -1) {
						Array.isArray(campaignSchedule) &&
							dispatch(
								updateCampaignSchedule(
									campaignSchedule.filter((item) => item.isSaved)
								)
							);
						Alertbox(
							"The campaign name is already in use, please try a different name.",
							"error",
							1000,
							"bottom-right"
						);
						setCampaignName({ ...campaignName, isError: true, errorMsg: "" });
						setLoadingBtn(false);
						setSaveDisabled(true);
						return false;
					}
				}
			}

			const campaignToSave = {
				campaignName: campaignName?.value,
				messageGroupId: groupMsgSelect?._id,
				quickMessage: quickMsg,
				messageLimit: msgLimit,
				campaignEndTimeStatus:
					endDateAndTime !== "Invalid date" &&
					endDateAndTime &&
					endDateAndTime !== ""
						? true
						: false,
				campaignEndTime: endDateAndTime ? new Date(endDateAndTime) : "",
				timeDelay: timeDelay,
				campaignLabelColor: campaginColorPick,
				campaignStatus: false,
			};

			if (isEditingModal) {
				const editingCampaignId =
					editingCampaign?._id || editingCampaign?.campaign_id;
				campaignToSave.campaignId = editingCampaignId;
				const findTheCampaign =
					campaignsArray?.length &&
					campaignsArray.find(
						(campaign) => campaign?.campaign_id === editingCampaignId
					);
				campaignToSave.campaignStatus = findTheCampaign?.status;

				campaignToSave.oldMessageGroupId = getOldMessageGroupId();
			}

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

			handleClickToSaveCampaign(campaignToSave);
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
		if (
			selectedSchedule &&
			campaignScheduleArr.some(
				(item) =>
					!item.isSaved &&
					moment(item.start).format("DD-MM-YYYY h:mm A") ===
						moment(selectedSchedule.start).format("DD-MM-YYYY h:mm A") &&
					moment(item.end).format("DD-MM-YYYY h:mm A") ===
						moment(selectedSchedule.end).format("DD-MM-YYYY h:mm A")
			)
		) {
			campaignScheduleArr = campaignScheduleArr.filter(
				(item) =>
					item.isSaved &&
					moment(item.start).format("DD-MM-YYYY h:mm A") !==
						moment(selectedSchedule.start).format("DD-MM-YYYY h:mm A") &&
					moment(item.end).format("DD-MM-YYYY h:mm A") !==
						moment(selectedSchedule.end).format("DD-MM-YYYY h:mm A")
			);
		} else {
			!campaignScheduleArr[campaignScheduleArr.length - 1].isSaved &&
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
				dispatch(fetchAllCampaignsFromIndexDB());
				setCampaignDeleteModalOpen(false);

				extensionAccesories.sendMessageToExt({
					action: "update_schedules",
				});

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
			await dispatch(
				updateCampaignStatus({ campaignId, campaignStatus })
			).unwrap().then((resp) => dispatch(fetchAllCampaignsFromIndexDB()));

			extensionAccesories.sendMessageToExt({
				action: "update_schedules",
			});
			Alertbox(
				`The campaign has been successfully turned ${
					campaignStatus ? "ON" : "OFF"
				}`,
				"success",
				3000,
				"bottom-right"
			);
			return false;
		} catch (error) {
			// Handle other unexpected errors
			Alertbox(error?.message, "error", 1000, "bottom-right");
			return false;
		}
	};

	// CAMPAIGN TOGGLE BUTTON SWITCHING..
	const handleCampaignStatusChange = async (e) => {
		const placeholderCampaign =
			campaignsArray?.length &&
			campaignsArray?.find(
				(camp) => camp?.campaign_id === editingCampaign?._id
			);

		if (
			!placeholderCampaign?.friends_added ||
			placeholderCampaign?.friends_added === undefined ||
			placeholderCampaign?.friends_added === null ||
			placeholderCampaign?.friends_added === 0
		) {
			setCampaignToggle(false);

			Alertbox(
				"This campaign currently has no pending friend(s). To turn on the campaign, please add some friends",
				"warning",
				3000,
				"bottom-right"
			);
			return false;
		}

		if (placeholderCampaign) {
			if (
				(placeholderCampaign?.friends_pending === 0 ||
					placeholderCampaign?.friends_added === 0 ||
					(placeholderCampaign?.campaign_end_time_status &&
						new Date(placeholderCampaign?.campaign_end_time) < new Date())) &&
				e.target.checked
			) {
				setCampaignToggle(false);
				Alertbox(
					`${
						placeholderCampaign?.friends_pending === 0
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
				camapignStatusToggleUpdateAPI(
					placeholderCampaign?.campaign_id,
					e.target.checked
				);
			}
		}
	};

	// HANDLE MESAGE LIMIT WITH THE CHANGE EVENT..
	const handleMsgLimitChange = (event) => {
		let msgLimitValue = event.target.value;

		// Remove any non-digit characters, including 'e'
		msgLimitValue = msgLimitValue.replace(/\D/g, "");

		if (!msgLimitValue) {
			msgLimitValue = "";
		}

		const parsedValue = parseInt(msgLimitValue);
		setMsgLimit(parsedValue);
	};

	// CHECK THE END DATE AND TIME THEN MAKE DECISION TO TURN OFF STATUS TOGGLE..
	useEffect(() => {
		const campaignId = editingCampaign?._id || editingCampaign?.campaign_id;

		if (
			editingCampaign?.campaign_end_time_status &&
			editingCampaign?.campaign_end_time &&
			editingCampaign?.campaign_end_time < new Date()
		) {
			(async () => {
				try {
					await dispatch(
						updateCampaignStatus({ campaignId, campaignStatus: false })
					).unwrap().then((resp) => dispatch(fetchAllCampaignsFromIndexDB()));
				} catch (error) {
					console.log("CAMPAIGN STATUS UPDATE ERROR - ", error);
				}
			})();
		}
	}, [editingCampaign?.campaign_end_time]);

	// CHECK MESSAGE GROUP SAVING OLDER GROUP..
	const setOldMessageGroupId = (messageGroupId) => {
		localStorage.setItem("old_message_group_id_campaign", messageGroupId);
	};

	// DISABLE SAVED BUTTON ACCORDING TO FIELDS ARE REQUIRED..
	// const disableSubmit = () => {
	// 	const name = campaignName?.value?.trim();
	// 	const groupMsg = groupMsgSelect?._id;

	// 	if (name === '' || (!groupMsg && quickMsg === null)
	// 		|| campaignSchedule?.length === 0
	// 		|| (scheduleTime && scheduleTime?.date?.length === 0)) {
	// 		return true;

	// 	} else {
	// 		return false;
	// 	}
	// };

	useEffect(() => {
		if (scheduleTime?.date?.length > 0) {
			setSaveDisabled(false);
		}
	}, [scheduleTime]);

	// FETCHING THE GROUP BY ID..
	const fetchGroupMessage = (groupId) => {
		// Store as for Older GroupID..
		setOldMessageGroupId(groupId);

		dispatch(getGroupById(groupId))
			.unwrap()
			.then((res) => {
				const data = res?.data;

				if (data.length) {
					setGroupMsgSelect(data[0]);
					localStorage.setItem("fr_using_campaigns_message", true);
				}
			});
	};

	// PREVIEW OF DATA AT FIELD FOR EDITING MODE..
	useEffect(() => {
		if (isEditingModal && editingCampaign) {
			if (editingCampaign?.campaign_name) {
				const modifiedTempValue = truncateAndAddEllipsis(
					editingCampaign?.campaign_name,
					40
				);

				setCampaignName({
					...campaignName,
					value: editingCampaign?.campaign_name,
					tempValue: modifiedTempValue,
				});
			}

			setTimeDelay(editingCampaign?.time_delay);
			setMsgLimit(editingCampaign?.message_limit);
			setCampaignColorPick(editingCampaign?.campaign_label_color);

			if (editingCampaign?.campaign_end_time_status) {
				const formatEndTime = moment(editingCampaign?.campaign_end_time).format(
					"YYYY-MM-DD HH:mm:ss"
				);
				setEndDateAndTime(formatEndTime);
			} else {
				setEndDateAndTime("");
			}

			if (editingCampaign?.message_group_id) {
				localStorage.removeItem("fr_quickMessage_campaigns_message");
				// Fetching the group from the id here..
				fetchGroupMessage(editingCampaign?.message_group_id);
			}

			if (editingCampaign?.quick_message) {
				localStorage.removeItem("fr_using_campaigns_message");
				setQuickMsg(editingCampaign?.quick_message);
			}
		}
	}, [isEditingModal]);

	// MEMORY CLEANUP FUNCTION..
	useEffect(() => {
		return () => {
			localStorage.removeItem("fr_quickMessage_campaigns_message");
		};
	}, []);

	useEffect(() => {
		return () => {
			dispatch(updateSelectedCampaignSchedule(null));
			setScheduleTime(() => {
				return {
					date: [new Date()],
					start: "",
					end: "",
				};
			});
		};
	}, []);

	// console.log("DETAILS -- ", editingCampaign);
	// console.log("SELECTED SCHEDULE -- ", selectedCampaignSchedule);

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
									background: "#0094FF1A",
									borderRadius: "50px",
									height: "30px",
									width: "30px",
									textAlign: "center",
									paddingTop: "2px",
									cursor: "pointer",
								}}
							>
								<svg
									width='15'
									height='15'
									viewBox='0 0 10 8'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M9.08073 4H0.914062M0.914062 4L4.41406 7.5M0.914062 4L4.41406 0.5'
										stroke='#0094FF'
										stroke-linecap='round'
										stroke-linejoin='round'
									/>
								</svg>
							</span>
						)}

						<span style={{ color: "#fff", fontSize: "15px" }}>
							{!isEditingModal ? "Create new campaign" : "Edit Campaign"}
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
									value={campaignName?.tempValue}
									onChange={handleCampaignName}
									onBlur={handleBlurValidationOnTextField}
									onFocus={handleFocusValidationOnTextField}
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
									setQuickMessage={(message) => {
										const campaignToSave = {
											campaignName: campaignName?.value,
											messageGroupId: groupMsgSelect?._id,
											quickMessage: message,
											messageLimit: msgLimit,
											campaignEndTimeStatus:
												endDateAndTime !== "Invalid date" &&
												endDateAndTime &&
												endDateAndTime !== ""
													? true
													: false,
											campaignEndTime: endDateAndTime
												? new Date(endDateAndTime)
												: "",
											timeDelay: timeDelay,
											campaignLabelColor: campaginColorPick,
											campaignStatus: false,
										};

										if (isEditingModal && editingCampaign) {
											const editingCampaignId =
												editingCampaign?._id || editingCampaign?.campaign_id;
											campaignToSave.campaignId = editingCampaignId;
											const findTheCampaign =
												campaignsArray?.length &&
												campaignsArray.find(
													(campaign) =>
														campaign?.campaign_id === editingCampaignId
												);
											campaignToSave.campaignStatus = findTheCampaign?.status;

											campaignToSave.oldMessageGroupId = getOldMessageGroupId();

											let campaignScheduleArr = Array.isArray(campaignSchedule)
												? campaignSchedule.filter((item) => item.isSaved)
												: [];

											if (
												scheduleTime.date &&
												scheduleTime.start &&
												scheduleTime.end &&
												timeOptions.findIndex(
													(item) => item.value === scheduleTime.start
												) <
													timeOptions.findIndex(
														(item) => item.value === scheduleTime.end
													)
											) {
												if (
													selectedSchedule &&
													!campaignScheduleArr.every(
														(item) =>
															moment(item.start).format(
																"DD-MM-YYYY h:mm: A"
															) ===
																moment(selectedSchedule.start).format(
																	"DD-MM-YYYY h:mm A"
																) &&
															moment(item.end).format("DD-MM-YYYY h:mm A") ===
																moment(selectedSchedule.end).format(
																	"DD-MM-YYYY h:mm A"
																)
													)
												) {
													campaignScheduleArr = campaignSchedule.filter(
														(item) =>
															moment(item.start).format(
																"DD-MM-YYYY h:mm: A"
															) !==
																moment(selectedSchedule.start).format(
																	"DD-MM-YYYY h:mm A"
																) &&
															moment(item.end).format("DD-MM-YYYY h:mm A") !==
																moment(selectedSchedule.end).format(
																	"DD-MM-YYYY h:mm A"
																)
													);
												}

												const dateArr = scheduleTime.date.map((item) =>
													moment(item).format("MMMM DD, YYYY")
												);
												const dateTimeArrObj = [];
												dateArr.forEach((item) => {
													const start = new Date(
														`${item} ${scheduleTime.start}`
													);
													const end = new Date(`${item} ${scheduleTime.end}`);
													dateTimeArrObj.push({
														isSaved: true,
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
																moment(item.start).format(
																	"DD-MM-YYYY h:mm: A"
																) !==
																	moment(schedule.start).format(
																		"DD-MM-YYYY h:mm A"
																	) &&
																moment(item.end).format("DD-MM-YYYY h:mm A") !==
																	moment(schedule.end).format(
																		"DD-MM-YYYY h:mm A"
																	)
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
											dispatch(
												updateCampaignSchedule([...campaignScheduleArr])
											);

											handleClickToSaveCampaign(campaignToSave);
											setCalenderModalType("");
											setCalenderModalOpen(false);
											setOpen(false);
										}
										setQuickMsg(message);
									}}
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
									handleChange={handleMsgLimitChange}
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
											timeOptions?.find((el) => el.value === scheduleTime.start)
												?.value
										}
										value={
											timeOptions?.find((el) => el.value === scheduleTime.start)
												?.value
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
											timeOptions?.find((el) => el.value === scheduleTime.end)
												?.value
										}
										value={
											timeOptions?.find((el) => el.value === scheduleTime.end)
												?.value
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
							onClick={handleCancelCampaignCreation}
						>
							Cancel
						</button>
						<button
							className={`btn ${
								isLoadingBtn ? "campaign-loading-save-btn" : ""
							}`}
							disabled={isSaveDisabled || unselectedError}
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
							campaignDeleteAPIReq(editingCampaign?._id);
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
									setCalenderModalType("");
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
								<p
									className={
										editingCampaign?.campaign_name?.trim()?.length > 40
											? `tooltipFullName custom-campaign-name-tooltip`
											: ""
									}
									data-text={`${editingCampaign?.campaign_name}`}
								>
									{truncateAndAddEllipsis(editingCampaign?.campaign_name, 25)}
								</p>
							</div>

							<div className='campaign-modal-header-actions'>
								<div className='campaign-view-details-toggle'>
									<Switch
										checked={isCampaignToggleOn}
										handleChange={(e) => {
											if (e.target.checked) {
												if (localStorage?.getItem("fr_plan")) {
													if (
														Number(
															localStorage?.getItem("fr_plan")?.toLowerCase()
														) < 3
													) {
														e.preventDefault();
														dispatch(showModal(true));
														return false;
													} else {
														handleCampaignStatusChange(e);
													}
												} else {
													return false;
												}
											} else {
												handleCampaignStatusChange(e);
											}
										}}
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
										color={`${
											!isMouseOverBtn?.editBtn ? "#767485" : "#0094FF"
										}`}
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
										<p>{editingCampaign?.time_delay} mins</p>
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
										<p>
											{editingCampaign?.group_name
												? editingCampaign?.group_name
												: "Quick message"}
										</p>
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
											{editingCampaign?.campaign_end_time
												? moment(editingCampaign?.campaign_end_time).format(
														"DD MMM, YYYY hh:mma"
												  )
												: "N/A"}
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