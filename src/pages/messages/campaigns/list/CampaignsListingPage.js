import { memo, useContext, useEffect, useState } from "react";
import { CampaignContext } from "../../index";
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

const CampaignsListingPage = ({ campaignsCreated, setIsEditingCampaign }) => {
	const [isReset, setIsReset] = useState(null);
	const { setCampaignViewMode } = useContext(CampaignContext);

	useEffect(() => {
		setCampaignViewMode("campaignList");
	}, []);

	// list ref for campaigns list page
	const campaignsListingRef = () => [
		{
			field: "campaign_name",
			headerName: "Campaign name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			lockPosition: "left",
			cellRenderer: CampaignNameCellRenderer,
			headerClass: "campaign-name-header",
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
			lockPosition: "right",
		},
	];

	useEffect(() => {
		// console.log('CHANGED IN CAMPAIGN ::::', campaignsCreated);
	}, [campaignsCreated]);

	return (
		<div className='campaigns-listing h-100 d-flex d-flex-column'>
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
