import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import BreadCrumb from "./BreadCrumb";
import { io } from "socket.io-client";
// import socket  from "../../configuration/socket-connection";
import helper from "../../helpers/helper";
import {
	FacebookSyncIcon,
	// SortIcon,
	// FilterIcon,
	ActionIcon,
	// ExportIcon,
	WhitelabelIcon,
	BlockIcon,
	UnfriendIcon,
	CampaignQuicActionIcon,
	CampaignModalIcon,
	OpenInNewTab,
	InfoIcon,
} from "../../assets/icons/Icons";
import { ReactComponent as CsvDownloadIcon } from "../../assets/images/CsvDownloadIcon.svg";
import { ReactComponent as ExportCSVIcon } from "../../assets/images/ExportCSVIcon.svg";
import { ReactComponent as GrayWarningCircleIcon } from "../../assets/images/GrayWarningCircleIcon.svg";
import { ReactComponent as MoveTopIcon } from "../../assets/images/MoveTopIcon.svg";
import { ReactComponent as NextIcon } from "../../assets/images/NextIcon.svg";
import { ReactComponent as ProgressIconOne } from "../../assets/images/ProgressIconOne.svg";
import { ReactComponent as ProgressIconTwo } from "../../assets/images/ProgressIconTwo.svg";
import { ReactComponent as SheetIcon } from "../../assets/images/SheetIcon.svg";
import { ReactComponent as UploadIcon } from "../../assets/images/UploadIcon.svg";
import { ReactComponent as WhiteArrowLeftIcon } from "../../assets/images/WhiteArrowLeftIcon.svg";
import { ReactComponent as WhiteCrossIcon } from "../../assets/images/WhiteCrossIcon.svg";
import { ChevronDownArrowIcon } from "../../assets/icons/Icons";
import Tooltip from "./Tooltip";
import Search from "../formComponents/Search";
import Alertbox from "./Toast";
import { useDispatch, useSelector } from "react-redux";
import {
	removeSelectedFriends,
	updateWhiteListStatusOfSelectesList,
} from "../../actions/FriendListAction";
import {
	saveUserProfile,
	fetchUserProfile,
} from "../../services/authentication/facebookData";
import { setProfileSpaces } from "../../actions/ProfilespaceActions";
import {
	getSendFriendReqst,
	reLoadFrList,
	unLoadFrList,
} from "../../actions/FriendsAction";
import {
	deleteFriend,
	getFriendList,
	whiteListFriend,
	BlockListFriend,
} from "../../actions/FriendsAction";
import { getGroupById } from "../../actions/MySettingAction";
import { fetchGroups } from "../../actions/MessageAction";
import {
	fRQueueExtMsgSendHandler,
	getFriendsQueueRecords,
	popFriendsQueueRecordsFromQueue,
	removeFriendsQueueRecordsFromIndexDB,
	reorderFriendsQueueRecordsInIndexDB,
	reorderFriendsQueueRecordsToTop,
	resetUploadedFriendsQueueCsvReport,
	resetFriendsQueueRecordsMetadata,
	resetUploadedFriendsQueueRecordResponse,
	uploadFriendsQueueRecordsForReview,
	uploadFriendsQueueRecordsForSaving,
} from "../../actions/FriendsQueueActions";
import Modal from "./Modal";
import DeleteImgIcon from "../../assets/images/deleteModal.png";
import extensionAccesories from "../../configuration/extensionAccesories";
import { updateFilter } from "../../actions/FriendListAction";
import { updateMessageType } from "../../actions/MessageAction";
import useComponentVisible from "../../helpers/useComponentVisible";
import ToolTipPro from "./ToolTipPro";
import { alertBrodcater, fr_channel } from "./AlertBrodcater";
import "../../assets/scss/component/common/_page_header.scss";
import { addUsersToCampaign } from "../../actions/CampaignsActions";
import { utils } from "../../helpers/utils";
import DropSelectMessage from "../messages/DropSelectMessage";
import { useDropzone } from "react-dropzone";
import moment from "moment";

const syncBtnDefaultState = "Sync Now";
const syncStatucCheckingIntvtime = 1000 * 10;
const refethingDelayAfterSync = 1000 * 60 * 1;
var isStopingSync = false;

// Page-wise options
const pageOptoions = {
	messageOption: false,
	viewSelect: false,
	syncManual: false,
	searchHeader: false,
	sortHeader: false,
	filterHeader: false,
	quickAction: false,
	exportHeader: false,
	dynamicMergeFields: false,
	sendInviteHeader: false,
	listLabelView: false,
	notificationView: false,
	markNotificationRead: false,
	createHeader: false,
	templatesOptions: false,
	labelsTagsView: false,
	billingOptionsView: false,
	listingLengthWell: false,
	queryTopHeader: {
		active: false,
		content:
			"Due to limitations on how Facebook shows and counts friends there may be a slight mismatch between the number shown here and the number shown on your profile from Facebook.",
	},
};

// View options
const radioOptions = [
	{
		label: "List",
		checked: true,
	},
	// {
	//   label: "Label",
	//   checked: true,
	// },
];

const radioMessageOptions = [
	{
		label: "Dynamic Merge field",
		checked: true,
		data: "dmf",
	},
	// {
	//   label: "Segment",
	//   checked: false,
	//   data: "segment",
	// },
	// {
	//   label: "Group",
	//   checked: false,
	//   data: "group",
	// },
];

// Accessibility options
const accessibilityOptions = [
	// {
	//   type: "sortHeader",
	//   status: false,
	//   text: "Sort",
	//   icon: <SortIcon />,
	//   active: false,
	// },
	// {
	//   type: "filterHeader",
	//   status: false,
	//   text: "Filter",
	//   icon: <FilterIcon />,
	//   active: false,
	// },
	{
		type: "quickAction",
		status: false,
		text: "Actions",
		icon: <ActionIcon />,
		active: false,
	},
	{
		type: "queueListAction",
		status: false,
		text: "Actions",
		icon: <ActionIcon />,
		active: false,
	},
	// {
	//   type: "exportHeader",
	//   status: false,
	//   text: "Export",
	//   icon: <ExportIcon />,
	//   active: false,
	// },
];

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

// If the socket connection failed then reconnect
const socket = io(SOCKET_URL, {
	transports: ["websocket", "polling"], // use WebSocket first, if available
	auth: { token: localStorage.getItem("fr_token") },
});

socket.on("connect", function () {
	socket.emit("join", { token: localStorage.getItem("fr_token") });
});

socket.on("disconnect", (reason) => {
	// console.log("disconnect due to " + reason);
});

socket.on("connect_error", (e) => {
	//console.log("There Is a connection Error in header", e);
	socket.io.opts.transports = ["websocket", "polling"];
});

const baseStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "80px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "rgba(0, 148, 255, 1)",
	borderStyle: "dashed",
	backgroundColor: "rgba(0, 148, 255, 0.1)",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
	marginTop: "16px",
};

const focusedStyle = {
	borderColor: "#2196f3",
};

const acceptStyle = {
	borderColor: "#00e676",
};

const rejectStyle = {
	borderColor: "#ff1744",
};

