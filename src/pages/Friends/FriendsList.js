import { useDispatch, useSelector } from "react-redux";
 
import Listing from "../../components/common/Listing";
import {
// SourceRenderer,
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
  EngagementGetter,
  UnlinkedNameCellWithOptionsRenderer,
  SourceRendererPending,
  CountryRenderer,
  RecentEngagementRenderer,
  CountryTierRenderer,
  KeywordRenderer,
  StatusRenderer
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { syncMainFriendList } from "../../actions/FriendsAction";
import { getMySettings } from "../../actions/MySettingAction";
import Modal from "../../components/common/Modal";
import helper from "../../helpers/helper"



const FriendsList = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const mySettings = useSelector((state) => state.settings.mySettings);
  const  [filterFrndList,setFilterFrndList] =useState([]);
  const  [pageSet,setPageSet]=useState(new Set());

  // const friendsList = useSelector((state) =>
  //   state.facebook_data.current_friend_list.filter(
  //     (item) => item.deleted_status !== 1 && item.friendStatus === "Activate"
  //   )
  // );
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [inactiveAfter, setInactiveAfter] = useState(null)
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
  // get Settings data
  const getSettingsData = async () => {
    if(mySettings?.data[0]?.friends_willbe_inactive_after) {
      setInactiveAfter(mySettings?.data[0]?.friends_willbe_inactive_after)
    } else {
      const dataSettings = await dispatch(getMySettings({ fbUserId: `${localStorage.getItem("fr_default_fb")}` })).unwrap();
      if(dataSettings) {
        setInactiveAfter(dataSettings?.data[0]?.friends_willbe_inactive_after)
      }
    }
  }

  useEffect(() => {
    // console.log('mySettings', mySettings?.data[0]?.friends_willbe_inactive_after);
    getSettingsData()
  }, [])

  const someComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
    if (nodeA.data.matchedKeyword == nodeB.data.matchedKeyword) return 0;
    return (nodeA.data.matchedKeyword > nodeB.data.matchedKeyword) ? 1 : -1;
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
      eaderCheckboxSelectionCurrentPageOnly:true,
      headerCheckboxSelectionFilteredOnly: true,
     // headerComponentFramework: CustomHeaderCheckbox,
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
      // headerComponentParams:{
      //   onChange: handleHeaderCheckboxChange, // Pass the custom function to the header component
      //   checked: false, // Pass the checked state if needed
      //   indeterminate: false, // Pass the indeterminate state if needed
      // }
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
      cellRenderer: AgeRenderer,
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
      field: "last_engagement_date",
      headerName: "Recent engagement",
      cellRenderer: RecentEngagementRenderer,
      cellRendererParams: {
        inactiveAfter
      },
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: [
          {
            displayKey: 'lessThan',
            displayName: 'Less than',
            predicate: ([filterValue], cellValue) => {
              return cellValue != null && Math.floor(Math.abs(helper.curretUTCTime() - new Date(cellValue).valueOf()) / (24 * 60 * 60 * 1000)) < filterValue
            }
          },
          {
            displayKey: 'greaterThan',
            displayName: 'Greater than',
            predicate: ([filterValue], cellValue) => {
              return cellValue != null && Math.floor(Math.abs(helper.curretUTCTime() - new Date(cellValue).valueOf()) / (24 * 60 * 60 * 1000)) > filterValue
            }
          },
          {
            displayKey: 'equals',
            displayName: 'Equals',
            predicate: ([filterValue], cellValue) => {
              return cellValue != null && Math.floor(Math.abs(helper.curretUTCTime() - new Date(cellValue).valueOf()) / (24 * 60 * 60 * 1000)) == filterValue
            }
          },
        ]
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
      comparator: someComparator ,
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
      // lockPosition: "right",
      // filterParams: {
      //   buttons: ["apply", "reset"],
      //   suppressMiniFilter: true,
      //   closeOnApply: true,
      //   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      // },
    },
    // {
    //   field: "created_at",
    //   headerName: "Sync & Added Date &  Time",
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
      {filterFrndList?.length > 0 && (
        <>
          {!loading && inactiveAfter !== null && (
            <Listing
            pageSet={pageSet}
            setPageSet={setPageSet}
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
