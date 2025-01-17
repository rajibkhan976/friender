import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";

import BreadCrumb from "./BreadCrumb";

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
	AddToQueueAction,
	AddToQueueIcon,
} from "../../assets/icons/Icons";
import config from "../../configuration/config"
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
import Tooltip from "./Tooltip";
import Search from "../formComponents/Search";
import Alertbox from "./Toast";
import { useDispatch, useSelector } from "react-redux";
import {
	removeSelectedFriends,
	updateSelectedFriends,
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
	getUserSyncData
} from "../../actions/FriendsAction";
import {
	deleteFriend,
	getFriendList,
	whiteListFriend,
	BlockListFriend,
} from "../../actions/FriendsAction";
import { fetchGroups } from "../../actions/MessageAction";
import {
	fRQueueExtMsgSendHandler,
	// getFriendsQueueRecordsFromIndexDB,
	getAllFriendsQueueRecordsInChunk,
	getNewFriendsQueueRecordsInChunk,
	popFriendsQueueRecordsFromQueue,
	removeFriendsQueueRecordsFromIndexDB,
	// reorderFriendsQueueRecordsInIndexDB,
	reorderFriendsQueueRecordsToTop,
	resetUploadedFriendsQueueCsvReport,
	resetFriendsQueueRecordsMetadata,
	resetUploadedFriendsQueueRecordResponse,
	uploadFriendsQueueRecordsForReview,
	uploadFriendsQueueRecordsForSaving,
} from "../../actions/FriendsQueueActions";
import { getMySettings } from "../../actions/MySettingAction";
import Modal from "./Modal";
import DeleteImgIcon from "../../assets/images/deleteModal.png";
import purpleAlertPng from "../../assets/images/purpleAlertPng.png"
import extensionAccesories from "../../configuration/extensionAccesories";
import { updateFilter } from "../../actions/FriendListAction";
import { updateMessageType } from "../../actions/MessageAction";
import useComponentVisible from "../../helpers/useComponentVisible";
import ToolTipPro from "./ToolTipPro";
import { alertBrodcater, fr_channel } from "./AlertBrodcater";
import "../../assets/scss/component/common/_page_header.scss";
import { addUsersToCampaign, fetchAllCampaigns } from "../../actions/CampaignsActions";
import { utils } from "../../helpers/utils";
import DropSelectMessage from "../messages/DropSelectMessage";
import { useDropzone } from "react-dropzone";
import moment from "moment";
import { bulkAction, bulkActionQueue, crealGlobalFilter, getFriendCountAction, getListData, getQueueSendableCount, removeFromTotalList, removeMTRallRowSelection, resetFilters, updateLocalListState, updateRowSelection, updateSelectAllState, updateWhiteListStatusOfSelectesList } from "../../actions/SSListAction";

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
	const navigate = useNavigate()
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
	// ssList
	const totalList = useSelector((state) => state.ssList.ssList_data);
	const selectedListItems = useSelector((state) => state.ssList.selected_friends)
	const filter_state = useSelector((state) => state.ssList.filter_state)
	const textFilter = useSelector((state) => state.friendlist.searched_filter);
    const select_all_state = useSelector((state) => state.ssList.selectAcross)
	//const current_list_selection_count = useSelector((state) => state.ssList.selected_friends_curr_count)
	const selectAcross = useSelector((state) => state.ssList.selectAcross)
	const MRT_selected_rows_state = useSelector((state) => state.ssList.MRT_selected_rows_state)
	const pagination_state = useSelector((state) => state.ssList.pagination_state)
	const currentPageSize = useSelector((state) => state.ssList.currentPageSize)
	// ssList
	const defaultFbId = localStorage.getItem("fr_default_fb");
	const listCount = useSelector((state) => state.ssList.list_unfiltered_count);
	const listFilteredCount = useSelector((state) => state.ssList.list_filtered_count);
	const listUnfilteredCount = useSelector((state) => state.ssList.list_unfiltered_count)
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
	const [isFrQueActionsEnabled, setIsFrQueActionsEnabled] = useState(false);
	const [selectedCampaignName, setSelectedCampaignName] = useState("Select");
	const friendsListData = useSelector(
		(state) => state.facebook_data.fb_data
	);
	const [isFetchingbulkActionCount, setIsFetchingbulkActionCount] = useState(false);
	const [actionableContacts, setActionableContacts] = useState({ "whitelist_count": 0, "blacklist_count": 0, "friendsCount": 0 });
	const [modalAddQueueOpen, setModalAddQueueOpen] = useState(false);
	const listFetchParams = useSelector((state) => state.ssList.listFetchParams);
	const list_filtered_count = useSelector((state) => state.ssList.list_filtered_count);
	// const currlist_total_blacklist_count = useSelector((state) => state.ssList.currlist_total_blacklist_count);
	// const currlist_total_whitelist_count = useSelector((state) => state.ssList.currlist_total_whitelist_count);
	const selected_friends_curr_count = useSelector((state) => state.ssList.selected_friends_curr_count);
	const selected_whitelist_contacts = useSelector((state) => state.ssList.selected_friends_total_whiteList_count);
	const selected_blacklist_contacts = useSelector((state) => state.ssList.selected_friends_total_blackList_count);
	const [addToQueue, setAddToQueue] = useState(0)

	const dataExtractor = (response) => {
		return {
			res:response,
			data: response?.data,
			count: response?.count,
		};
	};

	useEffect(() => {
		if (friendsListData) {
			if (friendsListData.last_sync_at) {
				setTooltip(friendsListData.last_sync_at);
				localStorage.removeItem("fr_tooltip");
			} else {
				localStorage.setItem(
					"fr_tooltip",
					friendsListData.last_sync_at
				);
				setTooltip(friendsListData.last_sync_at);
			}
		}


	}, [friendsListData]);
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
		setWhiteListable(selected_whitelist_contacts < selected_friends_curr_count);;
		setBlacklistable(selected_blacklist_contacts < selected_friends_curr_count);
	}, [selected_friends_curr_count,
		selected_whitelist_contacts,
		selected_blacklist_contacts,]);

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

	const refreshAndDeselectList = () => {

		//const funStr = listFetchParams.responseAdapter;
		//const responseAdapter = eval(`(${funStr})`);
		const payload = {
			queryParam: listFetchParams.queryParam,
			baseUrl: listFetchParams.baseUrl,
			//responseAdapter: props.dataExtractor,
		}
		// console.log('payload  >>>>>>>>>>>>>>> ', payload);
		dispatch(getListData(payload)).unwrap().then((res) => {
			//console.log("list res ",res);
		}).catch((err) => {
			console.log("Error in page header list fetch", err);
		});
		dispatch(removeMTRallRowSelection());
	}
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
			case "all":
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
							// "Due to limitations on how Facebook shows and counts friends there may be a slight mismatch between the number shown here and the number shown on your profile from Facebook.",
							"You can view all Facebook accounts here, regardless of whether they are your friends or not."
					},
				});
				break;
			case "non-friends":
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
							"View Facebook accounts of people who are not your friends.",
					},
				});
				break;

			case "friends":
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
							"This is the current number of people in the friend queue.",
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

			case "lost":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					listingLengthWell: true,
					quickAction: true,
					syncManual: true,
				});
				break;

			case "unfriended":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					listingLengthWell: true,
					quickAction: true,
					syncManual: true,
				});
				break;

			case "whitelisted":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					searchHeader: true,
					quickAction: true,
					listingLengthWell: true,
					syncManual: true,
				});
				break;

			case "blacklisted":
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

			case "my-profile":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					syncManual: true,
					searchHeader: false,
					sortHeader: false,
					filterHeader: false,
					quickAction: false,
					exportHeader: false,
					listingLengthWell: false,
					infoToolTip: false,
				});
				break;

			case "facebook-auth":
				setHeaderOptions({
					...headerOptions,
					viewSelect: false,
					syncManual: false,
					searchHeader: false,
					sortHeader: false,
					filterHeader: false,
					quickAction: false,
					exportHeader: false,
					listingLengthWell: false,
					infoToolTip: false,
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
		//console.log(item.type == "quickAction" && item.active, accessOptions);
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
							`${selectedFriends.length > 1 ? "Contacts" : "Contact"
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
							`${selectedFriends.length > 1 ? "Contacts" : "Contact"
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

	// const alterFriendsQueueRecordsOrder = (item) => {
	// 	if (item) {
	// 		closeFilterDropdown(item);
	// 	}
	// 	if (selectedFriends && selectedFriends.length > 0 && isFrQueActionsEnabled) {
	// 		const fbIdList = [];
	// 		selectedFriends?.forEach((item) => {
	// 			if (item._id) {
	// 				fbIdList.push(item?._id);
	// 			}
	// 		});
	// 		dispatch(
	// 			reorderFriendsQueueRecordsToTop({
	// 				topRecords: fbIdList,
	// 				fb_user_id: defaultFbId,
	// 			})
	// 		)
	// 			.unwrap()
	// 			.then((response) => {
	// 				// dispatch(reorderFriendsQueueRecordsInIndexDB(fbIdList));
	// 				const fr_queue_settings = localStorage.getItem("fr_queue_settings")
	// 					? JSON.parse(localStorage.getItem("fr_queue_settings"))
	// 					: null;
	// 				if (
	// 					fr_queue_settings?.length &&
	// 					typeof fr_queue_settings[0] === "object" &&
	// 					Object.keys(fr_queue_settings[0]).length >= 5
	// 				) {
	// 					// console.log(fr_queue_settings[0])
	// 					fRQueueExtMsgSendHandler(fr_queue_settings[0]);
	// 				}
	// 			});
	// 		dispatch(updateSelectedFriends([]));
	// 		setIsComponentVisible(false);
	// 		// console.log(selectedFriends);
	// 	}
	// };

	// useEffect(() => {
	// 	console.log('selectedListItems', pagination_state);
	// }, [pagination_state])

	// const deleteRecordsFromFriendsQueue = (item) => {
	// 	if (item) {
	// 		closeFilterDropdown(item);
	// 	}

	// 	if (!select_all_state?.selected) {
	// 		if (selectedListItems && selectedListItems.length > 0 && isFrQueActionsEnabled) {
	// 			const fbIdList = [];
	// 			selectedListItems?.forEach((item) => {
	// 				if (item._id) {
	// 					fbIdList.push(item?._id);
	// 				}
	// 			});
	// 			dispatch(
	// 				popFriendsQueueRecordsFromQueue({
	// 					removeRecords: fbIdList,
	// 					fb_user_id: defaultFbId,
	// 				})
	// 			)
	// 				.unwrap()
	// 				.then((response) => {
	// 					// console.log('pagination_state', pagination_state);
	// 					const payload = {
	// 						queryParam: {
	// 							page_number: pagination_state.page_number ? pagination_state.page_number + 1 : 1,
	// 							page_size: pagination_state.page_size?pagination_state.page_size:15,
	// 							search_string: searchValue.length > 2 ? searchValue : null,
	// 							fb_user_id: defaultFbId
	// 						},
	// 						baseUrl: config.fetchFriendsQueueRecordv2,
	// 						responseAdapter: dataExtractor,
	// 					};

	// 					// console.log('?>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', payload);
	// 					// dispatch(removeFriendsQueueRecordsFromIndexDB(fbIdList));
	// 					dispatch(removeFromTotalList(fbIdList))
	// 					dispatch(getListData(payload))
	// 					const fr_queue_settings = localStorage.getItem("fr_queue_settings")
	// 						? JSON.parse(localStorage.getItem("fr_queue_settings"))
	// 						: null;
	// 					if (
	// 						fr_queue_settings?.length &&
	// 						typeof fr_queue_settings[0] === "object" &&
	// 						Object.keys(fr_queue_settings[0]).length >= 5
	// 					) {
	// 						// console.log(fr_queue_settings[0])
	// 						fRQueueExtMsgSendHandler(fr_queue_settings[0]);
	// 					}
	// 				});
	// 			dispatch(updateSelectedFriends([]));
	// 			setIsComponentVisible(false);
	// 			// console.log(selectedFriends);
	// 		}
	// 	}
	// };

	const skipWhitList = () => {
		// const listWithOutWhites = selectedFriends.filter((item) => {
		const listWithOutWhites = selectedListItems.filter((item) => {
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

	// useEffect(() => {
	// 	console.log('totalList', totalList);
	// }, [totalList])

	const unfriend = async (unfriendableList = selectedFriends) => {
		let totalListPlacholder = [...totalList];
		unfriendableList = [...unfriendableList]?.filter(
													el => el?.deleted_status !== 1 &&
													(
														el?.friendship === 1 && 
														el?.friendStatus === "Activate"
													)
												)
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
		// dispatch(removeSelectedFriends());
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

			// console.log("unfriend RESULTS FROM EXTENSION ::::", unfriendFromFb);

			if (unfriendFromFb) {
				// if (select_all_state?.selected) {
				// 	// console.log(' >>>>> select_all_state?.selected <<<<<<');
				dispatch(deleteFriend({ payload: payload }))
					.unwrap()
					.then((res) => {
						// console.log('item', item);
						fr_channel.postMessage({
							cmd: "alert",
							type: "success",
							time: 3000,
							message: `${item.friendName
								} unfriended successfully!   (Unfriending ${i + 1}/${unfriendableList.length
								})`,
							position: "bottom-right",
						});
						// Alertbox(
						// 	`${item.friendName} unfriended successfully!   (Unfriending ${
						// 		i + 1
						// 	}/${unfriendableList.length})`,
						// 	"success",
						// 	3000,
						// 	"bottom-right"
						// );

						totalListPlacholder = totalListPlacholder?.map(el => el?.friendFbId === unfriendFromFb[0]?.uid ? { ...el, deleted_status: 1, friendship: 2 } : { ...el })
						dispatch(updateLocalListState(totalListPlacholder))
						Alertbox(
							`${item?.friendName} unfriended successfully!   (Unfriending ${i + 1
							}/${unfriendableList?.length})`,
							"success",
							3000,
							"bottom-right"
						);
					})
					.catch((err) => {
						//dispatch(removeSelectedFriends());
						Alertbox(`${err.message} `, "error", 3000, "bottom-right");
					});
				// 		// dispatch(removeSelectedFriends());
				if (i !== unfriendableList.length - 1) {
					let delay = getRandomInteger(1000 * 5, 1000 * 60 * 1); // 5 secs to 1 min
					//console.time("wake up");
					await helper.sleep(delay);
					//console.timeEnd("wake up");
				}
				// 	} 

				// 	if (!select_all_state?.selected) {
				// console.log(' >>>>> NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT NOT select_all_state?.selected');
				// console.log('unfriendableList >>>', totalList?.filter(el => el?.friendFbId === unfriendFromFb[0]?.uid));
				// unfriendableList[i] = unfriendableList?.filter(el => el?.friendFbId === unfriendFromFb[0]?.uid)[0];
				// console.log('currentUnfriendItem currentUnfriendItem currentUnfriendItem currentUnfriendItem', currentUnfriendItem);
				// item = {
				// 	...item,
				// 	deleted_status: 1,
				// 	friendship: 2
				// }

				// console.log('item >>>>> item >>>>>>> item >>>>>>', item);
				// console.log('=========================================');

				// console.log('totalListPlacholder >>>>>', totalListPlacholder);
				// 	}
			}
		}

		dispatch(crealGlobalFilter())
		dispatch(resetFilters())
		dispatch(removeMTRallRowSelection())
		// console.log('=============================Done all=============================');

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

		const updatedAccess = accessOptions.map((accessObj) => {
			return {
				...accessObj,
				active: false,
			};
		});

		setAccessOptions(updatedAccess);

		Alertbox(
			"Friends syncing is successfully completed",
			"success",
			1000,
			"bottom-right"
		);
		fetchPendingFrRquest(config.fetchPendingListv2);
		fetchFriends();
		facebookData?.fb_data?.fb_user_id && dispatch(getUserSyncData(facebookData?.fb_data?.fb_user_id))
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
			setInlineLoader(false);
			// console.log("now ending:::::::");
		}
		
		if (
			!syncingUpdate &&
			!isSyncActive
		) {
			setInlineLoader(false);
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

		dispatch(
			resetFriendsQueueRecordsMetadata({
				firstChunkLength: 0,
				limitUsed: 0,
				totalCount: 0,
			})
		);
		if (location?.pathname === "/friends/friends-queue") {
			// setIsFrQueActionsEnabled(false);
			// dispatch(getFriendsQueueRecordsFromIndexDB(defaultFbId))
			// 	.unwrap()
			// 	.then((res) => {
			// 		dispatch(getAllFriendsQueueRecordsInChunk())
			// 			.unwrap()
			// 			.then((response) =>{
			// 				dispatch(removeSelectedFriends())
			// 				.unwrap()
			// 				.then((result) => 
			// 					setIsFrQueActionsEnabled(true)
			// 				)}
			// 			);
			// 	})
			// 	.catch((error) => {
			// 		dispatch(getAllFriendsQueueRecordsInChunk())
			// 			.unwrap()
			// 			.then((response) =>{
			// 				dispatch(removeSelectedFriends())
			// 				.unwrap()
			// 				.then((result) => 
			// 					setIsFrQueActionsEnabled(true)
			// 				)}
			// 			);
			// 	});

			setIsFrQueActionsEnabled(true);
		}
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

		// console.log('VALIDATE HEADER OPTIONS -- ', locationPathName[locationPathName.length - 2]);

		if (locationPathName[locationPathName.length - 2] === "campaigns") {
			validateHeaderOptions(locationPathName[locationPathName.length - 2]);
		} else {
			validateHeaderOptions(locationPathName[locationPathName.length - 1]);
		}
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
	}, [facebookData]);

	const MassagebuttonClick = (messageType) => {
		// console.log("clicked msgobj::::>>", messageType);
		dispatch(updateMessageType(messageType.data));
	};

	useEffect(() => {
		dispatch(fetchAllCampaigns({ sort_order: "asc" }));
		dispatch(getMySettings({ fbUserId: defaultFbId }));

		const sendEssentialsPayload = {
			action: "sendEssentials",
			fr_token: localStorage.getItem("fr_token"),
			amount: localStorage.getItem("fr_amount")
		};
		//   console.log("sendEssentialsPayload ::: ", sendEssentialsPayload);
		extensionAccesories.sendMessageToExt(
			sendEssentialsPayload
		);
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
			// const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
			// const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
			
			const local1 = new Date(b).getTime();
			const local2 = new Date(a).getTime();

			// return Math.floor((utc2 - utc1) / _MS_PER_DAY);
			return Math.floor((local2 - local1) / _MS_PER_DAY);
		}

		if (toolTip) {
			if (toolTip?.trim() !== "" || !isNaN(toolTip)) {
				// let differenceInDays = (new Date() - new Date(toolTip)) / (1000 * 60 * 60 * 24);
				let differenceInDays = Math.abs(
					dateDiffInDays(new Date(), new Date(toolTip))
				);

				// console.log('toolTip DATE ::::', new Date(toolTip).getDate(), new Date(toolTip).getMonth()+1, new Date(toolTip).getFullYear())
				
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
						// groupName: item.groupName ? item.groupName : null,
						sourceName: item?.sourceName ? item?.sourceName : item?.groupName ? item?.groupName : null,
						status: "pending",
						// groupUrl: item.groupUrl ? item.groupUrl : null,
						sourceUrl: item?.sourceUrl ? item?.sourceUrl : item?.groupUrl ? item?.groupUrl : null,
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
		dispatch(updateSelectedFriends([]));
	};

	// console.log(accessOptions);
	const [showKeywordSuggestionBar, setShowKeywordSuggestionBar] =
		useState(false);
	const [keyword, setKeyword] = useState("");
	const [savedKeyword, setSavedKeyword] = useState([]);

	const timeout = useRef(null);

	const [selectedCsvFile, setSelectedCsvFile] = useState(null);
	const [disableCsvSelection, setDisableCsvSelection] = useState(false);
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
		const selectMsgUsing = localStorage.getItem("fr_using_que_sent_message");

		if (quickMsg1 && !selectMsgUsing) {
			setGroupMsgSelect1(null);
		}
		if (selectMsgUsing) {
			setQuickMsg1(null);
		}
	}, [groupMsgSelect1, quickMsg1]);

	useEffect(() => {
		const selectMsgUsing = localStorage.getItem("fr_using_que_accept_message");

		if (quickMsg2 && !selectMsgUsing) {
			setGroupMsgSelect2(null);
		}
		if (selectMsgUsing) {
			setQuickMsg2(null);
		}
	}, [groupMsgSelect2, quickMsg2]);

	// useEffect(() => {
	// 	console.log('isFrQueActionsEnabled VALUE ISSSSSSS :::::', isFrQueActionsEnabled);
	// }, [isFrQueActionsEnabled])

	const reFetchFrQueDataRef = useRef(null);
// const [fr_queue_loaded, setFr_queue_loaded] = useState(0)
	const reFetchDataOnRunFriendQueueSuccess = (event) => {
		// console.log("reFetchDataOnRunFriendQueueSuccess", event);
		// if (!event?.origin?.includes(process.env.REACT_APP_APP_URL)) return;
		if (event?.data === "fr_queue_success") {
			// setFr_queue_loaded(fr_queue_loaded+1)
			setIsFrQueActionsEnabled(false);
			dispatch(getQueueSendableCount({fb_user_id: defaultFbId})).unwrap()
				.then((res) => {
					// console.log('res >>>>>>', res);
				})
			// dispatch(getNewFriendsQueueRecordsInChunk())
			// 	.unwrap()
			// 	.then((resp) => {
			// 		dispatch(removeSelectedFriends())
			// 			.unwrap()
			// 			.then((response) =>
			// 				setIsFrQueActionsEnabled(true)
			// 			)
			// 	}
			// 	);
			// console.log('>>>>>>>>>>>>>>>', pagination_state, listFilteredCount, Math.ceil(listFilteredCount/pagination_state.page_size), '<<<<<<<<<<<<<<<');
		}
	};

	// useEffect(()=>{
	// 	console.log("listFilteredCount ::: ", pagination_state);
	// }, [pagination_state])
	const debouncedFetchData = useCallback(helper.debounce(reFetchDataOnRunFriendQueueSuccess, 1000), []);
	useEffect(() => {
		// console.log('XXXXXXXXXXXX', listFilteredCount);
		window.addEventListener(
			"message",
			(event) => {
				// console.log("addEventListener", event);
				//reFetchFrQueDataRef.current = setTimeout(() => reFetchDataOnRunFriendQueueSuccess(event), 1000);
				debouncedFetchData(event)
			},
			false
		);
		return () => {
			localStorage.removeItem("fr_edit_mode_quickCampMsg");
			localStorage.removeItem("fr_quickMessage_campaigns_message");
			window.removeEventListener("message", (event) => {
				debouncedFetchData(event);
			});
			//clearTimeout(reFetchFrQueDataRef);
		};
	}, []);

	const handleShowCsvUploadModal = () => {
		setTaskName(`CSV Upload ${moment().format("YYYYMMDDHHmmss")}`);
		setSelectedCsvFile(null);
		setShowUploadCsvModal(true);
		setDisableCsvSelection(false);
		setFriendsQueueCsvUploadStep(0);
		setSelectedCsvFile(null);
		setGroupMsgSelect1(null);
		setGroupMsgSelect2(null);
		setQuickMsg1(null);
		localStorage.removeItem("fr_quickMessage_queue_sent_req");
		setQuickMsg2(null);
		localStorage.removeItem("fr_quickMessage_queue_accept_req");
		setShowKeywordSuggestionBar(false);
		setKeyword("");
		setSavedKeyword([]);
		dispatch(resetUploadedFriendsQueueCsvReport(null));
		dispatch(resetUploadedFriendsQueueRecordResponse(null));
	};

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
				.then((response) => {
					if (response && response?.status === 400) {
						setSelectedCsvFile(null);
						setDisableCsvSelection(false);
						Alertbox(response?.data, "error", 1000, "bottom-right");
					}
				})
				.catch((error) => {
					if (error) {
						// console.log(error);
						setSelectedCsvFile(null);
						setDisableCsvSelection(false);
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

	const onDrop = useCallback((acceptedFiles) => {
		if (acceptedFiles && acceptedFiles[0].size <= 1048576) {
			setSelectedCsvFile(acceptedFiles);
			setFriendsQueueCsvUploadStep(friendsQueueCsvUploadStep + 1);
			setDisableCsvSelection(true);
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

	const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
		useDropzone({
			onDrop,
			onError,
			accept: { "text/csv": [".csv"] },
			multiple: false,
			// maxSize: 1000000,
			disabled: disableCsvSelection,
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

			if (quickMsg1 && quickMsg1.messengerText) {
				friendRequestSent = {
					groupId: "",
					quickMessage: quickMsg1.messengerText,
				};
			}

			if (groupMsgSelect2 && groupMsgSelect2._id) {
				friendRequestAccepted = {
					groupId: groupMsgSelect2._id,
					quickMessage: "",
				};
			}

			if (quickMsg2 && quickMsg2.messengerText) {
				friendRequestAccepted = {
					groupId: "",
					quickMessage: quickMsg2.messengerText,
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
			console.log('NOw ??????????');
			timeout.current = setTimeout(() => {
				setShowUploadCsvModal(false);
				setFriendsQueueCsvUploadStep(0);
				setSelectedCsvFile(null);
				setDisableCsvSelection(false);
				dispatch(resetUploadedFriendsQueueCsvReport(null));
				dispatch(resetUploadedFriendsQueueRecordResponse(null));
				dispatch(
					resetFriendsQueueRecordsMetadata({
						firstChunkLength: 0,
						limitUsed: 0,
						totalCount: 0,
					})
				);
				setIsFrQueActionsEnabled(false);
				// dispatch(getAllFriendsQueueRecordsInChunk())
				// 	.unwrap()
				// 	.then((response) => {
						dispatch(removeSelectedFriends());
						setIsFrQueActionsEnabled(true)
						const fr_queue_settings = localStorage.getItem("fr_queue_settings")
							? JSON.parse(localStorage.getItem("fr_queue_settings"))
							: null;
						if (
							fr_queue_settings?.length &&
							typeof fr_queue_settings[0] === "object" &&
							Object.keys(fr_queue_settings[0]).length >= 5
						) {
							// console.log(fr_queue_settings[0])
							fRQueueExtMsgSendHandler(fr_queue_settings[0]);
						}
						// dispatch(getFriendsQueueRecordsFromIndexDB(defaultFbId))
						// .unwrap()
						// .then((result) => 
						// 	setIsFrQueActionsEnabled(true)
						// );
					// })
					// .catch((error) => {
					// 	const fr_queue_settings = localStorage.getItem("fr_queue_settings")
					// 		? JSON.parse(localStorage.getItem("fr_queue_settings"))
					// 		: null;
					// 	if (
					// 		fr_queue_settings?.length &&
					// 		typeof fr_queue_settings[0] === "object" &&
					// 		Object.keys(fr_queue_settings[0]).length >= 5
					// 	) {
					// 		// console.log(fr_queue_settings[0])
					// 		fRQueueExtMsgSendHandler(fr_queue_settings[0]);
					// 	}
					// });

					refreshAndDeselectList();
					dispatch(getQueueSendableCount({fb_user_id: defaultFbId})).unwrap()
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

	// const fetchFriendListV2 = () => {
	// 	let payload = {}

	// page_number: paginationData.pageIndex + 1,
	//   page_size: paginationData.pageSize,
	// search_string: textFilter?.length > 2 ? textFilter : null,

	// 	dispatch(getListData())
	// }


	// NEW FUNCTIONS FOR BULK ACTIONS
	const assemblePayload = (action, url) => {
		const pathSuffix = location?.pathname?.split('/').pop()
		let queryParam = {
			fb_user_id: defaultFbId,
			check: select_all_state?.selected ? 'all' : 'some',
			//include_list: select_all_state?.selected ? [] : JSON.stringify([...selectedListItems?.map(el => el?._id)]),
			exclude_list: (select_all_state?.selected && select_all_state?.unSelected?.length > 0) ? JSON.stringify([...select_all_state?.unSelected?.map(el => el)]) : [],
			operation: action,
			friend_status: pathSuffix === 'friends' ? 'Activate' : pathSuffix === 'lost' ? 'Lost' : pathSuffix === "non-friends" ? "Non friend" :'all'
		};

		if (!select_all_state?.selected) {
			queryParam["include_list"] = JSON.stringify([...selectedListItems?.map(el => el?._id)]);
		}

		if (searchValue?.trim() !== "") {
			queryParam["searchString"] = searchValue
		}

		if (listFetchParams.queryParam.whitelist_status === 1) {
			queryParam['whitelist'] = 1;
		}
		if (listFetchParams.queryParam.blacklist_status === 1) {
			queryParam['blacklist'] = 1;
		}
		if (listFetchParams.queryParam.deleted_status === 1) {
			queryParam['unfriend'] = 1;

		}
		if (action === 'queue') {
			queryParam["settings_id"] = "664f3fc8915b190008002485";
		}

		if (filter_state?.filter_key_value?.length > 0) {
			const { values, fields, operators } = helper.listFilterParamsGenerator(
				filter_state?.filter_key_value,
				filter_state?.filter_fun_state
			);
			queryParam["values"] = JSON.stringify(values);
			queryParam["fields"] = JSON.stringify(fields);
			queryParam["operators"] = JSON.stringify(operators);
			queryParam["filter"] = 1;
		}

		//console.log("sorting---outi :::>>>", sortingState);
		// if (sortingState.length > 0) {
		// 	//console.log("sorting--- :::>>>", sortingState);
		// 	queryParam["sort_by"] = sortingState[0].id;
		// 	queryParam["sort_order"] = sortingState[0].desc ? "desc" : "asc";
		// }

		return {
			queryParam: queryParam,
			baseUrl: url,
		};
	}

	const triggerBulkOperation = async (bulkType = null) => {
		return new Promise((resolve, reject) => {
			// let payload = assemblePayload(bulkType, config.bulkOperationFriends)
			const pathSuffix = location?.pathname?.split('/').pop()
			let payload = {
				fb_user_id: defaultFbId,
				check: select_all_state?.selected ? 'all' : 'some',
				//include_list: select_all_state?.selected ? [] : [...selectedListItems?.map(el => el?._id)],
				operation: bulkType === 'skipWhitelisted' ? 'unfriend' : bulkType === 'skipBlacklisted' ? 'campaign' : bulkType,
				friend_status: pathSuffix === 'friends' ? 'Activate' : pathSuffix === 'lost' ? 'Lost' : pathSuffix === "non-friends" ? "Non friend" :'all'
			}

			if (!select_all_state?.selected) {
				payload["include_list"] = [...selectedListItems?.map(el => el?._id)];
			}

			if (select_all_state?.selected) {
				payload["exclude_list"] = select_all_state?.unSelected?.length > 1 ? [...select_all_state?.unSelected.map(el => el)] : []
			}

			if (filter_state?.filter_key_value?.length > 0) {
				const { values, fields, operators } = helper.listFilterParamsGenerator(
					filter_state?.filter_key_value,
					filter_state?.filter_fun_state
				);
				payload["values"] = values;
				payload["fields"] = fields;
				payload["operators"] = operators;
				payload["filter"] = 1;
			}

			if (searchValue?.trim() !== "") {
				payload["searchString"] = searchValue
			}

			if (listFetchParams.queryParam.whitelist_status === 1) {
				payload['whitelist'] = 1;
			}
			if (listFetchParams.queryParam.blacklist_status === 1) {
				payload['blacklist'] = 1;
			}
			if (listFetchParams.queryParam.deleted_status === 1) {
				payload['unfriend'] = 1;

			}
			if (bulkType === 'skipWhitelisted') {
				payload['skip_whitelist'] = true
			}
			if (bulkType === 'skipBlacklisted') {
				payload['campaign_id'] = selectedCampaign
				payload['skip_blacklist'] = true
			}
			if (bulkType === 'campaign') {
				payload['campaign_id'] = selectedCampaign
				console.log(payload);
			}
			if (bulkType === 'queue') {
				payload["settings_id"] = "664f3fc8915b190008002485";
			}

			if (
				bulkType === "unfriend" &&
				!select_all_state?.selected
			) {
				unfriend(selectedListItems)
			} else if (bulkType === "remove" || bulkType === "move_to_top") {
				delete payload["friend_status"]
				delete payload["operation"]

				payload['operation_name'] = bulkType

				console.log('payload ::::', payload);
				dispatch(bulkActionQueue(payload)).unwrap()
					.then((res) => {
						if (res) {
							const fr_queue_settings = localStorage.getItem("fr_queue_settings")
								? JSON.parse(localStorage.getItem("fr_queue_settings"))
								: null;
							if (
								fr_queue_settings?.length &&
								typeof fr_queue_settings[0] === "object" &&
								Object.keys(fr_queue_settings[0]).length >= 5
							) {
								console.log(fr_queue_settings[0])
								fRQueueExtMsgSendHandler(fr_queue_settings[0]);
							}
						}
						dispatch(getQueueSendableCount({fb_user_id: defaultFbId})).unwrap()
						setModalOpen(false)
						dispatch(updateSelectAllState({}))
						dispatch(updateSelectedFriends([]));
						setIsComponentVisible(false);
						dispatch(updateSelectAllState({}))
						dispatch(removeSelectedFriends());
						dispatch(updateRowSelection({}));
						refreshAndDeselectList();

						if (res){
							if (bulkType === "move_to_top") {
								Alertbox(
									res?.data,
									"success",
									1000,
									"bottom-right"
								);
							}

							if (bulkType === "remove") {
								Alertbox(
									`${
										select_all_state?.selected ? 
											payload.exclude_list?.length > 0 ?
												'All except '+payload.exclude_list?.length :
												'All' :
											payload?.include_list?.length
											} friends have been removed from your friend queue`,
									"success",
									1000,
									"bottom-right"
								);
							}
						}
					})
			} else {
				dispatch(bulkAction(payload)).unwrap()
					.then((res) => {
						console.log('res IN DISPATH BULK ACTION >>>>  ::::', res);
						if (bulkType === "unfriend" || bulkType === "skipWhitelisted") {
							console.log('res IN UNFRIEND ::::', res?.data?.unfriend_details);
							if (res?.data?.unfriend_details?.length === 0) {
								Alertbox(
									'No friends to Unfriend!',
									"success",
									1000,
									"bottom-right"
								);
							}
							else {
								unfriend(res?.data?.unfriend_details)
								// .unwrap()
								// .then(response => {
								// 	console.log('response', response);
								// })
							}
						}
						else {
							Alertbox(
								bulkType === 'queue' ? res?.data?.message : res?.data,
								"success",
								1000,
								"bottom-right"
							);
						}
						refreshAndDeselectList();
						setModalOpen(false)
						dispatch(updateSelectAllState({}))
						dispatch(updateSelectedFriends([]));
						// setAccessOptions(accessibilityOptions);
						setIsComponentVisible(false);
						dispatch(updateSelectAllState({}))
						dispatch(removeSelectedFriends());
						dispatch(updateRowSelection({}));
						setIsAddingToCampaign(false)
					})
			}
		})
	}

	const checkForBulkAction = (bulkType = null) => {
		let payload;
		// payload = assemblePayload(bulkType, !actionableContacts ? config.fetchFriendCount : config.bulkOperationFriends)
		console.log(bulkType);

		if (bulkType === 'unfriend' || bulkType === 'campaign' || bulkType === 'queue') {
			payload = assemblePayload(bulkType, config.fetchFriendCount)
			//console.log('payload', payload);

			setIsFetchingbulkActionCount(true)
			if (bulkType === 'unfriend') {
				setModalOpen(true)
			} else if (bulkType === 'queue') {
				setModalAddQueueOpen(true);
			}

			if (selected_friends_curr_count > 0) {
				dispatch(getFriendCountAction(payload)).unwrap()
					.then((res) => {
						setIsFetchingbulkActionCount(false)
						setActionableContacts(res)
						// if (bulkType === 'unfriend') {

						// }
					})
			}
			// if (bulkType === 'unfriend') {
			// else {
			// 	triggerBulkOperation(bulkType)
			// 		.then((res) => {
			// 			console.log('res', res);
			// 			setActionableContacts(null)
			// 		})
			// 		.catch((error) => {
			// 			console.log(error);
			// 		})
			// }
			// }
		}
		// else if (bulkType === 'campaign') {
		// 	console.log('bulk campaign', selectedListItems)
		// 	// setIsAddingToCampaign(true);
		// }
		else {
			console.log('selectedListItems', selectedListItems);

			if (bulkType === 'whitelist') {
				if (selectedListItems?.length === selectedListItems?.filter(el => el?.whitelist_status === 1).length) {
					return false
				}
			}

			if (bulkType === 'blacklist') {
				if (selectedListItems?.length === selectedListItems?.filter(el => el?.blacklist_status === 1).length) {
					return false
				}
			}


			triggerBulkOperation(bulkType)
				.then((res) => {
					console.log('res', res);
					setActionableContacts(null)
				})
				.catch((error) => {
					console.log(error);
				})
		}
	}

	useEffect(() => {
		//console.log("helloooooo_________>>>>>>", location);
		if (Object.keys(MRT_selected_rows_state)?.length > 0) {
			dispatch(removeMTRallRowSelection())
		}
	}, [location])

	const checkDisability = useCallback((item) => {
		// console.log(location?.pathname, Object.keys(MRT_selected_rows_state));
		if (
			selectAcross?.selected || Object.keys(MRT_selected_rows_state)?.length > 0
		) {
			if (item === 'whitelist' && location?.pathname?.split('/').pop() === 'whitelisted') {
				console.log(location?.pathname?.split('/').pop());
				return true
			}
			if (item === 'blacklist' && location?.pathname?.split('/').pop() === 'blacklisted') {
				console.log(location?.pathname?.split('/').pop());
				return true
			}
			if ((item === 'unfriend' || item === 'queue') && location?.pathname?.split('/').pop() === 'unfriended') {
				console.log(location?.pathname?.split('/').pop());
				return true
			}
			if ((item === 'unfriend' || item === 'queue') && location?.pathname?.split('/').pop() === 'lost') {
				console.log(location?.pathname?.split('/').pop());
				return true
			}
			if ((item === 'unfriend') && location?.pathname?.split('/').pop() === 'non-friends') {
				return true
			}
			if ((item === 'queue')) {
				if (
					(!selectAcross?.select &&
					(selectedListItems?.length > 0 &&
					selectedListItems?.filter(
						el =>
							el?.friendship === 4 && 
							el?.friendStatus === "Non friend"
					)?.length <= 0)) || (
						!selectAcross?.select && 
						selectedListItems?.length === selectedListItems?.filter(el => el?.finalSource === 'incoming').length
					)
					// selectedListItems?.filter(el => el?.finalSource === 'incoming').length > 0 ||
					// selectedListItems.length === selectedListItems?.filter(el => el?.finalSource === 'incoming').length
				) {
					return true
				}
			}
		} else {
			return true
		}
	}, [location?.pathname, MRT_selected_rows_state, selectedListItems])

	// useEffect(() => {
	// 	console.log('isFrQueActionsEnabled', isFrQueActionsEnabled);
	// }, [isFrQueActionsEnabled])

	return (
		<>
			{(selected_friends_curr_count > 0 || select_all_state?.selected) &&
				<Modal
					modalType="ADD-TO-QUEUE"
					ModalIconElement={AddToQueueIcon}
					headerText={"Add to Queue"}
					bodyText={
						<>You have selected
							{<><b>&nbsp;{Number(actionableContacts.nonFriend_count)}&nbsp;</b>
								{Number(actionableContacts.nonFriend_count) > 1 ? 'contact(s). ' : 'contact. '}</>}
							Are you sure you want to add them to friend queue?
						</>
					}
					closeBtnTxt={"Cancel"}
					// closeBtnFun={unfriend}
					closeBtnFun={() => setModalAddQueueOpen(false)}
					open={modalAddQueueOpen}
					setOpen={setModalAddQueueOpen}
					// ModalFun={skipWhitList}
					ModalFun={() => {
						setModalAddQueueOpen(false)
						triggerBulkOperation('queue')
					}}
					btnText={"Add to queue"}
					ExtraProps={{
						primaryBtnDisable: !(Number(actionableContacts.nonFriend_count) > 0)
					}}
					isLoading={isFetchingbulkActionCount}
				/>}
			{/* {selectedFriends?.length > 0 && ( */}
			{(selected_friends_curr_count > 0 || select_all_state?.selected) && (
				<Modal
					modalType='delete-type'
					modalIcon={DeleteImgIcon}
					headerText={"Unfriend"}
					bodyText={
						<>You have selected
							{actionableContacts.whitelist_count === list_filtered_count ? <><b>&nbsp;All&nbsp;</b> friend(s)</>
								: <><b>&nbsp;{Number(actionableContacts.friendsCount)}&nbsp;</b>
									{Number(actionableContacts.friendsCount) > 1 ? 'friend(s),' : 'friend,'}</>}
							<b>
								{" "}
								{actionableContacts.friendsCount > 0 || Number(actionableContacts.whitelist_count)
									?
									Number(actionableContacts.whitelist_count)
									: Number(0)}{" "}
							</b>{" "}
							of them are currently on your whitelist. Are you sure you want to
							remove all of these friend(s) from your list?
						</>
					}
					closeBtnTxt={"Yes, unfriend"}
					// closeBtnFun={unfriend}
					closeBtnFun={() => {
						if (select_all_state?.selected) {
							triggerBulkOperation('unfriend')
						} else {
							unfriend(selectedListItems)
						}
					}}
					open={modalOpen}
					setOpen={setModalOpen}
					// ModalFun={skipWhitList}
					ModalFun={() => {
						if (select_all_state?.selected) {
							checkForBulkAction('skipWhitelisted')
						} else {
							skipWhitList()
						}
					}}
					btnText={"Skip whitelisted"}
					ExtraProps={{
						primaryBtnDisable:
							// whiteCountInUnfriend === 0 ||
							// whiteCountInUnfriend === selectedFriends.length
							Number(actionableContacts.whitelist_count) === 0 ||
								Number(actionableContacts.whitelist_count) === Number(actionableContacts.friendsCount)
								? true
								: false,
					}}
					isLoading={isFetchingbulkActionCount}
				/>
			)}

			{/* Modal for Campaign Add */}
			{/* {selectedFriends?.length > 0 && isAddingToCampaign && ( */}
			{selected_friends_curr_count > 0 && isAddingToCampaign && (
				<Modal
					ModalIconElement={CampaignModalIcon}
					headerText={"Add to Campaign"}
					bodyText={
						<>
							You have selected <b>{selected_friends_curr_count}</b> friend(s)
							{Number(actionableContacts.blacklist_count) > 0 ? (
								<>
									, and <b>{Number(actionableContacts.blacklist_count)}</b> of them
									{Number(actionableContacts.blacklist_count) > 1 ? " are" : " is"} currently on
									your blacklist
								</>
							) : (
								""
							)}
							. Are you sure you want to add{" "}
							{Number(actionableContacts.blacklist_count) > 1
								? "all of these friends"
								: "this friend"}{" "}
							to campaign?
						</>
					}
					closeBtnTxt={
						Number(actionableContacts.blacklist_count) > 0 ? "Skip blacklisted" : "Cancel"
					}
					closeBtnFun={() =>
						Number(actionableContacts.blacklist_count) > 0
							? triggerBulkOperation('skipBlacklisted')//skipBlackList
							: skipAddingToCampaign()
					}
					open={isAddingToCampaign}
					setOpen={() => {
						setIsAddingToCampaign(null);
						setSelectedCampaign("Select");
					}}
					// ModalFun={() => AddToCampaign(selectedListItems)}
					ModalFun={() => triggerBulkOperation('campaign')}
					btnText={Number(actionableContacts.blacklist_count) > 0 ? "Yes, add all" : "Add"}
					modalWithChild={true}
					ExtraProps={{
						primaryBtnDisable:
							campaignsCreated?.length <= 0 || selectedCampaign === "Select",
						cancelBtnDisable:
							Number(actionableContacts.blacklist_count) > 0
								? selected_friends_curr_count === Number(actionableContacts.blacklist_count)
									? true
									: selectedCampaign === "Select"
										? true
										: false
								: false,
					}}
					additionalClass='add-campaign-modal'
					isLoading={isFetchingbulkActionCount}
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
											type='FR_QUE_REQ_SENT'
											placeholder='Select message group'
											openSelectOption={selectMessageOptionOpen1}
											handleIsOpenSelectOption={(status) => {
												if (status) {
													setSelectMessageOptionOpen2(false);
													setShowKeywordSuggestionBar(false);
												}
												setSelectMessageOptionOpen1(status);
											}}
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
											type='FR_QUE_REQ_ACCEPT'
											placeholder='Select message group'
											openSelectOption={selectMessageOptionOpen2}
											handleIsOpenSelectOption={(status) => {
												if (status) {
													setSelectMessageOptionOpen1(false);
													setShowKeywordSuggestionBar(false);
												}
												setSelectMessageOptionOpen2(status);
											}}
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
										</label>
										<input
											type='text'
											className={`task-name-field keyword-field`}
											value={keyword}
											onChange={(e) => {
												e.stopPropagation();
												setKeyword(e.target.value);
												if (
													e.target.value &&
													e.target.value.trim() &&
													e.target.value.trim().lastIndexOf(",") > -1 &&
													!savedKeyword.includes(
														e.target.value
															.trim()
															.substring(
																0,
																e.target.value.trim().lastIndexOf(",")
															)
													)
												) {
													setSavedKeyword([
														...savedKeyword,
														e.target.value
															.trim()
															.substring(
																0,
																e.target.value.trim().lastIndexOf(",")
															),
													]);
													setShowKeywordSuggestionBar(true);
													setKeyword("");
												}
											}}
											onKeyDown={(e) => {
												if (
													e.key === "Enter" &&
													e.target.value &&
													e.target.value.trim() &&
													!savedKeyword.includes(e.target.value.trim())
												) {
													setSavedKeyword([
														...savedKeyword,
														e.target.value.trim(),
													]);
													setShowKeywordSuggestionBar(true);
													setKeyword("");
												}
											}}
											placeholder='Type your keywords here'
											style={
												showKeywordSuggestionBar && savedKeyword?.length > 0
													? {}
													: { marginBottom: "8px" }
											}
										/>
										{showKeywordSuggestionBar && savedKeyword?.length > 0 && (
											<div className='keyword-suggestion-bar'>
												{savedKeyword?.length
													? savedKeyword.map((item, index) => (
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
													))
													: null}
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
					ModalFun={() => { }}
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
								// <span className='num-header-count num-well'>{listCount}</span>
								<span className='num-header-count num-well'>{listFilteredCount}</span>
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
								{facebookData && <TooltipDate />}
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
											className={`accessibility-btn btn h-100 ${accessItem.active || accessItem.type == "exportHeader"
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
													className={`fr-dropdown fr-dropdownAction ${accessItem.type === "queueListAction" &&
															accessItem.active
															? "active"
															: ""
														}`}
												>
													<ul>
														<li
															className='del-fr-action'
															onClick={() =>
																// deleteRecordsFromFriendsQueue(accessItem)
																triggerBulkOperation('remove')
															}
															data-disabled={
																!selectedListItems || selectedListItems?.length === 0
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
																// alterFriendsQueueRecordsOrder(accessItem)
																triggerBulkOperation('move_to_top')
															}
															data-disabled={
																!selectedListItems ||
																selectedListItems?.length === 0 ||
																(
																	select_all_state?.selected &&
																	!(filter_state == null || filter_state?.filter_key_value?.length>0)
																)
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
												className={`fr-dropdown fr-dropdownAction ${accessItem.type == "quickAction" && accessItem.active
														? "active"
														: ""
													}`}
											>
												<ul>
													<li
														className={`del-fr-action ${checkDisability('unfriend') ? 'disabled' : ''}`}
														// onClick={() => checkBeforeUnfriend(accessItem)}
														onClick={() => checkForBulkAction('unfriend')}
														data-disabled={
															selectedListItems?.length > 0 &&
															selectedListItems?.filter(
																el => 
																	el?.friendship === 1 && 
																	el?.friendStatus === "Activate"
															)?.length <= 0
														// 	!selectedFriends || selectedFriends.length === 0
														// 		? true
														// 		: false
														}
													>
														<figure>
															<UnfriendIcon />
														</figure>
														<span>Unfriend</span>
													</li>
													<li
														className={`whiteLabel-fr-action ${checkDisability('whitelist') ? 'disabled' : ''}`}
														// onClick={() => whiteLabeledUsers(accessItem)}
														data-disabled={!whiteListable}
														onClick={() => checkForBulkAction('whitelist')}
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
														className={`block-fr-action ${checkDisability('blacklist') ? 'disabled' : ''}`}
														// onClick={() => BlocklistUser(accessItem)}
														data-disabled={!blacklistable}
														onClick={() => checkForBulkAction('blacklist')}
													>
														<figure>
															<BlockIcon color={"#767485"} />
														</figure>
														<span>Blacklist</span>
													</li>
													<li
														className={`campaign-fr-action ${checkDisability('campaign') ? 'disabled' : ''}`}
														// onClick={() => checkBeforeAddToCampaign(accessItem)}
														// data-disabled={
														// 	!selectedFriends || selectedFriends.length === 0
														// }
														onClick={() => {
															setIsAddingToCampaign(true)
															checkForBulkAction('campaign')
														}}
													>
														<figure>
															<CampaignQuicActionIcon />
														</figure>
														<span>Campaign</span>
													</li>
													<li
														className={`campaign-fr-action ${checkDisability('queue') ? 'disabled' : ''}`}
														// onClick={() => checkBeforeAddToCampaign(accessItem)}
														data-disabled={
															(!selectAcross?.select &&
															(selectedListItems?.length > 0 &&
															selectedListItems?.filter(
																el =>
																	el?.friendship === 4 && 
																	el?.friendStatus === "Non friend"
															)?.length <= 0)) || (
																!selectAcross?.select && 
																selectedListItems?.length === selectedListItems?.filter(el => el?.finalSource === 'incoming').length
															)
														// 	!selectedFriends || selectedFriends.length === 0
														}
														onClick={() => checkForBulkAction('queue')}
													>
														<figure>
															<AddToQueueAction />
														</figure>
														<span>Add to Queue</span>
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
