import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import { getFriendLost } from "../../actions/FriendsAction";
import {
  countCurrentListsize,
  updateNumberofListing,
} from "../../actions/FriendListAction";
import "../../assets/scss/component/common/_listing.scss";
import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import {
  SourceRenderer,
  HasConversationRenderer,
  NameCellRenderer,
  StatusRenderer,
  GenderRenderer,
  CreationRenderer,
} from "../../components/listing/FriendListColumns";

const LostFriends = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const [friendsList, setFriendsList] = useState([]);
  const [friendsLost, setFriendsLost] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);

  const [defaultFbId, setDefaultFbId] = useState(null);
  useEffect(() => {
    friendsLost && dispatch(countCurrentListsize(friendsLost.length));
  }, [dispatch, friendsLost]);

  const friendsLostinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: NameCellRenderer,
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
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
    {
      field: "friendGender",
      headerName: "Gender ",
      filter: "agTextColumnFilter",
      cellRenderer: GenderRenderer,
      lockPosition: "right",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
    {
      field: "created_at",
      headerName: "Sync & Added Date &  Time ",
      cellRenderer: CreationRenderer,
      filter: "agDateColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
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
      headerName: "Friends source",
      cellRenderer: SourceRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
    {
      field: "message_thread",
      headerName: "Has Conversation",
      cellRenderer: HasConversationRenderer,
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
  ];

  const getFbUserId = async () => {
    setLoading(true);

    try {
      let savedFbUId = localStorage.getItem("fr_default_fb");

      if (savedFbUId) {
        console.log("got saved from local");
        setDefaultFbId(savedFbUId);
      } else {
        const getCurrentFbProfile = await fetchUserProfile();
        if (getCurrentFbProfile) {
          console.log("got saved from cloud");
          savedFbUId = localStorage.setItem(
            "fr_default_fb",
            getCurrentFbProfile[0].fb_user_id
          );
        }
      }
      dispatch(
        getFriendLost({
          token: localStorage.getItem("fr_token"),
          fbUserId: savedFbUId,
        })
      )
        .unwrap()
        .then((response) => {
          console.log("response:::joka", response);
          // dispatch(FriendsAction.getFriendLost({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId}))
          // .then((response) => {
          //   console.log(localStorage.getItem('fr_token'), savedFbUId, 'response', response);
          if (response.data[0].friend_details.length > 0) {
            setFriendsLost(response.data[0].friend_details);
            setLoading(false);
            setNoDataFound(false);
            console.log("here:::", response.data[0].friend_details);
            dispatch(
              updateNumberofListing(response.data[0].friend_details.length)
            );
          } else {
            setFriendsLost([]);
            setLoading(false);
            setNoDataFound(true);
            console.log("here");
            dispatch(updateNumberofListing(0));
          }
          // console.log("response.data[0].friend_details", response.data[0].friend_details);
        });
    } catch (error) {
      console.log(error);
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
      {friendsLost?.length > 0 && (
        <>
          <Listing
            friendsData={friendsLost}
            friendsListingRef={friendsLostinRef}
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

export default LostFriends;
