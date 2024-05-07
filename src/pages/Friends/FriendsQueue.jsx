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
	getFriendsQueueRecordsInChunk,
	getFriendsQueueRecordsFromIndexDB,
	saveFriendsQueueSettings,
	resetIsChunkedDataFetchedFromApi,
} from "../../actions/FriendsQueueActions";
import NumberRangeInput from "../../components/common/NumberRangeInput";
import DropSelector from "../../components/formComponents/DropSelector";
import Switch from "../../components/formComponents/Switch";
import Alertbox from "../../components/common/Toast";
import { showModal } from "../../actions/PlanAction";

const FriendsQueue = () => {
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.facebook_data.isLoading);
	const mySettings = useSelector((state) => state.settings.mySettings);
	const [isReset, setIsReset] = useState(null);

	const [modalOpen, setModalOpen] = useState(false);
	const [inactiveAfter, setInactiveAfter] = useState(null);
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
	];
	const timeoutToFetchFriendsQueueData = useRef(null);
	const timeoutToSaveFriendsQueueSettings = useRef(null);

	const friendRequestSentInsight = useSelector(
		(state) => state.friendsQueue.friendRequestSentInsight
	);
	const friendsQueueRecords = useSelector(
		(state) => state.friendsQueue.friendsQueueRecords
	);
	const friendsQueueRecordsCount = useSelector(
		(state) => state.friendsQueue.friendsQueueRecordsCount
	);
	const friendsQueueRecordsLimit = useSelector(
		(state) => state.friendsQueue.friendsQueueRecordsLimit
	);
	const isFriendsQueueListLoading = useSelector(
		(state) => state.friendsQueue.isFriendsQueueListLoading
	);
	const isListLoading = useSelector(
		(state) => state.friendsQueue.isListLoading
	);
	const isDataFetchingFromApi = useSelector(
		(state) => state.friendsQueue.isDataFetchingFromApi
	);
	const isChunkedDataFetchedFromApi = useSelector(
		(state) => state.friendsQueue.isChunkedDataFetchedFromApi
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

	const [frndReqSentPeriod, setFrndReqSentPeriod] = useState(0);
	const [keywordList, setKeyWordList] = useState(0);

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

	const friendsQueueRef = [
		{
			field: "friendProfileUrl",
			headerName: "Name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
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
			field: "task_name",
			headerName: "Source",
			headerTooltip: "Friends source",
			tooltipComponent: CustomHeaderTooltip,
			headerClass: "header-query-tooltip",
			cellRenderer: SourceRendererPending,
			// lockPosition: "right",
			minWidth: 185,
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
			// if (friendRequestQueueSettings.request_limit_value >= 999) {
			// 	setFriendRequestQueueSettings((friendRequestQueueSettings) => {
			// 		return {
			// 			...friendRequestQueueSettings,
			// 			request_limit_value: 999,
			// 		};
			// 	});
			// }
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

	// const useDebounce = (value, delay) => {
	// 	const [debouncedValue, setDebouncedValue] = useState(value);

	// 	useEffect(() => {
	// 		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

	// 		return () => {
	// 			clearTimeout(timer);
	// 		};
	// 	}, [value, delay]);

	// 	return debouncedValue;
	// };

	// const debouncedFriendsQueueSettings = useDebounce(
	// 	friendRequestQueueSettings,
	// 	1000
	// );

	useEffect(() => {
		dispatch(getFriendsQueueSettings())
			.unwrap()
			.then((response) => {
				if (response && !response?.data?.length) {
					dispatch(
						saveFriendsQueueSettings({
							fb_user_id: fbUserId,
							request_limit_value: 50,
							request_limited: true,
							run_friend_queue: false,
							time_delay: 3,
						})
					);
					setFriendRequestQueueSettings({
						fb_user_id: fbUserId,
						request_limit_value: 50,
						request_limited: true,
						run_friend_queue: false,
						time_delay: 3,
					});
				}
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
			.catch((error) => {
				dispatch(
					saveFriendsQueueSettings({
						fb_user_id: fbUserId,
						request_limit_value: 50,
						request_limited: true,
						run_friend_queue: false,
						time_delay: 3,
					})
				);
				setFriendRequestQueueSettings({
					fb_user_id: fbUserId,
					request_limit_value: 50,
					request_limited: true,
					run_friend_queue: false,
					time_delay: 3,
				});
			});
		// dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId));
		getSettingsData();

		return () => clearTimeout(timeoutToSaveFriendsQueueSettings);
	}, []);

	// useEffect(() => {
	// 	if (isDataFetchingFromApi) {
	// 		timeoutToFetchFriendsQueueData.current = setTimeout(
	// 			() => dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId)),
	// 			3500
	// 		);
	// 	}
	// 	return () => clearTimeout(timeoutToFetchFriendsQueueData);
	// }, [isDataFetchingFromApi]);

	// useEffect(() => {
	// 	if (friendsQueueRecordsFirstChunkLength < friendsQueueRecordsCount) {
	// 		dispatch(resetIsChunkedDataFetchedFromApi(false));
	// 		dispatch(
	// 			getFriendsQueueRecordsInChunk(
	// 				friendsQueueRecordsCount,
	// 				friendsQueueRecordsLimit
	// 			)
	// 		);
	// 	}
	// }, [
	// 	friendsQueueRecordsFirstChunkLength,
	// 	friendsQueueRecordsCount,
	// 	friendsQueueRecordsLimit,
	// ]);

	// useEffect(() => {
	// 	if (isChunkedDataFetchedFromApi) {
	// 		dispatch(getFriendsQueueRecordsFromIndexDB(fbUserId));
	// 	}
	// }, [isChunkedDataFetchedFromApi]);

	// useEffect(() => {
	// 	if (friendsQueueSettings && friendsQueueSettings?.length > 0) {
	// 		setFriendRequestQueueSettings({
	// 			fb_user_id: friendsQueueSettings[0]?.fb_user_id,
	// 			request_limit_value: friendsQueueSettings[0]?.request_limit_value,
	// 			request_limited: friendsQueueSettings[0]?.request_limited,
	// 			run_friend_queue: friendsQueueSettings[0]?.run_friend_queue,
	// 			time_delay: Number(friendsQueueSettings[0]?.time_delay),
	// 		});
	// 	}
	// }, [friendsQueueSettings]);

	// useEffect(() => {
	// 	if (
	// 		debouncedFriendsQueueSettings &&
	// 		Object.keys(debouncedFriendsQueueSettings)?.length > 1
	// 	) {
	// 		dispatch(resetFriendsQueueSettings(null));
	// 		dispatch(saveFriendsQueueSettings(debouncedFriendsQueueSettings));
	// 	}
	// }, [debouncedFriendsQueueSettings]);

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
		const le_plan = localStorage?.getItem('fr_plan')?.toLowerCase();

		if (le_plan === "1" && e.target.checked) {
			e.preventDefault();
			e.stopPropagation();
			dispatch(showModal(true))
			setFriendRequestQueueSettings({
				...friendRequestQueueSettings,
				run_friend_queue: false
			})
			console.log('here');
			return false;
		} else if (le_plan === "2" && e.target.checked) {
			console.log('here');
			// console.log("BASIC PLAN");
			Alertbox(
				`Friend request sending has started without message sending. Upgrade to send messages with friend requests.`,
				"info-plan-toast",
				3000,
				"bottom-right",
				"",
				"Info",
				{
					url: 'sales@tier5.us',
					text: "Upgrade"
				}
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
		} else {
			console.log('here');
			setFriendRequestQueueSettings(
				(friendRequestQueueSettings) => {
					return {
						...friendRequestQueueSettings,
						run_friend_queue:
							!friendRequestQueueSettings?.run_friend_queue,
					};
				}
			);
		}
	}

	return (
		<div className='main-content-inner d-flex d-flex-column'>
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
								handleChange={(e) => {
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
								}}
							/>
						</div>
					</div>
					<div className='friends-queue-action-bar-item'>
						<div className='friend-req-run-queue'>
							<div className='run-friend-queue'>
								<div className='run'>{`${
									friendRequestQueueSettings?.run_friend_queue ? "Stop" : "Run"
								} friend queue`}</div>
								<Switch
									checked={friendRequestQueueSettings?.run_friend_queue}
									handleChange={(e) => {
										if (
											localStorage?.getItem('fr_plan')?.toLowerCase() === "1" &&
											e.target.checked
										) {
											e.preventDefault();
											e.stopPropagation();
											dispatch(showModal(true))
											setFriendRequestQueueSettings({
												...friendRequestQueueSettings,
												run_friend_queue: false
											})
											return false
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
			{friendsQueueRecords?.length > 0 &&
			!loading &&
			!isDataFetchingFromApi &&
			inactiveAfter !== null ? (
				<Listing
					friendsData={friendsQueueRecords}
					friendsListingRef={friendsQueueRef}
					getFilterNum={setListFilteredCount}
					reset={isReset}
					setReset={setIsReset}
				/>
			) : loading || isDataFetchingFromApi ? (
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
