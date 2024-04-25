import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
	CommentIcon,
	CalendarIcon,
	FeMaleIcon,
	MaleIcon,
	MessageIcon,
	WhitelabelIcon,
	ReactionIcon,
	FacebookSyncIcon,
	EnvelopeIcon,
	BlockIcon,
	OpenInNewTab,
	SourceGroupIcon,
	SyncSourceIcon,
	NeuterIcon,
	Tier3Icon,
	Tier2Icon,
	Tier1Icon,
	IncomingRequestIcon,
} from "../../assets/icons/Icons";
// import {
//   BlockListFriends,
//   whiteListFriends,
// } from "../../services/friends/FriendListServices";
import { useDispatch, useSelector } from "react-redux";
import Alertbox from "../common/Toast";
import { BlockListFriend, whiteListFriend } from "../../actions/FriendsAction";
import helper from "../../helpers/helper";
//import { removeSelectedFriends } from "../../actions/FriendListAction";
import { Link } from "react-router-dom";
import { updateWhiteListStatusOfSelectesList } from "../../actions/FriendListAction";
import { utils } from "../../helpers/utils";
import { ReactComponent as UserIcon } from "../../assets/images/UserIcon.svg";
import { ReactComponent as SourceCsvIcon } from "../../assets/images/SourceCsvIcon.svg";
import { ReactComponent as RedWarningSquareIcon } from "../../assets/images/RedWarningSquareIcon.svg";
//let savedFbUId = localStorage.getItem("fr_default_fb");
import moment from "moment";

export const handlewhiteListUser = (dispatch, friendId, status) => {
	const payload = [
		{
			fbUserId: localStorage.getItem("fr_default_fb"),
			friendFbId: friendId,
			status: status,
		},
	];
	dispatch(whiteListFriend({ payload: payload }))
		.unwrap()
		.then((res) => {
			Alertbox(
				` Contact ${
					status === 1 ? "whitelisted" : "removed from whitelist"
				} successfully!`,
				"success",
				1000,
				"bottom-right"
			);
			// console.log("response after white listing >>>>>>",res)
			dispatch(updateWhiteListStatusOfSelectesList(res.data));
		})
		.catch((err) => {
			Alertbox(`${err.message} `, "error", 2000, "bottom-right");
			//dispatch(removeSelectedFriends());
		});
};

export const handleBlockingUser = (dispatch, friendId, status) => {
	const payload = [
		{
			fbUserId: localStorage.getItem("fr_default_fb"),
			friendFbId: friendId,
			status: status,
		},
	];
	dispatch(BlockListFriend({ payload: payload }))
		.unwrap()
		.then((res) => {
			Alertbox(
				` Contact ${
					status === 1 ? "blacklisted" : "removed from blacklist"
				} successfully!`,
				"success",
				1000,
				"bottom-right"
			);
			// dispatch(removeSelectedFriends());
		})
		.catch((err) => {
			Alertbox(`${err.message} `, "error", 2000, "bottom-right");
			// dispatch(removeSelectedFriends());
		});
};

export const NameCellRenderer = memo((params) => {
	const dispatch = useDispatch();
	return (
		<span className='name-image-renderer'>
			<a
				href={params.data.friendProfileUrl}
				target='_blank'
				rel='noreferrer'
			>
				<span
					className='fb-display-pic'
					style={{
						backgroundImage: `url(${params.data.friendProfilePicture})`,
					}}
				></span>
				<span className='fb-name'>{params.value}</span>
			</a>

			{params.data.whitelist_status ? (
				//dis-whiting
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handlewhiteListUser(dispatch, params.data.friendFbId, 0);
					}}
				>
					{<WhitelabelIcon color={"#FEC600"} />}
				</span>
			) : (
				//whiting
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handlewhiteListUser(dispatch, params.data.friendFbId, 1);
					}}
				>
					{<WhitelabelIcon color={"#767485"} />}
				</span>
			)}
			{params.data.blacklist_status ? (
				//removing from  black list
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handleBlockingUser(dispatch, params.data.friendFbId, 0);
					}}
				>
					{<BlockIcon color={"#FF6A77"} />}
				</span>
			) : (
				//black listing
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handleBlockingUser(dispatch, params.data.friendFbId, 1);
					}}
				>
					{<BlockIcon color={"#767485"} />}
				</span>
			)}
		</span>
	);
});

