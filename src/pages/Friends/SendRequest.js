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
import moment from "moment";
import Listing2 from "../../components/common/SSListing/Listing2";
import { PendingListColDefs } from "../../components/common/SSListing/ListColumnDefs/ContactlistColDefs";
import config from "../../configuration/config";
const fb_user_id= localStorage.getItem("fr_default_fb");

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
  // useEffect(() => {
  //   friendsList && dispatch(countCurrentListsize(friendsList.length));
  // }, [dispatch, friendsList]);

  // useEffect(() => {
  //   // setFriendsList(fr_req_send_list)
  //   dispatch(
  //     getSendFriendReqst({
  //       fbUserId: localStorage.getItem("fr_default_fb"),
  //     })
  //   )
  //     .unwrap()
  //     .then((res) => {
  //       // console.log("the friend request send list", res);
  //     });
  //   let currentCookies = document.cookie;
  //   if (currentCookies.includes("deleteAllPendingFR")) {
  //     deleteAllInterval(() => { dispatch(getSendFriendReqst({ fbUserId: localStorage.getItem("fr_default_fb") })) });
  //   }
  // }, []);
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
    let localTime=utils.convertUTCtoLocal(statusSync?.replace(" ", "T") + ".000Z",true);
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
    // -------------------------
		const ageCalculator = (bornDate) => {
			const todayUTC = moment().utc();
			const bornDateUTC = moment(bornDate, "YYYY-MM-DD HH:mm:ss").utc();
	
			// Age Differences..
			const timeDifference = Math.abs(todayUTC - bornDateUTC);
	
			// Calculate the time difference in milliseconds
			// const timeDifference = todayUTC.diff(bornDateUTC);
	
			// Calculate age in days..
			let ageInDays = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
	
			if (ageInDays === 0) {
				localTime =
					hours !== 0
						? `Today ${hours}h ${minutes}m Ago`
						: `Today ${minutes}m Ago`;
			}
	
			return Number(ageInDays);
		};
	
		let requestDate = targetDate?.toLowerCase();
		const ageInDays = ageCalculator(requestDate);
		age = ageInDays;
		// =========================
    return age
  }

	function matchesFilter(cellValue, filterValues) {
		return filterValues.some(filter => cellValue?.toLowerCase().includes(filter?.toLowerCase()));
	}
  function sourceComparator(valueA, valueB, nodeA, nodeB, isDescending) {
		// "groups", "group", "suggestions", "friends", "post", "sync", "incoming", "csv", task_name

		const filterName = (dataSet) => {
			const sourceNow = (
								// IF SOURCE IS GROUPS/GROUP/SUGGESTIONS/FRIENDS/POST
								dataSet?.finalSource?.toLowerCase() === "groups" ||
								dataSet?.finalSource?.toLowerCase() === "group" ||
								dataSet?.finalSource?.toLowerCase() === "suggestions" ||
								dataSet?.finalSource?.toLowerCase() === "friends" ||
								dataSet?.finalSource?.toLowerCase() === "post") ?
									// IF SOURCENAME IS PRESENT
									dataSet?.sourceName ?
										dataSet?.finalSource?.toLowerCase() === "post" ? 
											'Post' :
										dataSet?.finalSource?.toLowerCase() === "suggestions" ?
											'Suggested Friends' :
										// dataSet?.finalSource?.toLowerCase() === "friends" ?
										// 	'Friends of Friends' :
										dataSet?.sourceName?.length > 12
											? dataSet?.sourceName?.substring(0, 12) + "..."
											: dataSet?.sourceName :
									// IF SOURCE IS NOT PRESENT BUT GROUPNAME AND URL ARE PRESENT (FOR OLDER VERSIONS)
									(dataSet?.groupName && dataSet?.groupUrl) ? 
										dataSet?.groupName :
										'Sync':
								// IF FINALSOURCE IS SYNC
								dataSet?.finalSource?.toLowerCase() === "sync" ?
									"Sync" :
								// IF FINALSOURCE IS INCOMING
								dataSet?.finalSource?.toLowerCase() === "incoming" ?
									"Incoming request" :
								// IF FINALSOURCE IS CSV
								dataSet?.finalSource?.toLowerCase() === "csv" ?
									dataSet?.sourceName ? 
										dataSet?.sourceName :
										dataSet?.csvName ? 
											dataSet?.csvName : 
											"CSV Upload" :
								// IF TASKNAME (OLD)
								dataSet?.task_name ?
									dataSet?.task_name :
										(!dataSet?.finalSource &&
										dataSet?.sourceName) ? 
											dataSet?.sourceName :
											'Sync'
									
			return sourceNow;
		}
								

		let objA = filterName({...nodeA?.data})?.toLowerCase()
		let objB = filterName({...nodeB?.data})?.toLowerCase()

		if (objA == objB) return 0;
		return (objA > objB) ? 1 : -1;
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
						// params?.data?.finalSource === 'friends' ?
						// 	'Friends of Friends' : 
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
			},
			comparator: sourceComparator
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

  const tableMethods = {
    enableRowSelection: false,
  };
	//query params
	const defaultParams = {
		fb_user_id: fb_user_id,
	}
	const dataExtractor = (response)=>{
			return {
				res:response,
				data: response?.data,
				count: response?.total_pending_request
			}
	}
  return (
    <div className="main-content-inner fff d-flex d-flex-column listing-main pending-list">
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
     
        <>
        <Listing2 
					listColDef = {PendingListColDefs} 
					baseUrl = {config.fetchPendingListv2}
					tableMethods = {tableMethods} 
					defaultParams = {defaultParams}
					dataExtractor = {dataExtractor}
				/>
         
        </>
      

    
    </div>
  );
};

export default SendRequest;
