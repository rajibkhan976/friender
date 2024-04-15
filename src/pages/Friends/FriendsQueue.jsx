import { useDispatch, useSelector } from "react-redux";
import Listing from "../../components/common/Listing";
import {
	MessageRenderer,
	ReactionRenderer,
	CommentRenderer,
	GenderRenderer,
	AgeRenderer,
	EngagementGetter,
	UnlinkedNameCellWithOptionsRenderer,
	SourceRendererPending,
	CountryRenderer,
	RecentEngagementRenderer,
	KeywordRenderer,
	EngagementRenderer,
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { syncMainFriendList } from "../../actions/FriendsAction";
import { getMySettings } from "../../actions/MySettingAction";
import Modal from "../../components/common/Modal";
import helper from "../../helpers/helper";
import { utils } from "../../helpers/utils";
import { fetchAllCampaigns } from "../../actions/CampaignsActions";
import {
	getFriendsQueueSettings,
	saveFriendsQueueSettings,
} from "../../actions/FriendsQueueActions";
import NumberRangeInput from "../../components/common/NumberRangeInput";
import DropSelector from "../../components/formComponents/DropSelector";
import Switch from "../../components/formComponents/Switch";

const FriendsQueue = () => {
	//::::Friend List geting data from Redux::::
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.facebook_data.isLoading);
	const mySettings = useSelector((state) => state.settings.mySettings);
	const [filterFrndList, setFilterFrndList] = useState([]);
	const [listFilteredCount, setListFilteredCount] = useState(null);
	const [isReset, setIsReset] = useState(null);

	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [inactiveAfter, setInactiveAfter] = useState(null);
	const friendsList = useSelector(
		(state) => state.facebook_data.current_friend_list
	);

	const fbUserId = localStorage.getItem("fr_default_fb");
	const timeDelays = [
		{
			value: 3,
			label: "3 min",
			selected: true,
		},
		{
			value: 5,
			label: "5 min",
			selected: false,
		},
		{
			value: 10,
			label: "10 min",
			selected: false,
		},
		{
			value: 15,
			label: "15 min",
			selected: false,
		},
	];

	const friendsQueueSettings = useSelector(
		(state) => state.friendsQueue.friendsQueueSettings
	);

	const [friendRequestQueueSettings, setFriendRequestQueueSettings] = useState(
		{}
	);
	const [frndReqSentPeriod, setFrndReqSentPeriod] = useState("Today");

	useEffect(() => {
		const filteredData = friendsList.filter(
			(item) => item.deleted_status !== 1 && item.friendStatus === "Activate"
		);
		setFilterFrndList(filteredData);
		friendsList && dispatch(countCurrentListsize(filteredData.length));
		dispatch(syncMainFriendList());
	}, [dispatch, friendsList]);

	/**
	 * Custom comparator for columns with dates
	 *
	 * @returns updated array which is descending / ascending / default
	 */
	const dateComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
		let valA = new Date(nodeA.data.created_at);
		let valB = new Date(nodeB.data.created_at);

		return valB - valA;
	};
	// get Settings data
	const getSettingsData = async () => {
		if (mySettings?.data[0]?.friends_willbe_inactive_after) {
			setInactiveAfter(mySettings?.data[0]?.friends_willbe_inactive_after);
		} else {
			const dataSettings = await dispatch(
				getMySettings({ fbUserId: `${localStorage.getItem("fr_default_fb")}` })
			).unwrap();
			if (dataSettings) {
				setInactiveAfter(dataSettings?.data[0]?.friends_willbe_inactive_after);
			}
		}
	};

	useEffect(() => {
		dispatch(fetchAllCampaigns());
		dispatch(getFriendsQueueSettings(fbUserId));
		getSettingsData();
	}, []);

	useEffect(() => {
		if (friendsQueueSettings && friendsQueueSettings.length > 0) {
			setFriendRequestQueueSettings({
				fb_user_id: friendsQueueSettings[0]?.fb_user_id,
				request_limit_value: friendsQueueSettings[0]?.request_limit_value,
				request_limited: friendsQueueSettings[0]?.request_limited,
				run_friend_queue: friendsQueueSettings[0]?.run_friend_queue,
				time_delay: Number(friendsQueueSettings[0]?.time_delay),
			});
		}
	}, [friendsQueueSettings]);

	const someComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
		// console.log(nodeA.data.matchedKeyword, nodeB.data.matchedKeyword);
		if (nodeA.data.matchedKeyword == nodeB.data.matchedKeyword) return 0;
		return nodeA.data.matchedKeyword === undefined ||
			nodeA.data.matchedKeyword === null
			? -1
			: nodeB.data.matchedKeyword === undefined ||
			  nodeB.data.matchedKeyword === null
			? 1
			: nodeA.data.matchedKeyword > nodeB.data.matchedKeyword
			? 1
			: -1;
	};

	const ageComparator = (targetDate) => {
		let statusSync = targetDate?.toLowerCase();
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
		return age;
	};

	const friendsListinRef = [
		{
			field: "friendName",
			headerName: "Name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			lockPosition: "left",
			cellRenderer: UnlinkedNameCellWithOptionsRenderer,
			minWidth: 280,
		},
		// {
		//   field: "friendStatus",
		//   headerName: "Status",
		//   cellRenderer: StatusRenderer,
		//   filter: "agTextColumnFilter",
		//   filterParams: {
		//     buttons: ["apply", "reset"],
		//     suppressMiniFilter: true,Comments
		// },
		{
			field: "friendGender",
			headerName: "Gender ",
			headerClass: "header-gender",
			headerTooltip: "Gender",
			filter: "agTextColumnFilter",
			cellRenderer: GenderRenderer,
			// width: 80,
			maxWidth: 80,
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
			headerClass: "header-query-tooltip",
			headerTooltip:
				"Friender calculates age based on when you first connected, unfriended, lost, or sent a friend request. This isn't determined by Facebook's data, but if the request was via Friender, accuracy is high.\n",
			filter: "agNumberColumnFilter",
			// width: 110,
			maxWidth: 110,
			// filterParams: {
			//   buttons: ["apply", "reset"],
			//   debounceMs: 200,
			//   suppressMiniFilter: true,
			//   closeOnApply: true,
			//   filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
			// },
			filterParams: {
				buttons: ["apply", "reset"],
				debounceMs: 200,
				suppressMiniFilter: true,
				closeOnApply: true,
				filterOptions: [
					{
						displayKey: "lessThan",
						displayName: "Less than",
						predicate: ([filterValue], cellValue) => {
							return ageComparator(cellValue) < filterValue;
						},
					},
					{
						displayKey: "greaterThan",
						displayName: "Greater than",
						predicate: ([filterValue], cellValue) => {
							return ageComparator(cellValue) > filterValue;
						},
					},
					{
						displayKey: "equals",
						displayName: "Equals",
						predicate: ([filterValue], cellValue) => {
							return ageComparator(cellValue) == filterValue;
						},
					},
				],
			},
			comparator: dateComparator,
		},
		{
			field: "country",
			headerName: "Country",
			cellRenderer: CountryRenderer,
			headerTooltip: "Country",
			tooltipComponent: CustomHeaderTooltip,
			headerClass: "header-query-tooltip",
			// width: 158,
			maxWidth: 158,
			filter: "agTextColumnFilter",
			filterParams: {
				buttons: ["apply", "reset"],
				debounceMs: 200,
				suppressMiniFilter: true,
				closeOnApply: true,
				filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
			},
		},
		{
			field: "reactionThread",
			headerName: "Total Reaction",
			headerTooltip: "Reactions",
			headerClass: "header-reaction",
			cellRenderer: ReactionRenderer,
			// width: 75,
			maxWidth: 75,
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
			headerTooltip: "Comments",
			headerClass: "header-comments",
			cellRenderer: CommentRenderer,
			filter: "agNumberColumnFilter",
			// width: 75,
			maxWidth: 75,
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
			headerTooltip: "Total Engagement",
			headerClass: "header-engagement",
			filter: "agNumberColumnFilter",
			// width: 75,
			maxWidth: 75,
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
			cellClass: "engagementCell",
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
			field: "last_engagement_date",
			headerName: "Recent engagement",
			headerTooltip: "Recent Engagement",
			headerClass: "header-recent-engagement",
			cellRenderer: RecentEngagementRenderer,
			// width: 100,
			maxWidth: 100,
			cellRendererParams: {
				inactiveAfter,
			},
			filter: "agNumberColumnFilter",
			filterParams: {
				buttons: ["apply", "reset"],
				debounceMs: 200,
				suppressMiniFilter: true,
				closeOnApply: true,
				filterOptions: [
					{
						displayKey: "lessThan",
						displayName: "Less than",
						predicate: ([filterValue], cellValue) => {
							return (
								cellValue != null &&
								Math.floor(
									Math.abs(
										helper.curretUTCTime() - new Date(cellValue).valueOf()
									) /
										(24 * 60 * 60 * 1000)
								) < filterValue
							);
						},
					},
					{
						displayKey: "greaterThan",
						displayName: "Greater than",
						predicate: ([filterValue], cellValue) => {
							return (
								cellValue != null &&
								Math.floor(
									Math.abs(
										helper.curretUTCTime() - new Date(cellValue).valueOf()
									) /
										(24 * 60 * 60 * 1000)
								) > filterValue
							);
						},
					},
					{
						displayKey: "equals",
						displayName: "Equals",
						predicate: ([filterValue], cellValue) => {
							return (
								cellValue != null &&
								Math.floor(
									Math.abs(
										helper.curretUTCTime() - new Date(cellValue).valueOf()
									) /
										(24 * 60 * 60 * 1000)
								) == filterValue
							);
						},
					},
				],
			},
		},
		{
			field: "keywords",
			headerName: "Keyword(s)",
			// filter: "agTextColumnFilter",
			cellRendererParams: {
				setKeyWords,
				setModalOpen,
			},
			sortable: true,
			comparator: someComparator,
			cellRenderer: KeywordRenderer,
			filter: "agTextColumnFilter",
			filterParams: {
				buttons: ["apply", "reset"],
				filterOptions: [
					{
						displayKey: "contains",
						displayName: "Contains",
						predicate: ([filterValue], cellValue) => {
							console.log([filterValue][0], cellValue);
							if ([filterValue][0] == "NA" || [filterValue][0] == "N/A") {
								return (
									cellValue === undefined ||
									cellValue === "undefined" ||
									!cellValue ||
									cellValue === null ||
									cellValue === "NA" ||
									cellValue === "N/A"
								);
							} else {
								return cellValue != null && cellValue?.includes(filterValue);
							}
						},
					},
				],
				valueGetter: (params) => {
					return params?.data?.matchedKeyword;
				},
				textCustomComparator: function (filter, value, filterText) {
					const matchedKeywords = value.split(", "); // Split matched keywords by comma

					if (filter === "equals") {
						// Exact match
						return matchedKeywords.includes(filterText);
					} else {
						// Partial match
						return matchedKeywords.some((keyword) =>
							keyword.includes(filterText)
						);
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
			headerName: "Source",
			filter: "agTextColumnFilter",
			headerTooltip: "Friends source",
			tooltipComponent: CustomHeaderTooltip,
			headerClass: "header-query-tooltip",
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
		// {
		//   field: "message_thread",
		//   headerName: "Has Conversation",
		//   cellRenderer: HasConversationRenderer,
		//   filter: "agTextColumnFilter",
		//   filterParams: {
		//     buttons: ["apply", "reset"],
		//     suppressMiniFilter: true,
		//     closeOnApply: true,
		//     filterOptions: ["contains", "notContains", "startsWith", "endsWith"],
		//   },
		// },
	];

	console.log(frndReqSentPeriod);

	const onChangeFrndReqLimit = (event) => {
		let frndReqLimitValue = event.target.value;

		// Remove any non-digit characters, including 'e'
		frndReqLimitValue = frndReqLimitValue.replace(/\D/g, "");

		if (!frndReqLimitValue) {
			frndReqLimitValue = "";
		}

		const parsedValue = parseInt(frndReqLimitValue);
		setFriendRequestQueueSettings((friendRequestQueueSettings) => {
			return {
				...friendRequestQueueSettings,
				request_limit_value: parsedValue,
			};
		});
	};

	const handleIncrementDecrementVal = (type) => {
		if (type === "INCREMENT") {
			setFriendRequestQueueSettings((friendRequestQueueSettings) => {
				return {
					...friendRequestQueueSettings,
					request_limit_value:
						friendRequestQueueSettings.request_limit_value + 1,
				};
			});

			if (friendRequestQueueSettings.request_limit_value >= 999) {
				setFriendRequestQueueSettings((friendRequestQueueSettings) => {
					return {
						...friendRequestQueueSettings,
						request_limit_value: 999,
					};
				});
			}
		}

		if (type === "DECREMENT") {
			setFriendRequestQueueSettings((friendRequestQueueSettings) => {
				return {
					...friendRequestQueueSettings,
					request_limit_value:
						friendRequestQueueSettings.request_limit_value - 1,
				};
			});

			if (friendRequestQueueSettings.request_limit_value <= 1) {
				setFriendRequestQueueSettings((friendRequestQueueSettings) => {
					return {
						...friendRequestQueueSettings,
						request_limit_value: 1,
					};
				});
			}
		}
	};

	useEffect(() => {
		dispatch(saveFriendsQueueSettings(friendRequestQueueSettings));
	}, [friendRequestQueueSettings]);

	return (
		<div className='main-content-inner d-flex d-flex-column'>
			{modalOpen && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Keyword(s)"}
					bodyText={
						<>
							{console.log("in modal:::", keyWords, keyWords.matchedKeyword)}
							{keyWords?.matchedKeyword?.length > 0 && keyWords?.matchedKeyword
								? keyWords?.matchedKeyword.map((el, i) => (
										<span
											className={`tags positive-tags`}
											key={`key-${i}`}
										>
											{el}
										</span>
								  ))
								: "No specific keyword used"}
						</>
					}
					open={modalOpen}
					setOpen={setModalOpen}
					ModalFun={null}
					btnText={" "}
					modalButtons={false}
					additionalClass='modal-keywords'
				/>
			)}
			{filterFrndList?.length > 0 && !loading && inactiveAfter !== null && (
				<>
					<div className='friends-queue-action-bar'>
						<div className='friends-queue-action-bar-item'>
							<div className='friend-req-sent-filter'>
								<div className='friend-req-sent-count'>
									<div className='count'>160</div>
									<div className='count-descriptor'>Friend request(s) sent</div>
								</div>
								<select
									className='select-friend-req-sent-period'
									name='pets'
									id='pet-select'
									value={frndReqSentPeriod}
									onChange={(e) => setFrndReqSentPeriod(e.target.value)}
								>
									<option value='Today'>Today</option>
									<option value='This week'>This week</option>
									<option value='All times'>All times</option>
								</select>
							</div>
						</div>
						<div className='friends-queue-action-bar-item'>
							<div className='friend-req-send-limit'>
								<div className='select-limit'>
									<div className='req-limit'>Request limit</div>
									<div className='select-limit-item'>
										<div
											className={
												!friendRequestQueueSettings?.request_limited
													? "infinite is-active"
													: "infinite"
											}
											onClick={() => {
												setFriendRequestQueueSettings(
													(friendRequestQueueSettings) => {
														return {
															...friendRequestQueueSettings,
															request_limited: false,
														};
													}
												);
											}}
										>
											Infinite
										</div>
										<div
											className={
												friendRequestQueueSettings?.request_limited
													? "limited is-active"
													: "limited"
											}
											onClick={() => {
												setFriendRequestQueueSettings(
													(friendRequestQueueSettings) => {
														return {
															...friendRequestQueueSettings,
															request_limited: true,
														};
													}
												);
											}}
										>
											Limited
										</div>
									</div>
								</div>
								<NumberRangeInput
									value={friendRequestQueueSettings?.request_limit_value}
									handleChange={onChangeFrndReqLimit}
									setIncrementDecrementVal={handleIncrementDecrementVal}
									customStyleClass='friend-req-limit-num-input'
								/>
							</div>
						</div>
						<div className='friends-queue-action-bar-item'>
							<div className='friend-req-time-delay'>
								<div className='time-delay'>Time delay</div>
								<DropSelector
									selects={timeDelays}
									value={friendRequestQueueSettings?.time_delay}
									extraClass='friend-req-time-delay-bar tinyWrap'
									height='40px'
									width='inherit'
									handleChange={(e) => {
										setFriendRequestQueueSettings(
											(friendRequestQueueSettings) => {
												return {
													...friendRequestQueueSettings,
													time_delay: e.target.value,
												};
											}
										);
									}}
								/>
							</div>
						</div>
						<div className='friends-queue-action-bar-item'>
							<div className='friend-req-run-queue'>
								<div className='run-friend-queue'>
									<div className='run'>Run friend queue</div>
									<Switch
										checked={friendRequestQueueSettings?.run_friend_queue}
										handleChange={() => {
											setFriendRequestQueueSettings(
												(friendRequestQueueSettings) => {
													return {
														...friendRequestQueueSettings,
														run_friend_queue:
															!friendRequestQueueSettings.run_friend_queue,
													};
												}
											);
										}}
										smallVariant
									/>
								</div>
							</div>
						</div>
					</div>
					<Listing
						friendsData={filterFrndList}
						friendsListingRef={friendsListinRef}
						getFilterNum={setListFilteredCount}
						reset={isReset}
						setReset={setIsReset}
					/>
				</>
			)}

			{/* {filterFrndList?.length === 0 && <NoDataFound />} */}

			{loading && <ListingLoader />}

			{filterFrndList?.length > 0 && listFilteredCount === 0 && (
				<NoDataFound
					customText='Whoops!'
					additionalText={
						<>
							We couldn’t find the data
							<br /> that you filtered for.
						</>
					}
					interactionText='Clear filter'
					isInteraction={() => {
						setIsReset(!isReset);
					}}
				/>
			)}
		</div>
	);
};

export default FriendsQueue;
