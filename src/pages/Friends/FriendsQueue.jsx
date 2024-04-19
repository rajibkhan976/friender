import { useDispatch, useSelector } from "react-redux";
import Listing from "../../components/common/Listing";
import {
	KeywordRenderer,
	MessageGroupRenderer,
	SourceRendererPending,
	UnlinkedNameCellWithOptionsRenderer,
} from "../../components/listing/FriendListColumns";
import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState, useRef } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import CustomHeaderTooltip from "../../components/common/CustomHeaderTooltip";
import { getMySettings } from "../../actions/MySettingAction";
import Modal from "../../components/common/Modal";
import {
	getFriendsRequestSentInsight,
	getFriendsQueueRecordsInChunk,
	getFriendsQueueRecordsFromIndexDB,
	getFriendsQueueSettings,
	saveFriendsQueueSettings,
	resetFriendsQueueSettings,
	resetIsChunkedDataFetchedFromApi,
} from "../../actions/FriendsQueueActions";
import NumberRangeInput from "../../components/common/NumberRangeInput";
import DropSelector from "../../components/formComponents/DropSelector";
import Switch from "../../components/formComponents/Switch";

const FriendsQueue = () => {
	//::::Friend List geting data from Redux::::
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.facebook_data.isLoading);
	const mySettings = useSelector((state) => state.settings.mySettings);
	const [listFilteredCount, setListFilteredCount] = useState(null);
	const [isReset, setIsReset] = useState(null);

	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [inactiveAfter, setInactiveAfter] = useState(null);

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

	const friendRequestSentInsight = useSelector(
		(state) => state.friendsQueue.friendRequestSentInsight
	);
	const friendsQueueSettings = useSelector(
		(state) => state.friendsQueue.friendsQueueSettings
	);
	const friendsQueueRecords = useSelector(
		(state) => state.friendsQueue.friendsQueueRecords
	);
	const friendsQueueRecordsCount = useSelector(
		(state) => state.friendsQueue.friendsQueueRecordsCount
	);
	const isListLoading = useSelector(
		(state) => state.friendsQueue.isListLoading
	);
	const isDataFetchedFromApi = useSelector(
		(state) => state.friendsQueue.isDataFetchedFromApi
	);
	const isChunkedDataFetchedFromApi = useSelector(
		(state) => state.friendsQueue.isChunkedDataFetchedFromApi
	);

	const [friendRequestQueueSettings, setFriendRequestQueueSettings] =
		useState(null);
	const [frndReqSentPeriod, setFrndReqSentPeriod] = useState(0);

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

	const someComparator = (valueA, valueB, nodeA, nodeB, isDescending) => {
		// console.log(nodeA.data.matchedKeyword, nodeB.data.matchedKeyword);
		if (nodeA.data.matchedKeyword === nodeB.data.matchedKeyword) return 0;
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

	const friendsListinRef = [
		{
			field: "fb_profile_url",
			headerName: "Name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			lockPosition: "left",
			cellRenderer: UnlinkedNameCellWithOptionsRenderer,
			// minWidth: 280,
		},
		{
			field: "keywords",
			headerName: "Keyword(s)",
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
							// console.log([filterValue][0], cellValue);
							if ([filterValue][0] === "NA" || [filterValue][0] === "N/A") {
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
		},
		{
			field: "message_group_request_sent",
			headerName: "Message group: when friend request is sent",
			sortable: true,
			cellRenderer: MessageGroupRenderer,
		},
		{
			field: "message_group_request_accepted",
			headerName: "Message group: when friend request is accepted",
			sortable: true,
			cellRenderer: MessageGroupRenderer,
		},
		{
			field: "task_name",
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
	];

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

	const useDebounce = (value, delay) => {
		const [debouncedValue, setDebouncedValue] = useState(value);

		useEffect(() => {
			const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

			return () => {
				clearTimeout(timer);
			};
		}, [value, delay]);

		return debouncedValue;
	};

	const debouncedFriendsQueueSettings = useDebounce(
		friendRequestQueueSettings,
		1000
	);

	useEffect(() => {
		dispatch(resetFriendsQueueSettings());
		dispatch(getFriendsQueueSettings());
		dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId));
		getSettingsData();
	}, []);

	const timeout = useRef(null);

	useEffect(() => {
		if (isDataFetchedFromApi) {
			timeout.current = setTimeout(
				() => dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId)),
				5000
			);
		}
		return () => clearTimeout(timeout);
	}, [isDataFetchedFromApi]);

	useEffect(() => {
		if (
			Array.isArray(friendsQueueRecords) &&
			friendsQueueRecords.length < friendsQueueRecordsCount
		) {
			dispatch(resetIsChunkedDataFetchedFromApi(false));
			dispatch(getFriendsQueueRecordsInChunk(friendsQueueRecordsCount));
		}
	}, [friendsQueueRecords, friendsQueueRecordsCount]);

	useEffect(() => {
		if (isChunkedDataFetchedFromApi) {
			dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId));
		}
	}, [isChunkedDataFetchedFromApi]);

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

	useEffect(() => {
		if (
			debouncedFriendsQueueSettings &&
			Object.keys(debouncedFriendsQueueSettings).length > 0
		) {
			dispatch(resetFriendsQueueSettings(null));
			dispatch(saveFriendsQueueSettings(debouncedFriendsQueueSettings));
		}
	}, [debouncedFriendsQueueSettings]);

	useEffect(() => {
		dispatch(countCurrentListsize(friendsQueueRecordsCount));
	}, [friendsQueueRecordsCount]);

	useEffect(() => {
		dispatch(getFriendsRequestSentInsight(frndReqSentPeriod));
	}, [frndReqSentPeriod]);

	// console.log(frndReqSentPeriod);
	console.log(friendsQueueRecords);
	// console.log(friendsQueueRecordsCount);
	console.log(friendRequestSentInsight);

	return (
		<div className='main-content-inner d-flex d-flex-column'>
			{modalOpen && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Keyword(s)"}
					bodyText={
						<>
							{/* {console.log("in modal:::", keyWords, keyWords.matchedKeyword)} */}
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
			<div className='friends-queue-action-bar'>
				<div className='friends-queue-action-bar-item'>
					<div className='friend-req-sent-filter'>
						<div className='friend-req-sent-count'>
							<div className='count'>{friendRequestSentInsight}</div>
							<div className='count-descriptor'>Friend request(s) sent</div>
						</div>
						<select
							className='select-friend-req-sent-period'
							name='pets'
							id='pet-select'
							value={frndReqSentPeriod}
							onChange={(e) => setFrndReqSentPeriod(e.target.value)}
						>
							<option value='0'>Today</option>
							<option value='1'>This week</option>
							<option value='2'>All times</option>
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
							value={friendRequestQueueSettings?.request_limit_value ?? 1}
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
								setFriendRequestQueueSettings((friendRequestQueueSettings) => {
									return {
										...friendRequestQueueSettings,
										time_delay: e.target.value,
									};
								});
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
			{friendsQueueRecords.length > 0 && !loading && !isListLoading ? (
				<Listing
					friendsData={friendsQueueRecords}
					friendsListingRef={friendsListinRef}
					getFilterNum={setListFilteredCount}
					reset={isReset}
					setReset={setIsReset}
				/>
			) : loading || isListLoading ? (
				<ListingLoader />
			) : (
				<NoDataFound
					customText='Whoops!'
					additionalText={
						<>
							Your friend queue is <br />
							currently empty
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
