import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import BreadCrumb from "./BreadCrumb";
import Radio from "./Radio";
import {
  FacebookSyncIcon,
  SortIcon,
  FilterIcon,
  ActionIcon,
  ExportIcon,
  DeleteIcon,
  WhitelabelIcon,
  ClockIcon,
  RejectIcon
} from "../../assets/icons/Icons";
import Tooltip from "./Tooltip";
import Search from "../formComponents/Search";
import Alertbox from "./Toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteFriend, removeSelectedFriends, whiteListFriend } from "../../actions/FriendListAction";
import { getFriendList } from "../../actions/FriendsAction";
import Modal from "./Modal";
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
  listingLengthWell: false
}

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

function PageHeader({ headerText = "" }) {
  const dispatch=useDispatch()
  const actionRef = useRef(null);
  const location = useLocation();
  const friendsList=useSelector((state)=>state.facebook_data.current_friend_list.filter((item)=>item.deleted_status!==1))
  const token = localStorage.getItem('fr_token');
  const selectedFriends=useSelector(state=>state.friend_list_data.selected_friends)
  const currentFbId=useSelector(state=>state.facebook_data.current_fb_id)
  const listingLength=useSelector((state)=>state.friend_list_data.relevant_listing)
  const [links, setLinks] = useState([]);
  const [accessOptions, setAccessOptions] = useState(accessibilityOptions);
  const [headerOptions, setHeaderOptions] = useState(pageOptoions);
  // const [whiteFrndcount,setWhiteFrndcount]=useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  let savedFbUId = localStorage.getItem('fr_default_fb');
  const [inlineLoader, setInlineLoader] = useState(false);
  const [selectedState, setSelectedState] = useState(true)
  const onChangeHandler = useCallback((e) => {
    console.log(e);
  }, []);

  const onSearchModified = useCallback((e) => {
    dispatch(updateFilter(e));
  }, []);

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
      case 'friend-list':
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          syncManual: true,
          searchHeader: true,
          sortHeader: true,
          filterHeader: true,
          quickAction: true,
          exportHeader: true,
          listingLengthWell: true
        });
        break;
      case 'lost-friends':
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          syncManual: true,
          searchHeader: true,
          sortHeader: true,
          filterHeader: true,
          quickAction: true,
          exportHeader: true,
          listingLengthWell: true
        });
        break;
      case 'unfriend':
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          searchHeader: true,
        });
        break;
      case 'unfriend':
        setHeaderOptions({
          ...headerOptions,
          viewSelect: true,
          searchHeader: true,
        });
        break;
      
        
        default:
          setHeaderOptions({...pageOptoions});
          break;
        }
  }, [])

  const closeFilterDropdown = (item) => {
    console.log(item.type == 'quickAction' && item.active, accessOptions);
    const accessPlaceholder = [...accessOptions];
          accessPlaceholder.filter(arrayOpt => item.type == 'quickAction' && item.active, accessOptions)[0].active = false;
    setAccessOptions(accessPlaceholder);
  }

  const whiteLabeledUsers = (item) => {
    closeFilterDropdown(item);
    if(selectedFriends&&selectedFriends.length>0){
      let payload=selectedFriends.map((item)=>{return({
        "token":token,
    "fbUserId": currentFbId,
    "friendFbId":item.friendFbId,
    "friendListId":item._id,
    "status": 1
      })})
      dispatch(whiteListFriend({payload:payload})).unwrap().then((res)=>{
        console.log("res from white listinf frind:>>>--++++",res)

        dispatch(getFriendList({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId})).unwrap().then((res)=>{
          console.log("response sfter white listing",res)
          {selectedFriends && 
            Alertbox(`${selectedFriends.length > 1 ? 'Contacts' : 'Contact'} white-listed successfully!`, "success", 1000, "bottom-right");
          }

          dispatch(removeSelectedFriends())
        })

      }).catch((err)=>{
        Alertbox(`${err.message} `, "error", 2000, "bottom-right");
        dispatch(removeSelectedFriends())
    })
    }

 
  }

  const unFriendUsers = (item) => {
    closeFilterDropdown(item);
    if(selectedFriends&&selectedFriends.length>0){
      let abortdelete=false;
      let payload=selectedFriends.map((item)=>{if(item.whitelist_status===1){
        abortdelete=true;
        // setWhiteFrndcount(whiteFrndcount+1);
      } 
      return({
        "token":token,
    "fbUserId": currentFbId,
    "friendFbId":item.friendFbId,
    "friendListId":item._id,
    "status": 1
      })})
      if(abortdelete){
        setModalOpen(true)
        return};
      
      dispatch(deleteFriend({payload:payload})).unwrap().then((res)=>{
        console.log("res from white listinf frind:>>>",res)

        dispatch(getFriendList({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId})).unwrap().then((res)=>{
          console.log("response sfter deletion",res)
          {selectedFriends && 
            Alertbox(`${selectedFriends.length > 1 ? 'Contacts' : 'Contact'} removed successfully!`, "success", 1000, "bottom-right");
          }
          dispatch(removeSelectedFriends())
        })
      }).catch((err)=>{
        dispatch(removeSelectedFriends());
        Alertbox(`${err.message} `, "error", 2000, "bottom-right");
        
    })
    }
    
  }

  const unfriendWhiteLabeled=()=>{
    if(selectedFriends&&selectedFriends.length>0){
      let payload=selectedFriends.map((item)=>{return({
        "token":token,
    "fbUserId": currentFbId,
    "friendFbId":item.friendFbId,
    "friendListId":item._id,
    "status": 1
      })})
      dispatch(deleteFriend({payload:payload})).unwrap().then((res)=>{
        console.log("res from white listinf frind:>>>",res)

        dispatch(getFriendList({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId})).unwrap().then((res)=>{
          console.log("response sfter deletion",res)
          setModalOpen(false)
          dispatch(removeSelectedFriends())
          {selectedFriends && 
            Alertbox(`${selectedFriends.length > 1 ? 'Contacts' : 'Contact'} removed successfully!`, "success", 1000, "bottom-right");
          }
        })
      }).catch((err)=>{
        Alertbox(`${err.message} `, "error", 2000, "bottom-right");
        dispatch(removeSelectedFriends())
        setModalOpen(false)
       
    })
    }
   
  }

  useEffect(() => {
    const addAccess = accessOptions.map((accessObj) => {
        switch (accessObj.type) {
          case 'sortHeader':
            return {
              ...accessObj,
              status: headerOptions.sortHeader
            }
            break;
          case 'filterHeader':
            return {
              ...accessObj,
              status: headerOptions.filterHeader
            }
            break;
      
          case 'quickAction':
            return {
              ...accessObj,
              status: headerOptions.quickAction
            }
            break;
    
          case 'exportHeader':
            return {
              ...accessObj,
              status: headerOptions.exportHeader
            }
            break;
              
        
          default:
            break;
        }
        
        return accessObj;
    });

    setAccessOptions(addAccess);
  }, [headerOptions])

  useEffect(() => {
    const locationArray = [];
    const locationPathName = location.pathname.split('/').filter((el) => el.trim() !== "");

    locationPathName
      .map((el, i) => {
        locationArray.push({
          location: el.replace("-", " "),
          key: i,
        });
      });

    setLinks(locationArray);

    validateHeaderOptions(locationPathName[locationPathName.length - 1])
  }, [location]);

  const syncFriend = async () => {
    setInlineLoader(true);

    try {
      if(localStorage.getItem("fr_current_fbId") !== localStorage.getItem("fr_default_fb")){
        alert("Please login to following facebook account https://www.facebook.com/profile.php?id=" + localStorage.getItem("fr_current_fbId"))
        setInlineLoader(false);
        return;
      }
      const friendCountPayload = {
        action : "syncFriendLength", frLoginToken : localStorage.getItem("fr_token")
      }
      const facebookFriendLength = await extensionAccesories.sendMessageToExt(friendCountPayload);
      if(facebookFriendLength){
        const friendListPayload = {
          action : "manualSyncFriendList", frLoginToken : localStorage.getItem("fr_token")
        }
        
        const syncedFriends = await extensionAccesories.sendMessageToExt(friendListPayload);

        if(syncedFriends) {
          console.log("syncedFriends  ", syncedFriends)
        }
        Alertbox('Friends syncing is successfully completed', "success", 1000, "bottom-right");
      }
    } catch (error) {
      
    } finally {
      setInlineLoader(false);
    }
  }

  useEffect(() => {
    setSelectedState(selectedFriends)
  }, [selectedFriends])

  return (
    <>
    {selectedFriends?.length > 0 && 
      <Modal 
        headerText={"Unfriend"} 
        bodyText={`${selectedFriends.length} Friends selected. but ${selectedFriends.reduce((acc,curr)=>acc+curr.whitelist_status,0)} Whitelist friend are selected as well. Are you sure you want to unfriend your friends?`} 
        open={modalOpen}
        setOpen={setModalOpen}
        ModalFun={unfriendWhiteLabeled}
        btnText={"Yes, Unfriend"}
      />
    }
    <div className="common-header d-flex f-align-center f-justify-between">
      <div className="left-div d-flex d-flex-column">
        <div className="header-breadcrumb">
          <h2 className="d-flex">
            {headerText != ""
              ? headerText
              : links.length > 0
              ? links[links.length - 1].location
              : ""}
            {console.log('links', links)}
            {headerOptions.listingLengthWell && <span className="num-header-count num-well">{friendsList.length}</span>}
          </h2>
        </div>
        <div className="menu-breadcrumb">
          {links?.length > 0 ? <BreadCrumb links={links} /> : ""}
        </div>
      </div>
      <div className="right-div d-flex f-align-center">
        {headerOptions.viewSelect && 
        <div className="fr-listing-view">
          <Radio
            name="list-type"
            options={radioOptions}
            onChangeMethod={onChangeHandler}
          />
        </div>}
        {headerOptions.syncManual &&
        <div className="fr-sync-header">
          <button className="fr-fb-sync btn h-100" onClick={syncFriend}>
            <figure>
              <FacebookSyncIcon />
            </figure>
            <span className="sync-text">Sync now</span>
            {inlineLoader ? <div className="stage"><div className="dot-pulse"></div></div> : <Tooltip />}
          </button>
        </div>
        }
        {headerOptions.searchHeader &&
          <Search
            extraClass="fr-search-header"
            onSearch={onSearchModified}
            placeholderText="Search"
          />
        }
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
              <div className="fr-access-item h-100" key={'access-'+i}>
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
                  <span className="accessibility-text">{accessItem.text}</span>
                </button>
                  {accessItem.type == 'quickAction' && 
                    <div
                      className={`fr-dropdown fr-dropdownAction ${
                        (accessItem.type == 'quickAction' && accessItem.active)
                          ? "active"
                          : ""
                      }`}
                    >
                      <ul>
                        {/* {console.log('selectedState', selectedState)} */}
                        <li 
                          className="del-fr-action"
                          onClick={() => unFriendUsers(accessItem)}
                          data-disabled={!selectedState || selectedState.length == 0 ? true : false}
                        >
                          <figure>
                            <DeleteIcon />
                          </figure>
                          <span>Unfriend</span>
                        </li>
                        <li 
                          className="whiteLabel-fr-action"
                          onClick={() => whiteLabeledUsers(accessItem)}
                          data-disabled={!selectedState || selectedState.length == 0 ? true : false}
                        >
                          <figure>
                            <WhitelabelIcon />
                          </figure>
                          <span>Whitelist Friends</span>
                        </li>
                        <li 
                          className="history-fr-action"
                          data-disabled={!selectedState || selectedState.length == 0 ? true : false}
                        >
                          <figure>
                            <ClockIcon />
                          </figure>
                          <span>Run History</span>
                        </li>
                        <li 
                          className="reject-fr-action"
                          data-disabled={!selectedState || selectedState.length == 0 ? true : false}
                        >
                          <figure>
                            <RejectIcon />
                          </figure>
                          <span>Reject Requests</span>
                        </li>
                      </ul>
                    </div>
                  }
              </div>
            ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default PageHeader;
