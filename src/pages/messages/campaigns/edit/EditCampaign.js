import React, { memo, useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Listing from "../../../../components/common/Listing";
import {
	CreationRenderer,
	KeywordRenderer,
	SourceRendererPending,
	UnlinkedNameCellRenderer,
} from "../../../../components/listing/FriendListColumns";
import ListingLoader from "../../../../components/common/loaders/ListingLoader";
import NoDataFound from "../../../../components/common/NoDataFound";
import {
	CampaignFriendMessageRenderer,
	CampaignFriendStatusRenderer,
} from "../../../../components/messages/campaigns/CampaignListingColumns";
import Modal from "../../../../components/common/Modal";
import CustomHeaderTooltip from "../../../../components/common/CustomHeaderTooltip";
import DropSelectMessage from "../../../../components/messages/DropSelectMessage";
import NumberRangeInput from "../../../../components/common/NumberRangeInput";
import Switch from "../../../../components/formComponents/Switch";

const EditCampaign = () => {
	const [isEditingCampaign, setIsEditingCampaign, editViews] =
		useOutletContext();
	const [view, setView] = useState(null);
	const [isReset, setIsReset] = useState(null);
	const [loading, setLoading] = useState(false);
	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);

	const [campaignName, setCampaignName] = useState("Connect and Win");

	const [selectMessageOptionOpen, setSelectMessageOptionOpen] = useState(false);
	const [groupMsgSelect, setGroupMsgSelect] = useState(null);
	const [quickMsg, setQuickMsg] = useState(null);
	const [quickMsgModalOpen, setQuickMsgModalOpen] = useState(false);
	const [usingSelectOption, setUsingSelectOption] = useState(false);

	const [msgLimit, setMsgLimit] = useState(1);
	const [showEndDataAndTime, setShowEndDataAndTime] = useState(false);

	const campaignFriendsRef = [
		{
			field: "friendName",
			headerName: "Name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			lockPosition: "left",
			cellRenderer: UnlinkedNameCellRenderer,
			headerClass: "campaign-name-header",
		},
		{
			field: "status",
			headerName: "Status ",
			filter: "agTextColumnFilter",
			cellRenderer: CampaignFriendStatusRenderer,
		},
		{
			field: "message",
			headerName: "Message  ",
			cellRenderer: CampaignFriendMessageRenderer,
			enableFilter: false,
		},
		{
			field: "keywords",
			headerName: "Keyword(s)",
			// filter: "agTextColumnFilter",
			cellRendererParams: {
				setKeyWords,
				setModalOpen,
			},
			sortable: true,
			cellRenderer: KeywordRenderer,
		},
		{
			field: "groupName" ? "groupName" : "finalSource",
			headerName: "Source",
			headerTooltip: "Friends source",
			tooltipComponent: CustomHeaderTooltip,
			headerClass: "header-query-tooltip",
			enableFilter: false,
			cellRenderer: SourceRendererPending,
			// lockPosition: "right",
			minWidth: 185,
		},
		{
			field: "created_at",
			headerName: "Friend added date &  time",
			headerTooltip: "Friend added to Campaign Date & Time",
			cellRenderer: CreationRenderer,
			filter: "agDateColumnFilter",
		},
	];

	// Handle Campaign Name function..
	const handleCampaignName = (event) => {
		// event.preventDefault();
		const value = event.target.value;
		setCampaignName(value);
	};

	// Incrementing and decrementing for Message limit/25hr..
	const incrementDecrementVal = (type) => {
		if (type === "INCREMENT") {
			setMsgLimit(Number(msgLimit) + 1);
		}

		if (type === "DECREMENT") {
			setMsgLimit(Number(msgLimit) - 1);
		}
	};

	const RenderEditComponentData = useCallback(() => {
		if (view && isEditingCampaign?.friends) {
			if (view === "view") {
				return (
					<>
						{isEditingCampaign?.friends?.length === 0 ? (
							<NoDataFound
								customText={`Whoops!`}
								additionalText={`We couldn’t find any friends added to this campaign`}
							/>
						) : (
							<Listing
								friendsData={isEditingCampaign?.friends}
								friendsListingRef={campaignFriendsRef}
								getFilterNum={isEditingCampaign?.friends?.length}
								reset={isReset}
								setReset={setIsReset}
								isListing='campaign-friends'
							/>
						)}
					</>
				);
			} else {
				console.log("rendering EDIT now", view);

				return (
					<>
						{/* CAMPAIGNS CREATE/EDIT FORM INPUT TOP SECTION */}
						<div className='campaigns-edit-inputs'>
							<div className='campaigns-input w-250'>
								<label>Campaign name</label>

								<input
									type='text'
									className='campaigns-name-field'
									value={campaignName}
									onChange={handleCampaignName}
								/>
							</div>

							<div className='campaigns-input'>
								<label>Select message</label>

								<DropSelectMessage
									type='ACCEPT_REQ'
									openSelectOption={selectMessageOptionOpen}
									handleIsOpenSelectOption={setSelectMessageOptionOpen}
									groupList={[]}
									groupSelect={groupMsgSelect}
									setGroupSelect={setGroupMsgSelect}
									quickMessage={quickMsg}
									setQuickMessage={setQuickMsg}
									quickMsgModalOpen={quickMsgModalOpen}
									setQuickMsgOpen={setQuickMsgModalOpen}
									isDisabled={false}
									usingSelectOptions={usingSelectOption}
									setUsingSelectOptions={setUsingSelectOption}
									customWrapperClass='campaigns-select-msg-wrapper'
									customSelectPanelClass='campaigns-select-panel'
									customSelectPanelPageClass='campaigns-select-panel-page'
								/>
							</div>

							<div className='campaigns-input w-200'>
								<label>Time delay</label>
								<select className='campaigns-select'>
									<option value='3'>3 min</option>
									<option value='5'>5 min</option>
									<option value='10'>10 min</option>
									<option value='15'>15 min</option>
								</select>
							</div>

							<div className='campaigns-input w-200'>
								<label>Message limit/24hr</label>

								<NumberRangeInput
									value={msgLimit}
									handleChange={(event) => setMsgLimit(event.target.value)}
									setIncrementDecrementVal={incrementDecrementVal}
									customStyleClass='campaigns-num-input'
								/>
							</div>

							<div className='campaigns-input w-220'>
								<label className='d-flex'>
									<div>
										<Switch
											// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
											checked={showEndDataAndTime}
											handleChange={() =>
												setShowEndDataAndTime(!showEndDataAndTime)
											}
											smallVariant
										/>
									</div>

									<span>End date & time</span>
								</label>

								<input
									type='datetime-local'
									className='campaigns-datetime-select'
									style={{
										visibility: !showEndDataAndTime ? "hidden" : "visible",
									}}
								/>
							</div>
						</div>

						{/* CAMPAIGNS CALENDERS SECTION MIDDLE */}
						<div style={{ paddingLeft: "30px" }}>
							<h5>Campaigns Calender</h5>
						</div>

						{/* CAMPAIGNS SAVE OR CANCEL BUTTONS BOTTOM SECTION */}
						<div className='campaigns-save-buttons-container'>
							<button className='btn btn-grey'>Cancel</button>
							<button className='btn'>Save campaign</button>
						</div>
					</>
				);
			}
		}
	}, [
		view,
		isEditingCampaign,
		setMsgLimit,
		msgLimit,
		incrementDecrementVal,
		selectMessageOptionOpen,
		setSelectMessageOptionOpen,
		campaignName,
	]);

	useEffect(() => {
		setView(editViews?.find((el) => el.checked).label);
	}, [editViews]);

	useEffect(() => {
		if (isEditingCampaign) {
			// console.log('GOT TO EDIT ::::', isEditingCampaign);
			setLoading(false);
			if (
				localStorage?.getItem("fr_editCampaign_view") &&
				localStorage?.getItem("fr_editCampaign_view") != "undefined"
			) {
				setView(JSON.parse(localStorage.getItem("fr_editCampaign_view"))?.mode);
			} else {
				setView("view");
				localStorage.setItem(
					"fr_editCampaign_view",
					JSON.stringify({ mode: "view" })
				);
			}
		}

		return () => {
			setIsEditingCampaign(null);
		};
	}, []);

	return (
		<>
			{modalOpen && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Keyword(s)"}
					bodyText={
						<>
							{keyWords?.matchedKeyword?.length > 0 && keyWords?.matchedKeyword
								? keyWords?.matchedKeyword.map((el, i) => (
										<span
											className={`tags positive-tags`}
											key={`key-${i}`}
										>
											{el}
										</span>
								  ))
								: "No specific keyword used"}
						</>
					}
					open={modalOpen}
					setOpen={setModalOpen}
					ModalFun={null}
					btnText={" "}
					modalButtons={false}
					additionalClass='modal-keywords'
				/>
			)}

			<div className='campaigns-edit d-flex d-flex-column'>
				{loading ? <ListingLoader /> : <RenderEditComponentData />}
			</div>
		</>
	);
};

export default memo(EditCampaign);
