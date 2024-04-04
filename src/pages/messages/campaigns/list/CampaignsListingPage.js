import { memo, useEffect, useState } from "react";

import { updateCampaignsArray, deleteCampaign, syncCampaignStatus } from "actions/CampaignsActions";
import {
	CampaignNameCellRenderer,
	CampaignStatusCellRenderer,
	CampaignFriendsCountCellRenderer,
	CampaignScheduleCellRenderer,
	CampaignEndTimeCellRenderer,
	CampaignContextMenuCellRenderer,
	CampaignFriendsPendingCellRenderer,
} from "../../../../components/messages/campaigns/CampaignListingColumns";
import Listing from "../../../../components/common/Listing";
import Modal from "components/common/Modal";
import { DangerIcon } from "assets/icons/Icons";
import { useDispatch } from "react-redux";
import Alertbox from "components/common/Toast";
import extensionAccesories from "../../../../configuration/extensionAccesories"
const CampaignsListingPage = ({ campaignsCreated, setIsEditingCampaign }) => {
	const dispatch = useDispatch();
	const [isReset, setIsReset] = useState(null);
	const [isCampaignDeleteModalOpen, setCampaignDeleteModalOpen] = useState(false);
	const [campaignId, setCampaignId] = useState("");

	useEffect(() => {
		dispatch(syncCampaignStatus());
	}, [])

	// list ref for campaigns list page
	const campaignsListingRef = () => [
		{
			field: "campaign_name",
			headerName: "Campaign name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			cellRendererParams: {
				setIsEditingCampaign,
			},
			lockPosition: "left",
			cellRenderer: CampaignNameCellRenderer,
			headerClass: "campaign-name-header",
			sortable: true,
			comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
				if (valueA?.toLowerCase() == valueB?.toLowerCase()) return 0;
				return (valueA?.toLowerCase() > valueB?.toLowerCase()) ? 1 : -1;
			}
		},
		{
			field: "status",
			headerName: "Status ",
			cellRendererParams: {
				setIsEditingCampaign,
			},
			cellRenderer: CampaignStatusCellRenderer,
			headerClass: "campaign-status-header",
			sortable: false,
		},
		{
			field: "friends_added",
			headerName: "Friends added",
			cellRenderer: CampaignFriendsCountCellRenderer,
			headerClass: "campaign-friends-header",
		},
		{
			field: "friends_pending",
			headerName: "Pending",
			cellRenderer: CampaignFriendsPendingCellRenderer,
			headerClass: "campaign-pending-header",
		},
		{
			field: "_id",
			headerName: "Scheduled on",
			cellRenderer: CampaignScheduleCellRenderer,
			headerClass: "campaign-schedule-header",
			sortable: false,
		},
		{
			field: "campaign_end_time",
			headerName: "End date & time",
			cellRenderer: CampaignEndTimeCellRenderer,
			headerClass: "campaign-time-header",
			sortable: false,
		},
		{
			headerName: "",
			cellRenderer: CampaignContextMenuCellRenderer,
			headerClass: "campaign-contextMenu-header",
			suppressSorting: true,
			sortable: false,
			resizable: false,
			lockPosition: "right",
			cellRendererParams: {
				isCampaignDeleteModalOpen,
				setCampaignDeleteModalOpen,
				setCampaignId,
			},
		},
	];

	// DELETE CAMPAIGN API REQUEST..
	const campaignDeleteAPIReq = async (id) => {
		try {
			const response = await dispatch(
				deleteCampaign([{ campaignId: id }])
			).unwrap();

			if (response?.data) {
				setCampaignDeleteModalOpen(false);
				extensionAccesories.sendMessageToExt({
					action: "update_schedules"
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

	useEffect(() => {
		console.log('CHANGED IN CAMPAIGN ::::', campaignsCreated);
	}, [campaignsCreated]);

	return (
		<div className='campaigns-listing h-100 d-flex d-flex-column'>
			<Modal
				modalType='DELETE'
				headerText={"Delete"}
				bodyText={"Are you sure you want to delete ?"}
				open={isCampaignDeleteModalOpen}
				setOpen={setCampaignDeleteModalOpen}
				ModalFun={() => {
					campaignDeleteAPIReq(campaignId);
				}}
				btnText={"Yes, Delete"}
				ModalIconElement={() => <DangerIcon />}
				additionalClass={`campaign-view-details-delete-modal`}
			/>
			{/* <CampaignsListing
                campaignsData={campaignsCreated}
                campaignsListingRef={campaignsListingRef}
            /> */}
			<Listing
				friendsData={campaignsCreated}
				friendsListingRef={campaignsListingRef}
				getFilterNum={campaignsCreated?.length}
				reset={isReset}
				setReset={setIsReset}
				isListing='campaign'
			/>
		</div>
	);
};

export default memo(CampaignsListingPage);
