import { useDispatch, useSelector } from "react-redux";
 
import Listing from "../../components/common/Listing";
import {
  SourceRenderer,
  HasConversationRenderer,
  MessageRenderer,
  ReactionRenderer,
  //NameCellRenderer,
  // StatusRenderer,
  CommentRenderer,
  GenderRenderer,
  CreationRenderer,
  AgeRenderer,
  // EmptyRenderer,
  //EngagementGetter,
  UnlinkedNameCellWithOptionsRenderer,
  SourceRendererPending,
  CountryRenderer,
  RecentEngagementRenderer,
  CountryTierRenderer
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { syncMainFriendList } from "../../actions/FriendsAction";



const FriendsList = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const  [filterFrndList,setFilterFrndList] =useState([]);

  // const friendsList = useSelector((state) =>
  //   state.facebook_data.current_friend_list.filter(
  //     (item) => item.deleted_status !== 1 && item.friendStatus === "Activate"
  //   )
  // );

  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list
  );
  

  useEffect(() => {
    const filteredData=friendsList.filter(
      (item) => item.deleted_status !== 1 && item.friendStatus === "Activate"
    )
    setFilterFrndList(filteredData)
    friendsList && dispatch(countCurrentListsize(filteredData.length));
    dispatch(syncMainFriendList())
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
      cellRenderer: UnlinkedNameCellWithOptionsRenderer,
      minWidth: 280,
      maxWidth: 300,
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
      field: "created_at",
      headerName:"Age"  ,
      valueGetter: AgeRenderer,
      headerTooltip:"Number of days back friends synced or unfriended using friender",
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      comparator: dateComparator,
    },
    {
      field: "country",
      headerName: "Country Name",
      cellRenderer: CountryRenderer,
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
      cellRenderer : CountryTierRenderer,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      }
    },
    {
      field: "last_engagement_date" ? "last_engagement_date" : "created_at",
      headerName: "Recent engagement", 
      cellRenderer: RecentEngagementRenderer,
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
      headerName: "Sync & Added Date &  Time",
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
    // {
    //   field: "finalSource",
    //   headerName: "Friends Source",
    //   cellRenderer: SourceRenderer,
    //   filter: "agTextColumnFilter",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   },
    // },
    {
      field: "groupName" ? "groupName" : "finalSource",
      headerName: "Friends source",
      filter: "agTextColumnFilter",
      headerTooltip: 'Friends source',
      tooltipComponent: CustomHeaderTooltip,
      cellRenderer: SourceRendererPending,
      // lockPosition: "right",
      minWidth: 185,
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
    {
      field: "engagement",
      headerName: "Eng",
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
      valueGetter: EngagementGetter,
      minWidth: 0,
      maxWidth: 0,
    },
  ];

  return (
    <div className="main-content-inner d-flex d-flex-column">
      {filterFrndList?.length > 0 && (
        <>
          {!loading && (
            <Listing
              friendsData={filterFrndList}
              friendsListingRef={friendsListinRef}
            />
          )}
        </>
      )}
      {!filterFrndList.length && loading ? (
        <ListingLoader />
      ) : (
        filterFrndList?.length <= 0 && <NoDataFound />
      )}
    </div>
  );
};

export default FriendsList;
