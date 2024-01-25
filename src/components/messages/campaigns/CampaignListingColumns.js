import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
	updateCampaignContext,
	updateCampaignsArray,
} from "actions/CampaignsActions";
import useComponentVisible from "../../../helpers/useComponentVisible";
import Alertbox from "../../common/Toast";

export const CampaignNameCellRenderer = memo((params) => {
	const storeEdit = () => {
		localStorage.setItem(
			"fr_editCampaign_view",
			JSON.stringify({
				mode: "view",
			})
		);
	};

	return (
		<div className='campaign-name-cell'>
			<Link
				to={`https://localhost:3000/messages/campaigns/${params?.data?.campaign_id}`}
				onClick={storeEdit}
			>
				{params?.value}
			</Link>
		</div>
	);
});

export const CampaignStatusCellRenderer = memo((params) => {
	const [campaignStatus, setCampaignStatus] = useState(params?.value ? params?.value : false);

	const doSomething = (e) => {
		if (
			(params?.data?.friends_pending === 0 ||
			new Date(params?.data?.campaign_end_time) < new Date()) &&
			e.target.checked
		) {
			Alertbox(
				`${params?.data?.friends_pending === 0
					? "This campaign currently has no pending friend(s). To turn on the campaign, please add some friends"
					: "The campaign you are attempting to turn on has exceeded its end date and time. To proceed, you need to modify the campaign accordingly."
				}`,
				"warning",
				3000,
				"bottom-right"
			);

			e.preventDefault()
			e.stopPropagation();
			return false
		} else {
			params?.setIsEditingCampaign({
				...params?.data,
				status: e.target.checked,
			});
			setCampaignStatus(e.target.checked);

			Alertbox(
				`The campaign has been successfully turned ${e.target.checked ? "ON" : "OFF"
				}`,
				"success",
				3000,
				"bottom-right"
			);
		}
	};
	return (
		<div className='campaign-status-cell'>
			<Switch
				checked={campaignStatus}
				handleChange={doSomething}
			// isDisabled={params?.data?.friends_pending === 0 || new Date(params?.data?.campaign_end_time) < new Date()}
			/>
		</div>
	);
});

export const CampaignFriendsCountCellRenderer = memo((params) => {
	return <div className='campaign-count-cell'>{params?.value}</div>;
});

export const CampaignFriendsPendingCellRenderer = memo((params) => {
	return (
		<div
			className={`campaign-pending-cell ${params?.value === 0 ? "nothing-pending" : ""
				}`}
		>
			{params?.value}
		</div>
	);
});

export const CampaignScheduleCellRenderer = memo((params) => {
	const storeEdit = () => {
		localStorage.setItem(
			"fr_editCampaign_view",
			JSON.stringify({
				mode: "settings",
			})
		);
	};

	return (
		<div className='campaign-schedule-cell'>
			<Link
				to={`https://localhost:3000/messages/campaigns/${params?.value}`}
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
export const CampaignContextMenuCellRenderer = (params) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const campaignId = params?.data?.campaign_id;
	const { setCampaignDeleteModalOpen, setCampaignId } = params;

	const { clickedRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
	const togggleContext = () => {
		setIsComponentVisible((current) => !current);
		dispatch(updateCampaignContext(params?.data?._id));
	};

	const handleEditCampaignOnClick = () => {
		try {
			localStorage.setItem(
				"fr_editCampaign_view",
				JSON.stringify({
					mode: "settings",
				})
			);
			navigate(`/messages/campaigns/${campaignId}`);
		} catch (error) {
			Alertbox(error, "error", 1000, "bottom-right");
		} finally {
			togggleContext();
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
};

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
