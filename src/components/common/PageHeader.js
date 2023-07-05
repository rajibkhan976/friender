import { useState, useEffect, useCallback, useRef, memo } from "react";
import { useLocation } from "react-router-dom";

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
} from "../../assets/icons/Icons";
import Tooltip from "./Tooltip";
import Search from "../formComponents/Search";
import Alertbox from "./Toast";
import { useDispatch, useSelector } from "react-redux";
import { removeSelectedFriends } from "../../actions/FriendListAction";
import {
  saveUserProfile,
  fetchUserProfile,
} from "../../services/authentication/facebookData";
import {
  setProfileSpaces,
  setDefaultProfileId,
} from "../../actions/ProfilespaceActions";
import { getSendFriendReqst } from "../../actions/FriendsAction";
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
import "../../assets/scss/component/common/_page_header.scss"

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
  console.log("There Is a connection Error in header", e);
  socket.io.opts.transports = ["websocket", "polling"];
});

function PageHeader({ headerText = "" }) {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const { clickedRef, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const messageType = useSelector((state) => state.message.messageType);
  const actionRef = useRef(null);
  const location = useLocation();
  const token = localStorage.getItem("fr_token");
  const selectedFriends = useSelector(
    (state) => state.friendlist.selected_friends
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
  const [toolTip, setTooltip] = useState('');
  const [whiteCountInUnfriend, setWhiteCountInUnfriend] = useState(null);
  const [messageTypeOpt, setMessageTypeOpt] = useState("dmf");
  const [runningUnfriend, setRunningUnfriend] = useState(false);
  // const onChangeHandler = useCallback((e) => {
  //   //console.log(e);
  // }, []);
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

  socket.on("facebookLoggedOut", (logoutUpdate) => {
    //console.log("updates :::  ", logoutUpdate);
    setUpdate(syncBtnDefaultState);
    setInlineLoader(false);
    setIsSyncing("");
    dispatch(getFriendList({ fbUserId: localStorage.getItem("fr_default_fb") }))
      .unwrap()
      .then((response) => {
        // if (response?.data?.length > 0) {
        //   setTooltip(response?.data[0]?.friend_details[0]?.updated_at);
        //   localStorage.setItem(
        //     "fr_tooltip",
        //     response?.data[0]?.friend_details[0]?.updated_at
        //   );
        // }
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
    switch (pathValue) {
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
        });
        break;
      case "unfriended-friends":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: false,
          searchHeader: true,
          listingLengthWell: true,
          quickAction: false,
        });
        break;
      case "whitelisted-friends":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: false,
          searchHeader: true,
          quickAction: true,
          listingLengthWell: true,
        });
        break;
      case "blacklisted-friends":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: false,
          quickAction: true,
          searchHeader: true,
          listingLengthWell: true,
        });
        break;
      case "message":
        setHeaderOptions({
          ...headerOptions,
          messageOption: true,
        });
        break;
      case "pending-request":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: false,
          syncManual: false,
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
          syncManual: false,
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
        setHeaderOptions({ ...pageOptoions });
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
      dispatch(whiteListFriend({ payload: payload }))
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

      dispatch(BlockListFriend({ payload: payload }))
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

    if (defaultFb !== loggedInFb) {
      alert(
        "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
        localStorage.getItem("fr_default_fb")
      );
      return false;
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
        alert(
          "Please login to following facebook account https://www.facebook.com/profile.php?id=" +
          localStorage.getItem("fr_default_fb")
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
        console.log('response', response);
        if (response?.data?.length > 0 && response?.data[0]?.last_sync_at) {
          setTooltip(response?.data[0]?.last_sync_at);
          localStorage.setItem(
            "fr_tooltip",
            response?.data[0]?.last_sync_at
          );
        } else {
          setTooltip('');
          localStorage.removeItem('fr_tooltip')
        }
      });
  };

  const fetchPendingFrRquest = async () => {
    dispatch(getSendFriendReqst({ fbUserId: localStorage.getItem("fr_default_fb") })).unwrap().then((res) => {
      console.log("Pending Request List", res)
    })
  }

  const completeSync = async () => {
    // console.log("Stop syncing");
    setIsSyncing("");
    setUpdate(syncBtnDefaultState);
    setInlineLoader(false);
    // setIsStopingSync(false);
    isStopingSync = false;
    localStorage.removeItem("fr_update");
    console.log("syncing completed_________________________>")
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
      localStorage.getItem("fr_default_fb") !== facebookData?.fb_data?.fb_user_id
    ) {
      dispatch(getFriendList({ fbUserId: localStorage.getItem("fr_default_fb") }))
        .unwrap()
        .then((response) => {
          if (response) {
            if (!response?.data[0]?.last_sync_at) {
              setTooltip('');
              localStorage.removeItem("fr_tooltip");
            } else {
              localStorage.setItem("fr_tooltip", response?.data[0]?.last_sync_at);
              setTooltip(response?.data[0]?.last_sync_at);
            }
          }
        })
    } else {
      setTooltip(facebookData?.fb_data?.last_sync_at)
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
    console.log('toolTip:::', toolTip);
    if (toolTip) {
      if (toolTip?.trim() !== '' || !isNaN(toolTip)) {
        // let differenceInDays = (new Date() - new Date(toolTip)) / (1000 * 60 * 60 * 24);
        let differenceInDays = new Date().getDate() - new Date(toolTip).getDate()
        console.log('differenceInDays:::', new Date().getDate() - new Date(toolTip).getDate());

        if (differenceInDays === 1) {
          return '1 Day ago'
        }
        else if (differenceInDays > 1) {
          return `${differenceInDays} days ago`
        }
        else {
          return 'Today'
        }
      } else {
        return ''
      }
    } else {
      return ''
    }
    // `Last sync : ${Math.ceil(new Date().getDate() - new Date(toolTip).getDate()) > 1 ?
    //   `${Math.ceil(new Date().getDate() - new Date(toolTip).getDate())} days ago` :
    //   Math.ceil(new Date().getDate() - new Date(toolTip).getDate()) === 1 ?
    //     `${Math.ceil(new Date().getDate() - new Date(toolTip).getDate())} day ago` : 'Today'}` :
    // ""
  }

  return (
    <>
      {/* <Prompt
        when={runningUnfriend}
        message={() => 'Are you sure you want to leave this page? Your changes will not be saved.'}
      /> */}
      {selectedFriends?.length > 0 && (
        <Modal
          modalType="delete-type"
          modalIcon={DeleteImgIcon}
          headerText={"Unfriend"}
          bodyText={
            <>
              You have selected <b>{selectedFriends.length}</b> friend(s), and{" "}
              <b>
                {" "}
                {selectedFriends.length > 0
                  ? selectedFriends.reduce((acc, curr) => acc + curr.whitelist_status, Number(0))
                  : Number(0)}{" "}
              </b>{" "}
              of them are currently on your whitelist. Are you sure you want to remove all of these friend(s) from your list? SOLVED
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
      <div className="common-header d-flex f-align-center f-justify-between">
        <div className="left-div d-flex d-flex-column">
          <div className="header-breadcrumb">
            <h2 className="d-flex">
              {headerText != ""
                ? headerText
                : links.length > 0
                  ? links[links.length - 1].location
                  : ""}
              {headerOptions.listingLengthWell && (
                <span className="num-header-count num-well">{listCount}</span>
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
          <div className="menu-breadcrumb">
            {links?.length > 0 ? <BreadCrumb links={links} /> : ""}
          </div>
        </div>
        <div className="right-div d-flex f-align-center">
          {headerOptions.viewSelect && (
            <div className="fr-listing-view no-click">
              {/* <Radio
                name="list-type"
                options={radioOptions}
                onChangeMethod={onChangeHandler}
              /> */}
            </div>
          )}
          {headerOptions.searchHeader && (
            <Search
              extraClass="fr-search-header"
              itemRef={searchRef}
              onSearch={onSearchModified}
              placeholderText="Search"
            />
          )}
          {headerOptions.syncManual && (
            <div className="fr-sync-header">
              <button
                className={`fr-fb-sync btn h-100 ${isSyncing ? "active" : ""}`}
                onClick={syncFriend}
                disabled={inlineLoader ? true : false}
              >
                <figure>
                  <FacebookSyncIcon />
                </figure>
                <span className="sync-text">
                  {update || syncBtnDefaultState}
                </span>
              </button>
              <span className="last-sync-status text-center">
                <TooltipDate />
              </span>
            </div>
          )}

          {
            accessOptions
              .filter((e) => e.status)
              .length > 0 ?
              <div className="fr-accessibility-buttons d-flex f-align-center">
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
                      className="fr-access-item h-100"
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
                        <figure className="accessibility-icon">
                          {accessItem.icon}
                        </figure>
                        <span className="accessibility-text">
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
                              className="del-fr-action"
                              onClick={() => checkBeforeUnfriend(accessItem)}
                              data-disabled={
                                !selectedFriends || selectedFriends.length === 0
                                  ? true
                                  : false
                              }
                            >
                              <figure>
                                <DeleteIcon />
                              </figure>
                              <span>Unfriend</span>
                            </li>
                            <li
                              className="whiteLabel-fr-action"
                              onClick={() => whiteLabeledUsers(accessItem)}
                              data-disabled={!whiteListable}
                            >
                              <figure>
                                <WhitelabelIcon />
                              </figure>
                              <span>Whitelist Friends</span>
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
                              className="block-fr-action"
                              onClick={() => BlocklistUser(accessItem)}
                              data-disabled={!blacklistable}
                            >
                              <figure>
                                <BlockIcon color={"#767485"} />
                              </figure>
                              <span>Blacklist</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
              </div> : ''}
        </div>
      </div>
    </>
  );
}

export default memo(PageHeader);
