import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Footer from "../../components/common/Footer";
import Sidebar from "../../components/common/Sidebar";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import FriendsAction from "../../actions/FriendsAction";

import '../../assets/scss/component/common/_listing.scss';
import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import PageHeader from "../../components/common/PageHeader";
import NoDataFound from "../../components/common/NoDataFound";
import StatusRenderer from "../../components/listing/StatusRenderer";
import GenderRenderer from "../../components/listing/GenderRenderer";
import SourceRenderer from "../../components/listing/SourceRenderer";
import CreationRenderer from "../../components/listing/CreationRenderer";
import HasConversationRenderer from "../../components/listing/HasConversationRenderer"
import MessageRenderer from "../../components/listing/MessageRenderer"
import CommentRenderer from "../../components/listing/CommentRenderer"
import ReactionRenderer from "../../components/listing/ReactionRenderer"
import NameCellRenderer from "../../components/listing/NameCellRenderer";

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
      links: "/friends/incoming-pending-request",
      linkString: "Incoming Pending Request",
    },
  ];

const IncomingPendingRequest = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [friendsList, setFriendsList] = useState([]);
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
      filterParams: {
        buttons: ["reset", "apply"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true
      },
      cellRenderer: NameCellRenderer,
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
        console.log('got saved from local');
        setDefaultFbId(savedFbUId)
      } else {
        const getCurrentFbProfile = await fetchUserProfile({token : localStorage.getItem('fr_token')});
        if(getCurrentFbProfile) {
          console.log('got saved from cloud');
          savedFbUId = localStorage.setItem('fr_default_fb', getCurrentFbProfile[0].fb_user_id);
        }
      }

        dispatch(FriendsAction.getFriendList({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId}))
        .then((response) => {
          console.log(localStorage.getItem('fr_token'), savedFbUId, 'response', response);
          if(response.data[0].friend_details.length>0){
            setFriendsList(response.data[0].friend_details)
            setLoading(false)
            setNoDataFound(false)
            console.log('here:::', response.data[0].friend_details);
          }
          else {
            setFriendsList([])
            setLoading(false)
            setNoDataFound(true)
            console.log('here');
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

  useEffect(() => {
      getFbUserId();
  },[])

  return (
    <div className="main-content-inner d-flex d-flex-column">
      {friendsList?.length > 0 &&
      <>
          <Listing
              friendsData={friendsList}
              friendsListingRef={friendsListinRef}
              setLoadingStatus={setLoadingStatus}
              // pageLoadSize={pageLoadSize}
          />
      </>}

      {loading && <ListingLoader/>}
      {noDataFound && <NoDataFound />}
    </div>
  );
};

export default IncomingPendingRequest;
