import { useState, useEffect, useCallback, useRef, memo } from "react";
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
	DeleteIcon,
	WhitelabelIcon,
	BlockIcon,
	UnfriendIcon,
	CampaignQuicActionIcon,
	CampaignModalIcon,
	OpenInNewTab,
	InfoIcon,
} from "../../assets/icons/Icons";
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
import {
	setProfileSpaces,
	setDefaultProfileId,
} from "../../actions/ProfilespaceActions";
import { getSendFriendReqst, reLoadFrList, unLoadFrList } from "../../actions/FriendsAction";
import {
	deleteFriend,
	getFriendList,
	whiteListFriend,
	BlockListFriend,
} from "../../actions/FriendsAction";
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
	console.log("disconnect due to " + reason);
});
socket.on("connect_error", (e) => {
	//console.log("There Is a connection Error in header", e);
	socket.io.opts.transports = ["websocket", "polling"];
});

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
	const blacklistedFriends = useSelector((state) => state.friendlist.selected_friends.filter((el) => el?.blacklist_status));
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
	const campaignsCreated = useSelector((state) => state.campaign.campaignsArray);
	const [campaignListSelector, setCampaignListSelector] = useState(false);
	const [selectedCampaignName, setSelectedCampaignName] = useState("Select");

	const refreshFrList = () => {
		dispatch(unLoadFrList());
		setTimeout(() => {
			dispatch(reLoadFrList());
		}, 300)
	}

	useEffect(() => {
		setSelectedCampaign("Select");
		setCampaignListSelector(false);
		setSelectedCampaignName("Select");

	}, [isAddingToCampaign])
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

		console.log("location array -- ", locationArray);

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
			(arrayOpt) => item.type == "quickAction" && item.active,
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
				console.log("facewbook data", facebookProfile);
				console.log("profile datattat", profileData);
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

	}

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
		console.log("proceed further ", proceedFurther);
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
						message: `${item.friendName
							} unfriended successfully!   (Unfriending ${i + 1}/${unfriendableList.length
							})`,
						position: "bottom-right",
					});
					Alertbox(
						`${item.friendName} unfriended successfully!   (Unfriending ${i + 1
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
				console.log("response", response);
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
				console.log("Pending Request List", res);
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
			console.log("now ending:::::::");
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
		console.log("SKIP BLACKLISTED");
		const listWithOutBlacklisted = selectedFriends.filter((item) => {
			return item.blacklist_status !== 1;
		});
		console.log("list ou black", listWithOutBlacklisted)
		AddToCampaign(listWithOutBlacklisted);
	};

	// Add selected / forwarded friends to campaign
	const AddToCampaign = (addFriendsToCampaign) => {
		//dispatch(removeSelectedFriends());
		try {
			// console.log('addFriendsToCampaign', addFriendsToCampaign, 'selectedCampaign', selectedCampaign)
			let payload = {
				"campaignId": selectedCampaign,
				"facebookUserId": localStorage.getItem("fr_default_fb"),
				"friend_details": addFriendsToCampaign.map((item) => {
					return {
						"friendFbId": item.friendFbId ? item.friendFbId : null,
						"friendAddedAt": item.created_at ? item.created_at : null,
						"finalSource": item.finalSource ? item.finalSource : null,
						"friendName": item.friendName ? item.friendName : null,
						"friendProfilePicture": item.friendProfilePicture ? item.friendProfilePicture : null,
						"friendProfileUrl": item.friendProfileUrl ? item.friendProfileUrl : null,
						"groupName": item.groupName ? item.groupName : null,
						"status": "pending",
						"groupUrl": item.groupUrl ? item.groupUrl : null,
						"matchedKeyword": item.matchedKeyword ? item.matchedKeyword : null,
					}
				}),
			}
			dispatch(addUsersToCampaign(payload)).unwrap().then((res) => {
				refreshFrList();
				dispatch(removeSelectedFriends());
				Alertbox(
					`${addFriendsToCampaign?.length} friend(s) has been added to campaign successfully.`,
					"success",
					1000,
					"bottom-right"
				);
			}
			).catch((err) => {
				console.log("Add to campaign:", err);
			})
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
							{blacklistedFriends?.length >
								0 ? (
								<>
									, and{" "}
									<b>
										{
											blacklistedFriends
												?.length
										}
									</b>{" "}
									of them
									{blacklistedFriends
										?.length > 1
										? " are"
										: " is"}{" "}
									currently on your blacklist
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
						blacklistedFriends?.length > 0
							? "Skip blacklisted"
							: "Cancel"
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
					btnText={
						blacklistedFriends?.length > 0
							? "Yes, add all"
							: "Add"
					}
					modalWithChild={true}
					ExtraProps={{
						primaryBtnDisable:
							campaignsCreated?.length <= 0 || selectedCampaign === "Select",
						cancelBtnDisable: blacklistedFriends.length > 0 ?
							selectedFriends?.length === blacklistedFriends?.length
								? true
								: selectedCampaign === "Select"
									? true
									: false
							: false
					}}
					additionalClass='add-campaign-modal'
				>
					{/* If Campaign created, list else disable and show link for creation */}
					<>
						<h6>Choose campaign</h6>
						<span className='select-wrapers w-100' onClick={() => { setCampaignListSelector(!campaignListSelector) }}>

							<div className='selector_box'>
								{utils.cropParagraph(selectedCampaignName, 32)}
								{campaignsCreated?.length > 0 &&
									campaignListSelector && <ul className="selector_box_options">
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

									</ul>}

								<span className='select-arrow'></span>
							</div>

						</span>
						{campaignsCreated?.length <= 0 && (
							<span className='inline-note warning-note-inline'>
								<InfoIcon />
								You haven’t created any campaign(s) yet.{" "}
								<Link
									to='/messages/campaigns/create-campaign'
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

			<div className='common-header d-flex f-align-center f-justify-between'>
				<div className='left-div d-flex d-flex-column'>
					<div className='header-breadcrumb'>
						<h2 className='d-flex'>
							{/* {console.log(
								"links[links.length - 1]",
								links[links.length - 2]?.location
							)} */}
							{headerText != ""
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
											className={`accessibility-btn btn h-100 ${accessItem.active || accessItem.type == "exportHeader"
												? "active"
												: ""
												}`}
											key={accessItem.type + i}
											onClick={() => onAccessClick(accessItem)}
											ref={accessItem.type == "quickAction" ? actionRef : null}
										>
											<figure className='accessibility-icon'>
												{accessItem.icon}
											</figure>
											<span className='accessibility-text'>
												{accessItem.text}
											</span>
										</button>
										{accessItem.type == "quickAction" && isComponentVisible && (
											<div
												className={`fr-dropdown fr-dropdownAction ${accessItem.type == "quickAction" && accessItem.active
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
