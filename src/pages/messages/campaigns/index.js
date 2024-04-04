import { lazy, Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAllCampaigns,
	fetchCampaignById, 
	updateCampaignsArray,
	syncCampaignStatus,
	updateCampaignFilter,
	updateCampaignDuration,
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


const CampaignsCalendar = lazy(() => import("components/messages/campaigns/CampaignsCalendar"))
const CampaignsListingPage = lazy(() => import("./list/CampaignsListingPage"))

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
	// {
	// 	value: "week",
	// 	label: "Week",
	// 	selected: true,
	// },
	{
		value: "today",
		label: "Today",
		selected: false,
	},
	{
		value: "all",
		label: "All",
		selected: true,
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
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.campaign.isLoading);
	const campaignsCreated = useSelector(
		(state) => state.campaign.campaignsArray
	);
	const campaignsDetails = useSelector((state) => state.campaign.campaignsDetails);
	const editing = useSelector((state) => state.campaign.editingCampaign)
	const campaignsFilter = useSelector((state) => state.campaign.campaignFilter)
	const campaignDuration = useSelector((state) => state.campaign.campaignDuration)
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
			dispatch(fetchAllCampaigns())
				.unwrap()
				.then((res) => {
					console.log('res', res);
					dispatch(countCurrentListsize(res?.length ? res?.length : 0))
				});
			if (location?.pathname?.split("/")?.slice(-2)[0] === 'campaigns' && params?.campaignId) {
				const response = await dispatch(fetchCampaignById({
					fbUserId: localStorage.getItem("fr_default_fb"),
					campaignId: params?.campaignId
				})).unwrap()
			}
		} catch (error) {
			Alertbox(`${error} `, "error", 3000, "bottom-right");
		}
	};

	// UPDATING CAMPAIGNS LIST SIZE IN FRIEND LIST..
	useEffect(() => {
		if (campaignsCreated && campaignsCreated?.length === 0) {
			dispatch(countCurrentListsize(campaignsCreated?.length));
		}
	}, [campaignsCreated]);

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
				selected: e.value != el ? false : true,
			}))
		);

		dispatch(updateCampaignDuration(el))

		filterCampaigns();
	};

	// TOGGLE ACTIVE / INACTIVE CAMPAIGNS FOR CAMPAIGNS LIST
	const changeStatusView = (el) => {
		dispatch(syncCampaignStatus());
		setStatusOption((prevStatus) =>
			prevStatus?.map((e) => ({
				...e,
				selected: e.value != el ? false : true,
			}))
		);

		dispatch(updateCampaignFilter(el))
		filterCampaigns();
	};

	// TOGGLE EDIT CAMPAIGNS PAGE VIEW
	const changeEditView = (el) => {
		console.log('el', el);
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
			// Alertbox(
			// 	`The campaign has been successfully turned ${checkedValue ? "ON" : "OFF"
			// 	}`,
			// 	"success",
			// 	3000,
			// 	"bottom-right"
			// );
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
		let campaignsResult = campaignsCreated
		const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		// console.log('campaignsFilter CHANGED', campaignsFilter);

		// Check for campaign status
		switch (campaignsFilter) {
			case "active":
				campaignsResult = [...campaignsResult?.filter((el) => el?.status)]
				break;

			case "inactive":
				campaignsResult = [...campaignsResult?.filter((el) => !el?.status)]
				break;

			default:
				campaignsResult = [...campaignsResult];
				break;
		}

		// Check for campaign time span
		switch (campaignDuration) {
			case "today":
				campaignsResult = [...campaignsResult?.filter(el => el?.schedule?.filter(ex => ex?.day === week[new Date().getDay()])?.length && ({...el, schedule: [...el?.schedule?.filter(ex => ex?.day === week[new Date().getDay()])]}))]
				console.log('campaignsResult >>>>>', campaignsResult);
				break;

			default:
				campaignsResult = [...campaignsResult];
		}

		campaignsResult && dispatch(countCurrentListsize(campaignsResult?.length));
		return campaignsResult && campaignsResult;
	};

	// FILTER CAMPAIGNS (TODAY, ALL)..
	// const filterCampaignsBySpan = () => {
	// 	let campaignsResult = [...campaignsCreated];

	// 	switch (spanOption?.find(e => e.selected)?.value) {
	// 		case "today":
	// 			campaignsResult = campaignsResult?.filter((el) => new Date(el?.created_at).getDate() == new Date().getDate());
	// 			break;

	// 		default:
	// 			campaignsResult = campaignsResult;
	// 	}

	// 	campaignsResult && dispatch(countCurrentListsize(campaignsResult?.length));
	// 	return campaignsResult && campaignsResult;
	// }

	// UPDATE REDUX CAMPAIGNS ARRAY ON EDITED CAMPAIGN MODIFIED
	useEffect(() => {
		// console.log("isEditingCampaign", isEditingCampaign);

		if (isEditingCampaign) {
			// console.log("isEditingCampaign", isEditingCampaign);
			// console.log('isEditingCampaign CHANGED', isEditingCampaign);
			let campaignsCreatedPlaceholder = [...campaignsCreated];
			// console.log('campaignsCreatedPlaceholder', campaignsCreatedPlaceholder);
			campaignsCreatedPlaceholder = campaignsCreatedPlaceholder?.map((el) =>
				el?.campaign_id !== isEditingCampaign?.campaign_id
					? { ...el }
					: { ...isEditingCampaign }
			);

			dispatch(updateCampaignsArray(campaignsCreatedPlaceholder));
			// console.log('campaignsCreatedPlaceholder CHANGED', campaignsCreatedPlaceholder);
		}
	}, [isEditingCampaign]);

	useEffect(() => {
		if (editing) {
			if (editing?.friends?.length > 0) {
				setIsEditingCampaign(editing)
			} else {
				setIsEditingCampaign({ ...editing, friends: [] })
			}
			// console.log('editing--->>>> ', editing);
			if (editing && editing?.quick_message) {
				localStorage.setItem("fr_quickMessage_campaigns_message", editing?.quick_message?.__raw);
			}
			localStorage.setItem("fr_edit_mode_quickCampMsg", true);
		}
	}, [editing]);

	// useEffect(() => {
	// 	if (location?.pathname?.split("/")?.slice(-1)[0] === "create-campaign") {
	// 		localStorage.removeItem("fr_quickMessage_campaigns_message");
	// 		setIsEditingCampaign({ ...editing, quick_message: null });
	// 	}
	// }, [location.pathname]);

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

		return () => {
			dispatch(updateCampaignDuration(null));
			dispatch(updateCampaignFilter(null));
		};
	}, [location.pathname, radioOption]);

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
								!campaignsCreated || filterCampaigns()?.length <= 0 ? (
									<NoDataFound
										customText={`No campaign(s) has been created yet`}
									/>
								) : (
									<Suspense fallback=''>
										<CampaignsListingPage
											campaignsCreated={filterCampaigns()}
											setIsEditingCampaign={setIsEditingCampaign}
										/>
									</Suspense>
								)
							) : (
								<Suspense fallback=''>
									<CampaignsCalendar
										campaignsCreated={filterCampaigns()}
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
