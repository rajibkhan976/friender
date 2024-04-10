import { useDispatch, useSelector } from "react-redux";

import Listing from "../../components/common/Listing";
import {
  SourceRenderer,
  HasConversationRenderer,
  MessageRenderer,
  ReactionRenderer,
  NameCellRenderer,
  //StatusRenderer,
  CommentRenderer,
  GenderRenderer,
  AgeRenderer,
  CountryRenderer,
  // CreationRenderer,
  // AgeRenderer
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";

const InactiveFriends = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const [listFilteredCount, setListFilteredCount] = useState(null)
  const [isReset, setIsReset] = useState(null)
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list.filter(
      (item) => item.friendStatus === "Deactivate"
    )
  );
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));
    // console.log("friendsList", friendsList);
  }, [dispatch, friendsList]);


  /**
   * Custom comparator for columns with dates
   *
   * @returns updated array which is descending / ascending / default
   */
  const dateComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
    let valA = new Date(nodeA.data.created_at);
    let valB = new Date(nodeB.data.created_at);

    return valB - valA
  }

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
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: NameCellRenderer,
      minWidth: 250,
      maxWidth: 350,
    },
    // {
    //   field: "friendStatus",
    //   headerName: "Status",
    //   cellRenderer: StatusRenderer,
    //   filter: "agTextColumnFilter",
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
      headerClass: 'header-gender',
      headerTooltip: 'Gender',
      filter: "agTextColumnFilter",
      width: 80,
      maxWidth: 80,
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
      field: "created_at",
      headerName: "Age",
      cellRenderer: AgeRenderer,
      headerClass: 'header-query-tooltip',
      headerTooltip: "Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n",
      filter: "agTextColumnFilter",
      width: 110,
      maxWidth: 110,
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
      field: "country",
      headerName: "Country",
      cellRenderer: CountryRenderer,
      headerTooltip: 'Country',
      tooltipComponent: CustomHeaderTooltip,
      headerClass: 'header-query-tooltip',
      width: 158,
      maxWidth: 158,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      }
    },
    // {
    //   field: "tier",
    //   headerName: "Country Tier",
    //   filter: "agTextColumnFilter",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     debounceMs: 200,
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   }
    // },
    // {
    //   field: "created_at",
    //   headerName: "Sync & Added Date &  Time ",
    //   cellRenderer: CreationRenderer,
    //   minWidth: 240,
    //   maxWidth: 250,
    //   filter: "agDateColumnFilter",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     debounceMs: 200,
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: [
    //       "lessThan",
    //       "greaterThan",
    //       "lessThanOrEqual",
    //       "greaterThanOrEqual",
    //       "inRange",
    //     ],
    //   },
    // },
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
      headerTooltip: 'Reactions',
      headerClass: 'header-reaction',
      width: 75,
      maxWidth: 75,
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
      headerTooltip: 'Comments',
      width: 75,
      maxWidth: 75,
      headerClass: 'header-comments',
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
    // {
    //   field: "message_thread",
    //   headerName: "Message Count",
    //   cellRenderer: MessageRenderer,
    //   filter: "agNumberColumnFilter",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: [
    //       "lessThan",
    //       "greaterThan",
    //       "lessThanOrEqual",
    //       "greaterThanOrEqual",
    //     ],
    //   },
    // },
    {
      field: "message_thread",
      headerName: "Message Count",
      headerTooltip: 'Messages',
      headerClass: 'header-messages',
      width: 100,
      maxWidth: 100,
      cellRenderer: MessageRenderer,
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
    },
  ];
  return (
    <div className="main-content-inner d-flex d-flex-column">
      {friendsList?.length > 0 && (
        <>
          {!loading && (
            <Listing
              friendsData={friendsList}
              friendsListingRef={friendsListinRef}
              getFilterNum={setListFilteredCount}
              reset={isReset}
              setReset={setIsReset}
            />
          )}
        </>
      )}
      {loading ? (
        <ListingLoader />
      ) : (
        friendsList?.length > 0 && listFilteredCount === 0 &&
        <NoDataFound
          customText="Whoops!"
          additionalText={<>We couldn’t find the data<br /> that you filtered for.</>}
          interactionText="Clear filter"
          isInteraction={() => { setIsReset(!isReset) }}
        />
      )}
    </div>
  );
};

export default InactiveFriends;
