import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import BreadCrumb from "./BreadCrumb";
import Radio from "./Radio";
import { io } from "socket.io-client";
import {
  FacebookSyncIcon,
  SortIcon,
  FilterIcon,
  ActionIcon,
  ExportIcon,
  DeleteIcon,
  WhitelabelIcon,
  ClockIcon,
  RejectIcon,
} from "../../assets/icons/Icons";
import Tooltip from "./Tooltip";
import Search from "../formComponents/Search";
import Alertbox from "./Toast";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFriend,
  removeSelectedFriends,
  whiteListFriend,
} from "../../actions/FriendListAction";
import { getFriendList } from "../../actions/FriendsAction";
import Modal from "./Modal";
import DeleteImgIcon from "../../assets/images/deleteModal.png"
import extensionAccesories from "../../configuration/extensionAccesories";
import { updateFilter } from "../../actions/FilterActions";

// Page-wise options
const pageOptoions = {
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

const ENDPOINTEST = process.env.REACT_APP_SOCKET_URL_LOCAL;

const socket = io(ENDPOINTEST, {
  transports: ["websocket"], // use WebSocket first, if available
});
socket.on("connect_error", () => {
  // console.log("There Is a connection Error");
  socket.io.opts.transports = ["polling", "websocket"];
});

function PageHeader({ headerText = "" }) {
  const dispatch = useDispatch();
  const actionRef = useRef(null);
  const location = useLocation();
  const token = localStorage.getItem("fr_token");
  const selectedFriends = useSelector(
    (state) => state.friend_list_data.selected_friends
  );
  const currentFbId = useSelector((state) => state.facebook_data.current_fb_id);
  const listCount = useSelector((state) =>
    state.friend_list_data.curr_list_count
    
  );
  const [links, setLinks] = useState([]);
  const [accessOptions, setAccessOptions] = useState(accessibilityOptions);
  const [headerOptions, setHeaderOptions] = useState(pageOptoions);
  const [modalOpen, setModalOpen] = useState(false);
  let savedFbUId = localStorage.getItem("fr_default_fb");
  const [inlineLoader, setInlineLoader] = useState(false);
  const [selectedState, setSelectedState] = useState(true);
  const [isSyncing, setIsSyncing] = useState(true);
  const [toolTip, setTooltip] = useState("");
  const onChangeHandler = useCallback((e) => {
    console.log(e);
  }, []);

  const onSearchModified = useCallback((e) => {
    dispatch(updateFilter(e));
  }, []);
  const [update, setUpdate] = useState("Sync Now");

  socket.on("sendUpdate", (facebookFriendListUpdate)=>{
    console.log("sendUpdate ::: ", facebookFriendListUpdate);
    localStorage.setItem("fr_isSyncing", facebookFriendListUpdate?.isSyncing);
    setIsSyncing(facebookFriendListUpdate?.isSyncing);
    setUpdate(facebookFriendListUpdate?.update)
    localStorage.setItem("fr_update", facebookFriendListUpdate?.update)
    setInlineLoader(false);
  });

  const onAccessClick = (e) => {
    const updatedAccess = accessOptions.map((accessObj) => {
      if (accessObj.type === e.type) {
        return {
          ...accessObj,
          active: !accessObj.active,
        };
      }
      return accessObj;
    });

    setAccessOptions(updatedAccess);
  };

  const validateHeaderOptions = useCallback((pathValue) => {
    switch (pathValue) {
      case "friend-list":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          syncManual: true,
          searchHeader: true,
          sortHeader: true,
          filterHeader: true,
          quickAction: true,
          exportHeader: true,
          listingLengthWell: true,
        });
        break;
      case "lost-friends":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          syncManual: true,
          searchHeader: true,
          sortHeader: true,
          filterHeader: true,
          quickAction: true,
          exportHeader: true,
          listingLengthWell: true,
        });
        break;
      case "unfriend":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          searchHeader: true,
          listingLengthWell: true
        });
        break;
        case "whitelist":
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          searchHeader: true,
          listingLengthWell: true
        });
        break;
      default:
        setHeaderOptions({ ...pageOptoions });
        break;
    }
  }, []);

  const sleep = (ms) => {
    console.log("SLEEP for ", ms / 1000 + " Second(s)")
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  const closeFilterDropdown = (item) => {
    console.log(item.type == "quickAction" && item.active, accessOptions);
    const accessPlaceholder = [...accessOptions];
    accessPlaceholder.filter(
      (arrayOpt) => item.type == "quickAction" && item.active,
      accessOptions
    )[0].active = false;
    setAccessOptions(accessPlaceholder);
  };

  const whiteLabeledUsers = (item) => {
    closeFilterDropdown(item);
    if (selectedFriends && selectedFriends.length > 0) {
      let payload = selectedFriends.map((item) => {
        return {
          // token: token,
          fbUserId: currentFbId,
          friendFbId: item.friendFbId,
          friendListId: item._id,
          status: 1,
        };
      });
      dispatch(whiteListFriend({ payload: payload }))
        .unwrap()
        .then((res) => {
          dispatch(
            getFriendList({
              // token: localStorage.getItem("fr_token"),
              fbUserId: savedFbUId,
            })
          )
            .unwrap()
            .then((res) => {
              selectedFriends &&
                Alertbox(
                  `${
                    selectedFriends.length > 1 ? "Contacts" : "Contact"
                  } white-listed successfully!`,
                  "success",
                  1000,
                  "bottom-right"
                );

              dispatch(removeSelectedFriends());
            });
        })
        .catch((err) => {
          Alertbox(`${err.message} `, "error", 2000, "bottom-right");
          dispatch(removeSelectedFriends());
        });
    }
  };

  const checkBeforeUnfriend = async (item) => {
    if (item) {
      closeFilterDropdown(item);
    }
    if (selectedFriends && selectedFriends.length > 0) {
      let abortdelete = false;
      selectedFriends.map( async (item) => {
        if (item.whitelist_status === 1) {
          abortdelete = true;
          return; 
        }
      });

      if (abortdelete) {
        setModalOpen(true);
        return;
      } else {
        unfriend();
      }
     
    }
  };

  const unfriend = () => {
    selectedFriends.map( async (item, i) => {
      console.log("deleteing")
    
      let payload = [{
        fbUserId: currentFbId,
        friendFbId: item.friendFbId,
        friendListId: item._id,
        status: 1,
      }];

      const unfriendFromFb = await extensionAccesories.sendMessageToExt({
        action: "unfriend",
        frLoginToken: localStorage.getItem("fr_token"),
        payload: payload
      });

      dispatch(deleteFriend({ payload: payload }))
      .unwrap()
      .then((res) => {
        dispatch(
          getFriendList({
            fbUserId: savedFbUId,
          })
        )
          .unwrap()
          .then((res) => {
            selectedFriends &&
              Alertbox(
                `${
                  item.friendName 
                } unfriended successfully!`,
                "success",
                1000,
                "bottom-right"
              );
            dispatch(removeSelectedFriends());
          });
      })
      .catch((err) => {
        dispatch(removeSelectedFriends());
        Alertbox(`${err.message} `, "error", 2000, "bottom-right");
      });
      let delay = getRandomInteger(1000*5, 1000*60*2); // 30 secs to 2 mins
      await sleep(delay);
    });
    
  }
  const syncFriend = async () => {
    setInlineLoader(true);
    try {
      const facebookProfile = await extensionAccesories.sendMessageToExt({
        action: "syncprofile",
        frLoginToken: localStorage.getItem("fr_token"),
      });
      // console.log("facebookProfile :::::::::::::: ", facebookProfile?.uid?.toString())
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
      localStorage.setItem("fr_isSyncing", "active");
      localStorage.setItem("fr_update", "Syncing Friends...")
      setUpdate("Syncing Friends...");
      setIsSyncing("active");
      const friendCountPayload = {
        action: "syncFriendLength",
        frLoginToken: localStorage.getItem("fr_token"),
      };
      const facebookFriendLength = await extensionAccesories.sendMessageToExt(
        friendCountPayload
      );
      if (facebookFriendLength) {
      localStorage.setItem("friendLength", facebookFriendLength.friendLength)
        const friendListPayload = {
          action: "manualSyncFriendList",
          frLoginToken: localStorage.getItem("fr_token"),
        };

        const syncedFriends = await extensionAccesories.sendMessageToExt(
          friendListPayload
        );

        if (syncedFriends) {
          console.log("syncedFriends  ", syncedFriends);
        }
        localStorage.setItem("fr_isSyncing", "");
        Alertbox(
          "Friends syncing is successfully completed",
          "success",
          1000,
          "bottom-right"
        );
        setInlineLoader(false);
        console.log("here");
      }
      console.log("here::::");
    } catch (error) {
    } finally {
      setInlineLoader(false);
    }
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
    setSelectedState(selectedFriends);
  }, [selectedFriends]);

  useEffect(() => {
    setIsSyncing(localStorage.getItem("fr_isSyncing"));
    console.log("localStorage.getItem(fr_update) :::: ", localStorage.getItem("fr_update") !== null && localStorage.getItem("fr_update") !== "Done" )
    if(localStorage.getItem("fr_tooltip") !== null) setTooltip(localStorage.getItem("fr_tooltip"))
    if(localStorage.getItem("fr_update") !== null && localStorage.getItem("fr_update") !== "Done" ){ setUpdate(localStorage.getItem("fr_update")) } else setUpdate("Sync Now")
  }, []);

  useEffect(() => {
    console.log("inlineLoader", inlineLoader);
  }, [inlineLoader]);


  useEffect(()=>{
    if(update === "Done"){
    Alertbox(
        "Friends syncing is successfully completed",
        "success",
        1000,
        "bottom-right"
      );
      setUpdate("Sync Now");
      dispatch(getFriendList({"fbUserId" : localStorage.getItem("fr_default_fb")})).unwrap()
          .then((response) => {
            console.log("response :::b ", response)
            if(response?.data?.length>0){
              setTooltip(response?.data[0]?.friend_details[0]?.updated_at)
              localStorage.setItem("fr_tooltip", response?.data[0]?.friend_details[0]?.updated_at)
            }
            // else {
            // }
          })
    }
  }, [update]);


  return (
    <>
      {selectedFriends?.length > 0 && (
        <Modal
          modalType="delete-type"
          modalIcon={DeleteImgIcon}
          headerText={"Unfriend"}
          bodyText={`${
            selectedFriends.length
          } Friends selected. but ${selectedFriends.reduce(
            (acc, curr) => acc + curr.whitelist_status,
            0
          )} Whitelist friend are selected as well. Are you sure you want to unfriend your friends?`}
          open={modalOpen}
          setOpen={setModalOpen}
          ModalFun={unfriend}
          btnText={"Yes, Unfriend"}
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
                <span className="num-header-count num-well">
                  {listCount}
                </span>
              )}
            </h2>
          </div>
          <div className="menu-breadcrumb">
            {links?.length > 0 ? <BreadCrumb links={links} /> : ""}
          </div>
        </div>
        <div className="right-div d-flex f-align-center">
          {headerOptions.viewSelect && (
            <div className="fr-listing-view">
              <Radio
                name="list-type"
                options={radioOptions}
                onChangeMethod={onChangeHandler}
              />
            </div>
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
                  {update}
                </span>
                {console.log(toolTip)}
                {!isSyncing && <Tooltip textContent={toolTip !== "" ? "Last syced at " + toolTip : "Not Synced yet."} />}
              </button>
            </div>
          )}
          {headerOptions.searchHeader && (
            <Search
              extraClass="fr-search-header"
              onSearch={onSearchModified}
              placeholderText="Search"
            />
          )}
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
                <div className="fr-access-item h-100" key={"access-" + i}>
                  <button
                    className={`accessibility-btn btn h-100 ${
                      accessItem.active || accessItem.type == "exportHeader"
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
                  {accessItem.type == "quickAction" && (
                    <div
                      className={`fr-dropdown fr-dropdownAction ${
                        accessItem.type == "quickAction" && accessItem.active
                          ? "active"
                          : ""
                      }`}
                    >
                      <ul>
                        <li
                          className="del-fr-action"
                          onClick={() => checkBeforeUnfriend(accessItem)}
                          data-disabled={
                            !selectedState || selectedState.length == 0
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
                          data-disabled={
                            !selectedState || selectedState.length == 0
                              ? true
                              : false
                          }
                        >
                          <figure>
                            <WhitelabelIcon />
                          </figure>
                          <span>Whitelist Friends</span>
                        </li>
                        <li
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
                        </li>
                        <li
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
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PageHeader;
