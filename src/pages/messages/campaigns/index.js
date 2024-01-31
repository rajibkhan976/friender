import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAllCampaigns,
	fetchCampaignById,
	updateCampaignsArray,
} from "actions/CampaignsActions";
import { countCurrentListsize } from "actions/FriendListAction";

import {
	ListingIcon,
	CampaignsCalendarIcon,
	SettingIconLarge,
	UserIcon,
} from "assets/icons/Icons";

import ListingLoader from "components/common/loaders/ListLoader";
import CampaignsHeader from "components/messages/campaigns/CampaignsHeader";
import NoDataFound from "components/common/NoDataFound";
import Alertbox from "components/common/Toast";
import CreateCampaign from "./create/CreateCampaign";


const CampaignsCalendar = lazy(() =>
	import("components/messages/campaigns/CampaignsCalendar")
);
const CampaignsListingPage = lazy(() => import("./list/CampaignsListingPage"));

// VIEW OPTIONS FOR BASE CAMPAIGN PAGE
const radioOptions = [
	{
		label: "listing",
		checked: true,
		iconItem: <ListingIcon />,
	},
	{
		label: "calendar",
		checked: false,
		iconItem: <CampaignsCalendarIcon />,
	},
];

// FILTER OPTIONS FOR BASE CAMPAIGN PAGE TIME SPAN
const spanOptions = [
	{
		value: "today",
		label: "Today",
		selected: false,
	},
	{
		value: "week",
		label: "Week",
		selected: true,
	},
	{
		value: "all",
		label: "All",
		selected: false,
	},
];

// FILTER OPTIONS FOR BASE CAMPAIGN PAGE ACTIVE STATUS
const statusOptions = [
	{
		value: "all",
		label: "All",
		selected: true,
	},
	{
		value: "active",
		label: "Active",
		selected: false,
	},
	{
		value: "inactive",
		label: "Inactive",
		selected: false,
	},
];

// VIEW OPTIONS FOR EDIT CAMPAIGN PAGE
const editView = [
	{
		label: "view",
		checked: true,
		iconItem: <UserIcon />,
	},
	{
		label: "settings",
		checked: false,
		iconItem: <SettingIconLarge />,
	},
];

