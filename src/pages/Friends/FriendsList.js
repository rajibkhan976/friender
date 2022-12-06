import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserProfile } from "../../services/authentication/facebookData";
import { getFriendList, setFriendListArray } from "../../actions/FriendsAction";

import '../../assets/scss/component/common/_listing.scss';
import Listing from "../../components/common/Listing";
import StatusRenderer from "../../components/listing/StatusRenderer";
import GenderRenderer from "../../components/listing/GenderRenderer";
import SourceRenderer from "../../components/listing/SourceRenderer";
import CreationRenderer from "../../components/listing/CreationRenderer";
import HasConversationRenderer from "../../components/listing/HasConversationRenderer"
import MessageRenderer from "../../components/listing/MessageRenderer"
import CommentRenderer from "../../components/listing/CommentRenderer"
import ReactionRenderer from "../../components/listing/ReactionRenderer"
import NameCellRenderer from "../../components/listing/NameCellRenderer";
import { updateNumberofListing } from "../../actions/FriendListAction";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";

const breadlinks = [
    {
      links: "/",
      linkString: "Menu",
    },
    {
      links: "/friends",
      linkString: "Friends",
    },
    {
      links: "/friends",
      linkString: "Friends List",
    },
  ];

const FriendsList = () => {
  useEffect(() => {
    // console.log('friendsList', friendsList);
      getFbUserId();
  },[])
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const friendsList=useSelector((state)=>state.facebook_data.current_friend_list.filter((item)=>item.deleted_status!==1 && item.friendStatus === "Activate"))
    // const [friendsList, setFriendsList] = useState([]);
    const [noDataFound, setNoDataFound] = useState(false)
  
  const [defaultFbId, setDefaultFbId] = useState(null);

  const friendsListinRef = [ 
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: true,
      headerCheckboxSelectionFilteredOnly: true,
      filterParams: {
        buttons: ["reset", "apply"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true
      },
      cellRenderer: NameCellRenderer,
      minWidth: 250,
      maxWidth: 300
    },
    {
      field: "friendStatus",
      headerName: "Status",
      filter: true,
      cellRenderer: StatusRenderer,
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
    {
      field: "friendGender",
      headerName: "Gender ",
      filter: true,
      cellRenderer: GenderRenderer,
      lockPosition: "right",
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
    {
      field: "created_at",
      headerName: "Sync & Added Date &  Time ",
      cellRenderer: CreationRenderer,
      filter: false,
      minWidth: 240,
      maxWidth: 250
    },
    {
      field: "finalSource",
      headerName: "Friends source",
      cellRenderer: SourceRenderer,
      filter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
    {
      field: "reactionThread",
      headerName: "Total Reaction",
      cellRenderer: ReactionRenderer,
      filter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
    {
      field: "commentThread",
      headerName: "Total Comment",
      cellRenderer: CommentRenderer,
      filter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
    {
      field: "message_thread",
      headerName: "Message Count",
      cellRenderer: MessageRenderer,
      filter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
    {
      field: "message_thread",
      headerName: "Has Conversation",
      cellRenderer: HasConversationRenderer,
      filter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        suppressMiniFilter: true,
        closeOnApply: true
      },
    },
  ];

  const getFbUserId = async () => {
    setLoading(true);

    try {
      let savedFbUId = localStorage.getItem('fr_default_fb');

      if(savedFbUId) {
        setDefaultFbId(savedFbUId)
      } else {
        const getCurrentFbProfile = await fetchUserProfile({token : localStorage.getItem('fr_token')});
        if(getCurrentFbProfile) {
          console.log('got saved from cloud');
          savedFbUId = localStorage.setItem('fr_default_fb', getCurrentFbProfile[0].fb_user_id);
        }
      }

        dispatch(getFriendList({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId})).unwrap()
        .then((response) => {
          if(response.data[0].friend_details.length>0){
           // setFriendsList(response.data[0].friend_details.filter((item)=>item.deleted_status!==1))
            //dispatch(setFriendListArray(response.data[0].friend_details.filter((item)=>item.deleted_status!==1)))
            setLoading(false)
            setNoDataFound(false);
            dispatch(updateNumberofListing(response.data[0].friend_details.filter((item)=>item.deleted_status!==1).length));
          }
          else {
            //dispatch(setFriendListArray([]))
            setLoading(false)
            setNoDataFound(true)
            console.log('here');
            dispatch(updateNumberofListing(0));
          }
        // console.log("response.data[0].friend_details", response.data[0].friend_details);
        })
    } catch (error) {
      console.log(error);
      setLoading(false)
      setNoDataFound(true)
    }
  }

  const setLoadingStatus = (params) => {
    setLoading(params)
  }



  return (
    <div className="main-content-inner d-flex d-flex-column">
      {friendsList?.length > 0 && 
        <>
        {!loading && !noDataFound ? 
          <Listing
              friendsData={friendsList}
              friendsListingRef={friendsListinRef}
              //setLoadingStatus={setLoadingStatus}
              // pageLoadSize={pageLoadSize}
          />
          // {console.log('Sending data:::::', friendsList?.length)}
          : '' }
        </>
      }
      {loading ? <ListingLoader/> : noDataFound && <NoDataFound />}
      {/* <div><code>{friendsList.map((item)=>{return(<p style={{display:"inline"}}>Name:{item.friendName}&nbsp;deleted:{item.deleted_status}</p>)})}</code></div> */}
    </div>
  );
};

export default FriendsList;
