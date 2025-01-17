import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { countCurrentListsize } from "../../actions/FriendListAction";
import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import {
  CommentRenderer,
  CreationRenderer,
  GenderRenderer,
  HasConversationRenderer,
  MessageRenderer,
  NameCellRenderer,
  ReactionRenderer,
  SourceRenderer,
  StatusRenderer,
  AgeRenderer,
  EngagementGetter,
  UnlinkedNameCellWithOptionsRenderer,
  SourceRendererPending,
  CountryRenderer,
  CountryTierRenderer,
  RecentEngagementRenderer,
  KeywordRenderer,
  EngagementRenderer,
} from "../../components/listing/FriendListColumns";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { syncMainFriendList } from "../../actions/FriendsAction";
import { getMySettings } from "../../actions/MySettingAction";
import helper from "../../helpers/helper"
import Modal from "../../components/common/Modal";
import { utils } from "../../helpers/utils";
import moment from "moment";
import Listing2 from "../../components/common/SSListing/Listing2";
import { WhiteAndBlacklistContactlistColDefs } from "../../components/common/SSListing/ListColumnDefs/ContactlistColDefs";
import config from "../../configuration/config";
import { fetchUserProfile } from "../../services/authentication/facebookData";
// const fb_user_id= localStorage.getItem("fr_default_fb");

const WhiteList = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const mySettings = useSelector((state) => state.settings.mySettings);
  const [whiteList, setWhiteList] = useState([]);
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list
  );
  const [fb_user_id, set_fb_user_id] = useState(localStorage.getItem("fr_default_fb"));

  const getFbUserIdCall = useOutletContext();
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const inactiveAfter = useSelector((state) => state.settings.mySettings?.data[0]?.friends_willbe_inactive_after);
  const [listFilteredCount, setListFilteredCount] = useState(null)
  const [isReset, setIsReset] = useState(null)
  useEffect(() => {
    const filteredData = friendsList.filter(
      (item) => (item.deleted_status !== 1 && item.friendStatus !== "Lost") && item.whitelist_status === 1
    );
    setWhiteList(filteredData)
    friendsList
      ? dispatch(countCurrentListsize(filteredData.length))
      : getFbUserIdCall();

    dispatch(syncMainFriendList())
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

  const ageComparator = (targetDate) => {
    let statusSync = targetDate?.toLowerCase();
    let localTime = utils.convertUTCtoLocal(statusSync?.replace(" ", "T") + ".000Z", true);
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
      cellRenderer: UnlinkedNameCellWithOptionsRenderer,
      minWidth: 250,
      // maxWidth: 350,
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
      // maxWidth: 80,
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
      width: 110,
      // maxWidth: 110,
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
    {
      field: "country",
      cellRenderer: CountryRenderer,
      headerTooltip: 'Country',
      tooltipComponent: CustomHeaderTooltip,
      filter: "agTextColumnFilter",
      headerClass: 'header-query-tooltip',
      width: 158,
      // maxWidth: 158,
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
    //   cellRenderer: CountryTierRenderer,
    //   filter: "agTextColumnFilter",
    //   filterParams: {
    //     buttons: ["apply", "reset"],
    //     debounceMs: 200,
    //     suppressMiniFilter: true,
    //     closeOnApply: true,
    //     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
    //   }
    // },
    {
      field: "last_engagement_date",
      headerName: "Recent engagement",
      headerTooltip: 'Recent Engagement',
      headerClass: 'header-recent-engagement',
      cellRenderer: RecentEngagementRenderer,
      width: 100,
      // maxWidth: 100,
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
    },
    // {
    //   field: "created_at",
    //   headerName: "Sync & Added Date &  Time",
    //   cellRenderer: CreationRenderer,
    //   minWidth: 240,
    // //   maxWidth: 250,
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
      headerTooltip: 'Reactions',
      headerClass: 'header-reaction',
      width: 75,
      // maxWidth: 75,
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
      headerClass: 'header-comments',
      width: 75,
      // maxWidth: 75,
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
			headerTooltip: "Messages",
			headerClass: "header-messages",
			cellRenderer: MessageRenderer,
			// width: 100,
			maxWidth: 100,
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
      field: "engagement",
      headerName: "Engagement",
      headerTooltip: 'Total Engagement',
      headerClass: 'header-engagement',
      filter: "agNumberColumnFilter",
      width: 75,
      // maxWidth: 75,
      cellRenderer: EngagementRenderer,
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
      // minWidth: 0,
      // // maxWidth: 0,
      cellClass: 'engagementCell'
    },
  ];
  const tableMethods = {}
	const defaultParams = {
		friend_status: "all",
		whitelist_status: 1,
		fb_user_id: fb_user_id,
	}
	const dataExtractor = (response)=>{
			return {
        res : response,
				data: response?.data[0]?.friend_details,
				count: response?.data[0]?.friend_count
			}
	}

  useEffect(() => {
    if (!fb_user_id || fb_user_id == null) {
    fetchUserProfile().then((res) => {
      if (res && res.length) {
        // setProfiles(res);
          localStorage.setItem("fr_default_fb", res[0].fb_user_id);
          set_fb_user_id(res[0].fb_user_id);
      }
    });
  }
  }, [])
  

  return (
    <div className="main-content-inner d-flex d-flex-column listing-main">
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
      {/* {whiteList?.length > 0 && (
        <>
          {!loading && inactiveAfter !== null && (
           <Listing2 
           //friendsData={filterFrndList}
           listColDef = {FriendlistColDefs} 
           baseUrl = {config.fetchFriendListUrlv2}
           tableMethods = {tableMethods} 
           defaultParams = {defaultParams}
           dataExtractor = {dataExtractor}
         />
          )}
        </>
      )} */}
          {fb_user_id!=null? <Listing2 
              //friendsData={filterFrndList}
              listColDef = {WhiteAndBlacklistContactlistColDefs} 
              baseUrl = {config.fetchFriendListUrlv2}
              tableMethods = {tableMethods} 
              defaultParams = {defaultParams}
              dataExtractor = {dataExtractor}
            />:""}
      {/* {
        !loading &&
        whiteList?.length === 0 &&
        <NoDataFound />
      }
      {loading ? (
        <ListingLoader />
      ) : (
        whiteList?.length > 0 && listFilteredCount === 0 && <NoDataFound
          customText="Whoops!"
          additionalText={<>We couldn’t find the data<br /> that you filtered for.</>}
          interactionText="Clear filter"
          isInteraction={() => { setIsReset(!isReset) }}
        />
      )} */}
    </div>
  );
};

export default WhiteList;
