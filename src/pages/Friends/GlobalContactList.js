import { useDispatch, useSelector } from "react-redux";

import ListingLoader from "../../components/common/loaders/ListingLoader";
import NoDataFound from "../../components/common/NoDataFound";
import { useEffect, useState } from "react";
import { countCurrentListsize } from "../../actions/FriendListAction";
import { syncMainFriendList } from "../../actions/FriendsAction";
import Modal from "../../components/common/Modal";
import helper from "../../helpers/helper";
import { utils } from "../../helpers/utils";
import { fetchAllCampaigns } from "../../actions/CampaignsActions";
import moment from "moment";
import Listing2 from "../../components/common/SSListing/Listing2";
import {  GlobalContactlistColDefs } from "../../components/common/SSListing/ListColumnDefs/ContactlistColDefs";
import config from "../../configuration/config";
const fb_user_id= localStorage.getItem("fr_default_fb");

const GlobalContactList = () => {
	//::::Friend List geting data from Redux::::
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.facebook_data.isLoading);
	//const mySettings = useSelector((state) => state.settings.mySettings.friends_willbe_inactive_after);
	//const mySettings = useSelector((state) => state.settings.mySettings.friends_willbe_inactive_after);
	const [filterFrndList, setFilterFrndList] = useState([]);
	// const [pageSet, setPageSet] = useState(new Set());
	const [listFilteredCount, setListFilteredCount] = useState(null);
	const [isReset, setIsReset] = useState(null);

	// const friendsList = useSelector((state) =>
	//   state.facebook_data.current_friend_list.filter(
	//     (item) => item.deleted_status !== 1 && item.friendStatus === "Activate"
	//   )
	// );
	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const inactiveAfter = useSelector((state) => state.settings.mySettings?.data[0]?.friends_willbe_inactive_after);
	const friendsList = useSelector(
		(state) => state.facebook_data.current_friend_list
	);

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
	// const getSettingsData = async () => {
	// 	if (mySettings?.data[0]?.friends_willbe_inactive_after) {
	// 		//setInactiveAfter(mySettings?.data[0]?.friends_willbe_inactive_after);
	// 	} else {
	// 		const dataSettings = await dispatch(
	// 			getMySettings({ fbUserId: `${localStorage.getItem("fr_default_fb")}` })
	// 		).unwrap();
	// 		if (dataSettings) {
	// 			//setInactiveAfter(dataSettings?.data[0]?.friends_willbe_inactive_after);
	// 		}
	// 	}
	// };

	// useEffect(() => {
	// 	dispatch(fetchAllCampaigns({sort_order: "asc"}));
	// 	//getSettingsData();
	// }, []);

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
		let localTime = utils.convertUTCtoLocal(
			statusSync?.replace(" ", "T") + ".000Z",
			true
		);
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
		return age;
	};

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
										dataSet?.finalSource?.toLowerCase() === "friends" ?
											'Friends of Friends' :
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

	

	const tableMethods = {}
	const defaultParams = {
		friend_status: "all",
		//deleted_status: 0,
		fb_user_id: fb_user_id,
	}
	const dataExtractor = (response)=>{
			return {
				res : response,
				data: response?.data[0]?.friend_details,
				count: response?.data[0]?.friend_count
			}
	}

	return (
		<div className='main-content-inner d-flex d-flex-column listing-main'>
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
			{/* {filterFrndList?.length > 0 && !loading && inactiveAfter !== null && (
				// <Listing
				// 	friendsData={filterFrndList}
				// 	friendsListingRef={friendsListinRef}
				// 	getFilterNum={setListFilteredCount}
				// 	reset={isReset}
				// 	setReset={setIsReset}
				// />
				<Listing2 
					//friendsData={filterFrndList}
					listColDef = {GlobalContactlistColDefs} 
					baseUrl = {config.fetchFriendListUrlv2}
					tableMethods = {tableMethods} 
					defaultParams = {defaultParams}
					dataExtractor = {dataExtractor}
				/>
			)} */}
				<Listing2 
					//friendsData={filterFrndList}
					listColDef = {GlobalContactlistColDefs} 
					baseUrl = {config.fetchFriendListUrlv2}
					tableMethods = {tableMethods} 
					defaultParams = {defaultParams}
					dataExtractor = {dataExtractor}
				/>

			{/* {filterFrndList?.length === 0 && <NoDataFound />} */}

			{/* {loading && <ListingLoader />}

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
			)} */}
		</div>
	);
};

export default GlobalContactList;
