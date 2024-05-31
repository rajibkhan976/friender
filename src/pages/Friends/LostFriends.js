import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../services/authentication/facebookData";
import { getFriendLost } from "../../actions/FriendsAction";
import {
  countCurrentListsize,
  updateNumberofListing,
} from "../../actions/FriendListAction";

import Listing from "../../components/common/Listing";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import {
  SourceRenderer,
  HasConversationRenderer,
  StatusRenderer,
  GenderRenderer,
  CreationRenderer,
  AgeRenderer,
  GeneralNameCellRenderer,
  UnlinkedNameCellRenderer,
  SourceRendererPending,
  CountryRenderer,
  CountryTierRenderer,
  KeywordRenderer,
  MessageRenderer
} from "../../components/listing/FriendListColumns";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import Modal from "../../components/common/Modal";
import { utils } from "../../helpers/utils";
import helper from "../../helpers/helper"

const LostFriends = () => {
  //::::Friend List geting data from Redux::::
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.facebook_data.isLoading);
  const [keyWords, setKeyWords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [listFilteredCount, setListFilteredCount] = useState(null)
  const [isReset, setIsReset] = useState(null)
  const friendsList = useSelector((state) =>
    state.facebook_data.current_friend_list.filter(
      (item) => item.friendStatus === "Lost"
    )
  );
  useEffect(() => {
    friendsList && dispatch(countCurrentListsize(friendsList.length));
  }, [dispatch, friendsList]);

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

  const friendsLostinRef = [
    {
      field: "friendName",
      headerName: "Name",
      headerCheckboxSelection: false,
      checkboxSelection: false,
      showDisabledCheckboxes: true,
      lockPosition: "left",
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["apply", "reset"],
        debounceMs: 200,
        suppressMiniFilter: true,
        closeOnApply: true,
        filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
      },
      cellRenderer: UnlinkedNameCellRenderer,
    },
    // {
    //   field: "friendStatus",
    //   headerName: "Status",
    //   filter: "agTextColumnFilter",
    //   cellRenderer: StatusRenderer,
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
      field: "country",
      headerName: "Country",
      headerTooltip: 'Country',
      tooltipComponent: CustomHeaderTooltip,
      cellRenderer: CountryRenderer,
      headerClass: 'header-query-tooltip',
      // width: 158,
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
      field: "created_at",
      headerName: "Age",
      headerTooltip: "Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n",
      cellRenderer: AgeRenderer,
      headerClass: 'header-query-tooltip',
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
    //   field: "created_at",
    //   headerName: "Sync & Added Date &  Time ",
    //   cellRenderer: CreationRenderer,
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
  ];

  // const getFbUserId = async () => {
  //   setLoading(true);

  //   try {
  //     let savedFbUId = localStorage.getItem("fr_default_fb");

  //     if (savedFbUId) {
  //       setDefaultFbId(savedFbUId);
  //     } else {
  //       const getCurrentFbProfile = await fetchUserProfile();
  //       if (getCurrentFbProfile) {
  //         savedFbUId = localStorage.setItem(
  //           "fr_default_fb",
  //           getCurrentFbProfile[0].fb_user_id
  //         );
  //       }
  //     }
  //     dispatch(
  //       getFriendLost({
  //         // token: localStorage.getItem("fr_token"),
  //         fbUserId: savedFbUId,
  //       })
  //     )
  //       .unwrap()
  //       .then((response) => {
  //         // dispatch(FriendsAction.getFriendLost({"token" : localStorage.getItem('fr_token'), "fbUserId" : savedFbUId}))
  //         // .then((response) => {
  //         //   console.log(localStorage.getItem('fr_token'), savedFbUId, 'response', response);
  //         if (
  //           response.data &&
  //           response.data.length &&
  //           response.data[0].friend_details.length > 0
  //         ) {
  //           setFriendsLost(response.data[0].friend_details);
  //           setLoading(false);
  //           setNoDataFound(false);
  //           console.log("here:::", response.data[0].friend_details);
  //           dispatch(
  //             updateNumberofListing(response.data[0].friend_details.length)
  //           );
  //         } else {
  //           setFriendsLost([]);
  //           setLoading(false);
  //           setNoDataFound(true);
  //           console.log("here");
  //           dispatch(updateNumberofListing(0));
  //         }
  //         // console.log("response.data[0].friend_details", response.data[0].friend_details);
  //       });
  //   } catch (error) {
  //     //console.log(error);
  //     setLoading(false);
  //     setNoDataFound(true);
  //   }
  // };

  // const setLoadingStatus = (params) => {
  //   setLoading(params);
  // };

  // useEffect(() => {
  //   getFbUserId();
  // }, []);

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
      {friendsList?.length > 0 && (
        <>
          <Listing
            friendsData={friendsList}
            friendsListingRef={friendsLostinRef}
            // pageLoadSize={pageLoadSize}
            getFilterNum={setListFilteredCount}
            reset={isReset}
            setReset={setIsReset}
          />
        </>
      )}

      {
        !loading &&
        friendsList?.length === 0 &&
        <NoDataFound />
      }

      {loading && <ListingLoader />}
      {
        friendsList?.length > 0 && listFilteredCount === 0 && <NoDataFound
          customText="Whoops!"
          additionalText={<>We couldn’t find the data<br /> that you filtered for.</>}
          interactionText="Clear filter"
          isInteraction={() => { setIsReset(!isReset) }}
        />
      }
    </div>
  );
};

export default LostFriends;
