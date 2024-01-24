import React, { useState, useEffect } from "react";
import DropSelectMessage from "components/messages/DropSelectMessage";
import NumberRangeInput from "components/common/NumberRangeInput";
import Switch from "components/formComponents/Switch";
import DropSelector from "components/formComponents/DropSelector";
import { fetchGroups } from "actions/MessageAction";
import { useDispatch } from "react-redux";
import moment from "moment";

const CampaignCreateEditLayout = ({ children, ...rest }) => {
	const dispatch = useDispatch();
	// COLLECTING THE REST PROPS ITEMS..
	const { type = "CREATE" || "EDIT", handleClickSaveForm } = rest;

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
	const [groupMsgSelect, setGroupMsgSelect] = useState(null);
	const [quickMsg, setQuickMsg] = useState(null);

	const [selectMessageOptionOpen, setSelectMessageOptionOpen] = useState(false);
	const [quickMsgModalOpen, setQuickMsgModalOpen] = useState(false);
	const [usingSelectOption, setUsingSelectOption] = useState(false);
	const [unselectedError, setUnselectedError] = useState(false);

	// MESSAGE LIMIT/24HR STATE..
	const [msgLimit, setMsgLimit] = useState(100);

	// END DATE & TIME STATE..
	const [showEndDateAndTime, setShowEndDateAndTime] = useState(false);
	const [endDateAndTime, setEndDateAndTime] = useState("");

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

	// HANDLE END DATE AND TIME VALUE ON CHANGE..
	const handleChangeEndDateAndTime = (event) => {
		const value = event.target.value;
		const parsedDate = moment(value);
		const formattedDate = parsedDate.format("YYYY-MM-DD HH:mm:ss");
		setEndDateAndTime(formattedDate);
	};

	// HANDLE CLICK ON THE SAVE CAMPAIGNS..
	const handleClickToSaveCampaign = (event) => {
		event.preventDefault();
		if (!isLoadingBtn) {
			setLoadingBtn(true);

			// VALIDATE THE FORM..
			if (!groupMsgSelect?._id && quickMsg === null) {
				setUnselectedError(true);
				setLoadingBtn(false);
				return false;
			}

			// TRANSFERING DATA..
			handleClickSaveForm(
				{
					campaignName: campaignName?.value,
					messageGroupId: groupMsgSelect?._id,
					quickMessage: quickMsg,
					messageLimit: msgLimit,
					campaignEndTimeStatus: showEndDateAndTime,
					campaignEndTime: endDateAndTime,
					timeDelay: timeDelay,
					campaignLabelColor: getRandomCampaignColor(),
				},
				setLoadingBtn
			);
		}
	};

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
						className={`campaigns-name-field ${
							campaignName?.isError ? "campaigns-error-input-field" : ""
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
						quickMessage={quickMsg}
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
						defaultValue={
							timeDelays?.find((el) => el.value === timeDelay)?.value
						}
						extraClass='campaigns-time-delay-bar'
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
						className={`d-flex ${
							!showEndDateAndTime
								? "campaigns-end-dateTime-label"
								: "campaigns-end-dateTime-label-enabled"
						}`}
					>
							<Switch
								// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
								checked={showEndDateAndTime}
								handleChange={() => setShowEndDateAndTime(!showEndDateAndTime)}
								smallVariant
							/>

						<span>End date & time</span>
					</label>

					<input
						type='datetime-local'
						className='campaigns-datetime-select'
						value={endDateAndTime}
						style={{
							visibility: !showEndDateAndTime ? "hidden" : "visible",
						}}
						onChange={handleChangeEndDateAndTime}
						placeholder="Choose date & time"
					/>
				</div>
			</div>

			{/* CAMPAIGNS CALENDERS SECTION MIDDLE */}
			<div className='create-campaign-scheduler-container'>{children}</div>

			{/* CAMPAIGNS SAVE OR CANCEL BUTTONS BOTTOM SECTION */}
			<div className='campaigns-save-buttons-container'>
				<button className='btn btn-grey'>Cancel</button>
				<button
					className={`btn ${isLoadingBtn ? "campaign-loading-save-btn" : ""}`}
					onClick={handleClickToSaveCampaign}
					disabled={campaignName.value.trim() === "" || unselectedError}
				>
					{isLoadingBtn ? "Loading..." : "Save campaign"}
				</button>
			</div>
		</div>
	);
};

export default React.memo(CampaignCreateEditLayout);
