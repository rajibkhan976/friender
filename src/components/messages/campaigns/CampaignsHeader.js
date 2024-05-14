import { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import {
	AddTransparentIcon,
	ChevronLeftArrowIcon,
} from "../../../assets/icons/Icons";
import { useSelector, useDispatch } from 'react-redux';
import { showModal } from "../../../actions/PlanAction";
import Radio from "../../common/Radio";
import DropSelector from "../../formComponents/DropSelector";
import Switch from "../../formComponents/Switch";
import Alertbox from "../../common/Toast";
import { updateCampaignStatus, syncCampaignStatus } from 'actions/CampaignsActions';
import extensionAccesories from "../../../configuration/extensionAccesories";

const CampaignsHeader = ({
	radioOptions,
	changeCampaignsView = null,
	spanOptions, // Today / Week / All
	changeSpanView = null,
	statusOptions, // Active / Inactive / All
	changeStatusView = null,
	editOptions, // list / settings
	changeEditView = null,
	isEditingCampaign,
	campaignsCreated,
	setIsEditingCampaign,
	toggleEditCampaign = null,
	// fetchCampaign,
}) => {
	const location = useLocation();
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const [editCampaign, setEditCampaign] = useState(null);
	const [campaignsStatusActivity, setCampaignsStatusActivity] = useState(false);
	const campaignsDetails = useSelector((state) => state.campaign.campaignsDetails);
	const campaignsArray = useSelector((state) => state.campaign.campaignsArray);

	useEffect(() => {
		dispatch(syncCampaignStatus());
	}, [campaignsStatusActivity]);


	// CAMPAIGN STATUS UPDATE VIA API.. 
	const camapignStatusToggleUpdateAPI = async (campaignId, campaignStatus) => {
		try {
			await dispatch(updateCampaignStatus({ campaignId, campaignStatus })).unwrap();
			extensionAccesories.sendMessageToExt({
				action: "update_schedules"
			});
			Alertbox(
				`The campaign has been successfully turned ${campaignStatus ? "ON" : "OFF"
				}`,
				"success",
				3000,
				"bottom-right"
			);

			setCampaignsStatusActivity(campaignStatus);

			return false;

		} catch (error) {
			// Handle other unexpected errors
			Alertbox(
				error?.message,
				"error",
				1000,
				"bottom-right"
			);
			return false;
		}
	};

	// console.log("LOCAL STATE DATA -- ", location?.state?.data);

	// CAMPAIGN TOGGLE BUTTON SWITCHING..
	const switchPauseCampaign = async (e) => {
		if (
			Number(localStorage?.getItem("fr_plan")?.toLowerCase()) < 3
		) {
			e.preventDefault();
			
			setCampaignsStatusActivity(false)
			dispatch(showModal(true))
			return false
		} else {
			const campaignId = location?.state?.data?._id || location?.state?.data?.campaign_id;

			if (!location?.state?.data?.friends_added || location?.state?.data?.friends_added === undefined
				|| location?.state?.data?.friends_added === null || location?.state?.data?.friends_added === 0) {
				setCampaignsStatusActivity(false);

				Alertbox(
					"This campaign currently has no pending friend(s). To turn on the campaign, please add some friends",
					"warning",
					3000,
					"bottom-right"
				);
				return false;
			}

			if ((location?.state?.data?.friends_added === 0 || location?.state?.data?.friends_pending === 0
				|| location?.state?.data?.campaign_end_time_status
				&& (new Date(location?.state?.data?.campaign_end_time) < new Date()))
				&& e.target.checked) {
				setCampaignsStatusActivity(false);

				Alertbox(
					`${location?.state?.data?.friends_added === 0 || location?.state?.data?.friends_pending === 0
						? "This campaign currently has no pending friend(s). To turn on the campaign, please add some friends"
						: "The campaign you are attempting to turn on has exceeded its end date and time. To proceed, you need to modify the campaign accordingly."
					}`,
					"warning",
					3000,
					"bottom-right"
				);
				return false;

			} else {
				camapignStatusToggleUpdateAPI(campaignId, e.target.checked);
				// extensionAccesories.sendMessageToExt({
				// 	action: "update_schedules"
				//   });
				// We don't need that if we enables that, then toggle is not working..
				// toggleEditCampaign(e.target.checked);
			}
		}
	};

	const resetEditCampaign = () => {
		localStorage.removeItem("fr_editCampaign_view");
	};

	const RenderEditView = useCallback(() => {
		return (
			<Radio
				name='list-type'
				options={editOptions}
				onChangeMethod={changeEditView}
				isIcon={true}
				extraClass='campaigns-view-select m-left-a'
			/>
		);
	}, [editOptions]);

	// TRANCATE AND ELLIPSIS TEXT..
	// const truncateAndAddEllipsis = (stringText, maxLength) => {
	// 	if (stringText?.trim()?.length >= maxLength) {
	// 		let truncatedString = stringText.substring(0, maxLength);
	// 		return truncatedString + '...';
	// 	} else {
	// 		return stringText;
	// 	}
	// };

	// GRAVING THE STATUS OF CAMPAIGNS FOR SHOWING STATUS TOGGLE ON/OFF..
	useEffect(() => {
		if (campaignsDetails) {
			setCampaignsStatusActivity(campaignsDetails?.status);
		}
	}, [campaignsDetails]);


	useEffect(() => {
		// If coming from listing, localstorage will have _id and mode
		if (params?.campaignId) {
			console.log("params CHANGED!!!!");
			if (
				localStorage?.getItem("fr_editCampaign_view") &&
				localStorage?.getItem("fr_editCampaign_view") != "undefined"
			) {
				if (
					JSON.parse(localStorage.getItem("fr_editCampaign_view")).mode !==
					editOptions?.find((el) => el.checked).label
				) {
					let updatedViewObject = editOptions?.find(
						(el) =>
							el.label ===
							JSON.parse(localStorage.getItem("fr_editCampaign_view")).mode
					);
					updatedViewObject.checked = true;
					changeEditView(updatedViewObject);
				}
			}

			// fetchCampaign(params?.campaignId)
		} else {
			localStorage.removeItem("fr_editCampaign_view");
		}
	}, [params]);

	useEffect(() => {
		setEditCampaign(isEditingCampaign);
	}, [isEditingCampaign]);

	useEffect(() => {
		if (campaignsArray && campaignsArray?.length) {
			const placeholderCampaign = campaignsArray?.find((campArr) => (campArr?.campaign_id === params?.campaignId) || (campArr?._id === params?.campaignId));
			setCampaignsStatusActivity(placeholderCampaign?.status);
		}
	}, [campaignsArray]);

	const createCampaign = () => {
		// console.log('spanOptions >>>>', spanOptions);
		changeStatusView('all')

		// console.log('statusOptions >>>>', statusOptions);
		changeSpanView('all')
		setIsEditingCampaign(null)
	}

	return (
		<header className='campaigns-header d-flex f-align-center w-100'>
			{/* If on base campaign page */}
			{location?.pathname?.split("/")?.slice(-1)[0] === "campaigns" ? (
				<>
					<Link
						// to='/messages/campaigns/create-campaign'
						to='/campaigns/create-campaign'
						className='btn btn-light-bg btn-primary btn-create-campaign'
						onClick={() => createCampaign()}
					>
						<AddTransparentIcon />
						Create campaign
					</Link>

					<Radio
						name='list-type'
						options={radioOptions}
						onChangeMethod={changeCampaignsView}
						isIcon={true}
						extraClass='campaigns-view-select m-left-a'
					/>
					<DropSelector
						selects={spanOptions}
						id='result-span'
						defaultValue={spanOptions?.find((el) => el?.selected)?.value}
						extraClass='fr-select-new tinyWrap'
						height='40px'
						width='inherit'
						handleChange={(e)=>changeSpanView(e.target.value)}
					/>
					<DropSelector
						selects={statusOptions}
						id='state-span'
						defaultValue={statusOptions?.find((el) => el?.selected)?.value}
						extraClass='fr-select-new tinyWrap'
						height='40px'
						width='inherit'
						handleChange={(e)=>changeStatusView(e.target.value)}
					/>
				</>
			) : (
				<>
					{editCampaign || editCampaign !== null || params?.campaignId ? (
						<>
							{/* EDIT UI */}
							<Link
								// to='/messages/campaigns'
								to='/campaigns'
								className='btn btn-inline btn-circular btn-go-back'
								onClick={resetEditCampaign}
							>
								<ChevronLeftArrowIcon />
							</Link>
							<h3 style={{ maxWidth: '900px' }}>
								{editCampaign
									? editCampaign?.campaign_name :
									campaignsDetails ?
										campaignsDetails?.campaign_name :
										"Loading your campaign"
								}

								{/* {
									campaignsDetails && campaignsDetails?.campaign_name ? campaignsDetails?.campaign_name : "Loading your campaign"
								} */}
							</h3>

							{editOptions && <RenderEditView />}

							<div className='campaign-status h-100 d-flex f-align-center'>
								<span>{campaignsStatusActivity ? 'Pause' : 'Start'} this campaign</span>
								{/* {editCampaign && (
									<Switch
										// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
										checked={editCampaign?.status}
										handleChange={switchPauseCampaign}
									/>
								)} */}

								<Switch
									// isDisabled={!editCampaign || editCampaign?.friends_pending === 0}
									checked={campaignsStatusActivity}
									handleChange={switchPauseCampaign}
								/>
							</div>
						</>
					) : (
						<>
							{/* CREATE UI */}
							<Link
								// to='/messages/campaigns'
								to='/campaigns'
								className='btn btn-inline btn-circular btn-go-back'
							>
								<ChevronLeftArrowIcon />
							</Link>
							<h3>Create Campaign</h3>
						</>
					)}
				</>
			)}
		</header>
	);
};

export default memo(CampaignsHeader);
