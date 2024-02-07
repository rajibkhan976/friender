import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";

import helper from "../../../helpers/helper";
import { utils } from "../../../helpers/utils";

import Switch from "../../formComponents/Switch";
import { Link } from "react-router-dom";
import {
	CalendarIcon,
	DeleteIcon,
	EditIcon,
	OpenInNewTab,
	ThreeDotIcon,
} from "../../../assets/icons/Icons";
import {
	fetchCampaignById,
	updateCampaignContext,
	updateCampaignsArray,
	fetchUsers,
	updateCampaignStatus
} from "actions/CampaignsActions";
import useComponentVisible from "../../../helpers/useComponentVisible";
import Alertbox from "../../common/Toast";


export const CampaignNameCellRenderer = memo((params) => {
	const dispatch = useDispatch()
	const navigate = useNavigate();
	const campaignId = params?.data?.campaign_id || params?.data?._id;

	const storeEdit = async () => {
		try {
			const response = await dispatch(fetchCampaignById({ fbUserId: localStorage.getItem("fr_default_fb"), campaignId, })).unwrap();

			if (response) {
				localStorage.setItem(
					"fr_editCampaign_view",
					JSON.stringify({
						mode: "view",
					})
				);

				// const campaignData = response?.data[0];
				// navigate(`/messages/campaigns/${campaignId}`, { state: { ...campaignData } });
				navigate(`/messages/campaigns/${campaignId}`, { state: { data: params?.data } });
			}

		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='campaign-name-cell'>
			<Link
				// to={`/messages/campaigns/${campaignId}`}
				onClick={storeEdit}
			>
				{params?.value}
			</Link>
		</div>
	);
});

export const CampaignStatusCellRenderer = memo((params) => {
	const dispatch = useDispatch();
	const [campaignStatus] = useState(params?.data?.status ? params?.data?.status : false);

	// CAMPAIGN STATUS UPDATE VIA API.. 
	const camapignStatusToggleUpdateAPI = async (campaignId, campaignStatus) => {
		try {
			await dispatch(updateCampaignStatus({ campaignId, campaignStatus })).unwrap();
			Alertbox(
				`The campaign has been successfully turned ${campaignStatus ? "ON" : "OFF"
				}`,
				"success",
				3000,
				"bottom-right"
			);

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

	const handleSwitchToggleStatus = (e) => {
		const campaignId = params?.data?.campaign_id || params?.data?._id;
		
		if (!params?.data?.friends_added || (params?.data?.friends_added === 0 || new Date(params?.data?.campaign_end_time) < new Date()) && e.target.checked) {
			Alertbox(
				`${params?.data?.friends_added === 0
					? "This campaign currently has no pending friend(s). To turn on the campaign, please add some friends"
					: "The campaign you are attempting to turn on has exceeded its end date and time. To proceed, you need to modify the campaign accordingly."
				}`,
				"warning",
				3000,
				"bottom-right"
			);

			e.preventDefault();
			e.stopPropagation();
			return false;

		} else {
			// params?.setIsEditingCampaign({
			// 	...params?.data,
			// 	status: e.target.checked,
			// });
			// setCampaignStatus(e.target.checked);
			camapignStatusToggleUpdateAPI(campaignId, e.target.checked);
		}
	};

	return (
		<div className='campaign-status-cell'>
			<Switch
				checked={campaignStatus}
				handleChange={handleSwitchToggleStatus}
				// isDisabled={
				// 	params?.data?.friends_added === 0 ||
				// 	new Date(params?.data?.campaign_end_time) < new Date()
				// }
			/>
		</div>
	);
});

export const CampaignFriendsCountCellRenderer = memo((params) => {
	// console.log("FRIENDS COUNT CELL RENDERER - ", params?.value);
	// console.log("FRIENDS ADDED CELL - ", params?.data?.friends_added);
	return <div className='campaign-count-cell'>{!params?.value ? 0 : params?.value}</div>;
});

export const CampaignFriendsPendingCellRenderer = memo((params) => {
	return (
		<div
			className={`campaign-pending-cell ${params?.value === 0 ? "nothing-pending" : ""
				}`}
		>
			{params?.value || 0}
		</div>
	);
});

export const CampaignScheduleCellRenderer = memo((params) => {
	const dispatch = useDispatch()
	const navigate = useNavigate();

	const campaignId = params?.data?.campaign_id || params?.data?._id;

	const storeEdit = async () => {
		try {
			dispatch(fetchCampaignById({
				fbUserId: localStorage.getItem("fr_default_fb"),
				campaignId: params?.data?.campaign_id,
			}))
				.unwrap()
				.then(res => {
					if (res) {
						localStorage.setItem(
							"fr_editCampaign_view",
							JSON.stringify({
								mode: "settings",
							})
						);

						// navigate(`/messages/campaigns/${campaignId}`);
						navigate(`/messages/campaigns/${campaignId}`, { state: { data: params?.data } });
					}
				})
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='campaign-schedule-cell'>
			<Link
				// to={`messages/campaigns/${campaignId}`}
				onClick={storeEdit}
			>
				View schedule <OpenInNewTab />
			</Link>
		</div>
	);
});

export const CampaignEndTimeCellRenderer = memo((params) => {
	// Might need to convert time to UTC / Local
	const convertedTimeSplit = utils
		.convertUTCtoLocal(params?.value?.replace(" ", "T") + ".000Z", true)
		.split(",");

	return (
		<div
			className={`campaign-endTime-cell ${new Date() > new Date(params?.value) ? "end-time-exceeded" : ""
				}`}
		>
			{params?.value ? (
				<>
					<CalendarIcon />
					&nbsp;{convertedTimeSplit[0]}, {convertedTimeSplit[1]?.toLowerCase()}
				</>
			) : (
				<span className='muted-text'>--</span>
			)}
		</div>
	);
});

// CAMPAIGN LIST'S OPTION MENU TO EDIT / DELETE CAMPAIGN..
export const CampaignContextMenuCellRenderer = memo((params) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const campaignId = params?.data?.campaign_id || params?.data?._id;
	const { setCampaignDeleteModalOpen, setCampaignId } = params;

	const { clickedRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const togggleContext = () => {
		setIsComponentVisible((current) => !current);
		dispatch(updateCampaignContext(campaignId));
	};

	const handleEditCampaignOnClick = (event) => {
		event.preventDefault();

		try {
			dispatch(fetchCampaignById({
				fbUserId: localStorage.getItem("fr_default_fb"),
				campaignId,
			}))
				.unwrap()
				.then(res => {
					if (res) {
						localStorage.setItem(
							"fr_editCampaign_view",
							JSON.stringify({
								mode: "settings",
							})
						);

						// navigate(`/messages/campaigns/${campaignId}`);
						console.log("HERE IS CAMPAIGN DATA (PARAMS) - ", params?.data);
						navigate(`/messages/campaigns/${campaignId}`, { state: { data: params?.data } });
					}
				})
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteCampaignOnClick = async () => {
		setCampaignDeleteModalOpen(true);
		setCampaignId(campaignId);
	};

	return (
		<div
			className='campaign-contextMenu-cell w-100 text-center'
			ref={clickedRef}
		>
			<div
				className={
					isComponentVisible
						? "message-context-menu active"
						: "message-context-menu"
				}
			>
				<button
					className='context-menu-trigger'
					onClick={togggleContext}
				>
					<ThreeDotIcon />
				</button>

				{isComponentVisible && (
					<div className='context-menu'>
						<button
							className='btn btn-edit'
							onClick={handleEditCampaignOnClick}
						>
							<span className='context-icon'>
								<EditIcon />
							</span>
							Edit
						</button>
						<button
							className='btn btn-delete'
							onClick={handleDeleteCampaignOnClick}
						>
							<span className='context-icon'>
								<DeleteIcon />
							</span>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
});

export const CampaignFriendStatusRenderer = memo((params) => {
	return (
		<div className='campaign-friendName-cell'>
			<span
				className={
					params?.value?.toLowerCase() === "successful"
						? `activeEngaged actUser`
						: `activeEngaged actPending`
				}
			>
				<span className='dot'></span> {params?.value}
			</span>
		</div>
	);
});

export const CampaignFriendMessageRenderer = memo((params) => {
	return (
		<div className='campaign-friendMessage-cell'>
			{params?.value ? params?.value : <span className='muted-text'>-</span>}
		</div>
	);
});