export const EngagementGetter = (params) => {
	// Reacts + Comments
	let engCount =
		Number(params.data.reactionThread) + Number(params.data.commentThread);
	return engCount;
};

export const EmptyRenderer = memo((params) => {
	return "";
});

export const GeneralNameCellRenderer = memo((params) => {
	return (
		<span className='name-image-renderer'>
			<a
				href={params.data.friendProfileUrl}
				target='_blank'
				rel='noreferrer'
			>
				<span
					className='fb-display-pic'
					style={{
						backgroundImage: `url(${params.data.friendProfilePicture})`,
					}}
				></span>
				<span className='fb-name'>{params.value}</span>
			</a>
		</span>
	);
});

export const UnlinkedNameCellRenderer = memo((params) => {
	return (
		<span
			className={`name-image-renderer ${
				params?.data?.status === "sent" ||
				params?.data?.status === "send" ||
				params?.data?.status === "successful"
					? "frnd-send-status"
					: ""
			}`}
		>
			<span
				className='fb-display-pic'
				style={{
					backgroundImage: `url(${params.data.friendProfilePicture})`,
				}}
			></span>
			<span className='fb-name'>{params.value}</span>
			<a
				href={params.data.friendProfileUrl}
				target='_blank'
				rel='noreferrer'
				className='ico-open-link'
			>
				<OpenInNewTab />
			</a>
		</span>
	);
});

export const FriendQueueRecordsNameRenderer = memo((params) => {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<span className='name-image-renderer'>
			{params.data.friendProfileUrl ? (
				<>
					<UserIcon className='placeholder-img' />
					<div className='placeholder-name'>Facebook user</div>
				</>
			) : (
				<span className='muted-text'>N/A</span>
			)}
			{params.data.friendProfileUrl && (
				<>
					<a
						href={params.data.friendProfileUrl}
						target='_blank'
						rel='noreferrer'
						className='ico-open-link'
					>
						<OpenInNewTab />
					</a>
					{params.data?.status !== null && params.data?.status === 0 && (
						<RedWarningSquareIcon
							className='fb-friend-request-warning'
							onMouseEnter={(e) => {
								setShowTooltip(true);
								setMousePos({
									x: e.clientX,
									y: e.clientY,
								});
							}}
							onMouseLeave={(e) => {
								setShowTooltip(false);
								setMousePos({
									x: 0,
									y: 0,
								});
							}}
						/>
					)}
					{showTooltip &&
						createPortal(
							<span
								className='fb-friend-request-warning-tooitip'
								style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
							>
								Sending friend request was unsuccessful due to an unknown error
								from Facebook.
							</span>,
							document.getElementById("root")
						)}
				</>
			)}
		</span>
	);
});

