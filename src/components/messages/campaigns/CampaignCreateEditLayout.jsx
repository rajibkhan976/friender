import React, { useState, useEffect } from "react";
import DropSelectMessage from "components/messages/DropSelectMessage";
import NumberRangeInput from "components/common/NumberRangeInput";
import Switch from "components/formComponents/Switch";
import DropSelector from "components/formComponents/DropSelector";
import { fetchGroups } from "actions/MessageAction";
import { getGroupById } from 'actions/MySettingAction';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useNavigate } from 'react-router-dom';
import { createCampaign, updateCampaign, updateCampaignSchedule, updateCampaignDetails } from "actions/CampaignsActions";
import { fetchCampaign } from 'services/campaigns/CampaignServices';
import Alertbox from "components/common/Toast";
import Tooltip from 'components/common/Tooltip';


const CampaignCreateEditLayout = ({ children }) => {
	const params = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [isLoadingBtn, setLoadingBtn] = useState(false);
	const [type, setType] = useState("CREATE");

	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);
	const campaignsArray = useSelector(
		(state) => state.campaign.campaignsArray
	);

	const current_fb_id = localStorage.getItem("fr_default_fb");

	// CAMPAIGN NAME STATE..
	const [campaignName, setCampaignName] = useState({
		value: "",
		placeholder: "Ex. Word Boost",
		isError: false,
		errorMsg: "",
	});

	// SELECT MESSAGE SATES..
	const [groupMessages, setGroupMessages] = useState([]);
	const [groupMsgSelect, setGroupMsgSelect] = useState(null);
	const [quickMsg, setQuickMsg] = useState(null);

	const [selectMessageOptionOpen, setSelectMessageOptionOpen] = useState(false);
	const [quickMsgModalOpen, setQuickMsgModalOpen] = useState(false);
	const [usingSelectOption, setUsingSelectOption] = useState(false);
	const [unselectedError, setUnselectedError] = useState(false);

	useEffect(() => {
		if (quickMsg) {
			setUsingSelectOption(false);
		}
	}, [quickMsg]);

	// MESSAGE LIMIT/24HR STATE..
	const [msgLimit, setMsgLimit] = useState(100);

	// END DATE & TIME STATE..
	const [showEndDateAndTime, setShowEndDateAndTime] = useState(false);
	const [endDateAndTime, setEndDateAndTime] = useState({
		value: '',
		placeholder: "Choose data & time",
		isError: false,
		errorMsg: '',
	});

	// TIME DELAY..
	const [timeDelay, setTimeDelay] = useState(3);

	// TIME DELAYS..
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

	// RANDOM COLORS PICKED FOR CAMPAIGN CREATION..
	const getRandomCampaignColor = () => {
		const randomColors = [
			"#C0A9EB",
			"#9FC999",
			"#95D6D4",
			"#E0A8B8",
			"#92B0EA",
			"#D779D9",
			"#CFC778",
			"#8A78CF",
			"#CF7878",
			"#F2C794",
		];
		const randomIndex = Math.floor(Math.random() * randomColors.length);
		return randomColors[randomIndex];
	};

	// TIME DELAY..
	const onChangeTimeDelay = (event) => {
		setTimeDelay(event.target.value);
	};

	// HANDLE CAMPAIGNS NAME FUNCTION..
	const handleCampaignName = (event) => {
		// event.preventDefault();
		const value = event.target.value;
		setCampaignName({ ...campaignName, value });
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

	// TRANCATE AND ELLIPSIS TEXT..
	const truncateAndAddEllipsis = (stringText, maxLength) => {
		if (stringText.length >= maxLength) {
			return stringText;
		} else {
			let truncatedString = stringText.substring(0, maxLength);
			return truncatedString + '...';
		}
	};

	// HANDLE THE BLUR EFFECT'S VALIDATION FOR TEXT FIELDS..
	const handleBlurValidationOnTextField = (event) => {
		const value = event.target.value.trim();

		if (value.length < 1) {
			setCampaignName({ ...campaignName, isError: true, errorMsg: "Enter campaign name" });
		} else {
			setCampaignName({ ...campaignName, isError: false, errorMsg: "" });
		}

		if (value.length > 40) {
			setCampaignName({ ...campaignName, value: value.slice(0, 40) + '...' });
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

	// SWITCH BUTTON OF END DATE AND TIME HANDLE..
	const handleSwitchBtnEndDateAndTime = () => {
		setShowEndDateAndTime(!showEndDateAndTime);

		if (!showEndDateAndTime) {
			setEndDateAndTime({ ...endDateAndTime, isError: false, errorMsg: '' });
		}
	};

	// HANDLE END DATE AND TIME VALUE ON CHANGE..
	const handleChangeEndDateAndTime = (event) => {
		const value = event.target.value;
		const parsedDate = moment(value);
		const formattedDate = parsedDate.format("YYYY-MM-DD HH:mm:ss");
		setEndDateAndTime({ ...endDateAndTime, value: formattedDate });
	};

	// VALIDATION ON END DATE AND TIME ON BLUR EVENT..
	const handleBlurEndDateAndTime = (event) => {
		const value = event.target.value?.trim();

		if (showEndDateAndTime) {
			if (value?.length === 0) {
				setEndDateAndTime({ ...endDateAndTime, isError: true, errorMsg: 'Blank not allowed' });
			} else {
				setEndDateAndTime({ ...endDateAndTime, isError: false, errorMsg: '' });
			}
		}
	};


	// CREATE/UPDATE CAMPAIGN FUNCTION..
	const campaignAddOrUpdateRequestToAPI = async (type, payload, setLoadingBtn) => {
		if (!payload?.schedule || payload?.schedule?.length === 0) {
			Alertbox("Please ensure that you schedule your campaign for at least one specific time before saving.",
				"error",
				1000,
				"bottom-right",
				"",
				"Opps!"
			);
			setLoadingBtn(false);
			return false;
		}

		if (campaignsArray?.length) {
			if (type === "CREATE") {
				const campaignExistsCheck = campaignsArray.findIndex((campaign) => campaign?.campaign_name?.trim()?.toLowerCase() === payload?.campaignName?.trim()?.toLowerCase());

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

			if (type === "CREATE") {
				response = await dispatch(createCampaign(payload)).unwrap();
			}
			if (type === "EDIT") {
				response = await dispatch(updateCampaign(payload)).unwrap();
			}

			if (response?.data?.length === 0) {
				Alertbox("The campaign name is already in use, please try a different name.", "error", 1000, "bottom-right");
				setLoadingBtn(false);
			} else {
				Alertbox(`${response?.message}`, "success", 1000, "bottom-right");
				setLoadingBtn(false);
				navigate("/messages/campaigns");
			}

		} catch (error) {
			// Handle other unexpected errors
			console.log("Error Catch:", error);
			Alertbox(
				error?.message,
				"error",
				1000,
				"bottom-right"
			);
			setLoadingBtn(false);
		}
	};


	// TRANSFORM CAMPAIGN SCHEDULES PROPERTY INTO THE OBJECT FOR API PAYLOAD..
	const transformCampaignSchedulesPayload = (schedules = []) => {
		const transformSchedules = [];
		schedules && schedules?.length &&
			schedules.forEach((schedule) => {
				// const fromTime = moment(schedule.start).format("YYYY-MM-DD HH:mm:ss");
				// const toTime = moment(schedule.end).format("YYYY-MM-DD HH:mm:ss");
				const fromTime = moment(schedule.start).format("HH:mm:ss");
				const toTime = moment(schedule.end).format("HH:mm:ss");
				const day = moment(schedule.start).format("dddd");
				if (schedule.isSaved) {
					transformSchedules.push({
						day,
						from_time: fromTime,
						to_time: toTime,
					});
				}
			});

		return transformSchedules;
	};

	// GETTING OLDER MESSAGE GROUP ID.. (FOR EDIT CAMPAIGN ONLY)
	const getOldMessageGroupId = () => {
		return localStorage.getItem("old_message_group_id_campaign") ? localStorage.getItem("old_message_group_id_campaign") : '';
	};

	// HANDLE SAVED DATA FROM CHILD..
	const handleSavedData = (type, data, setLoadingBtn = () => null) => {
		const transformCampaignSchedules = transformCampaignSchedulesPayload(campaignSchedule);
		const payload = {
			...data,
			fbUserId: current_fb_id,
			schedule: transformCampaignSchedules || [],
		};
		campaignAddOrUpdateRequestToAPI(type, payload, setLoadingBtn);
	};

	// HANDLE CLICK ON THE SAVE CAMPAIGNS..
	const handleClickToSaveCampaign = (event) => {
		event.preventDefault();
		if (!isLoadingBtn) {
			setLoadingBtn(true);

			// VALIDATE THE FORM, (SELECT GROUP MESSAGE)
			if (!groupMsgSelect?._id && quickMsg === null) {
				setUnselectedError(true);
				setLoadingBtn(false);
				return false;
			}

			// VALIDATION THE FORM, (END DATE AND TIME)
			if (showEndDateAndTime && endDateAndTime?.value?.trim() === "") {
				setEndDateAndTime({
					...endDateAndTime,
					isError: true,
					errorMsg: "Blank not allowed",
				});
				setLoadingBtn(false);
				return false;
			}

			const campaignData = {
				campaignName: campaignName?.value,
				messageGroupId: groupMsgSelect?._id,
				quickMessage: quickMsg,
				messageLimit: msgLimit,
				campaignEndTimeStatus: showEndDateAndTime,
				campaignEndTime: endDateAndTime?.value ? new Date(endDateAndTime?.value) : '',
				campaignStatus: false,
				timeDelay: timeDelay,
				campaignLabelColor: getRandomCampaignColor(),
			};

			if (type === "EDIT") {
				campaignData.campaignId = params?.campaignId;

				// For Edit Campaign Needs the Status to be as it as..
				// delete campaignData.campaignStatus;
				const findTheCampaign =
					campaignsArray?.length &&
					campaignsArray.find(
						(campaign) => campaign?.campaign_id === params?.campaignId
					);
				campaignData.campaignStatus = findTheCampaign?.status;

				campaignData.oldMessageGroupId = getOldMessageGroupId();
			}

			// TRANSFERING DATA..
			handleSavedData(type, campaignData, setLoadingBtn);
		}
	};

	// CAMPAIGN EDIT / UPDATE CANCEL..
	const handleClickToCancelEditCampaign = (_event) => {
		navigate("/messages/campaigns");
	};

	// CHECK MESSAGE GROUP SAVING OLDER GROUP..
	const setOldMessageGroupId = (messageGroupId) => {
		localStorage.setItem("old_message_group_id_campaign", messageGroupId);
	};

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

	// UPDATE THE SCHEDULAR WITH SPECIFIC CAMPAIGNS DATA..
	const updateSchedularOfCalender = (
		scheduleData,
		nameOfCampaign,
		colorOfCampaign
	) => {
		const schedule =
			scheduleData?.length &&
			scheduleData.map((sched) => {
				const date = moment(
					weekdaysArr.find((item) => item.day === sched.day).date
				).format("MMMM DD, YYYY");
				const id = params?.campaignId;
				const color = colorOfCampaign;
				const title = nameOfCampaign;
				const start = new Date(`${date} ${sched?.from_time}`);
				const end = new Date(`${date} ${sched?.to_time}`);
				const isSaved = true;
				const isEditMode = true;

				return { id, color, title, start, end, isSaved, isEditMode };
			});

		dispatch(updateCampaignSchedule(schedule));
	};

	/**
	 * SYNC FOR EDIT / UPDATE CAMPAIGN DATA..
	 */
	const fetchCampaignDetails = async () => {
		try {
			const res = await fetchCampaign({ fbUserId: current_fb_id, campaignId: params?.campaignId });
			const data = res?.data;

			if (data && data.length) {
				const campaignData = data[0];

				dispatch(updateCampaignDetails(campaignData));

				setCampaignName({ ...campaignName, value: campaignData?.campaign_name });

				if (campaignData?.message_group_id) {
					// Fetching the group from the id here..
					fetchGroupMessage(campaignData?.message_group_id);
				}

				if (campaignData?.quick_message) {
					setQuickMsg(campaignData?.quick_message);
				}

				if (campaignData?.campaign_end_time) {
					const formatEndTime = moment(campaignData.campaign_end_time).format("YYYY-MM-DD HH:mm:ss");
					setEndDateAndTime({ ...endDateAndTime, value: formatEndTime });
				}

				if (campaignData?.campaign_end_time_status) {
					setShowEndDateAndTime(campaignData.campaign_end_time_status);
				}

				if (campaignData?.time_delay) {
					setTimeDelay(campaignData.time_delay);
				}

				if (campaignData?.message_limit) {
					setMsgLimit(campaignData?.message_limit);
				}

				// Have to setting the Schedule from here..
				if (campaignData?.schedule?.length) {
					updateSchedularOfCalender(campaignData?.schedule, campaignData?.campaign_name, campaignData?.campaign_label_color);
				}
			}

		} catch (error) {
			// Handle other unexpected errors
			console.log("Error Catch:", error);
			Alertbox("An unexpected error occurred. Please try again later.", "error", 1000, "bottom-right");
		}
	};

	// HANDLE THE DIFFERENT SELECT OPTION ON ONE COMPONENT AS KEEP ONLY ONE AT A TIME..
	useEffect(() => {
		const selectMsgUsing = localStorage.getItem("fr_using_campaigns_message");

		if (quickMsg && !selectMsgUsing) {
			setGroupMsgSelect(null);
		}
		if (selectMsgUsing) {
			setQuickMsg(null);
		}

	}, [groupMsgSelect, quickMsg]);

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

			return () => {
				localStorage.removeItem("fr_edit_mode_quickCampMsg");
				localStorage.removeItem("fr_quickMessage_campaigns_message");
			};
	}, []);

	useEffect(() => {
		if (params && params?.campaignId) {
			console.log("FB USER ID -- ", current_fb_id, " - CAMPAIGN ID -- ", params?.campaignId);
			setType("EDIT");
			fetchCampaignDetails();
		}
	}, [params]);

	// DISABLE SAVED BUTTON ACCORDING TO FIELDS ARE REQUIRED..
	const disableSubmit = () => {
		const name = campaignName?.value?.trim();
		const groupMsg = groupMsgSelect?._id;

		if (name === '' || (!groupMsg && quickMsg === null) || campaignSchedule?.length === 0) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<div className='campaigns-edit d-flex d-flex-column'>
			{/* CAMPAIGN CREATE/VIEW EVENT MODAL COMPONENT */}
			{/* <CampaignModal type="VIEW_DETAILS" open={true} /> */}

			{/* CAMPAIGNS CREATE/EDIT FORM INPUT TOP SECTION */}
			<div className='campaigns-edit-inputs'>
				<div className='campaigns-input campaign-name-field'>
					<label>Campaign name</label>

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
						<span className='text-red'>{campaignName?.errorMsg}</span>
					)}
				</div>

				<div className='campaigns-input campaign-message-field'>
					<label>Select message</label>

					<DropSelectMessage
						type='CAMPAIGNS_MESSAGE'
						openSelectOption={selectMessageOptionOpen}
						handleIsOpenSelectOption={setSelectMessageOptionOpen}
						groupList={groupMessages}
						groupSelect={groupMsgSelect}
						setGroupSelect={setGroupMsgSelect}
						quickMessage={quickMsg && quickMsg}
						setQuickMessage={setQuickMsg}
						quickMsgModalOpen={quickMsgModalOpen}
						setQuickMsgOpen={setQuickMsgModalOpen}
						isDisabled={false}
						usingSelectOptions={usingSelectOption}
						setUsingSelectOptions={setUsingSelectOption}
						unselectedError={unselectedError}
						setUnselectedError={setUnselectedError}
						customWrapperClass='campaigns-select-msg-wrapper'
						customSelectPanelClass='campaigns-select-panel'
						customSelectPanelPageClass='campaigns-select-panel-page'
						customQuickMsgTooltipStyleClass='campaigns-quick-msg-tooltip'
					/>
				</div>

				<div className='campaigns-input campaign-time-field w-200'>
					<label>Time delay</label>

					<DropSelector
						selects={timeDelays}
						// id='start-time-span'
						value={timeDelay}
						defaultValue={
							timeDelays?.find((el) => el.value === timeDelay)?.value
						}
						extraClass='campaigns-time-delay-bar tinyWrap'
						height='40px'
						width='inherit'
						handleChange={onChangeTimeDelay}
					/>
				</div>

				<div className='campaigns-input campaign-limit-field w-200'>
					<label>Message limit/24hr</label>

					<NumberRangeInput
						value={msgLimit}
						handleChange={(event) => setMsgLimit(event.target.value)}
						handleBlur={handleMessageLimitOnBlur}
						setIncrementDecrementVal={incrementDecrementVal}
						customStyleClass='campaigns-num-input'
					/>
				</div>

				<div className='campaigns-input campaign-end-field'>
					<label
						className={`d-flex ${!showEndDateAndTime
							? "campaigns-end-dateTime-label"
							: "campaigns-end-dateTime-label-enabled"
							}`}
					>
						<Switch
							// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
							checked={showEndDateAndTime}
							handleChange={handleSwitchBtnEndDateAndTime}
							smallVariant
						/>

						<span className="campaign-end-datetime-span">End date & time</span>


						<span className="campaigns-input-tooltip">
							<Tooltip
								type="info"
								customWidth={200}
								iconColor={"#313037"}
								textContent="The campaign will automatically deactivate at the specified date and time."
							/>
						</span>

					</label>

					<input
						type='datetime-local'
						className={`campaigns-datetime-select ${endDateAndTime?.isError ? 'campaigns-error-input-field' : ''}`}
						value={endDateAndTime?.value}
						style={{
							visibility: !showEndDateAndTime ? "hidden" : "visible",
						}}
						onChange={handleChangeEndDateAndTime}
						onBlur={handleBlurEndDateAndTime}
						placeholder={endDateAndTime?.placeholder}
					/>

					{endDateAndTime?.isError && showEndDateAndTime && (
						<span className='text-red'>{endDateAndTime?.errorMsg}</span>
					)}
				</div>
			</div>

			{/* CAMPAIGNS CALENDERS SECTION MIDDLE */}
			<div className='create-campaign-scheduler-container'>{children}</div>

			{/* CAMPAIGNS SAVE OR CANCEL BUTTONS BOTTOM SECTION */}
			<div className='campaigns-save-buttons-container'>
				<button className='btn btn-grey' onClick={handleClickToCancelEditCampaign}>Cancel</button>

				<button
					className={`btn ${isLoadingBtn ? "campaign-loading-save-btn" : ""}`}
					onClick={handleClickToSaveCampaign}
					disabled={disableSubmit() || unselectedError || (showEndDateAndTime && endDateAndTime?.isError)}
				>
					{isLoadingBtn ? type === "EDIT" ? "Updating..." : "Saving..." : "Save campaign"}
				</button>
			</div>
		</div>
	);
};

export default React.memo(CampaignCreateEditLayout);
