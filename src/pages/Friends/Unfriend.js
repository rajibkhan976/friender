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
  AgeRenderer,
  GeneralNameCellRenderer,
  EngagementGetter,
  UnlinkedNameCellRenderer,
  SourceRendererPending,
  CountryTierRenderer,
  CountryRenderer,
  KeywordRenderer,
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import { useOutletContext } from "react-router-dom";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import Modal from "../../components/common/Modal";

const FriendsList = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const [unfriendList, setUnfriendList] = useState([]);
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list
  );
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const getFbUserIdCall = useOutletContext();
  const [listFilteredCount, setListFilteredCount] = useState(null)
  const [isReset, setIsReset] = useState(null)
  useEffect(() => {
    const filteredData = friendsList.filter(
      (item) => item.deleted_status === 1 && item.friendStatus === "Activate"
    );
    setUnfriendList(filteredData);
    friendsList
      ? dispatch(countCurrentListsize(filteredData.length))
      : getFbUserIdCall();
  }, [dispatch, friendsList]);

  /**
   * Custom comparator for columns with dates
   *
   * @returns updated array which is descending / ascending / default
   */
  const dateComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
    let valA = new Date(valueA);
    let valB = new Date(valueB);

    return valB - valA;
  };

  const friendsListinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      headerCheckboxSelectionCurrentPageOnly: true,
      headerCheckboxSelectionFilteredOnly: true,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: UnlinkedNameCellRenderer,
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
      field: "created_at",
      headerName: "Age",
      headerTooltip: "Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n",
      cellRenderer: AgeRenderer,
      headerClass: 'header-query-tooltip',
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
      filter: "agTextColumnFilter",
      cellRenderer: CountryRenderer,
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
      cellRenderer: CountryTierRenderer,
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
      },
      cellRenderer: KeywordRenderer,
      headerClass: 'header-query-tooltip',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        filterOptions: [
          {
            displayKey: 'contains',
            displayName: 'Contains',
            predicate: ([filterValue], cellValue) => {
              console.log([filterValue][0], cellValue);
              if([filterValue][0] == 'NA' || [filterValue][0] == 'N/A') {
                return cellValue === undefined || cellValue === "undefined" || !cellValue || cellValue === null || cellValue === "NA" || cellValue === "N/A"
              }
              else {
                return cellValue != null && cellValue?.includes(filterValue)
              }
            }
          }
        ],
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
      cellClass: 'engagementCell'
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
      {unfriendList?.length > 0 && (
        <>
          {!loading && (
            <Listing
              friendsData={unfriendList}
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
        unfriendList?.length > 0 && listFilteredCount === 0 && <NoDataFound
          customText="Whoops!"
          additionalText={<>We couldn’t find the data<br /> that you filtered for.</>}
          interactionText="Clear filter"
          isInteraction={() => { setIsReset(!isReset) }}
        />
      )}
    </div>
  );
};

export default FriendsList;