export const UnlinkedNameCellWithOptionsRenderer = memo((params) => {
	const [white, setWhite] = useState(params.data.whitelist_status);
	const [black, setBlack] = useState(params.data.blacklist_status);
	const dispatch = useDispatch();
	// console.log(params.data);

	return (
		<span className='name-image-renderer'>
			{params.data.friendProfilePicture && (
				<>
					<span
						className='fb-display-pic'
						style={{
							backgroundImage: `url(${params.data.friendProfilePicture})`,
						}}
					></span>
					<span
						className='tooltipFullName'
						data-text={params.value}
					>
						<span className='fb-name'>{params.value}</span>
					</span>
				</>
			)}

			{params.data.friendProfileUrl && (
				<a
					href={params.data.friendProfileUrl}
					target='_blank'
					rel='noreferrer'
					className='ico-open-link'
				>
					<OpenInNewTab />
				</a>
			)}

			{white ? (
				//dis-whiting
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handlewhiteListUser(dispatch, params.data.friendFbId, 0);
						setWhite(false);
					}}
				>
					{<WhitelabelIcon color={"#FEC600"} />}
				</span>
			) : (
				//whiting
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handlewhiteListUser(dispatch, params.data.friendFbId, 1);
						setWhite(true);
					}}
				>
					{<WhitelabelIcon color={"#767485"} />}
				</span>
			)}
			{black ? (
				//removing from  black list
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handleBlockingUser(dispatch, params.data.friendFbId, 0);
						setBlack(false);
					}}
				>
					{<BlockIcon color={"#FF6A77"} />}
				</span>
			) : (
				//black listing
				<span
					className='profile-whitelabeled'
					onClick={() => {
						handleBlockingUser(dispatch, params.data.friendFbId, 1);
						setBlack(true);
					}}
				>
					{<BlockIcon color={"#767485"} />}
				</span>
			)}
		</span>
	);
});

export const CommentRenderer = memo((params) => {
	const commentCount = params.value;

	return (
		<span className={`sync-date d-flex f-align-center h-100 w-100`}>
			{/* <figure className={`sync-ico text-center`}>
        <CommentIcon />
      </figure>
      <span className={`sync-dt`}>{commentCount || 0}</span> */}
			{commentCount || 0}
		</span>
	);
});

export const EngagementRenderer = memo((params) => {
	const engagementCount = params.value;

	return (
		<span className={`sync-date d-flex f-align-center h-100 w-100`}>
			{engagementCount || 0}
		</span>
	);
});

export const CreationRenderer = memo((params) => {
	const statusSync = params.value.toLowerCase();
	const syncDate = statusSync.split(" ")[0];
	const syncTime = statusSync.split(" ")[1];

	return (
		<span className={`sync-date d-flex f-align-center`}>
			<figure className={`sync-ico text-center`}>
				<CalendarIcon />
			</figure>
			<span className={`sync-dt`}>{syncDate}</span>
			<span className={`sync-tm`}>{syncTime}</span>
		</span>
	);
});

export const CampaignCreationRenderer = memo((params) => {
	// 01 Dec, 2020 06:30
	const statusSync = params.value.toLowerCase();
	const localStatusSync = utils.convertUTCtoLocal(
		statusSync?.replace(" ", "T") + ".000Z",
		true
	);

	// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	// const parsedDate = moment(statusSync);
	// const formattedHours = parsedDate.format("HH:mm");

	return (
		<span className={`sync-date d-flex f-align-center`}>
			<figure className={`sync-ico text-center`}>
				<CalendarIcon />
			</figure>
			{/* <span className={`sync-dt`}>{new Date(statusSync).getDate()+" "+months[new Date(statusSync).getMonth()]+", "+new Date(statusSync).getFullYear()}</span> */}
			<span className={`sync-dt`}>
				{localStatusSync ? localStatusSync : ""}
			</span>
			{/* <span className={`sync-tm`}>{formattedHours}</span> */}
		</span>
	);
});

