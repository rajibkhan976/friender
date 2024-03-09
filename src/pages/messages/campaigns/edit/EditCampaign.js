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
import { countCurrentListsize } from "../../../../actions/FriendListAction";

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
	const [loading, setLoading] = useState(false);
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
		{
			field: "groupName" ? "groupName" : "finalSource",
			headerName: "Source",
			headerTooltip: "Friends source",
			tooltipComponent: CustomHeaderTooltip,
			headerClass: "header-query-tooltip",
			enableFilter: false,
			cellRenderer: SourceRendererPending,
			// lockPosition: "right",
			minWidth: 185,
		},
		{
			field: "created_at",
			headerName: "Friend added date & time",
			headerTooltip: "Friend added to Campaign Date & Time",
			cellRenderer: CampaignCreationRenderer,
			filter: "agDateColumnFilter",
		},
	];

	// RENDER VIEW COMPONENT DEPENDING ON VIEW MODES (VIEW PEOPLES / EDIT CAMPAIGN)..
	const renderComponentsView = () => {
		if (view && isEditingCampaign?.friends) {
			if (view === "view") {
				console.log('loadingState', loadingState);
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
				console.log('loadingState', loadingState);
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
			console.log(
				"REMOVE API HAS BEEN CALLED HERE -- ",
				removedContactResponse
			);
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

	// FETCHING CAMPAIGN'S USERS..
	const getCampaignUsersListFromAPI = async (
		fbUserId = current_fb_id,
		campaignId = "",
		status = "all"
	) => {
		try {
			await dispatch(fetchUsers({ fbUserId, campaignId, status })).unwrap().then((res) => {
				console.log('USERS COUNT', res);
				dispatch(countCurrentListsize(res?.data?.length))
			});

		} catch (error) {
			console.log(
				`GETTING ERROR WHILE FETCHING CAMPAIGN USERS - `,
				error?.message
			);
		}
	};

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
