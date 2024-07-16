import { useDispatch, useSelector } from "react-redux";
import Listing from "../../components/common/Listing";
import {
	FriendsQueueRecordsKeywordRenderer,
	MessageGroupRequestAcceptedRenderer,
	MessageGroupRequestSentRenderer,
	SourceRendererPending,
	FriendQueueRecordsNameRenderer,
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
	getFriendsQueueSettings,
	saveFriendsQueueSettings,
} from "../../actions/FriendsQueueActions";
import NumberRangeInput from "../../components/common/NumberRangeInput";
import DropSelector from "../../components/formComponents/DropSelector";
import Switch from "../../components/formComponents/Switch";
import Alertbox from "../../components/common/Toast";
import { showModal } from "../../actions/PlanAction";
import ToolTipPro from "components/common/ToolTipPro";
import extensionMethods from "../../configuration/extensionAccesories";
import Listing2 from "../../components/common/SSListing/Listing2";
import { FriendsQueueColDef } from "../../components/common/SSListing/ListColumnDefs/FriendsQueueColDef";
import config from "../../configuration/config";
const fb_user_id= localStorage.getItem("fr_default_fb");

const FriendsQueue = () => {
	const dispatch = useDispatch();
	const stopFRQS = useRef(null);

	const loading = useSelector((state) => state.facebook_data.isLoading);
	const mySettings = useSelector((state) => state.settings.mySettings);
	const [isReset, setIsReset] = useState(null);

	const [modalOpen, setModalOpen] = useState(false);
	const inactiveAfter = useSelector((state) => state.settings.mySettings?.data[0]?.friends_willbe_inactive_after);
	const [listFilteredCount, setListFilteredCount] = useState(null);

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
		{
			value: 30,
			label: "30 min",
			selected: false,
		},
		{
			value: Number(1 * 60),
			label: "1 hr",
			selected: false,
		},
		{
			value: Number(2 * 60),
			label: "2 hrs",
			selected: false,
		},
		{
			value: Number(4 * 60),
			label: "4 hrs",
			selected: false,
		}
	];
	const timeoutToSaveFriendsQueueSettings = useRef(null);

	const friendRequestSentInsight = useSelector(
		(state) => state.friendsQueue.friendRequestSentInsight
	);
	const friendsQueueRecords = useSelector(
		(state) => state.friendsQueue.friendsQueueRecords
	);

	// console.log("RECORDS FOR FRIRNDS QUEUE -- ", friendsQueueRecords);

	const isDataFetchingFromApi = useSelector(
		(state) => state.friendsQueue.isDataFetchingFromApi
	);

	const fr_queue_settings = localStorage.getItem("fr_queue_settings")
		? JSON.parse(localStorage.getItem("fr_queue_settings"))
		: null;

	const [friendRequestQueueSettings, setFriendRequestQueueSettings] = useState(
		fr_queue_settings?.length &&
			typeof fr_queue_settings[0] === "object" &&
			Object.keys(fr_queue_settings[0]).length >= 5
			? fr_queue_settings[0]
			: null
	);

	// localStorage.clear();
	// console.log(localStorage.getItem("fr_queue_settings"));
	// console.log(fr_queue_settings);
	// console.log(friendRequestQueueSettings);

	const [frndReqSentPeriod, setFrndReqSentPeriod] = useState(localStorage.getItem('fr_req_sent_from_que') ?? 0);
	const [keywordList, setKeyWordList] = useState(0);
	const [sendableRecordsCount, setSendableRecordsCount] = useState(0);

	useEffect(() => {
		sendMessageToExt();
		window.addEventListener(
			"message",
			(event) => {
				// console.log("addEventListener", event);
				stopFRQS.current = setTimeout(() => turnoffFriendQueue(event), 3000);
			},
			false
		);
		return () => {
			window.removeEventListener("message", (event) => {
				turnoffFriendQueue(event);
			});
			clearTimeout(stopFRQS);
		};
	}, [])
	const sendMessageToExt = async (data) => {
		const extRes = await extensionMethods.sendMessageToExt({
			action: "fRqueAlarmStatusCheck",
			frLoginToken: localStorage.getItem("fr_token")
		});
		console.log("extRes in FRQUE LIST", extRes);
	}

	//
	useEffect(() => {
		if (friendsQueueRecords) {
			// const filteredErrorRecords = friendsQueueRecords?.length && friendsQueueRecords.filter(item => item.status === false);
			const filteredSendbleRecords =
				friendsQueueRecords?.length &&
				friendsQueueRecords.filter(
					(item) => item.status === null && item.is_active === true
				);
			setSendableRecordsCount(filteredSendbleRecords?.length ?? 0);
		}
	}, [friendsQueueRecords]);

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
						'Sync' :
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


		let objA = filterName({ ...nodeA?.data })?.toLowerCase()
		let objB = filterName({ ...nodeB?.data })?.toLowerCase()

		if (objA == objB) return 0;
		return (objA > objB) ? 1 : -1;
	}

	const friendsQueueRef = [
		{
			field: "friendName",
			headerName: "Name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			filter: "agTextColumnFilter",
			filterParams: {
				buttons: ["apply", "reset"],
				debounceMs: 200,
				suppressMiniFilter: true,
				closeOnApply: true,
			},
			lockPosition: "left",
			cellRenderer: FriendQueueRecordsNameRenderer,
			minWidth: 220,
		},
		{
			field: "matchedKeyword",
			headerName: "Keyword(s)",
			cellRendererParams: {
				setKeyWordList,
				setModalOpen,
			},
			sortable: true,
			cellRenderer: FriendsQueueRecordsKeywordRenderer,
		},
		{
			field: "message_group_request_sent",
			headerName: "Message group: when friend request is sent",
			sortable: true,
			cellRenderer: MessageGroupRequestSentRenderer,
		},
		{
			field: "message_group_request_accepted",
			headerName: "Message group: when friend request is accepted",
			sortable: true,
			cellRenderer: MessageGroupRequestAcceptedRenderer,
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
	];

	const onChangeFrndReqLimit = (event) => {
		let frndReqLimitValue = event.target.value;

		// Remove any non-digit characters, including 'e'
		frndReqLimitValue = frndReqLimitValue.replace(/\D/g, "");

		if (!frndReqLimitValue) {
			frndReqLimitValue = "";
		}

		const parsedValue = parseInt(frndReqLimitValue);

		if (friendRequestQueueSettings) {
			const payload = { ...friendRequestQueueSettings };
			Object.assign(payload, {
				request_limit_value: parsedValue ? parsedValue : 50,
			});
			timeoutToSaveFriendsQueueSettings.current = setTimeout(
				() => dispatch(saveFriendsQueueSettings(payload)),
				1000
			);
			setFriendRequestQueueSettings((friendRequestQueueSettings) => {
				return {
					...friendRequestQueueSettings,
					request_limit_value: parsedValue ? parsedValue : 50,
				};
			});
			clearTimeout(timeoutToSaveFriendsQueueSettings);
		}
	};

	// HANDLE TIME DELAY SELECT OPTIONS..
	const handleTimeDelaySlotSelects = (e) => {
		if (friendRequestQueueSettings) {
			const payload = { ...friendRequestQueueSettings };

			Object.assign(payload, {
				time_delay: Number(e.target.value),
			});

			timeoutToSaveFriendsQueueSettings.current = setTimeout(
				() => dispatch(saveFriendsQueueSettings(payload)),
				1000
			);

			setFriendRequestQueueSettings(
				(friendRequestQueueSettings) => {
					return {
						...friendRequestQueueSettings,
						time_delay: Number(e.target.value),
					};
				}
			);

			clearTimeout(timeoutToSaveFriendsQueueSettings);
		}
	};

	const handleIncrementDecrementVal = (type) => {
		if (type === "INCREMENT" && friendRequestQueueSettings) {
			const payload = { ...friendRequestQueueSettings };
			Object.assign(payload, {
				request_limit_value: friendRequestQueueSettings.request_limit_value + 1,
			});
			timeoutToSaveFriendsQueueSettings.current = setTimeout(
				() => dispatch(saveFriendsQueueSettings(payload)),
				1000
			);
			setFriendRequestQueueSettings((friendRequestQueueSettings) => {
				return {
					...friendRequestQueueSettings,
					request_limit_value:
						friendRequestQueueSettings.request_limit_value + 1,
				};
			});
			clearTimeout(timeoutToSaveFriendsQueueSettings);
		}

		if (type === "DECREMENT" && friendRequestQueueSettings) {
			if (friendRequestQueueSettings.request_limit_value <= 1) {
				const payload = { ...friendRequestQueueSettings };
				Object.assign(payload, {
					request_limit_value: 1,
				});
				timeoutToSaveFriendsQueueSettings.current = setTimeout(
					() => dispatch(saveFriendsQueueSettings(payload)),
					1000
				);
				setFriendRequestQueueSettings((friendRequestQueueSettings) => {
					return {
						...friendRequestQueueSettings,
						request_limit_value: 1,
					};
				});
				clearTimeout(timeoutToSaveFriendsQueueSettings);
			} else {
				const payload = { ...friendRequestQueueSettings };
				Object.assign(payload, {
					request_limit_value:
						friendRequestQueueSettings.request_limit_value - 1,
				});
				timeoutToSaveFriendsQueueSettings.current = setTimeout(
					() => dispatch(saveFriendsQueueSettings(payload)),
					1000
				);
				setFriendRequestQueueSettings((friendRequestQueueSettings) => {
					return {
						...friendRequestQueueSettings,
						request_limit_value:
							friendRequestQueueSettings.request_limit_value - 1,
					};
				});
				clearTimeout(timeoutToSaveFriendsQueueSettings);
			}
		}
	};

	useEffect(() => {
		dispatch(getFriendsQueueSettings())
			.unwrap()
			.then((response) => {
				if (
					response &&
					response.data &&
					response.data.length &&
					typeof response.data[0] === "object" &&
					Object.keys(response.data[0]).length >= 5
				) {
					setFriendRequestQueueSettings(response.data[0]);
				}
			})
		// dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId));
		//getSettingsData();

		return () => clearTimeout(timeoutToSaveFriendsQueueSettings);
	}, []);

	useEffect(() => {
		dispatch(countCurrentListsize(friendsQueueRecords?.length));
	}, [friendsQueueRecords]);

	useEffect(() => {
		dispatch(getFriendsRequestSentInsight(frndReqSentPeriod));
	}, [frndReqSentPeriod]);

	// console.log(frndReqSentPeriod);
	// console.log(friendsQueueRecords);
	// console.log(friendsQueueRecordsCount);
	// console.log(friendRequestSentInsight);

	const runFriendsQueue = (e) => {
		const le_plan = localStorage?.getItem("fr_plan")?.toLowerCase();

		if (le_plan === "1" && e.target.checked) {
			e.preventDefault();
			e.stopPropagation();
			dispatch(showModal(true));
			setFriendRequestQueueSettings({
				...friendRequestQueueSettings,
				run_friend_queue: false,
			});
			console.log("here");
			return false;
		} else if (le_plan === "2" && e.target.checked) {
			console.log("here");
			// console.log("BASIC PLAN");
			Alertbox(
				`Friend request sending has started without message sending. Upgrade to send messages with friend requests.`,
				"info-plan-toast",
				3000,
				"bottom-right",
				"",
				"Info",
				{
					url: "sales@tier5.us",
					text: "Upgrade",
				}
			);
			setFriendRequestQueueSettings((friendRequestQueueSettings) => {
				return {
					...friendRequestQueueSettings,
					run_friend_queue: !friendRequestQueueSettings.run_friend_queue,
				};
			});
		} else {
			console.log("here");
			setFriendRequestQueueSettings((friendRequestQueueSettings) => {
				return {
					...friendRequestQueueSettings,
					run_friend_queue: !friendRequestQueueSettings?.run_friend_queue,
				};
			});
		}
	};
	const turnoffFriendQueue = (event) => {
		if (event?.data === "stop_fr_queue") {
			console.log("********************* stop FRQS ***************************");
			const payload = { ...friendRequestQueueSettings, run_friend_queue: false };
			// console.log("payload for switch off  --->   ", payload);
			dispatch(saveFriendsQueueSettings(payload))
			setFriendRequestQueueSettings({...friendRequestQueueSettings, run_friend_queue: false,});
			extensionMethods.sendMessageToExt({
				action: "fRqueSettingUpdate",
				frLoginToken: localStorage.getItem("fr_token"),
				payload: payload,
			});	
		}
	}

	const tableMethods = {}
	const defaultParams = {
		fb_user_id: fb_user_id,
	}
	const dataExtractor = (response) => {
		return {
			data: response?.data,
			count: response?.count,
		};
	};

	return (
		<div className='main-content-inner d-flex d-flex-column listing-main listing-campaign'>
			{modalOpen && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Keyword(s)"}
					bodyText={
						<>
							{keywordList?.length > 0
								? keywordList.map((el, i) => (
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
			{!loading && (
				<div className='friends-queue-action-bar'>
					<div className='friends-queue-action-bar-item'>
						<div className='friends-queue-total-count-area'>
							<div className='friend-req-sent-count'>
								<div className='count'>{sendableRecordsCount ?? 0}</div>
								<div className='count-descriptor'>Sendable requests</div>
							</div>

							<div className='friend-req-queue-tooltip-container'>
								<ToolTipPro
									isInteract={false}
									type='query-gray'
									textContent='Total number of people in the queue who will receive a friend request.'
								/>
							</div>
						</div>
					</div>

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
								onChange={(e) => {
									setFrndReqSentPeriod(e.target.value);
									localStorage.setItem('fr_req_sent_from_que', e.target.value);
								}}
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
											if (friendRequestQueueSettings) {
												const payload = { ...friendRequestQueueSettings };
												Object.assign(payload, { request_limited: false });
												timeoutToSaveFriendsQueueSettings.current = setTimeout(
													() => dispatch(saveFriendsQueueSettings(payload)),
													1000
												);
												setFriendRequestQueueSettings(
													(friendRequestQueueSettings) => {
														return {
															...friendRequestQueueSettings,
															request_limited: false,
														};
													}
												);
												clearTimeout(timeoutToSaveFriendsQueueSettings);
											}
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
											if (friendRequestQueueSettings) {
												const payload = { ...friendRequestQueueSettings };
												Object.assign(payload, { request_limited: true });
												timeoutToSaveFriendsQueueSettings.current = setTimeout(
													() => dispatch(saveFriendsQueueSettings(payload)),
													1000
												);
												setFriendRequestQueueSettings(
													(friendRequestQueueSettings) => {
														return {
															...friendRequestQueueSettings,
															request_limited: true,
														};
													}
												);
												clearTimeout(timeoutToSaveFriendsQueueSettings);
											}
										}}
									>
										Limited
									</div>
								</div>
							</div>
							<NumberRangeInput
								value={
									!friendRequestQueueSettings?.request_limited
										? "∞"
										: friendRequestQueueSettings?.request_limit_value
								}
								handleChange={onChangeFrndReqLimit}
								setIncrementDecrementVal={handleIncrementDecrementVal}
								customStyleClass='friend-req-limit-num-input'
								disabled={!friendRequestQueueSettings?.request_limited}
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
								handleChange={handleTimeDelaySlotSelects}
							/>
						</div>
					</div>
					<div className='friends-queue-action-bar-item'>
						<div className='friend-req-run-queue'>
							<div className='run-friend-queue'>
								<div className='run'>{`${friendRequestQueueSettings?.run_friend_queue ? "Stop" : "Run"
									} friend queue`}</div>
								<Switch
									checked={friendRequestQueueSettings?.run_friend_queue}
									handleChange={(e) => {
										if (
											Number(localStorage?.getItem("fr_plan")?.toLowerCase()) <
											2 &&
											e.target.checked
										) {
											e.preventDefault();
											e.stopPropagation();
											dispatch(showModal(true));
											setFriendRequestQueueSettings({
												...friendRequestQueueSettings,
												run_friend_queue: false,
											});
											return false;
										}
										// else if (
										// 	localStorage?.getItem('fr_plan')?.toLowerCase() === "2" &&
										// 	e.target.checked
										// ) {
										// 	Alertbox(
										// 		`Friend request sending has started without message sending. Upgrade to send messages with friend requests.`,
										// 		"info-plan-toast",
										// 		3000,
										// 		"bottom-right",
										// 		"",
										// 		"Info",
										// 		{
										// 			url: 'sales@tier5.us',
										// 			text: "Upgrade"
										// 		}
										// 	);
										// 	setFriendRequestQueueSettings(
										// 		(friendRequestQueueSettings) => {
										// 			return {
										// 				...friendRequestQueueSettings,
										// 				run_friend_queue:
										// 					!friendRequestQueueSettings.run_friend_queue,
										// 			};
										// 		}
										// 	);
										// }
										else {
											if (friendRequestQueueSettings) {
												// console.log(friendRequestQueueSettings);
												const payload = { ...friendRequestQueueSettings };
												Object.assign(payload, {
													run_friend_queue:
														!friendRequestQueueSettings.run_friend_queue,
												});
												timeoutToSaveFriendsQueueSettings.current = setTimeout(
													() => dispatch(saveFriendsQueueSettings(payload)),
													1000
												);
												setFriendRequestQueueSettings(
													(friendRequestQueueSettings) => {
														return {
															...friendRequestQueueSettings,
															run_friend_queue:
																!friendRequestQueueSettings.run_friend_queue,
														};
													}
												);
												clearTimeout(timeoutToSaveFriendsQueueSettings);
											}
										}
									}}
									smallVariant
								/>
							</div>
						</div>
					</div>
				</div>
			)}
			{
				inactiveAfter !== null ? (
				// <Listing
				// 	friendsData={friendsQueueRecords}
				// 	friendsListingRef={friendsQueueRef}
				// 	getFilterNum={setListFilteredCount}
				// 	reset={isReset}
				// 	setReset={setIsReset}
				// />

				<Listing2 
					//friendsData={filterFrndList}
					listColDef = {FriendsQueueColDef} 
					baseUrl = {config.fetchFriendsQueueRecordv2}
					tableMethods = {tableMethods} 
					defaultParams = {defaultParams}
					dataExtractor = {dataExtractor}
				/>

			) : loading ? (
				<ListingLoader />
			) : (
				<NoDataFound
					customText=''
					additionalText={
						<>
							Your friend queue is <br />
							currently empty
						</>
					}
				// interactionText='Clear filter'
				// isInteraction={() => {
				// 	setIsReset(!isReset);
				// }}
				/>
			)}
		</div>
	);
};

export default FriendsQueue;