export const AgeRenderer = memo((params) => {
	let statusSync = null;

	if (params?.data?.friendRequestStatus?.toLowerCase() === "pending") {
		if (params?.data?.last_friend_request_send_at) {
			if (params?.data?.refriending_attempt > 0) {
				statusSync = params?.data?.created_at?.toLowerCase();
			} else {
				statusSync = params?.data?.last_friend_request_send_at?.toLowerCase();
			}
		} else {
			statusSync = params?.data?.created_at?.toLowerCase();
		}
	} else if (params?.data?.friendStatus?.toLowerCase() === "lost") {
		statusSync = params?.data?.updated_at?.toLowerCase();
	} else if (params?.data?.deleted_status === 1) {
		statusSync = params?.data?.deleted_at?.toLowerCase();
	} else {
		statusSync = params?.data?.created_at?.toLowerCase();
	}

	// let statusSync = params?.data?.created_at?.toLowerCase();
	// inputTimeString.replace(" ", "T") + ".000Z";
	let localTime = utils.convertUTCtoLocal(
		statusSync?.replace(" ", "T") + ".000Z",
		true
	);
	//console.log("status sysnc>>>>>>local date",localTime);
	let currentUTC = helper.curretUTCTime();
	let diffTime = Math.abs(currentUTC - new Date(statusSync).valueOf());
	let days = diffTime / (24 * 60 * 60 * 1000);
	let hours = (days % 1) * 24;
	let minutes = (hours % 1) * 60;
	let secs = (minutes % 1) * 60;
	[days, hours, minutes, secs] = [
		Math.floor(days),
		Math.floor(hours),
		Math.floor(minutes),
		Math.floor(secs),
	];

	// console.log("Params Here for FriendListColumn --- ", params.data, statusSync);
	// console.log(`Days - ${days} | Hours - ${hours} | Minutes - ${minutes} | Secs - ${secs}`);

	let age = 0;

	if (days) age = days;
	else if (hours) age = 1;
	else if (minutes) age = 1;
	else age = 1;

	// console.log("Params Here for FriendListColumn --- ", params.data);

	// Calculates the Age for all..
	const ageCalculator = (bornDate) => {
		const todayUTC = moment().utc();
		const bornDateUTC = moment(bornDate, "YYYY-MM-DD HH:mm:ss").utc();

		// Age Differences..
		const timeDifference = Math.abs(todayUTC - bornDateUTC);

		// Calculate the time difference in milliseconds
		// const timeDifference = todayUTC.diff(bornDateUTC);

		// Calculate age in days..
		let ageInDays = Math.floor(timeDifference / (24 * 60 * 60 * 1000));

		if (ageInDays === 0) {
			localTime =
				hours !== 0
					? `Today ${hours}h ${minutes}m Ago`
					: `Today ${minutes}m Ago`;
		}

		return Number(ageInDays);
	};

	if (params?.data?.friendRequestStatus?.toLowerCase() === "pending") {
		let requestDate;

		if (params.data?.last_friend_request_send_at?.toLowerCase()) {
			if (params?.data?.refriending_attempt > 0) {
				requestDate = params?.data?.created_at?.toLowerCase();
			} else {
				requestDate = params?.data?.last_friend_request_send_at?.toLowerCase();
			}
		} else {
			requestDate = params?.data?.created_at?.toLowerCase();
		}

		const ageInDays = ageCalculator(requestDate);
		age = ageInDays;
	} else if (params?.data?.friendStatus?.toLowerCase() === "lost") {
		// const lostDate = new Date(params?.data?.lost_friend_at?.toLowerCase());
		const lostDate = params?.data?.updated_at?.toLowerCase();
		const ageInDays = ageCalculator(lostDate);
		age = ageInDays;
	} else if (params?.data?.deleted_status === 1) {
		const unfriendedDate = params?.data?.deleted_at?.toLowerCase();
		const ageInDays = ageCalculator(unfriendedDate);
		age = ageInDays;
	} else {
		const actionDate = params?.data?.created_at?.toLowerCase();
		const ageInDays = ageCalculator(actionDate);
		age = ageInDays;
	}

	//  let showingDate = new Date(localTime);
	//  function getMonthName(monthNumber) {
	//  // const date = new Date();
	//   showingDate.setMonth(monthNumber - 1);

	//   return showingDate.toLocaleString('en-US', { month: 'short' });
	// }

	// let tooltipDateFormat = showingDate.getDate() +" " + getMonthName(showingDate.getMonth() + 1, ) + ", "+ showingDate.getFullYear() + "  "+ JSON.stringify(showingDate).slice(12, 17);
	// console.log('tooltipDateFormat', tooltipDateFormat);

	return (
		<span className={` d-flex f-align-center w-100 h-100`}>
			<span
				className='tooltipFullName ageTooltip w-100 h-100 d-flex f-align-center'
				data-text={localTime}
			>
				{age}
			</span>
		</span>
	);
});

