import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import FriendsAction from "../../actions/FriendsAction";

 
import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import {
  SourceRenderer,
  HasConversationRenderer,
  MessageRenderer,
  ReactionRenderer,
  NameCellRenderer,
  StatusRenderer,
  CommentRenderer,
  GenderRenderer,
  CreationRenderer,
} from "../../components/listing/FriendListColumns";
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
    links: "/friends/incoming-pending-request",
    linkString: "Incoming Pending Request",
  },
];

const IncomingPendingRequest = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [friendsList, setFriendsList] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);

  const [defaultFbId, setDefaultFbId] = useState(null);

  const friendsListinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      headerCheckboxSelectionFilteredOnly: true,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "equals",
          "notEqual",
          "contains",
          "notContains",
          "startsWith",
          "endsWith",
        ],
      },
      cellRenderer: NameCellRenderer,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      field: "friendStatus",
      headerName: "Status",
      filter: "agTextColumnFilter",
      cellRenderer: StatusRenderer,
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["equals", "notEqual"],
      },
    },
    {
      field: "friendGender",
      headerName: "Gender ",
      filter: "agTextColumnFilter",
      cellRenderer: GenderRenderer,
      // lockPosition: "right",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["equals", "notEqual"],
      },
    },
    {
      field: "created_at",
      headerName: "Sync & Added Date &  Time ",
      cellRenderer: CreationRenderer,
      minWidth: 240,
      maxWidth: 250,
      filter: "agDateColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "contains",
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
          "inRange",
        ],
      },
    },
    {
      field: "finalSource",
      headerName: "Friends Source",
      cellRenderer: SourceRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["equals", "notEqual", "contains"],
      },
    },
    {
      field: "reactionThread",
      headerName: "Total Reaction",
      cellRenderer: ReactionRenderer,
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "contains",
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
          "inRange",
        ],
      },
    },
    {
      field: "commentThread",
      headerName: "Total Comment",
      cellRenderer: CommentRenderer,
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "contains",
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
          "inRange",
        ],
      },
    },
    {
      field: "message_thread",
      headerName: "Message Count",
      cellRenderer: MessageRenderer,
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "contains",
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
          "inRange",
        ],
      },
    },
    {
      field: "message_thread",
      headerName: "Has Conversation",
      cellRenderer: HasConversationRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["equals", "notEqual", "contains"],
      },
    },
  ];

  const getFbUserId = async () => {
    setLoading(true);

    try {
      let savedFbUId = localStorage.getItem("fr_default_fb");

      if (savedFbUId) {
        setDefaultFbId(savedFbUId);
      } else {
        const getCurrentFbProfile = await fetchUserProfile();
        if (getCurrentFbProfile) {
          savedFbUId = localStorage.setItem(
            "fr_default_fb",
            getCurrentFbProfile[0].fb_user_id
          );
        }
      }

      dispatch(
        FriendsAction.getFriendList({
          token: localStorage.getItem("fr_token"),
          fbUserId: savedFbUId,
        })
      ).then((response) => {
        console.log(
          localStorage.getItem("fr_token"),
          savedFbUId,
          "response",
          response
        );
        if (response.data[0].friend_details.length > 0) {
          console.log(
            "helo e   pending lst datta:::::",
            response.data[0].friend_details
          );
          setFriendsList(response.data[0].friend_details);
          setLoading(false);
          setNoDataFound(false);
          //console.log("here:::", response.data[0].friend_details);
        } else {
          setFriendsList([]);
          setLoading(false);
          setNoDataFound(true);
          //console.log("here");
        }
        // console.log("response.data[0].friend_details", response.data[0].friend_details);
      });
    } catch (error) {
      //console.log(error);
      setLoading(false);
      setNoDataFound(true);
    }
  };

  const setLoadingStatus = (params) => {
    setLoading(params);
  };

  useEffect(() => {
    getFbUserId();
  }, []);

  return (
    <div className="main-content-inner d-flex d-flex-column">
      {friendsList?.length > 0 && (
        <>
          <Listing
            friendsData={friendsList}
            friendsListingRef={friendsListinRef}
            setLoadingStatus={setLoadingStatus}
            // pageLoadSize={pageLoadSize}
          />
        </>
      )}

      {loading && <ListingLoader />}
      {noDataFound && <NoDataFound />}
    </div>
  );
};

export default IncomingPendingRequest;