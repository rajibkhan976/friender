import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteCampaign,
	fetchAllCampaigns,
	fetchCampaignById,
	updateCampaignsArray,
	setCampaignDeleteModalOpen,
	syncCampaignStatus,
	updateCampaignFilter,
	updateCampaignDuration,
} from "actions/CampaignsActions";
import { updateCurrlistCount, commonbulkAction, getListData, removeMTRallRowSelection } from "actions/SSListAction";
import extensionAccesories from "../../../configuration/extensionAccesories";

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
import Modal from "components/common/Modal";
import { DangerIcon } from "assets/icons/Icons";
import { CampaignColDef } from "./list/CampaignColDef";
import Listing2 from 'components/common/SSListing/Listing2';
import { campaignColumnDefs } from 'components/common/SSListing/ListColumnDefs/CampaignColDef';
import config from "configuration/config";
import helper from 'helpers/helper';

const CampaignsCalendar = lazy(() =>
	import("components/messages/campaigns/CampaignsCalendar")
);
// const CampaignList = lazy(() => import("./list/CampaignList"));
// const CampaignsListingPage = lazy(() => import("./list/CampaignsListingPage"));

const {
	CampaignName,
	Status,
	FriendsAdded,
	Pending,
	ScheduledOn,
	EndDateNTime,
	Actions
} = CampaignColDef;

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
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.campaign.isLoading);
	const campaignsArray = useSelector(
		(state) => state.campaign.campaignsArray
	);
	const campaignsDetails = useSelector(
		(state) => state.campaign.campaignsDetails
	);
	const editing = useSelector((state) => state.campaign.editingCampaign);
	const campaignFilter = useSelector((state) => state.campaign.campaignFilter);
	const campaignDuration = useSelector(
		(state) => state.campaign.campaignDuration
	);
	const isCampaignDeleteModalOpen = useSelector(
		(state) => state.campaign.isCampaignDeleteModalOpen
	);
	
	const campaignId = useSelector(
		(state) => state.campaign.selectedCampaignId
	);
	const select_all_state = useSelector((state) => state.ssList.selectAcross);
	const selectedListItems = useSelector((state) => state.ssList.selected_friends);
	const filter_state = useSelector((state) => state.ssList.filter_state);
	const listFetchParams = useSelector((state) => state.ssList.listFetchParams);
	const firstRender = useRef(true);


	// const [loading, setLoading] = useState(false);
	const [createNew, setCreateNew] = useState(true);
	const [radioOption, setRadioOption] = useState(radioOptions);
	const [spanOption, setSpanOption] = useState(spanOptions);
	const [statusOption, setStatusOption] = useState(statusOptions);
	const [editViews, setEditViews] = useState(editView);
	const [isEditingCampaign, setIsEditingCampaign] = useState(null); //{isPaused: true}
	const [fb_user_id] = useState(localStorage.getItem("fr_default_fb"));
	const current_fb_id = localStorage.getItem("fr_default_fb");
	const [defaultParams, setDefaultParams] = useState({
		sort_order: "asc"
	});

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}else{
			refreshAndDeselectList(defaultParams)
		}
	}, [defaultParams]);
	const weekDays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const today = new Date();

	const fetchAll = async () => {
		try {
			let urlSearchParamsObject = {sort_order: "asc"};
			const weekDays = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			const today = new Date();

			if (campaignDuration && campaignDuration === "today") {
				Object.assign(urlSearchParamsObject, { campaign_day: weekDays[today.getDay()] });
			}

			if (campaignFilter && campaignFilter === "inactive") {
				Object.assign(urlSearchParamsObject, { campaign_status: 0 });
			} else if (campaignFilter && campaignFilter === "active") {
				Object.assign(urlSearchParamsObject, { campaign_status: 1 });
			}
			
			dispatch(fetchAllCampaigns(urlSearchParamsObject))
			.unwrap()
			.then((resp) => {
				if (resp) {
					dispatch(updateCurrlistCount(resp?.total_campaings));
				}
			});
			
			if (
				location?.pathname?.split("/")?.slice(-2)[0] === "campaigns" &&
				params?.campaignId
			) {
				const response = await dispatch(
					fetchCampaignById({
						fbUserId: localStorage.getItem("fr_default_fb"),
						campaignId: params?.campaignId,
					})
				).unwrap();
			}
		} catch (error) {
			Alertbox(`${error} `, "error", 3000, "bottom-right");
		}
	};

	// fetch clicked campaign
	const fetchCampaign = async (editId) => {
		let editCampaign = campaignsArray?.find((el) => el?._id == editId);

		try {
			if (campaignsDetails) {
				// console.log("SPECIFIC CAMPAIGN DETAILS", campaignsDetails);
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
			// console.log(error);
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

		setDefaultParams((prevState) => {
			if (el === "today") {
				return {...prevState, campaign_day: weekDays[today.getDay()] }
			} else {
				return {...prevState, campaign_day: null }
			}
		});	

		dispatch(updateCampaignDuration(el));

		// filterCampaigns();
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

		setDefaultParams((prevState) => {
			if (el === "inactive") {
				return {...prevState, campaign_status: 0 }
			} else if (el === "active") {
				return {...prevState, campaign_status: 1 }
			}
		});	

		dispatch(updateCampaignFilter(el));
		// filterCampaigns();
	};

	// TOGGLE EDIT CAMPAIGNS PAGE VIEW
	const changeEditView = (el) => {
		// console.log('el', el);
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
			// console.log(error);
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
		let campaignsResult = campaignsArray;
		const week = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		// Check for campaign status
		switch (campaignFilter) {
			case "active":
				campaignsResult = [...campaignsResult?.filter((el) => el?.status)];
				break;

			case "inactive":
				campaignsResult = [...campaignsResult?.filter((el) => !el?.status)];
				break;

			default:
				campaignsResult = [...campaignsResult];
				break;
		}

		// Check for campaign time span
		switch (campaignDuration) {
			case "today":
				campaignsResult = [...campaignsResult?.filter(el => el?.schedule?.filter(ex => ex?.day === week[new Date().getDay()])?.length && ({...el, schedule: [...el?.schedule?.filter(ex => ex?.day === week[new Date().getDay()])]}))]
				// console.log('campaignsResult >>>>>', campaignsResult);
				break;

			default:
				campaignsResult = [...campaignsResult];
		}

		return campaignsResult && campaignsResult;
	};

	// DELETE CAMPAIGN API REQUEST..
	const campaignDeleteAPIReq = async (id) => {
		try {
			const response = await dispatch(
				deleteCampaign([{ campaignId: id }])
			).unwrap();

			if (response?.data) {
				dispatch(setCampaignDeleteModalOpen(false));

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
				dispatch(setCampaignDeleteModalOpen(false));
				Alertbox(`${response?.error?.message}`, "error", 1000, "bottom-right");
			} else {
				dispatch(setCampaignDeleteModalOpen(false));
				Alertbox(
					`Failed to delete the campaign. Please check your input and try again.`,
					"error",
					1000,
					"bottom-right"
				);
			}
		} catch (error) {
			dispatch(setCampaignDeleteModalOpen(false));
			Alertbox(error, "error", 1000, "bottom-right");
		} finally {
			dispatch(setCampaignDeleteModalOpen(false));
		}
	};

	console.log("isEditingCampaign", isEditingCampaign);

	const refreshAndDeselectList = (params) => {
		const payload = {
			queryParam: {...listFetchParams.queryParam, ...params},
			baseUrl: listFetchParams.baseUrl,
			//responseAdapter: props.dataExtractor,
		}
		dispatch(getListData(payload)).unwrap().then((res) => {
			//console.log("list res ",res);
		}).catch((err) => {
			console.log("Error in page header list fetch", err);
		});
		dispatch(removeMTRallRowSelection());
	}

	const triggerBulkOperation = async (bulkType = null) => {
		return new Promise((resolve, reject) => {
			// let payload = assemblePayload(bulkType, config.bulkOperationFriends)
			console.log("THE PARAMS HERE -- ", params);
			let reqBody = {
				// fb_user_id: current_fb_id,
				check: select_all_state?.selected ? 'all' : 'some',
				//include_list: select_all_state?.selected ? [] : [...selectedListItems?.map(el => el?._id)],
				// operation: bulkType === 'skipWhitelisted' ? 'unfriend' : bulkType === 'skipBlacklisted' ? 'campaign' : bulkType,
				// campaign_id: params?.campaignId,
			}

			if (!select_all_state?.selected) {
				reqBody["include_list"] = [...selectedListItems?.map(el => el?._id)];
			}

			if (select_all_state?.selected) {
				reqBody["exclude_list"] = select_all_state?.unSelected?.length > 1 ? [...select_all_state?.unSelected.map(el => el)] : []
			}

			console.log("filter value -- ", filter_state)

			if (filter_state?.filter_key_value?.length > 0) {
				const { values, fields, operators } = helper.listFilterParamsGenerator(
					filter_state?.filter_key_value,
					filter_state?.filter_fun_state
				);
				reqBody["values"] = values;
				reqBody["fields"] = fields;
				reqBody["operators"] = operators;
				reqBody["filter"] = 1;
			}

			const payload ={
				"method": "POST",
				"baseUrl": `${config.deleteCampaignV2Url}`,
				reqBody
			}

				dispatch(commonbulkAction(payload)).unwrap()
					.then((res) => {
						console.log('res IN DISPATH BULK ACTION >>>>  ::::', res);
						// Alertbox(
						// 	bulkType === 'queue' ? res?.data?.message : res?.data,
						// 	"success",
						// 	1000,
						// 	"bottom-right"
						// );
						refreshAndDeselectList();
					})
			
		})
	}

	// Any list specific Methods 
	const tableMethods = {};
	
	const dataExtractor = (response)=>{
		return {
			res: response,
			data: response.data,
			count: response.total_campaings,
		}
	}

	const extraParams = {
		isCampaignList: true,
		removeFriendFromCampaign: triggerBulkOperation
	}

	useEffect(() => {
		// console.log("isEditingCampaign", isEditingCampaign);

		if (isEditingCampaign && campaignsArray && Array.isArray(campaignsArray)) {
			// console.log("isEditingCampaign", isEditingCampaign);
			// console.log('isEditingCampaign CHANGED', isEditingCampaign);
			let campaignsCreatedPlaceholder = [...campaignsArray];
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
				setIsEditingCampaign(editing);
			} else {
				setIsEditingCampaign({ ...editing, friends: [] });
			}
			// console.log('editing--->>>> ', editing);
			if (editing && editing?.quick_message) {
				localStorage.setItem(
					"fr_quickMessage_campaigns_message",
					editing?.quick_message?.__raw
				);
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
		if (radioOption && 
			Array.isArray(radioOption) && 
			radioOption?.length && 
			radioOption.some((item) => item?.label === "calendar" && item?.checked)
		) {
			fetchAll();
		}
	}, [campaignDuration, campaignFilter, location, radioOption]);

	useEffect(() => {
		// dispatch(fetchAllCampaigns({sort_order: "asc"}))
		// .unwrap()
		// .then((resp) => {
		// 	if (resp) {
		// 		dispatch(updateCurrlistCount(resp?.total_campaings));
		// 	}
		// });
		
		return () => {
			dispatch(updateCampaignDuration(null));
			dispatch(updateCampaignFilter(null));
		};
	}, []);

	return (
		<div className='h-100 w-100 d-flex d-flex-column messages-campaign'>
			<Modal
				modalType='DELETE'
				headerText={"Delete"}
				bodyText={"Are you sure you want to delete ?"}
				open={isCampaignDeleteModalOpen}
				setOpen={(status) => dispatch(setCampaignDeleteModalOpen(status))}
				ModalFun={() => {
					campaignDeleteAPIReq(campaignId);
				}}
				btnText={"Yes, Delete"}
				ModalIconElement={() => <DangerIcon />}
				additionalClass={`campaign-view-details-delete-modal`}
			/>
			{/* {loading ? (
				<ListingLoader />
			) : ( */}
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
						campaignsCreated={campaignsArray}
						setIsEditingCampaign={setIsEditingCampaign}
						toggleEditCampaign={toggleEditCampaign}
						fetchCampaign={fetchCampaign}
					/>
					{location?.pathname?.split("/")?.slice(-1)[0] === "campaigns" ? (
						<div className='campaigns-main listing-main'>
							{radioOption?.find((el) => el.checked).label === "listing" ? (
								(
									<Suspense fallback=''>
										{/* <CampaignsListingPage
											campaignsCreated={filterCampaigns()}
											setIsEditingCampaign={setIsEditingCampaign}
										/> */}
										{/* <CampaignList 
											listColDef={() =>[
												CampaignName,
												Status,
												FriendsAdded,
												Pending,
												ScheduledOn,
												EndDateNTime,
												Actions
											]}
											radioOption={radioOption}
										/> */}

										<Listing2 
											listColDef={campaignColumnDefs}
											baseUrl={config.fetchAllCampaignsUrl}
											tableMethods={tableMethods}
											defaultParams={defaultParams}
											dataExtractor={dataExtractor}
											extraParams = {extraParams}

										/>
									</Suspense>
								)
							) : (
								<Suspense fallback=''>
									<CampaignsCalendar
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
			{/* //)} */}
		</div>
	);
};

export default Campaigns;