export const RecentEngagementRenderer = memo((params) => {
	const [inactiveAfter, setInactiveAfter] = useState(
		params?.inactiveAfter ? params?.inactiveAfter : 30
	);
	const [statusSync, setStatusSync] = useState(
		params?.data?.last_engagement_date
	);
	let currentUTC = helper.curretUTCTime();
	let diffTime = Math.abs(currentUTC - new Date(statusSync).valueOf());
	let days = Math.floor(diffTime / (24 * 60 * 60 * 1000));
	// let cutoff = 10; //here Friends will be considered as inactive after
	let date = new Date(statusSync);
	let currentYear = date.getFullYear();
	let currentMonth = date.getMonth() + 1; // 0 - 11
	let currentDay = date.getDate();
	if (currentMonth < 10) {
		currentMonth = "0" + currentMonth;
	}
	let dateFormat = currentMonth + " / " + currentDay + " / " + currentYear;

	useEffect(() => {
		if (params?.inactiveAfter) {
			setInactiveAfter(params?.inactiveAfter);
		}
		if (params?.data?.last_engagement_date) {
			setStatusSync(params?.data?.last_engagement_date);
		}
	}, [params]);

	return (
		<span className={`h-100 w-100 d-flex f-align-center`}>
			<span
				className={
					!(inactiveAfter && statusSync)
						? ""
						: "tooltipFullName small h-100 w-100 d-flex"
				}
				data-text={
					inactiveAfter && statusSync && "Last engaged on " + dateFormat
				}
			>
				{inactiveAfter && statusSync ? (
					<span
						className={
							days > inactiveAfter
								? "activeEngaged notAct"
								: "activeEngaged actUser"
						}
					>
						{/* <span className="dot"></span> {days} day(s) */}
						<span className='dot'></span> {days}
					</span>
				) : (
					<span className='activeEngaged notAct'>
						<span className='dot'></span> Never
					</span>
				)}
			</span>
		</span>
	);
});

export const GenderRenderer = memo((params) => {
	let genderFriend = "N/A";
	if (params.value?.length > 0 && params.value != "N/A") {
		genderFriend = params.value.toLowerCase();
	}

	return (
		<div className={`friend-gender d-flex fa-align-center`}>
			{genderFriend === "male" ||
			genderFriend === "female" ||
			genderFriend === "neuter" ? (
				<figure
					className={
						genderFriend === "male"
							? "friend-gender-ico text-center male"
							: "friend-gender-ico text-center"
					}
				>
					{genderFriend === "male" ? (
						<MaleIcon />
					) : genderFriend === "female" ? (
						<FeMaleIcon />
					) : genderFriend === "neuter" ? (
						<NeuterIcon />
					) : (
						"-"
					)}
				</figure>
			) : (
				"-"
			)}
			{/* <span className={genderFriend === "N/A" ? "muted-text" : ""}>{genderFriend}</span> */}
		</div>
	);
});

export const HasConversationRenderer = memo((params) => {
	const messageCount = params.value;

	return (
		<div className={`friend-gender d-flex fa-align-center`}>
			{messageCount > 0 ? (
				<span className='has-conversation conv-yes text-center'>Yes</span>
			) : (
				<span className='has-conversation conv-no text-center'>No</span>
			)}
		</div>
	);
});

export const MessageRenderer = memo((params) => {
	const messageCount = params.value;

	return (
		<span className={`sync-date d-flex f-align-center h-100 w-100`}>
			{/* <figure className={`sync-ico text-center`}>
        <MessageIcon />
      </figure>
      <span className={`sync-dt`}>{messageCount || 0}</span> */}
			{messageCount || 0}
		</span>
	);
});

