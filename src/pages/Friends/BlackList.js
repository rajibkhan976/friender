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
  EngagementRenderer,
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
import helper from "../../helpers/helper"
import { utils } from "../../helpers/utils";

const BlackList = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const mySettings = useSelector((state) => state.settings.mySettings);
  const [blackList, setBlackList] = useState([])
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list
  );
  const [inactiveAfter, setInactiveAfter] = useState(null)
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const filteredData = friendsList.filter(
      (item) => (item.deleted_status !== 1 && item.friendStatus !== "Lost") && item.blacklist_status === 1
    )
    setBlackList(filteredData)
    friendsList && dispatch(countCurrentListsize(filteredData.length));
    dispatch(syncMainFriendList())
  }, [dispatch, friendsList]);
  const [listFilteredCount, setListFilteredCount] = useState(null)
  const [isReset, setIsReset] = useState(null)

  // get Settings data
  const getSettingsData = async () => {
    if (mySettings?.data[0]?.friends_willbe_inactive_after) {
      setInactiveAfter(mySettings?.data[0]?.friends_willbe_inactive_after)
    } else {
      const dataSettings = await dispatch(getMySettings({ fbUserId: `${localStorage.getItem("fr_default_fb")}` })).unwrap();
      if (dataSettings) {
        setInactiveAfter(dataSettings?.data[0]?.friends_willbe_inactive_after)
      }
    }
  }

  useEffect(() => {
    // console.log('mySettings', mySettings?.data[0]?.friends_willbe_inactive_after);
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

  const ageComparator = (targetDate) => {
    let statusSync = targetDate?.toLowerCase();
    const localTime = utils.convertUTCtoLocal(statusSync?.replace(" ", "T") + ".000Z", true);
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
      field: "last_engagement_date",
      headerName: "Recent engagement",
      headerTooltip: 'Recent Engagement',
      headerClass: 'header-recent-engagement',
      cellRenderer: RecentEngagementRenderer,
      cellRendererParams: {
        inactiveAfter
      },
      filter: "agNumberColumnFilter",
      // width: 100,
      // maxWidth: 100,
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
      field: "created_at",
      headerName: "Age",
      headerTooltip: "Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n",
      cellRenderer: AgeRenderer,
      headerClass: 'header-query-tooltip',
      // width: 110,
      filter: "agTextColumnFilter",
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
      // width: 158,
      headerClass: 'header-query-tooltip',
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
    {
      field: "reactionThread",
      headerName: "Total Reaction",
      headerTooltip: 'Reactions',
      headerClass: 'header-reaction',
      // width: 75,
			maxWidth: 100,
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
      // width: 75,
      maxWidth: 75,
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
      field: "engagement",
      headerName: "Engagement",
      headerTooltip: 'Total Engagement',
      headerClass: 'header-engagement',
      // width: 75,
      filter: "agNumberColumnFilter",
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
  return (
    <div className="main-content-inner d-flex d-flex-column">
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
      {blackList?.length > 0 && (
        <>
          {!loading && inactiveAfter !== null && (
            <Listing
              friendsData={blackList}
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
        blackList?.length === 0 &&
        <NoDataFound />
      }
      {loading ? (
        <ListingLoader />
      ) : (
        blackList?.length > 0 && listFilteredCount === 0 &&
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

export default BlackList;
