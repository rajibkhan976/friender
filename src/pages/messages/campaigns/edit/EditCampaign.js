import { memo, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	CampaignCreationRenderer,
	KeywordRenderer,
	SourceRendererPending,
	UnlinkedNameCellRenderer,
} from "components/listing/FriendListColumns";
import ListingLoader from "components/common/loaders/ListingLoader";
import {
	CampaignFriendMessageRenderer,
	CampaignFriendStatusRenderer,
} from "components/messages/campaigns/CampaignListingColumns";
import Modal from "components/common/Modal";
import CustomHeaderTooltip from "components/common/CustomHeaderTooltip";
import CampaignScheduler from "components/messages/campaigns/CampaignScheduler";
import CampaignSchedulerPopup from "components/messages/campaigns/CampaignScedulerPopup";
import NoDataFound from "components/common/NoDataFound";
import Listing from "components/common/Listing";
import CampaignCreateEditLayout from "components/messages/campaigns/CampaignCreateEditLayout";
import ScheduleSelector from "../../../../components/messages/campaigns/ScheduleSelector";
import {
	fetchUsers,
	deleteCampaignContacts,
	updateCampaignSchedule
} from "../../../../actions/CampaignsActions";
import { updateCurrlistCount } from "../../../../actions/SSListAction";

