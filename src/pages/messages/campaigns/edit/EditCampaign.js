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
import CampaignCreateEditLayout from "components/messages/campaigns/CampaignCreateEditLayout";
import ScheduleSelector from "../../../../components/messages/campaigns/ScheduleSelector";
import {
	fetchUsers,
	deleteCampaignContacts,
	updateCampaignSchedule
} from "../../../../actions/CampaignsActions";
import { commonbulkAction, getListData, removeMTRallRowSelection, updateCurrlistCount } from "../../../../actions/SSListAction";
import { fetchUserProfile } from "../../../../services/authentication/facebookData";
import Listing2 from "../../../../components/common/SSListing/Listing2";
import config from "../../../../configuration/config";
import { campaignUserColumnDefs } from "../../../../components/common/SSListing/ListColumnDefs/CampaignColDef";
import helper from "../../../../helpers/helper";
import Alertbox from "../../../../components/common/Toast";

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
	const [fb_user_id, set_fb_user_id] = useState(localStorage.getItem("fr_default_fb"));
	const [scheduleTime, setScheduleTime] = useState({
		date: [new Date()],
		start: "",
		end: "",
	});
	const [showPopup, setShowPopup] = useState(false);
	const [popupCoordPos, setPopupCoordPos] = useState({ x: 0, y: 0 });
	const select_all_state = useSelector((state) => state.ssList.selectAcross);
	const selectedListItems = useSelector((state) => state.ssList.selected_friends);
	const filter_state = useSelector((state) => state.ssList.filter_state);
	function matchesFilter(cellValue, filterValues) {
		return filterValues.some(filter => cellValue?.toLowerCase().includes(filter?.toLowerCase()));
	}
	const listFetchParams = useSelector((state) => state.ssList.listFetchParams);

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

//	console.log("isEditingCampaign", isEditingCampaign);

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

	const refreshAndDeselectList = () => {

		//const funStr = listFetchParams.responseAdapter;
		//const responseAdapter = eval(`(${funStr})`);
		const payload = {
			queryParam: listFetchParams.queryParam,
			baseUrl: listFetchParams.baseUrl,
			//responseAdapter: props.dataExtractor,
		}
		dispatch(getListData(payload)).unwrap().then((res) => {
			//console.log("list res ",res);
		}).catch((err) => {
			console.log("Error in page header list fetch", err);
		});
		dispatch(removeMTRallRowSelection());
	}

	const triggerBulkOperation = async (bulkType = null) => {
		return new Promise((resolve, reject) => {
			// let payload = assemblePayload(bulkType, config.bulkOperationFriends)
			let reqBody = {
				fb_user_id: current_fb_id,
				check: select_all_state?.selected ? 'all' : 'some',
				//include_list: select_all_state?.selected ? [] : [...selectedListItems?.map(el => el?._id)],
				// operation: bulkType === 'skipWhitelisted' ? 'unfriend' : bulkType === 'skipBlacklisted' ? 'campaign' : bulkType,
				campaign_id: params?.campaignId,
			}

			if (!select_all_state?.selected) {
				reqBody["include_list"] = [...selectedListItems?.map(el => el?._id)];
			}

			if (select_all_state?.selected) {
				reqBody["exclude_list"] = select_all_state?.unSelected?.length > 1 ? [...select_all_state?.unSelected.map(el => el)] : []
			}

			if (filter_state?.filter_key_value?.length > 0) {
				const { values, fields, operators } = helper.listFilterParamsGenerator(
					filter_state?.filter_key_value,
					filter_state?.filter_fun_state
				);
				reqBody["values"] = values;
				reqBody["fields"] = fields;
				reqBody["operators"] = operators;
				reqBody["filter"] = 1;
			}

			const payload ={
				"method": "POST",
				"baseUrl": `${config.deleteCampaignContactsv2}`,
				reqBody
			}

				dispatch(commonbulkAction(payload)).unwrap()
					.then((res) => {
						console.log('res IN DISPATH BULK ACTION >>>>  ::::', res);
						// Alertbox(
						// 	bulkType === 'queue' ? res?.data?.message : res?.data,
						// 	"success",
						// 	1000,
						// 	"bottom-right"
						// );
						refreshAndDeselectList();
					})
			
		})
	}
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
	// Any list specific Methods 
	const tableMethods = {};
	//query params
	const defaultParams = {
		campaign_id: params?.campaignId,
		fb_user_id: fb_user_id,
	}
	const dataExtractor = (response)=>{
			return {
				res:response,
				data: response.data,
				count: response.total_campaign_contacts,
			}
	}
	const extraParams = {
		isCampaignUserList: true,
		removeFriendFromCampaign: triggerBulkOperation
	}

	// RENDER VIEW COMPONENT DEPENDING ON VIEW MODES (VIEW PEOPLES / EDIT CAMPAIGN)..
	const renderComponentsView = () => {
		if (view && isEditingCampaign?.friends) {
			if (view === "view") {
				//console.log("loadingState", loadingState);
				return (
          <>
            {isEditingCampaign?.friends?.length === 0 ? (
              <NoDataFound
                customText={`Whoops!`}
                additionalText={`We couldn’t find any friends added to this campaign`}
              />
            ) : (
              <div className="campaigns-edit h-100 d-flex d-flex-column listing-main listing-campaign">
                {fb_user_id != null ? (
                  <Listing2
                    listColDef={campaignUserColumnDefs}
                    baseUrl={config.fetchCampaignUsersv2}
                    tableMethods={tableMethods}
                    defaultParams={defaultParams}
                    dataExtractor={dataExtractor}
					extraParams = {extraParams}
                  />
                ) : (
                  ""
                )}
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