const Campaigns = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.campaign.isLoading);
	const campaignsCreated = useSelector(
		(state) => state.campaign.campaignsArray
	);
	const campaignsDetails = useSelector((state) => state.campaign.campaignsDetails);
	// const [loading, setLoading] = useState(false);
	const [createNew, setCreateNew] = useState(true);
	const [radioOption, setRadioOption] = useState(radioOptions);
	const [spanOption, setSpanOption] = useState(spanOptions);
	const [statusOption, setStatusOption] = useState(statusOptions);
	const [editViews, setEditViews] = useState(editView);
	const [isEditingCampaign, setIsEditingCampaign] = useState(null); //{isPaused: true}
	const current_fb_id = localStorage.getItem("fr_default_fb");

	const fetchAll = async () => {
		try {
			dispatch(fetchAllCampaigns());
		} catch (error) {
			Alertbox(`${error} `, "error", 3000, "bottom-right");
		}
	};

	// fetch clicked campaign
	const fetchCampaign = async (editId) => {
		let editCampaign = campaignsCreated?.find((el) => el?._id == editId);

		try {
			if (campaignsDetails) {
				console.log("SPECIFIC CAMPAIGN DETAILS", campaignsDetails);
			}

			// dispatch(fetchCampaignById({ campaignId: editId, fbUserId: current_fb_id }))
			// 	.unwrap()
			// 	.then((res) => {
			// 		if (res) {
			// 			// console.log('fetching Edit item', res?.data);
			// 			editCampaign = { ...editCampaign, ...res?.data[0] };
			// 			console.log("editCampaign >>>>>>>>>>>> ", editCampaign);
			// 			setIsEditingCampaign(editCampaign);
			// 		}
			// 	});
		} catch (error) {
			Alertbox(
				`
                ${error} `,
				"error",
				3000,
				"bottom-right"
			);
		}
	};

	// PAUSE / UNPAUSE CAMPAIGNS
	const changeCampaignsView = (checkThis) => {
		try {
			let radioOptionPlaceholder = radioOption;
			radioOptionPlaceholder = radioOptionPlaceholder?.map((el) =>
				el?.label !== checkThis?.label
					? { ...el, checked: false }
					: { ...checkThis }
			);

			setRadioOption(radioOptionPlaceholder);
		} catch (error) {
			console.log(error);
		}
	};

	// TOGGLE TIME SPAN FOR BASE CAMPAIGN PAGE
	const changeSpanView = (el) => {
		setSpanOption((prevStatus) =>
			prevStatus?.map((e) => ({
				...e,
				selected: e.value != el?.target?.value ? false : true,
			}))
		);
	};

	// TOGGLE ACTIVE / INACTIVE CAMPAIGNS FOR CAMPAIGNS LIST
	const changeStatusView = (el) => {
		setStatusOption((prevStatus) =>
			prevStatus?.map((e) => ({
				...e,
				selected: e.value != el?.target?.value ? false : true,
			}))
		);
		filterCampaigns();
	};

	// TOGGLE EDIT CAMPAIGNS PAGE VIEW
	const changeEditView = (el) => {
		let editViewPlaceholder = [...editViews];
		editViewPlaceholder = editViewPlaceholder.map((item) =>
			item.label === el.label ? { ...el } : { ...item, checked: false }
		);

		setEditViews(editViewPlaceholder);
		localStorage.setItem(
			"fr_editCampaign_view",
			JSON.stringify({
				mode: editViewPlaceholder?.find((el) => el.checked)?.label,
			})
		);
	};

	// TOGGLE A CAMPAIGN ACTIVE >< INACTIVE
	const toggleEditCampaign = (checkedValue) => {
		try {
			setIsEditingCampaign({
				...isEditingCampaign,
				status: checkedValue,
			});
			Alertbox(
				`The campaign has been successfully turned ${checkedValue ? "ON" : "OFF"
				}`,
				"success",
				3000,
				"bottom-right"
			);
		} catch (error) {
			console.log(error);
			Alertbox(
				`
                ${error} `,
				"error",
				3000,
				"bottom-right"
			);
		}
	};

	// FILTER CAMPAIGNS / FRIENDS FROM HEADER
	const filterCampaigns = () => {
		let campaignsResult = [...campaignsCreated];

		// Check for campaign status
		switch (statusOption?.find((e) => e.selected)?.value) {
			case "active":
				campaignsResult = campaignsResult?.filter((el) => el?.campaign_status);
				break;

			case "inactive":
				campaignsResult = campaignsResult?.filter((el) => !el?.campaign_status);
				break;

			default:
				campaignsResult = [...campaignsResult];
				break;
		}

		campaignsResult && dispatch(countCurrentListsize(campaignsResult?.length));
		return campaignsResult;
	};

	// UPDATE REDUX CAMPAIGNS ARRAY ON EDITED CAMPAIGN MODIFIED
	useEffect(() => {
		console.log("isEditingCampaign", isEditingCampaign);

		if (isEditingCampaign) {
			console.log("isEditingCampaign", isEditingCampaign);
			// console.log('isEditingCampaign CHANGED', isEditingCampaign);
			let campaignsCreatedPlaceholder = [...campaignsCreated];
			campaignsCreatedPlaceholder = campaignsCreatedPlaceholder?.map((el) =>
				el?._id !== isEditingCampaign?._id
					? { ...el }
					: { ...isEditingCampaign }
			);

			dispatch(updateCampaignsArray(campaignsCreatedPlaceholder));
			// console.log('campaignsCreatedPlaceholder CHANGED', campaignsCreatedPlaceholder);
		}
	}, [isEditingCampaign]);

	// REMOVE
	useEffect(() => {
		if (
			location?.pathname?.split("/")?.slice(-1)[0] === "create-campaign" ||
			location?.pathname?.split("/")?.slice(-1)[0] === "campaigns"
		) {
			setIsEditingCampaign(null);
		}
	}, [location.pathname]);

	useEffect(() => {
		fetchAll();
	}, []);

	return (
		<div className='h-100 w-100 d-flex d-flex-column messages-campaign'>
			{loading ? (
				<ListingLoader />
			) : (
				<>
					<CampaignsHeader
						radioOptions={radioOption}
						changeCampaignsView={changeCampaignsView}
						spanOptions={spanOption}
						changeSpanView={changeSpanView}
						statusOptions={statusOption}
						changeStatusView={changeStatusView}
						editOptions={editViews}
						changeEditView={changeEditView}
						createNew={createNew}
						isEditingCampaign={isEditingCampaign}
						campaignsCreated={campaignsCreated}
						setIsEditingCampaign={setIsEditingCampaign}
						toggleEditCampaign={toggleEditCampaign}
						fetchCampaign={fetchCampaign}
					/>
					{location?.pathname?.split("/")?.slice(-1)[0] === "campaigns" ? (
						<div className='campaigns-main'>
							{radioOption?.find((el) => el.checked).label === "listing" ? (
								(!campaignsCreated || campaignsCreated?.length <= 0) ? (
									<NoDataFound
										customText={`No campaign(s) has been created yet`}
									/>
								) : (
									<Suspense fallback='Loading Listing View for your Campaigns'>
										<CampaignsListingPage
											campaignsCreated={filterCampaigns}
											setIsEditingCampaign={setIsEditingCampaign}
										/>
									</Suspense>
								)
							) : (!campaignsCreated || campaignsCreated?.length <= 0) ? (
								<NoDataFound
									customText={`No campaign(s) has been created yet`}
								/>
							) : (
								<Suspense fallback='Loading Calendar View for your Campaigns'>
									<CampaignsCalendar
										campaignsCreated={filterCampaigns}
										setIsEditingCampaign={setIsEditingCampaign}
									/>
								</Suspense>
							)}
						</div>
					) : isEditingCampaign ? (
						<Outlet
							key={location.pathname}
							context={[isEditingCampaign, setIsEditingCampaign, editViews]}
						/>
					) : (
						<CreateCampaign />
					)}
				</>
			)}
		</div>
	);
};

export default Campaigns;