const EditCampaign = (props) => {
	const dispatch = useDispatch();
	const params = useParams();
	const [isEditingCampaign, setIsEditingCampaign, editViews] =
		useOutletContext();
	const current_fb_id = localStorage.getItem("fr_default_fb");
	const editingCampaign = useSelector((state) => state.campaign.editingCampaign);
	const campaignSchedule = useSelector(
		(state) => state.campaign.campaignSchedule
	);

	const [view, setView] = useState(null);
	const [isReset, setIsReset] = useState(null);
	const loadingState = useSelector((state) => state.campaign.isLoading);
	const [loading, setLoading] = useState(true);
	const [keyWords, setKeyWords] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedSchedule, setSelectedSchedule] = useState(null);

	const [scheduleTime, setScheduleTime] = useState({
		date: [new Date()],
		start: "",
		end: "",
	});
	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });

	function matchesFilter(cellValue, filterValues) {
		return filterValues.some(filter => cellValue?.toLowerCase().includes(filter?.toLowerCase()));
	}

	function sourceComparator(valueA, valueB, nodeA, nodeB, isDescending) {
		// "groups", "group", "suggestions", "friends", "post", "sync", "incoming", "csv", task_name

		const filterName = (dataSet) => {
			const sourceNow = (dataSet?.finalSource?.toLowerCase() === "groups" ||
								dataSet?.finalSource?.toLowerCase() === "group" ||
								dataSet?.finalSource?.toLowerCase() === "suggestions" ||
								dataSet?.finalSource?.toLowerCase() === "friends" ||
								dataSet?.finalSource?.toLowerCase() === "post") ?
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
									dataSet?.groupName :
								dataSet?.finalSource?.toLowerCase() === "sync" ?
									"Sync" :
								dataSet?.finalSource?.toLowerCase() === "incoming" ?
									"Incoming request" :
								dataSet?.finalSource?.toLowerCase() === "csv" ?
									dataSet?.sourceName ? 
										dataSet?.sourceName :
										dataSet?.csvName ? 
											dataSet?.csvName : 
											"CSV Upload" :
								dataSet?.task_name
			console.log('sourceNow >>>>>', sourceNow);
			return sourceNow;
		}
								

		let objA = filterName({...nodeA?.data})?.toLowerCase()
		let objB = filterName({...nodeB?.data})?.toLowerCase()

		if (objA == objB) return 0;
		return (objA > objB) ? 1 : -1;
	}

	const campaignFriendsRef = [
		{
			field: "friendName",
			headerName: "Name",
			headerCheckboxSelection: true,
			checkboxSelection: true,
			showDisabledCheckboxes: true,
			lockPosition: "left",
			cellRenderer: UnlinkedNameCellRenderer,
			headerClass: "campaign-name-header",
			suppressRowClickSelection: false,
			// showDisabledCheckboxes: false,
		},
		{
			field: "status",
			headerName: "Status ",
			filter: "agTextColumnFilter",
			cellRenderer: CampaignFriendStatusRenderer,
		},
		{
			field: "message",
			headerName: "Message  ",
			cellRenderer: CampaignFriendMessageRenderer,
			enableFilter: false,
			sortable: false,
			cellRendererParams: {
				editingCampaign,
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
			cellRenderer: KeywordRenderer,
		},
		// {
		// 	field: "finalSource",
		// 	headerName: "Source",
		// 	headerTooltip: "Friends source",
		// 	tooltipComponent: CustomHeaderTooltip,
		// 	headerClass: "header-query-tooltip",
		// 	enableFilter: false,
		// 	cellRenderer: SourceRendererPending,
		// 	// lockPosition: "right",
		// 	minWidth: 185,
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
		{
			field: "created_at",
			headerName: "Friend added date & time",
			headerTooltip: "Friend added to Campaign Date & Time",
			cellRenderer: CampaignCreationRenderer,
			filter: "agDateColumnFilter",
		},
	];

	console.log("isEditingCampaign", isEditingCampaign);

	useEffect(() => {
		setView(editViews?.find((el) => el.checked).label);
	}, [editViews]);

	// VIEW CHANGING FOR BETWEEN SCREEN EDIT AND PEOPLES VIEW..
	useEffect(() => {
		if (isEditingCampaign) {
			// console.log('GOT TO EDIT ::::', isEditingCampaign);
			setLoading(false);
			if (
				localStorage?.getItem("fr_editCampaign_view") &&
				localStorage?.getItem("fr_editCampaign_view") !== "undefined"
			) {
				setView(JSON.parse(localStorage.getItem("fr_editCampaign_view"))?.mode);
			} else {
				setView("view");
				localStorage.setItem(
					"fr_editCampaign_view",
					JSON.stringify({ mode: "view" })
				);
			}
			dispatch(
				updateCampaignSchedule(campaignSchedule.filter((item) => item.isSaved))
			);
		}

		return () => {
			setIsEditingCampaign(null);
			dispatch(updateCampaignSchedule([]));
		};
	}, []);

	useEffect(() => {
		if (params?.campaignId) {
			getCampaignUsersListFromAPI(current_fb_id, params?.campaignId);
		}
	}, []);

	// RENDER VIEW COMPONENT DEPENDING ON VIEW MODES (VIEW PEOPLES / EDIT CAMPAIGN)..
	const renderComponentsView = () => {
		if (view && isEditingCampaign?.friends) {
			if (view === "view") {
				console.log("loadingState", loadingState);
				return (
					<>
						{isEditingCampaign?.friends?.length === 0 ? (
							<NoDataFound
								customText={`Whoops!`}
								additionalText={`We couldn’t find any friends added to this campaign`}
							/>
						) : (
							<div className='campaigns-edit h-100 d-flex d-flex-column'>
								<Listing
									friendsData={isEditingCampaign?.friends}
									friendsListingRef={campaignFriendsRef}
									getFilterNum={isEditingCampaign?.friends?.length}
									reset={isReset}
									setReset={setIsReset}
									isListing='campaign-friends'
									removeCampaignContacts={removeCampaignContacts}
									getCurrentCampaignFriends={getCampaignUsersListFromAPI}
								/>
							</div>
						)}
					</>
				);
			} else {
				console.log("loadingState", loadingState);
				return (
					<CampaignCreateEditLayout>
						<div className='create-campaign-scheduler'>
							{showPopup && (
								<CampaignSchedulerPopup>
									<ScheduleSelector
										handleSetShowPopup={(status) => setShowPopup(status)}
										popupCoordPos={popupCoordPos}
										scheduleTime={scheduleTime}
										selectedSchedule={selectedSchedule}
										setScheduleTime={setScheduleTime}
									/>
								</CampaignSchedulerPopup>
							)}
							<CampaignScheduler
								handleSetShowPopup={(status) => setShowPopup(status)}
								handleSetPopupPos={(pos) => {
									setPopupCoordPos({ x: pos.X, y: pos.Y });
								}}
								handleSetSelectedSchedule={setSelectedSchedule}
								selectedSchedule={selectedSchedule}
								setScheduleTime={setScheduleTime}
							/>
						</div>
					</CampaignCreateEditLayout>
				);
			}
		}
	};

	// REMOVE FRIENDS FROM THIS LIST..
	const removeCampaignContacts = async (data = {}) => {
		const fbUserId = current_fb_id;
		const campaignId = params?.campaignId;
		const { selectedFrnd, selectedFriends } = data;

		const payloadToDelete =
			selectedFriends?.length &&
			selectedFriends?.map((friend) => {
				return {
					fbUserId,
					campaignId,
					friendFbId: friend?.friendFbId || "",
				};
			});

		try {
			const removedContactResponse = await dispatch(
				deleteCampaignContacts(payloadToDelete)
			).unwrap();
			// console.log(
			// 	"REMOVE API HAS BEEN CALLED HERE -- ",
			// 	removedContactResponse
			// );
			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
				message: error?.message,
			};
		}
	};

	console.log("editingCampaign", editingCampaign);

	// FETCHING CAMPAIGN'S USERS..
	const getCampaignUsersListFromAPI = async (
		fbUserId = current_fb_id,
		campaignId = "",
		status = "all"
	) => {
		try {
			await dispatch(fetchUsers({ fbUserId, campaignId, status }))
			.unwrap()
			.then((res) => {
				console.log("USERS COUNT", res);
				dispatch(updateCurrlistCount(res?.data?.length));
			});
		} catch (error) {
			// console.log(
			// 	`GETTING ERROR WHILE FETCHING CAMPAIGN USERS - `,
			// 	error?.message
			// );
		}
	};

	return (
		<>
			{modalOpen && (
				<Modal
					modalType='normal-type'
					modalIcon={null}
					headerText={"Keyword(s)"}
					bodyText={
						<>
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
			{loading ? <ListingLoader /> : renderComponentsView()}
		</>
	);
};

export default memo(EditCampaign);