export const ReactionRenderer = memo((params) => {
	const reactionCount = params.value;

	return (
		<span className={`sync-date d-flex f-align-center w-100 h-100`}>
			{/* <figure className={`sync-ico text-center`}> */}
			{/* <ReactionIcon /> */}
			{/* </figure> */}
			{/* <span className={`sync-dt`}>{reactionCount || 0}</span> */}
			{reactionCount || 0}
		</span>
	);
});

export const SourceRenderer = memo((params) => {
	const sourceFriend = params?.data?.groupName;

	return (
		<>
			{params?.data?.groupUrl && sourceFriend ? (
				<Link
					to={params?.data?.groupUrl}
					className='friend-sync-source d-flex f-align-center'
					target='_blank'
				>
					{sourceFriend ? (
						<>
							<figure className='friend-source text-center'>
								{sourceFriend === "sync" ? <FacebookSyncIcon /> : ""}
							</figure>
							<span>
								{/* {params?.data?.finalSource} : {sourceFriend} */}
								{sourceFriend}
							</span>
						</>
					) : (
						<span className='no-keywords muted-text'>N/A</span>
					)}
				</Link>
			) : (
				<div className='friend-sync-source d-flex f-align-center'>
					{params?.data?.finalSource ? (
						<>
							<figure className='friend-source text-center'>
								{params?.data?.finalSource === "sync" ? (
									<FacebookSyncIcon />
								) : (
									""
								)}
							</figure>
							<span>
								{/* {params?.data?.finalSource} : {sourceFriend} */}
								{params?.data?.finalSource}
							</span>
						</>
					) : (
						<span className='no-keywords muted-text'>N/A</span>
					)}
				</div>
			)}
		</>
	);
});

export const StatusRenderer = memo((params) => {
	const statusFriend = params.value.toLowerCase();

	return (
		<span className={`account-status status-${statusFriend}`}>
			<span className={`status-bg`}></span>
			<span className='status-text'>
				{params.value === "Activate"
					? "Active"
					: params.value === "Deactivate"
					? "Inactive"
					: params.value}
			</span>
		</span>
	);
});

export const EmailRenderer = memo((params) => {
	let emailSync = "N/A";
	if (params.value && params.value != "N/A") {
		emailSync = params.value.toLowerCase();
	}

	return (
		<span className={`sync-email d-flex f-align-center`}>
			<figure className={`sync-ico text-center`}>
				<EnvelopeIcon />
			</figure>
			<span className={emailSync === "N/A" ? `muted-text` : `sync-txt`}>
				{emailSync}
			</span>
		</span>
	);
});

export const RequestRenderer = memo((params) => {
	let reqSync = "N/A";
	if (params.value) {
		reqSync = params.value;
	}

	return (
		<span
			className={`sync-box-wrap d-flex f-align-center ${
				reqSync === 1 ? "green" : "yellow"
			}`}
		>
			<span className={reqSync === "N/A" ? `muted-text` : `sync-txt`}>
				{reqSync}
			</span>
		</span>
	);
});

export const FriendsQueueRecordsKeywordRenderer = memo((params) => {
	// console.log(params.data.matchedKeyword);
	// console.log(params.data.matchedKeyword.split(","));
	return (
		<>
			{params.data.matchedKeyword &&
			Array.isArray(params.data.matchedKeyword.split(",")) &&
			params.data.matchedKeyword.split(",").length > 0 ? (
				params.data.matchedKeyword
					.split(",")
					.slice(0, 1)
					.map((item, index) => (
						<div
							className='friend-queue-keywords-container'
							key={index}
						>
							<div className='friend-queue-keywords'>{item}</div>
							{params.data.matchedKeyword.split(",").length > 1 && (
								<div
									className='friend-queue-keywords-more'
									onClick={() => {
										params.setKeyWordList(
											params.data.matchedKeyword
												.split(",")
												.slice(1, params.data.matchedKeyword.split(",").length)
										);
										params.setModalOpen(true);
									}}
								>
									{`+${params.data.matchedKeyword.split(",").length - 1}`}
								</div>
							)}
						</div>
					))
			) : (
				<span className='muted-text'>N/A</span>
			)}
		</>
	);
});

