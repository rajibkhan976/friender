import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countCurrentListsize } from "../../actions/FriendListAction";
import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import {
  AgeRenderer,
  CommentRenderer,
  CountryRenderer,
  CountryTierRenderer,
  CreationRenderer,
  EngagementGetter,
  GenderRenderer,
  HasConversationRenderer,
  KeywordRenderer,
  MessageRenderer,
  NameCellRenderer,
  ReactionRenderer,
  RecentEngagementRenderer,
  SourceRenderer,
  SourceRendererPending,
  StatusRenderer,
  UnlinkedNameCellWithOptionsRenderer,
} from "../../components/listing/FriendListColumns";
import { syncMainFriendList } from "../../actions/FriendsAction";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { getMySettings } from "../../actions/MySettingAction";
import Modal from "../../components/common/Modal";

const BlackList = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list.filter(
      (item) => (item.deleted_status !== 1 && item.friendStatus !== "Lost") && item.blacklist_status === 1
    )
  );
  const [inactiveAfter, setInactiveAfter] = useState(null)
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));
    dispatch(syncMainFriendList())
  }, [dispatch, friendsList]);

  // get Settings data
  const getSettingsData = async () => {
    const dataSettings = await dispatch(getMySettings({ fbUserId: `${localStorage.getItem("fr_default_fb")}` })).unwrap();

    if(dataSettings) {
      setInactiveAfter(dataSettings?.data[0].friends_willbe_inactive_after)
    }
  }

  useEffect(() => {
    getSettingsData()
  }, [])

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
      minWidth: 250,
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
      field: "last_engagement_date" ? "last_engagement_date" : "created_at",
      headerName: "Recent engagement", 
      cellRenderer: RecentEngagementRenderer,        
      cellRendererParams: {
        inactiveAfter
      },                                  
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
      cellRenderer : CountryTierRenderer,
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
    field: "keywords",
    headerName: "Keyword",
    // filter: "agTextColumnFilter",
    cellRendererParams: {
      setKeyWords,
      setModalOpen,
    },
    sortable: true,
    comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
      if (valueA == valueB) return 0;
      return (valueA > valueB) ? 1 : -1;
  } ,
    cellRenderer: KeywordRenderer,
    filter: "agTextColumnFilter",
    filterParams: {
      buttons: ["apply", "reset"],
      filterOptions: ["contains"], // Set filter options to match any part of the text
      valueGetter: params => {
        return params?.data?.matchedKeyword
      },
      textCustomComparator: function (filter, value, filterText) {
        const matchedKeywords = value.split(", "); // Split matched keywords by comma

        if (filter === "equals") {
          // Exact match
          return matchedKeywords.includes(filterText);
        } else {
          // Partial match
          return matchedKeywords.some(keyword => keyword.includes(filterText));
        }
      },
    },
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
    {modalOpen && (
      <Modal
        modalType="normal-type"
        modalIcon={null}
        headerText={"Keyword(s)"}
        bodyText={
          <>
          {console.log('in modal:::', keyWords, keyWords.matchedKeyword)}
            {keyWords?.matchedKeyword?.length > 0 && keyWords?.matchedKeyword ?
              keyWords?.matchedKeyword.map((el, i) =>
              (<span className={`tags positive-tags`} key={`key-${i}`}>
                {el}
              </span>)
              ) : (
                "No specific keyword used"
              )}
          </>
        }
        open={modalOpen}
        setOpen={setModalOpen}
        ModalFun={null}
        btnText={" "}
        modalButtons={false}
        additionalClass="modal-keywords"
      />
    )}
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

export default BlackList;
