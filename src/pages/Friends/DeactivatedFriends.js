import { useDispatch, useSelector } from "react-redux";
 
import Listing from "../../components/common/Listing";
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
  GeneralNameCellRenderer,
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";

const DeactivatedFriends = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list.filter(
      (item) => item.friendStatus === "Deactivate"
    )
  );
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));
  }, [dispatch, friendsList]);

  const friendsListinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: false,
      checkboxSelection: false,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      headerCheckboxSelectionFilteredOnly: true,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: GeneralNameCellRenderer,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      field: "friendStatus",
      headerName: "Status",
      cellRenderer: StatusRenderer,
      filter: "agTextColumnFilter",
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
      minWidth: 240,
      maxWidth: 250,
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
      field: "reactionThread",
      headerName: "Total Reaction",
      cellRenderer: ReactionRenderer,
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
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
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
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
          "lessThan",
          "greaterThan",
          "lessThanOrEqual",
          "greaterThanOrEqual",
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
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
  ];

  useEffect(() => {
    console.log("unfriended-friends");
  }, []);

  return (
    <div className="main-content-inner d-flex d-flex-column">
      {friendsList?.length > 0 && (
        <>
          {!loading && (
            <Listing
              friendsData={friendsList}
              friendsListingRef={friendsListinRef}
            />
          )}
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

export default DeactivatedFriends;