export const KeywordRenderer = memo((params) => {
	// console.log(params.data);
	// const keywords =
	//   params.value?.length > 0 && params.value[0].selected_keywords?.length > 0
	//     ? params.value[0].selected_keywords
	//     : null;

	const [matchedKeyword, setMatchedKeyword] = useState(
		params?.data.matchedKeyword
			? params?.data.matchedKeyword
					.split(",")
					.filter((keyW) => keyW.trim() !== "")
			: []
	);

	// console.log(matchedKeyword);

	//className={sourceFriend.length > 12 ? "friendSource tooltipFullName" : "friendSource"} data-text={sourceFriend.length > 12 && sourceFriend}
	return (
		<>
			{matchedKeyword?.length > 0 && !params.data.is_incoming ? (
				<span className={`sync-box-wrap d-flex f-align-center key-box-wrap`}>
					{Array.isArray(matchedKeyword) ? (
						<span
							className={
								matchedKeyword[0].length > 12
									? "tooltipFullName sync-txt tags positive-tags"
									: "sync-txt tags positive-tags"
							}
							data-text={matchedKeyword[0].length > 12 && matchedKeyword[0]}
						>
							{matchedKeyword[0].length > 12
								? matchedKeyword[0].substring(0, 12) + "..."
								: matchedKeyword[0]}
						</span>
					) : (
						0
					)}
					{Array.isArray(matchedKeyword) && matchedKeyword.length > 1 ? (
						<span
							className='syn-tag-count'
							onClick={() => {
								params.setKeyWords({
									matchedKeyword: matchedKeyword,
								});
								params.setModalOpen(true);
							}}
						>
							+{matchedKeyword.length - 1}
						</span>
					) : (
						""
					)}
				</span>
			) : (
				<span className='no-keywords muted-text'>N/A</span>
			)}
		</>
	);
});

export const MessageGroupRequestAcceptedRenderer = memo((params) => {
	const groupArray = useSelector((state) => state.message.groupArray);
	const { message_group_request_accepted } = params.data;
	// console.log(groupArray);
	// console.log("params?.value", message_group_request_accepted);
	return (
		<>
			{params.data &&
			message_group_request_accepted &&
			message_group_request_accepted.groupId ? (
				<>
					{
						groupArray?.find(
							(item) => item._id === message_group_request_accepted.groupId
						)?.group_name
					}
				</>
			) : params.data &&
			  message_group_request_accepted &&
			  message_group_request_accepted.quickMessage ? (
				<>{"Quick Message"}</>
			) : (
				<span className='muted-text'>N/A</span>
			)}
		</>
	);
});

export const MessageGroupRequestSentRenderer = memo((params) => {
	const groupArray = useSelector((state) => state.message.groupArray);
	const { message_group_request_sent } = params.data;
	// console.log(groupArray);
	// console.log("params?.value", message_group_request_sent);
	return (
		<>
			{params.data &&
			message_group_request_sent &&
			message_group_request_sent.groupId ? (
				<>
					{
						groupArray?.find(
							(item) => item._id === message_group_request_sent.groupId
						)?.group_name
					}
				</>
			) : params.data &&
			  message_group_request_sent &&
			  message_group_request_sent.quickMessage ? (
				<>{"Quick Message"}</>
			) : (
				<span className='muted-text'>N/A</span>
			)}
		</>
	);
});

