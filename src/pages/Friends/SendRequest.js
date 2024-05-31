import { useDispatch, useSelector } from "react-redux";

import Listing from "../../components/common/Listing";
import {
  AgeRenderer,
  CreationRenderer,
  GenderRenderer,
  KeywordRenderer,
  SourceRenderer,
  UnlinkedNameCellRenderer,
  CountryRenderer,
  CountryTierRenderer,
  SourceRendererPending,
  RefriendCountRenderer
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import { getSendFriendReqst } from "../../actions/FriendsAction";
import Modal from "../../components/common/Modal";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { utils } from "../../helpers/utils";
import helper from "../../helpers/helper"


const SendRequest = ({ deleteAllInterval }) => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const friendsList = useSelector(
    (state) => state.facebook_data.send_friend_request_list
  );

  // const [friendsList,setFriendsList]=useState(fr_req_send_list)
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));
  }, [dispatch, friendsList]);

  useEffect(() => {
    // setFriendsList(fr_req_send_list)
    dispatch(
      getSendFriendReqst({
        fbUserId: localStorage.getItem("fr_default_fb"),
      })
    )
      .unwrap()
      .then((res) => {
        // console.log("the friend request send list", res);
      });
    let currentCookies = document.cookie;
    if (currentCookies.includes("deleteAllPendingFR")) {
      deleteAllInterval(() => { dispatch(getSendFriendReqst({ fbUserId: localStorage.getItem("fr_default_fb") })) });
    }
  }, []);
  const [listFilteredCount, setListFilteredCount] = useState(null)
  const [isReset, setIsReset] = useState(null)

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

  const ageComparator = (targetDate) => {
    let statusSync = targetDate?.toLowerCase();
    const localTime=utils.convertUTCtoLocal(statusSync?.replace(" ", "T") + ".000Z",true);
    let currentUTC = helper.curretUTCTime();
    let diffTime = Math.abs(currentUTC - new Date(statusSync).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [
      Math.floor(days),
      Math.floor(hours),
      Math.floor(minutes),
      Math.floor(secs),
    ];

    let age = 0;

    if (days) age = days;
    else if (hours) age = 1;
    else if (minutes) age = 1;
    else age = 1;

    // console.log(filterValue, age);
    return age
  }

	function matchesFilter(cellValue, filterValues) {
		return filterValues.some(filter => cellValue?.toLowerCase().includes(filter?.toLowerCase()));
	}

  const friendsListinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: false,
      checkboxSelection: false,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      headerCheckboxSelectionFilteredOnly: false,
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: UnlinkedNameCellRenderer,
      minWidth: 220,
      // maxWidth: 320,
    },
    // {
    //     field: "email",
    //     headerName: "Email",
    //     //filter: "agTextColumnFilter",
    //     cellRenderer: EmailRenderer,
    //    // lockPosition: "right",
    //     filterParams: {
    //       buttons: ["apply", "reset"],
    //       suppressMiniFilter: true,
    //       closeOnApply: true,
    //       filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //     },
    //   },
    // {
    //   field: "gender",
    //   headerName: "Gender",
    //  // filter: "agTextColumnFilter",
    //   cellRenderer: GenderRenderer,
    //   //   lockPosition: "right",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   },
    // },
    {
      field: "gender",
      headerName: "Gender ",
      filter: "agTextColumnFilter",
      headerClass: 'header-gender',
      maxWidth: 80,
      // width: 80,
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
      // width: 110,
      maxWidth: 110,
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
              return ageComparator(cellValue) < filterValue
            }
          },
          {
            displayKey: 'greaterThan',
            displayName: 'Greater than',
            predicate: ([filterValue], cellValue) => {
              return ageComparator(cellValue) > filterValue
            }
          },
          {
            displayKey: 'equals',
            displayName: 'Equals',
            predicate: ([filterValue], cellValue) => {
              return ageComparator(cellValue) == filterValue
            }
          },
        ],
      },
      comparator: dateComparator,
    },
    // {
    //   field: "country",
    //   headerName: "Country",
    //   filter: "agTextColumnFilter",
    //   cellRenderer: CountryRenderer,
    //   headerClass: 'header-query-tooltip',
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     debounceMs: 200,
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   }
    // },
    // {
    //   field: "tier",
    //   headerName: "Country Tier",
    //   filter: "agTextColumnFilter",
    //   cellRenderer: CountryTierRenderer,
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     debounceMs: 200,
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   }
    // },
    {
      field: "refriending_attempt",
      headerName: "# Re-friending",
      filter: "agNumberColumnFilter",
      // width: 150,
      maxWidth: 150,
      cellRenderer: RefriendCountRenderer,
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
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        filterOptions: [
          {
            displayKey: 'contains',
            displayName: 'Contains',
            predicate: ([filterValue], cellValue) => {
              // console.log([filterValue][0], cellValue);
              if ([filterValue][0] == 'NA' || [filterValue][0] == 'N/A') {
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
      // lockPosition: "right",
      // filterParams: {
      //   buttons: ["apply", "reset"],
      //   suppressMiniFilter: true,
      //   closeOnApply: true,
      //   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      // },
    },
    {
			field: "finalSource",
			headerName: "Source",
			filter: "agTextColumnFilter",
			headerTooltip: "Friends source",
			tooltipComponent: CustomHeaderTooltip,
			headerClass: "header-query-tooltip",
			cellRenderer: SourceRendererPending,
			// lockPosition: "right",
			minWidth: 185,
			filterValueGetter: (params) => {
				return {
					finalSource: params?.data?.finalSource,
						sourceName: params?.data?.finalSource === 'post' || 
						params?.data?.finalSource === 'sync' ? 
						null : 
						params?.data?.finalSource === "incoming" ?
							'Incoming request' :
						params?.data?.finalSource === 'friends' ?
							'Friends of Friends' : 
						params?.data?.finalSource === 'suggestions' ?
							'Suggested Friends' :
							params?.data?.sourceName
				}
			},
			filterParams: {
				buttons: ["apply", "reset"],
				debounceMs: 200,
				suppressMiniFilter: true,
				closeOnApply: true,
				filterOptions: [
					{
						displayKey: "contains",
						displayName: "Contains",
						predicate: ([filterValue], cellValue) => {
							return cellValue?.sourceName ? 
										matchesFilter(cellValue?.sourceName, [filterValue]) : 
										matchesFilter(cellValue?.finalSource, [filterValue])
						},
					},
					{
						displayKey: "notContains",
						displayName: "Not Contains",
						predicate: ([filterValue], cellValue) => {
							return cellValue?.sourceName ? 
										!matchesFilter(cellValue?.sourceName, [filterValue]) : 
										!matchesFilter(cellValue?.finalSource, [filterValue])
						},
					},
					{
						displayKey: "startsWith",
						displayName: "Starts With",
						predicate: ([filterValue], cellValue) => {
							return cellValue?.sourceName?.toLowerCase().startsWith(filterValue.toLowerCase()) ||
										cellValue?.finalSource?.toLowerCase().startsWith(filterValue.toLowerCase())
						},
					},
					{
						displayKey: "endsWith",
						displayName: "Ends With",
						predicate: ([filterValue], cellValue) => {
							return cellValue?.sourceName?.toLowerCase().endsWith(filterValue.toLowerCase()) ||
										cellValue?.finalSource?.toLowerCase().endsWith(filterValue.toLowerCase())
						},
					},
				]
			}
		},
    // {
    //   field: "request_send_count",
    //   headerName: "Request Sent",
    //   // filter: "agTextColumnFilter",
    //   cellRenderer: RequestRenderer,
    //   // lockPosition: "right",
    //   // filterParams: {
    //   //   buttons: ["apply", "reset"],
    //   //   suppressMiniFilter: true,
    //   //   closeOnApply: true,
    //   //   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   // },
    // },
    // {
    //   field: "created_at",
    //   headerName: "Request date &  time",
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
  ];
  // useEffect(() => {
  //   console.log("//////////////", keyWords);
  // }, [keyWords]);
  return (
    <div className="main-content-inner fff d-flex d-flex-column">
      {modalOpen && (
        <Modal
          modalType="normal-type"
          modalIcon={null}
          headerText={"Keyword(s)"}
          bodyText={
            <>
              {/* {console.log('in modal:::', keyWords, keyWords.matchedKeyword)} */}
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
              getFilterNum={setListFilteredCount}
              reset={isReset}
              setReset={setIsReset}
            />
          )}
        </>
      )}

      {
        !loading &&
        friendsList?.length === 0 &&
        <NoDataFound />
      }
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

export default SendRequest;
