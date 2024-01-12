import React, { memo, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
	CreationRenderer,
	KeywordRenderer,
	SourceRendererPending,
	UnlinkedNameCellRenderer,
} from "components/listing/FriendListColumns";
import ListingLoader from "components/common/loaders/ListingLoader";
import {
	CampaignFriendMessageRenderer,
	CampaignFriendStatusRenderer,
} from "components/messages/campaigns/CampaignListingColumns";
import Modal from "components/common/Modal";
import CustomHeaderTooltip from "components/common/CustomHeaderTooltip";
import CampaignScheduler from "components/messages/campaigns/CampaignScheduler";
import CampaignSchedulerPopup from "components/messages/campaigns/CampaignScedulerPopup";

import CampaignCreateEditLayout from "../layout/CampaignCreateEditLayout";


const EditCampaign = () => {
	const [isEditingCampaign, setIsEditingCampaign, editViews] =
		useOutletContext();
	const [view, setView] = useState(null);
	const [loading, setLoading] = useState(false);
	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);

	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });


	// HANDLE SAVED DATA FROM CHILD..
	const handleSavedData = (data) => {
		console.log("DATA -- ", data);
	};


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

			
				{loading ? <ListingLoader />
					:
					(
						<CampaignCreateEditLayout type="EDIT" handleClickSaveForm={handleSavedData}>
							<div className='create-campaign-scheduler'>
								{showPopup && (
									<CampaignSchedulerPopup
										popupCoordPos={popupCoordPos}
										handleSetShowPopup={(status) => setShowPopup(status)}
									/>
								)}
								<CampaignScheduler
									handleSetShowPopup={(status) => setShowPopup(status)}
									handleSetPopupPos={(pos) => {
										setPopupCoordPos({ x: pos.X, y: pos.Y });
									}}
								/>
							</div>
						</CampaignCreateEditLayout>
					)
				}
			
		</>
	);
};

export default memo(EditCampaign);