export const CountryRenderer = memo((params) => {
	let countryName = "N/A";
	if (params.value && params.value != "N/A") {
		countryName = params.value.toLowerCase();
	}

	return (
		<span className={` d-flex f-align-center`}>
			<span
				className={
					countryName === "N/A"
						? `d-flex muted-text f-align-center`
						: `d-flex f-align-center capText sync-txt`
				}
			>
				{params?.data?.tier?.toLowerCase() !== "na" &&
				params?.data?.tier?.toLowerCase() !== "n/a" &&
				countryName?.toLowerCase() !== "na" &&
				countryName?.toLowerCase() !== "n/a" ? (
					<>
						<span className='inline-icon tier-icon'>
							{params?.data?.tier === "Tier3" ? (
								<Tier3Icon />
							) : params?.data?.tier === "Tier2" ? (
								<Tier2Icon />
							) : (
								<Tier1Icon />
							)}
						</span>
						<span className='country-name'>{countryName}</span>
					</>
				) : (
					<span className='muted-text'>N/A</span>
				)}
			</span>
		</span>
	);
});

export const CountryTierRenderer = memo((params) => {
	let countryTierName = "N/A";
	if (params.value && params.value != "N/A") {
		countryTierName = params.value.toLowerCase();
	}

	return (
		<span className={` d-flex f-align-center`}>
			<span
				className={
					countryTierName === "N/A" ? "muted-text" : "capText sync-txt"
				}
			>
				{countryTierName}
			</span>
		</span>
	);
});

export const RefriendCountRenderer = memo((params) => {
	// console.log('params?.value', params?.value);
	return params?.value && !params.data.is_incoming ? (
		params?.value
	) : (
		<span className='muted-text'>N/A</span>
	);
});

export const SourceRendererPending = memo((params) => {
	// console.log(params);
	if (params?.data?.finalSource?.toLowerCase() === "group") {
		const groupName = params?.data?.groupName;

		if (params?.data?.groupUrl && groupName) {
			return (
				<div className='friend-sync-source d-flex f-align-center'>
					{/* {console.log('here')} */}
					{groupName ? (
						<>
							<figure className='friend-source text-center'>
								{groupName === "sync" ? <FacebookSyncIcon /> : ""}
							</figure>
							<span
								className={
									groupName.length > 12
										? "friendSource tooltipFullName"
										: "friendSource"
								}
								data-text={groupName.length > 12 && groupName}
							>
								<SourceGroupIcon />{" "}
								<span>
									{groupName.length > 12
										? groupName.substring(0, 12) + "..."
										: groupName}
								</span>
								<Link
									to={params?.data?.groupUrl}
									className='ico-open-link'
									target='_blank'
								>
									<OpenInNewTab />
								</Link>
							</span>
						</>
					) : (
						<span className='no-keywords muted-text'>N/A</span>
					)}
				</div>
			);
		}
	}

	if (params?.data?.finalSource?.toLowerCase() === "sync") {
		return (
			<div className='friend-sync-source d-flex f-align-center'>
				{/* {console.log('here')} */}
				{params?.data?.finalSource ? (
					<>
						<figure className='friend-source text-center'>
							<SyncSourceIcon />
						</figure>
						<span
							className={
								params?.data?.finalSource.length > 12
									? "friendSource tooltipFullName"
									: "friendSource"
							}
							data-text={params?.data?.finalSource}
						>
							{params?.data?.finalSource.length > 12
								? params?.data?.finalSource.substring(0, 12) + "..."
								: params?.data?.finalSource}
						</span>
					</>
				) : (
					<span className='no-keywords muted-text'>N/A</span>
				)}
			</div>
		);
	}

	if (params?.data?.finalSource?.toLowerCase() === "incoming") {
		return (
			<div className='friend-sync-source d-flex f-align-center'>
				<figure className='friend-source text-center'>
					<IncomingRequestIcon />
				</figure>
				<span
					className={
						params?.data?.finalSource.length > 12
							? "friendSource tooltipFullName"
							: "friendSource"
					}
					data-text={params?.data?.finalSource}
				>
					Incoming request
				</span>
			</div>
		);
	}

	if (params?.data?.task_name?.toLowerCase()) {
		return (
			<div className='friend-sync-source d-flex f-align-center'>
				<SourceCsvIcon className='friend-sync-source-icon' />
				{params?.data?.task_name}
			</div>
		);
	}
});