function PageHeader({ headerText = "" }) {
	const dispatch = useDispatch();
	const searchRef = useRef(null);
	const params = useParams();
	const searchValue = useSelector((state) => state.friendlist.searched_filter);
	const { clickedRef, isComponentVisible, setIsComponentVisible } =
		useComponentVisible(false);
	const messageType = useSelector((state) => state.message.messageType);
	const actionRef = useRef(null);
	const location = useLocation();
	const token = localStorage.getItem("fr_token");
	const selectedFriends = useSelector(
		(state) => state.friendlist.selected_friends
	);
	const blacklistedFriends = useSelector((state) =>
		state.friendlist.selected_friends.filter((el) => el?.blacklist_status)
	);
	const defaultFbId = localStorage.getItem("fr_default_fb");
	const listCount = useSelector((state) => state.friendlist.curr_list_count);
	const facebookData = useSelector((state) => state?.facebook_data);
	const [links, setLinks] = useState([]);
	const [accessOptions, setAccessOptions] = useState(accessibilityOptions);
	const [headerOptions, setHeaderOptions] = useState(pageOptoions);
	const [modalOpen, setModalOpen] = useState(false);
	let savedFbUId = localStorage.getItem("fr_default_fb");
	const [inlineLoader, setInlineLoader] = useState(false);
	// const [selectedState, setSelectedState] = useState(true);
	const [whiteListable, setWhiteListable] = useState(false);
	const [blacklistable, setBlacklistable] = useState(false);
	const [isSyncing, setIsSyncing] = useState(true);
	const [toolTip, setTooltip] = useState("");
	const [whiteCountInUnfriend, setWhiteCountInUnfriend] = useState(null);
	const [blackCountInAddCampaign, setBlackCountInAddCampaign] = useState(null);
	const [messageTypeOpt, setMessageTypeOpt] = useState("dmf");
	const [runningUnfriend, setRunningUnfriend] = useState(false);
	const [isAddingToCampaign, setIsAddingToCampaign] = useState(false);
	const [selectedCampaign, setSelectedCampaign] = useState("Select");
	const campaignsCreated = useSelector(
		(state) => state.campaign.campaignsArray
	);
	const [campaignListSelector, setCampaignListSelector] = useState(false);
	const [selectedCampaignName, setSelectedCampaignName] = useState("Select");

	const refreshFrList = () => {
		dispatch(unLoadFrList());
		setTimeout(() => {
			dispatch(reLoadFrList());
		}, 300);
	};

	useEffect(() => {
		setSelectedCampaign("Select");
		setCampaignListSelector(false);
		setSelectedCampaignName("Select");
	}, [isAddingToCampaign]);

	useEffect(() => {
		if (!modalOpen) {
			setWhiteCountInUnfriend(null);
		}
	}, [modalOpen]);

	const closeAccessItem = (e) => {
		setIsComponentVisible(false);
	};

	useEffect(() => {
		if (!isComponentVisible) {
			const updatedAccess = accessOptions.map((accessObj) => {
				return {
					...accessObj,
					active: false,
				};
			});

			setAccessOptions(updatedAccess);
		}
	}, [isComponentVisible]);

	// const [isStopingSync, setIsStopingSync] = useState(false);
	alertBrodcater();

	const onSearchModified = useCallback((e) => {
		dispatch(updateFilter(e));
	}, []);

	const [update, setUpdate] = useState(syncBtnDefaultState);

	useEffect(() => {
		if (update === syncBtnDefaultState) {
			setIsSyncing(false);
		}
	}, [update]);

	socket.on("facebookLoggedOut", (logoutUpdate) => {
		//console.log("updates :::  ", logoutUpdate);
		setUpdate(syncBtnDefaultState);
		setInlineLoader(false);
		setIsSyncing("");
		dispatch(getFriendList({ fbUserId: localStorage.getItem("fr_default_fb") }))
			.unwrap()
			.then((response) => {
				if (response?.data?.length > 0) {
					setTooltip(response?.data[0]?.friend_details[0]?.updated_at);
					localStorage.setItem(
						"fr_tooltip",
						response?.data[0]?.friend_details[0]?.updated_at
					);
				}
			});
	});
	/**
	 * function to search array for not white-listed friend
	 * @param {Array} list
	 * @returns
	 */
	const searchForNotWhiteLst = (list) => {
		for (let i = 0; i < list.length; i++) {
			if (list[i].whitelist_status === 0 || !list[i].whitelist_status) {
				return true;
			}
		}
	};
	/**
	 * Function to search array fro not black-listed friend
	 * @param {Array} list
	 * @returns
	 */
	const searchForNotBlackLst = (list) => {
		for (let i = 0; i < list.length; i++) {
			if (list[i].blacklist_status === 0 || !list[i].blacklist_status) {
				return true;
			}
		}
	};

	useEffect(() => {
		setWhiteListable(searchForNotWhiteLst(selectedFriends));
		setBlacklistable(searchForNotBlackLst(selectedFriends));
	}, [selectedFriends]);

	useEffect(() => {
		const addAccess = accessOptions.map((accessObj) => {
			switch (accessObj.type) {
				case "sortHeader":
					return {
						...accessObj,
						status: headerOptions.sortHeader,
					};

				case "filterHeader":
					return {
						...accessObj,
						status: headerOptions.filterHeader,
					};

				case "quickAction":
					return {
						...accessObj,
						status: headerOptions.quickAction,
					};

				case "queueListAction":
					return {
						...accessObj,
						status: headerOptions.queueListAction,
					};

				case "exportHeader":
					return {
						...accessObj,
						status: headerOptions.exportHeader,
					};

				default:
					break;
			}
			return accessObj;
		});

		setAccessOptions(addAccess);
	}, [headerOptions]);

	useEffect(() => {
		const locationArray = [];
		const locationPathName = location.pathname
			.split("/")
			.filter((el) => el.trim() !== "");

		locationPathName.map((el, i) => {
			locationArray.push({
				location: el.replace("-", " "),
				key: i,
			});
		});

		// console.log("location array -- ", locationArray);

		setLinks(locationArray);

		validateHeaderOptions(locationPathName[locationPathName.length - 1]);
	}, [location]);

	const onAccessClick = (e) => {
		const updatedAccess = accessOptions.map((accessObj) => {
			if (accessObj.type === e.type) {
				closeAccessItem();
				return {
					...accessObj,
					active: !accessObj.active,
				};
			}
			return accessObj;
		});

		setAccessOptions(updatedAccess);
		setIsComponentVisible((current) => !current);
	};

	const validateHeaderOptions = useCallback((pathValue) => {
		// console.log("The Path Value -- ", pathValue);
		switch (pathValue) {
			case "settings":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "request-history":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "browser-manager":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "friend-list":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					syncManual: true,
					searchHeader: true,
					sortHeader: true,
					filterHeader: true,
					quickAction: true,
					exportHeader: true,
					listingLengthWell: true,
					queryTopHeader: {
						active: true,
						content:
							"Due to limitations on how Facebook shows and counts friends there may be a slight mismatch between the number shown here and the number shown on your profile from Facebook.",
					},
				});
				break;

			case "friends-queue":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					syncManual: true,
					searchHeader: true,
					queueListAction: true,
					exportCSV: true,
					listingLengthWell: true,
					queryTopHeader: {
						active: true,
						content:
							"Due to limitations on how Facebook shows and counts friends there may be a slight mismatch between the number shown here and the number shown on your profile from Facebook.",
					},
				});
				break;

			case "pending-request":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					listingLengthWell: true,
					quickAction: false,
					syncManual: true,
				});
				break;

			case "lost-friends":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					listingLengthWell: true,
					quickAction: false,
					syncManual: true,
				});
				break;

			case "unfriended-friends":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					listingLengthWell: true,
					quickAction: false,
					syncManual: true,
				});
				break;

			case "whitelisted-friends":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					quickAction: true,
					listingLengthWell: true,
					syncManual: true,
				});
				break;

			case "blacklisted-friends":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					quickAction: true,
					searchHeader: true,
					listingLengthWell: true,
					syncManual: true,
				});
				break;

			case "groups":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "segments":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "campaigns":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
					listingLengthWell: true,
				});
				break;

			case "connect-&-win":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "create-campaign":
				setHeaderOptions({
					...headerOptions,
					syncManual: true,
				});
				break;

			case "pending-request":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					syncManual: true,
					searchHeader: true,
					sortHeader: true,
					filterHeader: true,
					quickAction: false,
					exportHeader: true,
					listingLengthWell: true,
					infoToolTip: true,
				});
				break;

			case "deactivated-friends":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					syncManual: true,
					searchHeader: true,
					sortHeader: true,
					filterHeader: true,
					quickAction: false,
					exportHeader: true,
					listingLengthWell: true,
					infoToolTip: true,
				});
				break;

			default:
				if (params?.campaignId) {
					setHeaderOptions({
						...headerOptions,
						syncManual: true,
						listingLengthWell: true,
					});
				} else {
					setHeaderOptions({ ...pageOptoions, listingLengthWell: true });
				}
				break;
		}
	}, []);

	const getRandomInteger = (min, max) => {
		return Math.floor(Math.random() * (max - min)) + min;
	};

	const closeFilterDropdown = (item) => {
		//onsole.log(item.type == "quickAction" && item.active, accessOptions);
		const accessPlaceholder = [...accessOptions];
		accessPlaceholder.filter(
			(arrayOpt) =>
				(item.type === "quickAction" || item.type === "queueListAction") &&
				item.active,
			accessOptions
		)[0].active = false;
		setAccessOptions(accessPlaceholder);
	};

	const whiteLabeledUsers = (item) => {
		dispatch(removeSelectedFriends());
		closeFilterDropdown(item);
		if (selectedFriends && selectedFriends.length > 0) {
			let payload = selectedFriends.map((item) => {
				return {
					// token: token,
					fbUserId: defaultFbId,
					friendFbId: item.friendFbId,
					friendListId: item._id,
					status: 1,
				};
			});
			dispatch(whiteListFriend({ payload: payload, bulkAction: true }))
				.unwrap()
				.then((res) => {
					selectedFriends &&
						Alertbox(
							`${
								selectedFriends.length > 1 ? "Contacts" : "Contact"
							} whitelisted successfully!`,
							"success",
							1000,
							"bottom-right"
						);
					dispatch(updateWhiteListStatusOfSelectesList(res.data));
					//dispatch(removeSelectedFriends());
				})
				.catch((err) => {
					Alertbox(`${err.message} `, "error", 3000, "bottom-right");
					// dispatch(removeSelectedFriends());
				});
		}
	};

	const BlocklistUser = (item) => {
		dispatch(removeSelectedFriends());
		closeFilterDropdown(item);
		if (selectedFriends && selectedFriends.length > 0) {
			let payload = selectedFriends.map((item) => {
				return {
					// token: token,
					fbUserId: defaultFbId,
					friendFbId: item.friendFbId,
					status: 1,
				};
			});

			dispatch(BlockListFriend({ payload: payload, bulkAction: true }))
				.unwrap()
				.then((res) => {
					selectedFriends &&
						Alertbox(
							`${
								selectedFriends.length > 1 ? "Contacts" : "Contact"
							} blacklisted successfully!`,
							"success",
							3000,
							"bottom-right"
						);
					//dispatch(removeSelectedFriends());
				})
				.catch((err) => {
					Alertbox(`${err.message} `, "error", 2000, "bottom-right");
					//dispatch(removeSelectedFriends());
				});
		}
	};

	const checkBeforeUnfriend = async (item) => {
		if (item) {
			closeFilterDropdown(item);
		}
		if (selectedFriends && selectedFriends.length > 0) {
			let whiteCount = 0;
			for (let item of selectedFriends) {
				if (item.whitelist_status === 1) {
					whiteCount++;
				}
			}
			setWhiteCountInUnfriend(whiteCount);
			setModalOpen(true);
		}
	};

	const alterFriendsQueueRecordsOrder = (item) => {
		if (item) {
			closeFilterDropdown(item);
		}
		if (selectedFriends && selectedFriends.length > 0) {
			const fbIdList = [];
			selectedFriends?.forEach((item) => {
				if (item._id) {
					fbIdList.push(item?._id);
				}
			});
			dispatch(
				reorderFriendsQueueRecordsToTop({
					topRecords: fbIdList,
					fb_user_id: defaultFbId,
				})
			)
				.unwrap()
				.then((response) =>
					dispatch(reorderFriendsQueueRecordsInIndexDB(fbIdList))
				);
			// console.log(selectedFriends);
		}
	};

	const deleteRecordsFromFriendsQueue = (item) => {
		if (item) {
			closeFilterDropdown(item);
		}
		if (selectedFriends && selectedFriends.length > 0) {
			const fbIdList = [];
			selectedFriends?.forEach((item) => {
				if (item._id) {
					fbIdList.push(item?._id);
				}
			});
			dispatch(
				popFriendsQueueRecordsFromQueue({
					removeRecords: fbIdList,
					fb_user_id: defaultFbId,
				})
			)
				.unwrap()
				.then((payload) => {
					dispatch(removeFriendsQueueRecordsFromIndexDB(fbIdList));
				});
			// console.log(selectedFriends);
		}
	};

	const skipWhitList = () => {
		const listWithOutWhites = selectedFriends.filter((item) => {
			return item.whitelist_status !== 1;
		});
		unfriend(listWithOutWhites);
	};

	const handleBeforeUnload = (e) => {
		e.preventDefault();
		e.returnValue = "";
	};

	const checkFBConnection = async () => {
		const profileData = await fetchUserProfile();
		// if user id is present already with the facebook auth information then :
		if (profileData?.length) {
			if (profileData[0].fb_user_id != null && profileData[0].fb_user_id) {
				const facebookProfile = await extensionAccesories.sendMessageToExt({
					action: "syncprofile",
					frLoginToken: localStorage.getItem("fr_token"),
				});
				// console.log("facewbook data", facebookProfile);
				// console.log("profile datattat", profileData);
				//If auth profile and current logged in profile is not matching then :
				if (facebookProfile?.error == "No response") {
					// Alertbox(
					//   `Please login to following facebook account https://www.facebook.com/profile.php?id=${profileData[0]?.fb_user_id}`,
					//   "error",
					//   1000,
					//   "bottom-right"
					// );
					Alertbox(
						`Please login to following facebook account `,
						"error-toast",
						1000,
						"bottom-right",
						`https://www.facebook.com/profile.php?id=${profileData[0]?.fb_user_id}`
					);
					return false;
				}
				if (facebookProfile?.uid != profileData[0]?.fb_user_id) {
					// Alertbox(
					//   `Please login to following facebook account https://www.facebook.com/profile.php?id=${profileData[0]?.fb_user_id}`,
					//   "error",
					//   1000,
					//   "bottom-right"
					// );
					Alertbox(
						`Please login to following facebook account `,
						"error-toast",
						1000,
						"bottom-right",
						`https://www.facebook.com/profile.php?id=${profileData[0]?.fb_user_id}`
					);
					return false;
				}

				if (facebookProfile?.error) {
					// Alertbox(
					//   `Please login to following facebook account https://www.facebook.com/profile.php?id=${profileData[0]?.fb_user_id}`,
					//   "error",
					//   1000,
					//   "bottom-right"
					// );
					Alertbox(
						`Please login to following facebook account `,
						"error-toast",
						1000,
						"bottom-right",
						`https://www.facebook.com/profile.php?id=${profileData[0]?.fb_user_id}`
					);
					return false;
				}

				return true;
			}
		}
	};

	const campaignSelectFun = (item) => {
		//console.log("camo sele",item)
		setSelectedCampaignName(item?.campaign_name);
		setSelectedCampaign(item?.campaign_id);
	};

	const unfriend = async (unfriendableList = selectedFriends) => {
		// console.log("Calling unfriendddddddddd////////?????/////", unfriendableList);
		if (!unfriendableList?.length > 0) {
			Alertbox(
				`Some error happend in selecting prfiles`,
				"error",
				1000,
				"bottom-right"
			);
			return;
		}
		setModalOpen(false);

		let defaultFb = localStorage.getItem("fr_default_fb");
		let loggedInFb = localStorage.getItem("fr_current_fbId");

		let proceedFurther = await checkFBConnection();
		// console.log("proceed further ", proceedFurther);
		if (!proceedFurther) {
			return;
		}

		Alertbox(
			`Started to delete ${unfriendableList.length} friends, please don't logout from facebook or turn off the system`,
			"warning",
			3000,
			"bottom-right"
		);
		window.addEventListener("beforeunload", handleBeforeUnload);
		setRunningUnfriend(true);
		dispatch(removeSelectedFriends());
		for (let i = 0; i < unfriendableList.length; i++) {
			let item = unfriendableList[i];

			let payload = [
				{
					fbUserId: defaultFbId,
					friendFbId: item.friendFbId,
					friendListId: item._id,
					status: 1,
				},
			];
			const unfriendFromFb = await extensionAccesories.sendMessageToExt({
				action: "unfriend",
				frLoginToken: localStorage.getItem("fr_token"),
				payload: payload,
			});
			//console.timeEnd("send remove req");

			// console.log("unfriendFromFb", unfriendFromFb);

			dispatch(deleteFriend({ payload: payload }))
				.unwrap()
				.then((res) => {
					fr_channel.postMessage({
						cmd: "alert",
						type: "success",
						time: 3000,
						message: `${
							item.friendName
						} unfriended successfully!   (Unfriending ${i + 1}/${
							unfriendableList.length
						})`,
						position: "bottom-right",
					});
					Alertbox(
						`${item.friendName} unfriended successfully!   (Unfriending ${
							i + 1
						}/${unfriendableList.length})`,
						"success",
						3000,
						"bottom-right"
					);
				})
				.catch((err) => {
					//dispatch(removeSelectedFriends());
					Alertbox(`${err.message} `, "error", 3000, "bottom-right");
				});
			// dispatch(removeSelectedFriends());
			if (i !== unfriendableList.length - 1) {
				let delay = getRandomInteger(1000 * 5, 1000 * 60 * 1); // 5 secs to 1 min
				//console.time("wake up");
				await helper.sleep(delay);
				//console.timeEnd("wake up");
			}
		}
		setRunningUnfriend(false);
		window.removeEventListener("beforeunload", handleBeforeUnload);
	};

	const syncFriend = async () => {
		setInlineLoader(true);
		try {
			const facebookProfile = await extensionAccesories.sendMessageToExt({
				action: "syncprofile",
				frLoginToken: localStorage.getItem("fr_token"),
			});
			if (
				facebookProfile?.uid?.toString() !==
				localStorage.getItem("fr_default_fb")
			) {
				// alert(
				//   "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
				//   localStorage.getItem("fr_default_fb")
				// );
				Alertbox(
					`Please login to following facebook account `,
					"error-toast",
					2000,
					"bottom-right",
					`https://www.facebook.com/${localStorage.getItem("fr_default_fb")}`
				);
				setInlineLoader(false);
				return;
			}
			setUpdate("Syncing Friends...");
			setIsSyncing("active");

			let profileUpdate = {
				userId: facebookProfile.uid.toString(),
				name: facebookProfile.text,
				profilePicture: facebookProfile.photo,
				profileUrl: "https://www.facebook.com" + facebookProfile.path,
			};
			await saveUserProfile(profileUpdate);
			fetchUserProfile().then((res) => {
				if (res && res.length) {
					dispatch(setProfileSpaces(res));
				}
			});

			helper.setCookie("fr_isSyncing", "active");
			localStorage.setItem("fr_update", "Syncing Friends...");

			const friendCountPayload = {
				action: "syncFriendLength",
				frLoginToken: localStorage.getItem("fr_token"),
			};
			const facebookFriendLength = await extensionAccesories.sendMessageToExt(
				friendCountPayload
			);
			if (facebookFriendLength) {
				localStorage.setItem("friendLength", facebookFriendLength.friendLength);
				const friendListPayload = {
					action: "manualSyncFriendList",
					frLoginToken: localStorage.getItem("fr_token"),
				};

				let intv = setInterval(() => {
					checkSyncingStatus(intv);
				}, syncStatucCheckingIntvtime);

				const syncedFriends = await extensionAccesories.sendMessageToExt(
					friendListPayload
				);
			}
			//console.log("here::::");
		} catch (error) {
		} finally {
			// setInlineLoader(false);
		}
	};

	const fetchFriends = async () => {
		dispatch(getFriendList({ fbUserId: localStorage.getItem("fr_default_fb") }))
			.unwrap()
			.then((response) => {
				// console.log("response", response);
				if (response?.data?.length > 0 && response?.data[0]?.last_sync_at) {
					setTooltip(response?.data[0]?.last_sync_at);
					localStorage.setItem("fr_tooltip", response?.data[0]?.last_sync_at);
				} else {
					setTooltip("");
					localStorage.removeItem("fr_tooltip");
				}
			});
	};

	const fetchPendingFrRquest = async () => {
		dispatch(
			getSendFriendReqst({ fbUserId: localStorage.getItem("fr_default_fb") })
		)
			.unwrap()
			.then((res) => {
				// console.log("Pending Request List", res);
			});
	};

	const completeSync = async () => {
		// console.log("Stop syncing");
		setIsSyncing("");
		setUpdate(syncBtnDefaultState);
		setInlineLoader(false);
		// setIsStopingSync(false);
		isStopingSync = false;
		localStorage.removeItem("fr_update");
		// console.log("syncing completed_________________________>")
		Alertbox(
			"Friends syncing is successfully completed",
			"success",
			1000,
			"bottom-right"
		);
		fetchPendingFrRquest();
		fetchFriends();
	};

	const checkSyncingStatus = async (intv) => {
		let isSyncActive = helper.getCookie("fr_isSyncing");
		let syncingUpdate = localStorage.getItem("fr_update");

		if (syncingUpdate !== "Done") {
			setUpdate(syncingUpdate);
		}
		if (isSyncActive) {
			//console.log("set inline loader");
			setInlineLoader(true);
		}

		//console.log("is Syncing stoping", isStopingSync);

		if (!isSyncActive && syncingUpdate && !isStopingSync) {
			//console.log("stoping sync");
			clearInterval(intv);
			isStopingSync = true;
			// setIsStopingSync(true);
			await helper.sleep(refethingDelayAfterSync);
			await completeSync();
			setIsSyncing(false);
			// console.log("now ending:::::::");
		}
	};

	// Force stop syncing loader
	useEffect(() => {
		if (update === "Sync Now") {
			setIsSyncing("");
		}
	}, [update]);

	const checkIsSyncing = async () => {
		setInterval(() => {
			let isSyncActive = helper.getCookie("fr_isSyncing");
			let syncingUpdate = localStorage.getItem("fr_update");
			if (isSyncActive && syncingUpdate !== "Done") {
				setIsSyncing(true);
				setUpdate(syncingUpdate || "Syncing Friends...");
			} else if (syncingUpdate && !isStopingSync) {
				checkSyncingStatus();
			}
		}, 1000 * 10);
	};

	useEffect(() => {
		const addAccess = accessOptions.map((accessObj) => {
			switch (accessObj.type) {
				case "sortHeader":
					return {
						...accessObj,
						status: headerOptions.sortHeader,
					};
					break;
				case "filterHeader":
					return {
						...accessObj,
						status: headerOptions.filterHeader,
					};
					break;

				case "quickAction":
					return {
						...accessObj,
						status: headerOptions.quickAction,
					};
					break;

				case "queueListAction":
					return {
						...accessObj,
						status: headerOptions.queueListAction,
					};

				case "exportHeader":
					return {
						...accessObj,
						status: headerOptions.exportHeader,
					};
					break;

				default:
					break;
			}

			return accessObj;
		});

		setAccessOptions(addAccess);
	}, [headerOptions]);

	useEffect(() => {
		const locationArray = [];
		const locationPathName = location.pathname
			.split("/")
			.filter((el) => el.trim() !== "");

		locationPathName.map((el, i) => {
			locationArray.push({
				location: el.replace("-", " "),
				key: i,
			});
		});

		dispatch(fetchGroups())
			.unwrap()
			.then((res) => {
				const data = res?.data;
				// console.log(data);
				if (data && data.length) {
					setGroupMessages(data);
				}
			})
			.catch((error) =>
				console.log("Error when try to fetching all groups -- ", error)
			);

		setLinks(locationArray);

		validateHeaderOptions(locationPathName[locationPathName.length - 1]);
	}, [location]);

	useEffect(() => {
		let isSyncingActive = helper.getCookie("fr_isSyncing");
		//console.log("Cookie isSyncingActive = ", isSyncingActive);
		setIsSyncing(isSyncingActive);

		checkIsSyncing();

		if (
			facebookData?.fb_data == null ||
			facebookData?.fb_data == "" ||
			localStorage.getItem("fr_default_fb") !==
				facebookData?.fb_data?.fb_user_id ||
			localStorage.getItem("fr_user_id") !== facebookData?.fb_data?.user_id
		) {
			localStorage.setItem("fr_user_id", facebookData?.fb_data?.user_id);
			dispatch(
				getFriendList({ fbUserId: localStorage.getItem("fr_default_fb") })
			)
				.unwrap()
				.then((response) => {
					if (response) {
						if (!response?.data?.[0]?.last_sync_at) {
							setTooltip("");
							localStorage.removeItem("fr_tooltip");
						} else {
							localStorage.setItem(
								"fr_tooltip",
								response?.data[0]?.last_sync_at
							);
							setTooltip(response?.data[0]?.last_sync_at);
						}
					}
				});
		} else {
			setTooltip(facebookData?.fb_data?.last_sync_at);
		}

		if (isSyncingActive) {
			setUpdate(localStorage.getItem("fr_update"));

			// Check sync status
			let intv = setInterval(() => {
				checkSyncingStatus(intv);
			}, syncStatucCheckingIntvtime);
		} else {
			localStorage.removeItem("fr_update");
			setUpdate(syncBtnDefaultState);
		}
	}, []);

	const MassagebuttonClick = (messageType) => {
		// console.log("clicked msgobj::::>>", messageType);
		dispatch(updateMessageType(messageType.data));
	};

	useEffect(() => {
		if (messageType) {
			radioMessageOptions
				.filter((msg) => msg.data != messageType)
				.map((mapMsg) => (mapMsg.checked = false));
			radioMessageOptions.filter(
				(msg) => msg.data == messageType
			)[0].checked = true;
		}
	}, []);

	// useEffect(() => {
	//   console.log("isComponentVisible", isComponentVisible);
	// }, [isComponentVisible]);

	const TooltipDate = () => {
		function dateDiffInDays(a, b) {
			const _MS_PER_DAY = 1000 * 60 * 60 * 24;
			// Discard the time and time-zone information.
			const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

			return Math.floor((utc2 - utc1) / _MS_PER_DAY);
		}

		if (toolTip) {
			if (toolTip?.trim() !== "" || !isNaN(toolTip)) {
				// let differenceInDays = (new Date() - new Date(toolTip)) / (1000 * 60 * 60 * 24);
				let differenceInDays = Math.abs(
					dateDiffInDays(new Date(), new Date(toolTip))
				);
				//console.log('differenceInDays:::', differenceInDays);

				if (differenceInDays === 1) {
					return "Last sync: Successful 1 Day ago";
				} else if (differenceInDays > 1) {
					return `Last sync: Successful ${differenceInDays} days ago`;
				} else {
					return "Last sync: Successful Today";
				}
			} else {
				return "";
			}
		} else {
			return "";
		}
		// `Last sync : ${Math.ceil(new Date().getDate() - new Date(toolTip).getDate()) > 1 ?
		//   `${Math.ceil(new Date().getDate() - new Date(toolTip).getDate())} days ago` :
		//   Math.ceil(new Date().getDate() - new Date(toolTip).getDate()) === 1 ?
		//     `${Math.ceil(new Date().getDate() - new Date(toolTip).getDate())} day ago` : 'Today'}` :
		// ""
	};

	const checkBeforeAddToCampaign = async (item) => {
		if (item) {
			closeFilterDropdown(item);
		}
		if (selectedFriends && selectedFriends.length > 0) {
			let backCount = 0;
			for (let item of selectedFriends) {
				if (item.blacklist_status === 1) {
					backCount++;
				}
			}
			setBlackCountInAddCampaign(backCount);
			setIsAddingToCampaign(true);
		}
	};

	const skipBlackList = () => {
		// console.log("SKIP BLACKLISTED");
		const listWithOutBlacklisted = selectedFriends.filter((item) => {
			return item.blacklist_status !== 1;
		});
		// console.log("list ou black", listWithOutBlacklisted)
		AddToCampaign(listWithOutBlacklisted);
	};

	// Add selected / forwarded friends to campaign
	const AddToCampaign = (addFriendsToCampaign) => {
		//dispatch(removeSelectedFriends());
		try {
			// console.log('addFriendsToCampaign', addFriendsToCampaign, 'selectedCampaign', selectedCampaign)
			let payload = {
				campaignId: selectedCampaign,
				facebookUserId: localStorage.getItem("fr_default_fb"),
				friend_details: addFriendsToCampaign.map((item) => {
					return {
						friendFbId: item.friendFbId ? item.friendFbId : null,
						friendAddedAt: item.created_at ? item.created_at : null,
						finalSource: item.finalSource ? item.finalSource : null,
						friendName: item.friendName ? item.friendName : null,
						friendProfilePicture: item.friendProfilePicture
							? item.friendProfilePicture
							: null,
						friendProfileUrl: item.friendProfileUrl
							? item.friendProfileUrl
							: null,
						groupName: item.groupName ? item.groupName : null,
						status: "pending",
						groupUrl: item.groupUrl ? item.groupUrl : null,
						matchedKeyword: item.matchedKeyword ? item.matchedKeyword : null,
					};
				}),
			};
			dispatch(addUsersToCampaign(payload))
				.unwrap()
				.then((res) => {
					refreshFrList();
					dispatch(removeSelectedFriends());
					Alertbox(
						`${addFriendsToCampaign?.length} friend(s) has been added to campaign successfully.`,
						"success",
						1000,
						"bottom-right"
					);
				})
				.catch((err) => {
					console.log("Add to campaign:", err);
				});
			setIsAddingToCampaign(false);
			setSelectedCampaign("Select");
		} catch (error) {
			Alertbox(`${error}`, "error", 1000, "bottom-right");
		}
	};

	const skipAddingToCampaign = () => {
		//dispatch(removeSelectedFriends());
		setSelectedCampaign("Select");
		setIsAddingToCampaign(false);
	};

	// console.log(accessOptions);
	const [showKeywordSuggestionBar, setShowKeywordSuggestionBar] =
		useState(false);
	const [keyword, setKeyword] = useState("");
	const [selectedKeyword, setSelectedKeyword] = useState([]);
	const [savedKeyword, setSavedKeyword] = useState([]);
	const [shouldModify, setShouldModify] = useState(false);

	const timeout = useRef(null);

	const [selectedCsvFile, setSelectedCsvFile] = useState(null);
	const [showUploadCsvModal, setShowUploadCsvModal] = useState(false);
	const [taskName, setTaskName] = useState(`CSV Upload ${Date.now()}`);
	const [friendsQueueCsvUploadStep, setFriendsQueueCsvUploadStep] = useState(0);

	const [selectMessageOptionOpen1, setSelectMessageOptionOpen1] =
		useState(false);
	const [groupMessages, setGroupMessages] = useState([]);
	const [groupMsgSelect1, setGroupMsgSelect1] = useState(null);
	const [quickMsg1, setQuickMsg1] = useState(null);
	const [quickMsgModalOpen1, setQuickMsgModalOpen1] = useState(false);
	const [usingSelectOption1, setUsingSelectOption1] = useState(false);
	const [unselectedError1, setUnselectedError1] = useState(false);

	const [selectMessageOptionOpen2, setSelectMessageOptionOpen2] =
		useState(false);
	const [groupMsgSelect2, setGroupMsgSelect2] = useState(null);
	const [quickMsg2, setQuickMsg2] = useState(null);
	const [quickMsgModalOpen2, setQuickMsgModalOpen2] = useState(false);
	const [usingSelectOption2, setUsingSelectOption2] = useState(false);
	const [unselectedError2, setUnselectedError2] = useState(false);

	const uploadedFriendsQueueCsvReport = useSelector(
		(state) => state.friendsQueue.uploadedFriendsQueueCsvReport
	);
	const uploadedFriendsQueueRecordResponse = useSelector(
		(state) => state.friendsQueue.uploadedFriendsQueueRecordResponse
	);
	const friendsQueueSettings = useSelector(
		(state) => state.friendsQueue.friendsQueueSettings
	);

	useEffect(() => {
		if (quickMsg1) {
			setUsingSelectOption1(false);
		}
	}, [quickMsg1]);

	useEffect(() => {
		if (quickMsg2) {
			setUsingSelectOption2(false);
		}
	}, [quickMsg2]);

	// HANDLE THE DIFFERENT SELECT OPTION ON ONE COMPONENT AS KEEP ONLY ONE AT A TIME..
	useEffect(() => {
		const selectMsgUsing = localStorage.getItem("fr_using_campaigns_message");

		if (quickMsg1 && !selectMsgUsing) {
			setGroupMsgSelect1(null);
		}
		if (selectMsgUsing) {
			setQuickMsg1(null);
		}
	}, [groupMsgSelect1, quickMsg1]);

	useEffect(() => {
		const selectMsgUsing = localStorage.getItem("fr_using_campaigns_message");

		if (quickMsg2 && !selectMsgUsing) {
			setGroupMsgSelect2(null);
		}
		if (selectMsgUsing) {
			setQuickMsg2(null);
		}
	}, [groupMsgSelect2, quickMsg2]);

	useEffect(() => {
		dispatch(
			resetFriendsQueueRecordsMetadata({
				firstChunkLength: 0,
				limitUsed: 0,
				totalCount: 0,
			})
		);
		dispatch(getFriendsQueueRecords());

		return () => {
			localStorage.removeItem("fr_edit_mode_quickCampMsg");
			localStorage.removeItem("fr_quickMessage_campaigns_message");
		};
	}, []);

	const handleShowCsvUploadModal = () => {
		setTaskName(`CSV Upload ${moment().format("YYYYMMDDHHmmss")}`);
		setSelectedCsvFile(null);
		setShowUploadCsvModal(true);
		setFriendsQueueCsvUploadStep(0);
		setSelectedCsvFile(null);
		setSavedKeyword([]);
		setGroupMsgSelect1(null);
		setGroupMsgSelect2(null);
		setQuickMsg1(null);
		setQuickMsg2(null);
		setKeyword("");
		setShowKeywordSuggestionBar(false);
		dispatch(resetUploadedFriendsQueueCsvReport(null));
		dispatch(resetUploadedFriendsQueueRecordResponse(null));
	};

	const onDrop = useCallback((acceptedFiles) => {
		if (acceptedFiles && acceptedFiles[0].size <= 1048576) {
			setSelectedCsvFile(acceptedFiles);
			setFriendsQueueCsvUploadStep(friendsQueueCsvUploadStep + 1);
		}

		if (acceptedFiles && acceptedFiles[0].size > 1048576) {
			Alertbox(
				`The file you are attempting to upload exceeds 1MB in size.`,
				"error",
				1000,
				"bottom-right"
			);
		}
	}, []);

	const onError = useCallback((Error) => {
		console.log(Error);
	}, []);

	// console.log(selectedCsvFile);

	const handleCsvUpload = () => {
		if (selectedCsvFile && taskName && !uploadedFriendsQueueCsvReport) {
			const data = {
				csvFile: selectedCsvFile[0],
				taskName: taskName,
				fb_user_id: defaultFbId,
			};
			dispatch(resetUploadedFriendsQueueCsvReport(null));
			dispatch(uploadFriendsQueueRecordsForReview(data))
				.unwrap()
				.then((response) => response)
				.catch((error) => {
					if (error) {
						// console.log(error);
						setSelectedCsvFile(null);
						Alertbox(
							`Failed to initiate the review of the CSV file.`,
							"error",
							1000,
							"bottom-right"
						);
					}
				});
			setFriendsQueueCsvUploadStep(friendsQueueCsvUploadStep + 1);
		}
		if (uploadedFriendsQueueCsvReport) {
			setFriendsQueueCsvUploadStep(friendsQueueCsvUploadStep + 1);
		}
	};

	// console.log(friendsQueueCsvUploadStep);

	const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
		useDropzone({
			onDrop,
			onError,
			accept: { "text/csv": [".csv"] },
			multiple: false,
			// maxSize: 1000000,
		});

	const style = useMemo(
		() => ({
			...baseStyle,
			...(isFocused ? focusedStyle : {}),
			...(isDragAccept ? acceptStyle : {}),
			...(isDragReject ? rejectStyle : {}),
		}),
		[isFocused, isDragAccept, isDragReject]
	);

	const [keywordSuggestions, setKeywordSuggestions] = useState([
		"Front-end Developer",
		"Marketer",
		"AI & UX",
		"Founder",
		"CEO",
		"CTO",
		"Digital",
		"Co-Founder",
		"Business",
		"Design",
		"Manager",
		"Startup",
	]);

	const handleSaveKeywords = () => {
		// if (keyword && !savedKeyword.includes(keyword.trim())) {
		// 	setSavedKeyword([...savedKeyword, keyword]);
		// 	setSelectedKeyword([]);
		// 	setShowKeywordSuggestionBar(false);
		// 	setShouldModify(true);
		// }
		if (selectedKeyword.length) {
			const copyOfSavedKeyword = [...savedKeyword];
			selectedKeyword.forEach((item) => {
				if (!copyOfSavedKeyword.includes(item)) {
					copyOfSavedKeyword.push(item);
				}
			});
			setSavedKeyword(copyOfSavedKeyword);
			setSelectedKeyword([]);
			// setShowKeywordSuggestionBar(false);
			setShouldModify(true);
		}
	};

	const handleClearKeywords = () => {
		setKeyword("");
		setSelectedKeyword([]);
	};

	const handleKeywordOnClick = (keywordItem) => {
		if (keywordItem && !selectedKeyword.includes(keywordItem.trim())) {
			setSelectedKeyword([...selectedKeyword, keywordItem]);
		}
	};

	const handleImportFriendsQueueCsv = () => {
		if (uploadedFriendsQueueCsvReport) {
			let friendRequestSent = null;
			let friendRequestAccepted = null;

			if (groupMsgSelect1 && groupMsgSelect1._id) {
				friendRequestSent = {
					groupId: groupMsgSelect1._id,
					quickMessage: "",
				};
			}

			if (quickMsg1 && quickMsg1.text) {
				friendRequestSent = {
					groupId: "",
					quickMessage: quickMsg1.text,
				};
			}

			if (groupMsgSelect2 && groupMsgSelect2._id) {
				friendRequestAccepted = {
					groupId: groupMsgSelect2._id,
					quickMessage: "",
				};
			}

			if (quickMsg2 && quickMsg2.text) {
				friendRequestAccepted = {
					groupId: "",
					quickMessage: quickMsg2.text,
				};
			}

			const data = {
				taskId: uploadedFriendsQueueCsvReport?.result?.taskId,
				fb_user_id: defaultFbId,
				keywords: savedKeyword,
				friendRequestSent: friendRequestSent,
				friendRequestAccepted: friendRequestAccepted,
			};

			dispatch(resetUploadedFriendsQueueRecordResponse(null));

			dispatch(uploadFriendsQueueRecordsForSaving(data))
				.unwrap()
				.then((response) => {
					if (response) {
						// console.log(response);
						Alertbox(
							`Initiating the upload of the CSV file.`,
							"success",
							1000,
							"bottom-right"
						);
						if (friendsQueueSettings) {
							// console.log(friendsQueueSettings)
							fRQueueExtMsgSendHandler(friendsQueueSettings);
						}
					}
				})
				.catch((error) => {
					if (error) {
						console.log(error);
						Alertbox(
							`Failed to initiate the upload of the CSV file.`,
							"error",
							1000,
							"bottom-right"
						);
					}
				});
		}
	};

	useEffect(() => {
		if (uploadedFriendsQueueRecordResponse) {
			timeout.current = setTimeout(() => {
				setShowUploadCsvModal(false);
				setFriendsQueueCsvUploadStep(0);
				dispatch(resetUploadedFriendsQueueCsvReport(null));
				dispatch(resetUploadedFriendsQueueRecordResponse(null));
				dispatch(
					resetFriendsQueueRecordsMetadata({
						firstChunkLength: 0,
						limitUsed: 0,
						totalCount: 0,
					})
				);
				dispatch(getFriendsQueueRecords());
			}, 3000);
		}

		return () => clearTimeout(timeout);
	}, [uploadedFriendsQueueRecordResponse]);

	const handleClickDownloadSampleCsv = () => {
		const sampleCsvHeader = "Facebook id,Facebook profile URL,Keywords";
		const sampleCsvBlob = new Blob([sampleCsvHeader], {
			type: "text/csv;charset=utf-8,",
		});
		const sampleCsvUrl = URL.createObjectURL(sampleCsvBlob);
		const sampleCsvLink = document.createElement("a");
		sampleCsvLink.setAttribute("href", sampleCsvUrl);
		sampleCsvLink.setAttribute("download", "sample_csv.csv");
		sampleCsvLink.click();
	};

	const handleClickDownloadErrorList = (url) => {
		if (url) {
			const errorListLink = document.createElement("a");
			errorListLink.setAttribute("href", url);
			errorListLink.click();
		}
	};

	return (
		<>
			{/* <Prompt
        when={runningUnfriend}
        message={() => 'Are you sure you want to leave this page? Your changes will not be saved.'}
      /> */}
			{selectedFriends?.length > 0 && (
				<Modal
					modalType='delete-type'
					modalIcon={DeleteImgIcon}
					headerText={"Unfriend"}
					bodyText={
						<>
							You have selected <b>{selectedFriends.length}</b> friend(s), and{" "}
							<b>
								{" "}
								{selectedFriends.length > 0
									? // ? selectedFriends.reduce((acc, curr) => acc + curr.whitelist_status, 0)
									  selectedFriends.filter((el) => el?.whitelist_status)?.length
									: Number(0)}{" "}
							</b>{" "}
							of them are currently on your whitelist. Are you sure you want to
							remove all of these friend(s) from your list?
						</>
					}
					closeBtnTxt={"Yes, unfriend"}
					closeBtnFun={unfriend}
					open={modalOpen}
					setOpen={setModalOpen}
					ModalFun={skipWhitList}
					btnText={"Skip whitelisted"}
					ExtraProps={{
						primaryBtnDisable:
							whiteCountInUnfriend === 0 ||
							whiteCountInUnfriend === selectedFriends.length
								? true
								: false,
					}}
				/>
			)}

			{/* Modal for Campaign Add */}
			{selectedFriends?.length > 0 && isAddingToCampaign && (
				<Modal
					ModalIconElement={CampaignModalIcon}
					headerText={"Add to Campaign"}
					bodyText={
						<>
							You have selected <b>{selectedFriends.length}</b> friend(s)
							{blacklistedFriends?.length > 0 ? (
								<>
									, and <b>{blacklistedFriends?.length}</b> of them
									{blacklistedFriends?.length > 1 ? " are" : " is"} currently on
									your blacklist
								</>
							) : (
								""
							)}
							. Are you sure you want to add{" "}
							{blacklistedFriends?.length > 1
								? "all of these friends"
								: "this friend"}{" "}
							to campaign?
						</>
					}
					closeBtnTxt={
						blacklistedFriends?.length > 0 ? "Skip blacklisted" : "Cancel"
					}
					closeBtnFun={
						blacklistedFriends?.length > 0
							? skipBlackList
							: skipAddingToCampaign
					}
					open={isAddingToCampaign}
					setOpen={() => {
						setIsAddingToCampaign(null);
						setSelectedCampaign("Select");
					}}
					ModalFun={() => AddToCampaign(selectedFriends)}
					btnText={blacklistedFriends?.length > 0 ? "Yes, add all" : "Add"}
					modalWithChild={true}
					ExtraProps={{
						primaryBtnDisable:
							campaignsCreated?.length <= 0 || selectedCampaign === "Select",
						cancelBtnDisable:
							blacklistedFriends.length > 0
								? selectedFriends?.length === blacklistedFriends?.length
									? true
									: selectedCampaign === "Select"
									? true
									: false
								: false,
					}}
					additionalClass='add-campaign-modal'
				>
					{/* If Campaign created, list else disable and show link for creation */}
					<>
						<h6>Choose campaign</h6>
						<span
							className='select-wrapers w-100'
							onClick={() => {
								setCampaignListSelector(!campaignListSelector);
							}}
						>
							<div className='selector_box'>
								{utils.cropParagraph(selectedCampaignName, 32)}
								{campaignsCreated?.length > 0 && campaignListSelector && (
									<ul className='selector_box_options'>
										{campaignsCreated?.map((item, index) => {
											return (
												<li
													value={item.campaign_id}
													key={"fr-select" + index}
													onClick={() => campaignSelectFun(item)}
												>
													{item?.campaign_name}
												</li>
											);
										})}
									</ul>
								)}

								<span className='select-arrow'></span>
							</div>
						</span>
						{campaignsCreated?.length <= 0 && (
							<span className='inline-note warning-note-inline'>
								<InfoIcon />
								You haven’t created any campaign(s) yet.{" "}
								<Link
									// to='/messages/campaigns/create-campaign'
									to='/campaigns/create-campaign'
									className='inline-icon'
									// target="_blank"
									onClick={() => setIsAddingToCampaign(false)}
								>
									Create campaign <OpenInNewTab />
								</Link>
							</span>
						)}
					</>
				</Modal>
			)}

			{headerOptions.exportCSV && showUploadCsvModal && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Import data"}
					bodyText={
						<>
							{friendsQueueCsvUploadStep === 3 &&
							uploadedFriendsQueueCsvReport ? (
								<>
									<div className='friend-request-queue-message-field'>
										<label className='friend-request-sent-message-label'>
											Send message when friend request is sent (optional)
										</label>

										<DropSelectMessage
											type='CAMPAIGNS_MESSAGE'
											placeholder='Select message group'
											openSelectOption={selectMessageOptionOpen1}
											handleIsOpenSelectOption={setSelectMessageOptionOpen1}
											groupList={groupMessages}
											groupSelect={groupMsgSelect1}
											setGroupSelect={setGroupMsgSelect1}
											quickMessage={quickMsg1 && quickMsg1}
											setQuickMessage={setQuickMsg1}
											quickMsgModalOpen={quickMsgModalOpen1}
											setQuickMsgOpen={setQuickMsgModalOpen1}
											isDisabled={false}
											usingSelectOptions={usingSelectOption1}
											setUsingSelectOptions={setUsingSelectOption1}
											unselectedError={unselectedError1}
											setUnselectedError={setUnselectedError1}
											customWrapperClass='friend-request-queue-select-msg-wrapper'
											customSelectPanelClass='friend-request-queue-select-panel'
											customSelectPanelPageClass='friend-request-queue-select-panel-page'
											customQuickMsgTooltipStyleClass='campaigns-quick-msg-tooltip'
										/>
									</div>

									<div className='friend-request-queue-message-field'>
										<label className='friend-request-accepted-message-label'>
											Send message when friend request is accepted (optional)
										</label>

										<DropSelectMessage
											type='CAMPAIGNS_MESSAGE'
											placeholder='Select message group'
											openSelectOption={selectMessageOptionOpen2}
											handleIsOpenSelectOption={setSelectMessageOptionOpen2}
											groupList={groupMessages}
											groupSelect={groupMsgSelect2}
											setGroupSelect={setGroupMsgSelect2}
											quickMessage={quickMsg2 && quickMsg2}
											setQuickMessage={setQuickMsg2}
											quickMsgModalOpen={quickMsgModalOpen2}
											setQuickMsgOpen={setQuickMsgModalOpen2}
											isDisabled={false}
											usingSelectOptions={usingSelectOption2}
											setUsingSelectOptions={setUsingSelectOption2}
											unselectedError={unselectedError2}
											setUnselectedError={setUnselectedError2}
											customWrapperClass='friend-request-queue-select-msg-wrapper'
											customSelectPanelClass='friend-request-queue-select-panel'
											customSelectPanelPageClass='friend-request-queue-select-panel-page'
											customQuickMsgTooltipStyleClass='campaigns-quick-msg-tooltip'
										/>
									</div>

									<div className='import-data-input keyword-input'>
										<label className='task-name-label keywords-label'>
											Keywords (optional)
											{!keyword && !selectedKeyword.length && !shouldModify ? (
												<figure
													className='icon-arrow-down'
													onClick={() =>
														setShowKeywordSuggestionBar(
															!showKeywordSuggestionBar
														)
													}
												>
													<ChevronDownArrowIcon size={18} />
												</figure>
											) : null}
											{(keyword || selectedKeyword.length) && !shouldModify ? (
												<>
													<div
														className='keyword-clear-action'
														onClick={handleClearKeywords}
													>
														Clear selection
													</div>
													<div
														className='keyword-save-action'
														onClick={handleSaveKeywords}
													>
														Save
													</div>
												</>
											) : null}
											{shouldModify ? (
												<div
													className='keyword-save-action'
													onClick={() => setShouldModify(false)}
												>
													Modify
												</div>
											) : null}
										</label>
										<input
											type='text'
											className={`task-name-field keyword-field`}
											value={keyword}
											onChange={(e) => {
												setKeyword(e.target.value);
												setShowKeywordSuggestionBar(true);
											}}
											onKeyDown={(e) => {
												if (
													e.key === "Enter" &&
													keyword &&
													e.target.value &&
													e.target.value.trim() &&
													!keywordSuggestions.includes(e.target.value.trim())
												) {
													setKeywordSuggestions([
														...keywordSuggestions,
														e.target.value.trim(),
													]);
													setKeyword("");
												}
											}}
											placeholder='Type your keywords here'
											style={
												showKeywordSuggestionBar ? {} : { marginBottom: "8px" }
											}
										/>
										{showKeywordSuggestionBar && (
											<div className='keyword-suggestion-bar'>
												{!shouldModify &&
													keywordSuggestions.map((item, index) => (
														<button
															className={
																selectedKeyword.includes(item) ||
																savedKeyword.includes(item)
																	? "keyword-item saved"
																	: "keyword-item"
															}
															key={index}
															onClick={() => handleKeywordOnClick(item)}
														>
															{item}
														</button>
													))}
												{shouldModify &&
													savedKeyword.map((item, index) => (
														<button
															className={"keyword-item saved should-modify"}
															key={index}
														>
															{item}
															<WhiteCrossIcon
																className='cross-icon'
																onClick={() =>
																	setSavedKeyword(
																		savedKeyword.filter(
																			(keyword) => keyword !== item
																		)
																	)
																}
															/>
														</button>
													))}
											</div>
										)}
									</div>

									<div className='uploaded-csv-report'>
										<div className='report-block'>
											<div className='block-title'>
												<span className='block-txt'>Total records</span>
												<GrayWarningCircleIcon className='import-csv-report-tooltip-icon' />
												<div className='import-csv-report-tooltip'>
													Total no. of records found in the uploaded sheet
												</div>
											</div>
											<div className='block-stat total'>
												{
													uploadedFriendsQueueCsvReport?.result
														?.totalNumberOfRecords
												}
											</div>
										</div>
										<div className='report-block'>
											<div className='block-title'>
												<span className='block-txt'>Records added</span>
												<GrayWarningCircleIcon className='import-csv-report-tooltip-icon' />
												<div className='import-csv-report-tooltip'>
													Total no. of records added from the uploaded sheet
												</div>
											</div>
											<div className='block-stat added'>
												{
													uploadedFriendsQueueCsvReport?.result
														?.numberOfRecordsWillBeAdded
												}
											</div>
										</div>
									</div>
									<div className='uploaded-csv-report'>
										<div className='report-block'>
											<div className='block-title'>
												<span className='block-txt'>Records skipped</span>
												<GrayWarningCircleIcon className='import-csv-report-tooltip-icon' />
												<div className='import-csv-report-tooltip'>
													Users skipped as they are already present in the
													friend queue.
												</div>
											</div>
											<div className='block-stat skipped'>
												{
													uploadedFriendsQueueCsvReport?.result
														?.numberOfSkippedRecords
												}
											</div>
										</div>
										<div className='report-block'>
											<div className='block-title'>
												<span className='block-txt'>Number of errors</span>
												<GrayWarningCircleIcon className='import-csv-report-tooltip-icon' />
												<div className='import-csv-report-tooltip'>
													Total number of errors found. Download the error list
													file to review and address the issues.
												</div>
											</div>
											<div className='block-stat errors'>
												{uploadedFriendsQueueCsvReport?.result?.numberOfErrors}
											</div>
										</div>
									</div>
									<div className='custom-modal-footer report-footer'>
										<div
											className='download-sample-csv'
											onClick={() =>
												handleClickDownloadErrorList(
													uploadedFriendsQueueCsvReport?.fileUrl
												)
											}
										>
											<CsvDownloadIcon className='csv-download-icon' />
											<div className='download-sample-csv-txt1'>
												Download&nbsp;
											</div>
											<div className='download-sample-csv-txt2'>error list</div>
										</div>
										<button
											type='button'
											className={
												selectedCsvFile && taskName
													? "import-csv-nxt-btn active"
													: "import-csv-nxt-btn disabled"
											}
											onClick={handleImportFriendsQueueCsv}
										>
											Import
											<WhiteArrowLeftIcon className='next-icon' />
										</button>
									</div>
								</>
							) : (
								<div className='import-data-input'>
									<label className='task-name-label'>
										Task name <span className='danger-note'>*</span>
									</label>

									<input
										type='text'
										className={`task-name-field `}
										value={taskName}
										onChange={(e) => setTaskName(e.target.value)}
									/>

									<div
										className='import-csv'
										{...getRootProps({ style })}
									>
										<input {...getInputProps()} />
										{selectedCsvFile && friendsQueueCsvUploadStep === 1 ? (
											<>
												<SheetIcon className='import-csv-icon' />
												<p className='import-csv-txt'>
													CSV file is ready for upload...
												</p>
												<span className='import-condition-one'>
													{selectedCsvFile[0]?.name}
												</span>
											</>
										) : selectedCsvFile &&
										  friendsQueueCsvUploadStep === 2 &&
										  !uploadedFriendsQueueCsvReport ? (
											<>
												<ProgressIconOne className='import-csv-icon' />
												<span className='progress'>98%</span>
												<p className='import-csv-txt'>
													The CSV file is currently in the process of being
													uploaded and reviewed
												</p>
												<span className='import-condition-one'>
													{selectedCsvFile[0]?.name}
												</span>
											</>
										) : uploadedFriendsQueueCsvReport ? (
											<>
												<ProgressIconTwo className='import-csv-icon' />
												<p className='import-csv-txt'>
													CSV file successfully uploaded and reviewed
												</p>
											</>
										) : (
											<>
												<UploadIcon className='import-csv-icon' />
												<p className='import-csv-txt'>
													Drag & drop or{" "}
													<span className='sub-txt'>Choose file</span> to upload
												</p>
												<span className='import-condition-one'>
													Supported formats: csv
												</span>
												<span className='import-condition-two'>
													(Maximum upload size is 1 MB)
												</span>
											</>
										)}
									</div>
									<p className='import-csv-note'>
										<span className='danger-note'>* Note: </span>Ensure your
										data sheet includes links to Facebook profiles or the user
										IDs of Facebook users.
									</p>
									<div className='custom-modal-footer'>
										<div
											className='download-sample-csv'
											onClick={handleClickDownloadSampleCsv}
										>
											<CsvDownloadIcon className='csv-download-icon' />
											<div className='download-sample-csv-txt1'>
												Download&nbsp;
											</div>
											<div className='download-sample-csv-txt2'>
												sample template
											</div>
										</div>
										<button
											type='button'
											className={
												selectedCsvFile && taskName
													? "import-csv-nxt-btn active"
													: "import-csv-nxt-btn disabled"
											}
											onClick={handleCsvUpload}
										>
											Next
											{selectedCsvFile && taskName ? (
												<WhiteArrowLeftIcon className='next-icon' />
											) : (
												<NextIcon className='next-icon' />
											)}
										</button>
									</div>
								</div>
							)}
						</>
					}
					open={showUploadCsvModal}
					setOpen={setShowUploadCsvModal}
					ModalFun={() => {}}
					additionalClass={`import-csv-modal`}
					modalButtons={false}
				/>
			)}

			<div className='common-header d-flex f-align-center f-justify-between'>
				<div className='left-div d-flex d-flex-column'>
					<div className='header-breadcrumb'>
						<h2 className='d-flex'>
							{/* {console.log(
								"links[links.length - 1]",
								links[links.length - 2]?.location
							)} */}
							{headerText !== ""
								? headerText
								: links.length > 0
								? links[links.length - 2]?.location !== "campaigns"
									? links[links.length - 1].location
									: "Campaigns"
								: ""}
							{headerOptions.listingLengthWell && (
								<span className='num-header-count num-well'>{listCount}</span>
							)}
							{headerOptions.infoToolTip && (
								<ToolTipPro
									type={"query"}
									textContent={
										"This count is only based on the friend requests sent by Friender"
									}
								/>
							)}

							{headerOptions.queryTopHeader.active ? (
								<Tooltip
									textContent={headerOptions.queryTopHeader.content}
									type={"query"}
								/>
							) : (
								""
							)}
						</h2>
					</div>
					<div className='menu-breadcrumb'>
						{links?.length > 0 ? <BreadCrumb links={links} /> : ""}
					</div>
				</div>
				<div className='right-div d-flex f-align-center'>
					{headerOptions.viewSelect && (
						<div className='fr-listing-view no-click'>
							{/* <Radio
                name="list-type"
                options={radioOptions}
                onChangeMethod={onChangeHandler}
              /> */}
						</div>
					)}
					{headerOptions.exportCSV && (
						<div
							className='export-csv-action'
							onClick={handleShowCsvUploadModal}
						>
							<ExportCSVIcon className='export-csv-icon' />
							<div className='export-csv-tooltip'>CSV upload</div>
						</div>
					)}

					{headerOptions.searchHeader && (
						<Search
							extraClass='fr-search-header'
							itemRef={searchRef}
							onSearch={onSearchModified}
							searchValue={searchValue}
							placeholderText='Search'
						/>
					)}
					{headerOptions.syncManual && (
						<div className='fr-sync-header'>
							<button
								className={`fr-fb-sync btn h-100 ${isSyncing ? "active" : ""}`}
								onClick={syncFriend}
								disabled={inlineLoader ? true : false}
							>
								<figure>
									<FacebookSyncIcon />
								</figure>
								<span className='sync-text'>
									{update || syncBtnDefaultState}
								</span>
							</button>
							<span className='last-sync-status text-center'>
								<TooltipDate />
							</span>
						</div>
					)}

					{accessOptions.filter((e) => e.status).length > 0 ? (
						<div className='fr-accessibility-buttons d-flex f-align-center'>
							{/*
              {headerOptions.dynamicMergeFields && }
              {headerOptions.sendInviteHeader && }
              {headerOptions.listLabelView && }
              {headerOptions.notificationView && }
              {headerOptions.markNotificationRead && }
              {headerOptions.createHeader && }
              {headerOptions.templatesOptions && }
              {headerOptions.labelsTagsView && } */}

							{accessOptions
								.filter((e) => e.status)
								.map((accessItem, i) => (
									<div
										className='fr-access-item h-100'
										key={"access-" + i}
										ref={clickedRef}
									>
										<button
											className={`accessibility-btn btn h-100 ${
												accessItem.active || accessItem.type == "exportHeader"
													? "active"
													: ""
											}`}
											key={accessItem.type + i}
											onClick={() => onAccessClick(accessItem)}
											ref={
												accessItem.type === "quickAction" ||
												accessItem.type === "queueListAction"
													? actionRef
													: null
											}
										>
											<figure className='accessibility-icon'>
												{accessItem.icon}
											</figure>
											<span className='accessibility-text'>
												{accessItem.text}
											</span>
										</button>
										{accessItem.type === "queueListAction" &&
											isComponentVisible && (
												<div
													className={`fr-dropdown fr-dropdownAction ${
														accessItem.type === "queueListAction" &&
														accessItem.active
															? "active"
															: ""
													}`}
												>
													<ul>
														<li
															className='del-fr-action'
															onClick={() =>
																deleteRecordsFromFriendsQueue(accessItem)
															}
															data-disabled={
																!selectedFriends || selectedFriends.length === 0
																	? true
																	: false
															}
														>
															<figure>
																<UnfriendIcon />
															</figure>
															<span>Remove</span>
														</li>
														<li
															className='del-fr-action'
															onClick={() =>
																alterFriendsQueueRecordsOrder(accessItem)
															}
															data-disabled={
																!selectedFriends || selectedFriends.length === 0
																	? true
																	: false
															}
														>
															<figure>
																<MoveTopIcon />
															</figure>
															<span>Move to top</span>
														</li>
													</ul>
												</div>
											)}
										{accessItem.type == "quickAction" && isComponentVisible && (
											<div
												className={`fr-dropdown fr-dropdownAction ${
													accessItem.type == "quickAction" && accessItem.active
														? "active"
														: ""
												}`}
											>
												<ul>
													<li
														className='del-fr-action'
														onClick={() => checkBeforeUnfriend(accessItem)}
														data-disabled={
															!selectedFriends || selectedFriends.length === 0
																? true
																: false
														}
													>
														<figure>
															<UnfriendIcon />
														</figure>
														<span>Unfriend</span>
													</li>
													<li
														className='whiteLabel-fr-action'
														onClick={() => whiteLabeledUsers(accessItem)}
														data-disabled={!whiteListable}
													>
														<figure>
															<WhitelabelIcon />
														</figure>
														<span>Whitelist</span>
													</li>
													{/* <li
                          className="history-fr-action"
                          data-disabled={
                            !selectedState || selectedState.length == 0
                              ? true
                              : false
                          }
                        >
                          <figure>
                            <ClockIcon />
                          </figure>
                          <span>Run History</span>
                        </li> */}
													{/* <li
                          className="reject-fr-action"
                          data-disabled={
                            !selectedState || selectedState.length == 0
                              ? true
                              : false
                          }
                        >
                          <figure>
                            <RejectIcon />
                          </figure>
                          <span>Reject Requests</span>
                        </li> */}
													{/* </li> */}
													<li
														className='block-fr-action'
														onClick={() => BlocklistUser(accessItem)}
														data-disabled={!blacklistable}
													>
														<figure>
															<BlockIcon color={"#767485"} />
														</figure>
														<span>Blacklist</span>
													</li>
													<li
														className='campaign-fr-action'
														onClick={() => checkBeforeAddToCampaign(accessItem)}
														data-disabled={
															!selectedFriends || selectedFriends.length === 0
														}
													>
														<figure>
															<CampaignQuicActionIcon />
														</figure>
														<span>Campaign</span>
													</li>
												</ul>
											</div>
										)}
									</div>
								))}
						</div>
					) : (
						""
					)}
				</div>
			</div>
		</>
	);
}

export default memo(PageHeader);
