import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import { getFriendLost } from "../../actions/FriendsAction";
import {
  countCurrentListsize,
  updateNumberofListing,
} from "../../actions/FriendListAction";
 
import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import {
  SourceRenderer,
  HasConversationRenderer,
  StatusRenderer,
  GenderRenderer,
  CreationRenderer,
  AgeRenderer,
  GeneralNameCellRenderer,
  UnlinkedNameCellRenderer
} from "../../components/listing/FriendListColumns";

const LostFriends = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list.filter(
      (item) => item.friendStatus === "Lost"
    )
  );
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));
  }, [dispatch, friendsList]);

  const dateComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
    let valA = new Date(nodeA.data.created_at);
    let valB = new Date(nodeB.data.created_at);
    
    return valB - valA
  }

  const friendsLostinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: false,
      checkboxSelection: false,
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
      cellRenderer: UnlinkedNameCellRenderer,
    },
    // {
    //   field: "friendStatus",
    //   headerName: "Status",
    //   filter: "agTextColumnFilter",
    //   cellRenderer: StatusRenderer,
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   },
    // },
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
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
    {
      field: "country",
      headerName: "Country Name",
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      }
    },
    {
      field: "tier",
      headerName: "Country Tier",
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      }
    },
    {
      field: "created_at",
      headerName: "Age",
      headerTooltip:"Number of days back friends synced or unfriended using friender",
      valueGetter: AgeRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      comparator: dateComparator
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
      headerName: "Friends Source",
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

  // const getFbUserId = async () => {
  //   setLoading(true);

  //   try {
  //     let savedFbUId = localStorage.getItem("fr_default_fb");

  //     if (savedFbUId) {
  //       setDefaultFbId(savedFbUId);
  //     } else {
  //       const getCurrentFbProfile = await fetchUserProfile();
  //       if (getCurrentFbProfile) {
  //         savedFbUId = localStorage.setItem(
  //           "fr_default_fb",
  //           getCurrentFbProfile[0].fb_user_id
  //         );
  //       }
  //     }
  //     dispatch(
  //       getFriendLost({
  //         // token: localStorage.getItem("fr_token"),
  //         fbUserId: savedFbUId,
  //       })
  //     )
  //       .unwrap()
  //       .then((response) => {
  //         // dispatch(FriendsAction.getFriendLost({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId}))
  //         // .then((response) => {
  //         //   console.log(localStorage.getItem('fr_token'), savedFbUId, 'response', response);
  //         if (
  //           response.data &&
  //           response.data.length &&
  //           response.data[0].friend_details.length > 0
  //         ) {
  //           setFriendsLost(response.data[0].friend_details);
  //           setLoading(false);
  //           setNoDataFound(false);
  //           console.log("here:::", response.data[0].friend_details);
  //           dispatch(
  //             updateNumberofListing(response.data[0].friend_details.length)
  //           );
  //         } else {
  //           setFriendsLost([]);
  //           setLoading(false);
  //           setNoDataFound(true);
  //           console.log("here");
  //           dispatch(updateNumberofListing(0));
  //         }
  //         // console.log("response.data[0].friend_details", response.data[0].friend_details);
  //       });
  //   } catch (error) {
  //     //console.log(error);
  //     setLoading(false);
  //     setNoDataFound(true);
  //   }
  // };

  // const setLoadingStatus = (params) => {
  //   setLoading(params);
  // };

  // useEffect(() => {
  //   getFbUserId();
  // }, []);

  return (
    <div className="main-content-inner d-flex d-flex-column">
      {friendsList?.length > 0 && (
        <>
          <Listing
            friendsData={friendsList}
            friendsListingRef={friendsLostinRef}
            // pageLoadSize={pageLoadSize}
          />
        </>
      )}
      {loading ? (
        <ListingLoader />
      ) : (
        friendsList?.length <= 0 && <NoDataFound />
      )}
    </div>
  );
};

export default LostFriends;
